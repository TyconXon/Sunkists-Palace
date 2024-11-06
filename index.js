

/***
*      _________             __   .__          __
*     /   _____/__ __  ____ |  | _|__| _______/  |_
*     \_____  \|  |  \/    \|  |/ /  |/  ___/\   __\
*     /        \  |  /   |  \    <|  |\___ \  |  |
*    /_______  /____/|___|  /__|_ \__/____  > |__|
*            \/           \/     \/       \/
*/
/***  Max, Aft, Box, Sky, Avn, Vin, Tar, Leo, Rey, Kat, Aid, Wig, Cas
 *    ___________    .__  .__
 *    \_   _____/___ |  | |  |   ______  _  __ ___________  ______
 *     |    __)/  _ \|  | |  |  /  _ \ \/ \/ // __ \_  __ \/  ___/
 *     |     \(  <_> )  |_|  |_(  <_> )     /\  ___/|  | \/\___ \
 *     \___  / \____/|____/____/\____/ \/\_/  \___  >__|  /____  >
 *         \/ The amazin chat room                \/           \/
 */
/***
 *    ████████╗ ██████╗ ██████╗  ██████╗
 *    ╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗██╗
 *       ██║   ██║   ██║██║  ██║██║   ██║╚═╝
 *       ██║   ██║   ██║██║  ██║██║   ██║██╗
 *       ██║   ╚██████╔╝██████╔╝╚██████╔╝╚═╝
 *       ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝
 *
 */
//* CLEAN EVERYTHING!!! This code is messy and unreadable. It's awful. WE MUST PURIFY THIS WEBSITE!!!
//* Rework the chat messages to only send important information such as the usr and msg  - for preformance

//Configuration!!!
const MEM = true; /** Memory-Mode: Are messages stored in memory or forgotten after relay? */
const splashTexxt = "<a href='./directory.html'>Page directory</a> | We're using railway now." /** MOTD */

var http = require("http");
var https = require("https");
const { Server } = require("socket.io");

/* Precious exotic imports */

	var url = require("url");
	const request = require("request");
	const webhookURL = process.env["webhookURL"];
	var fs = require("fs");
	const { setTimeout, setInterval } = require("timers");
	const busboy = require('busboy');
	const path = require('path');
	const status = require('./status.json');
	const forever = require('./forever.json');
	var os = require('os');
	var childProcess = require('child_process');
	const Client = require("@replit/database");
	const client = new Client();
	const PImage = require('pureimage');

//Delete previous temporary files.
function flushTemporaries(){
	fs.readdir("temp", (err, files) => {
		if (err) {
			console.log("no temp?? not flushing anything man.");
			return;
		}
	
		for (var file of files) {
			fs.unlink(path.join("temp", file), (err) => {
				if (err) throw err;
			});
		}
	});
}
flushTemporaries();



/** Where the messages are stored */
var list = MEM
	? /** It's an array if memory mode is on */
	[`<div id='splash' class='message splash console'> ${splashTexxt}</div>`]
	: /** Otherwise it's a fake array with a fake length. How pathetic. */
	{ length: 0 };

//Server-side data 
{
	//Active userbase:
		/** Array of those who are talking */
			var talkers = []; 
		/** Array that logs everyone who has connected */
			var whoHasConnected = [];
		/** Map of online people with their names tied to their client ID */
			var onliners = new Map(); 
		/** A more reliable way of seeing how many people are online */
			var connected = 0; 
		/** Array of idle users, for use in the auto-idle system. */
			var idleList = [];
	
	/** Integer that tracks how many messages have been sent by the same person, for use in collapsed messages */
		var colcount = 0;
	/** A database for whatever the users may want to store globally */
		var serverData = {};
	/** Array of URLs to update via the webhook subscription service */
		var subscriptionList = [];
	/** Object comprised of username keys which hold array values containing blacklisted channels. OBJ->USR->ARR->STRNG */
		var userBans = {
			superSafePasswordsChannel : ["hacker"]
		};
	var developmentServer = false;
	var deploymentChecked = false;
}
//TerminalX server-side data
const coworkers = new Map();
const minefield = {hacker:["honeypot"]};

const fnt = PImage.registerFont(
      "fonts/Retron2000.ttf",
      "invalid",
    );
fnt.loadSync();

function splitString(inputString) {
	try{
		const result = {
			id: inputString.match(/((?<=maple\()|(?<=maple\('))[^']+((?=')|(?=\)))/g)[0],
			usrIdentifier: inputString.match(
				/((?<=onIdentifer\(\")|(?<=onIdentifer\(\&quot;))[^(^)]*((?="\))|(?=\&quot;\)))/g,
			)[0],
			message: inputString.match(/(?<=<msgtxt>)[^]+?(?=<\/msgtxt>)/g)[0],
		};
		return result;
	}catch(e){
		console.log("splitstring error: " + e);
	}
}

/** SERVER */
const server = http.createServer(function(req, res) {
	
	var q = url.parse(req.url, true);
	var qData = q.query;

	if(!deploymentChecked){
		if(req.rawHeaders[1].includes('picard')){
			developmentServer = true;
		}
		deploymentChecked = true;
		console.log(developmentServer?'Server started. (development server)':'Server started. (production server)');
	}

	try{
	if(q.path.includes('out.png')){
		// make image
		let img1 = PImage.make(1200, (20*list.length)+100);
		// get canvas context
		let ctx = img1.getContext("2d");
		ctx.fillStyle = "red";
		ctx.font = "20pt 'invalid'";
		for (var i = 0; i < list.length; i++){
			let splt = splitString(list[i])
			ctx.fillText(`[${splt.id}] ${splt.usrIdentifier} : ${splt.message}`, 0, 10*i);
		}
		//write to 'out.png'
		PImage.encodePNGToStream(img1, fs.createWriteStream("out.png"))
		.then(() => {
			res.setHeader("Content-Type", "image/png");
			res.write(fs.readFileSync('.' + q.pathname.replace(/%20/g, ' ')));
			return
		})
		.catch((e) => {
			console.log("there was an error writing");
		});
	}

	}catch(e){console.log(e)}
	//Upload system
	try {
		if (req.url.includes('/upload')) {
			let filename = '';
			const bb = busboy({ headers: req.headers });
			bb.on('file', (name, file, info) => {
				if (info.filename == undefined) {
					res.writeHead(201);
					res.end(`<head> <meta http-equiv="refresh" content="0; url=https://sunkist-palace.net/?return"> </head>
					<a href='https://sunkist-palace.net/?return'>You can't upload nothing!</a>`);
					return 2;
				}
				filename = info.filename.replace(/ /g, '_').replace(/"/g, '-').replace(/'/g, '-');
				let saveDir = qData.dir ? qData.dir : '/temp/';
				const saveTo = path.join(__dirname + saveDir, filename);
				file.pipe(fs.createWriteStream(saveTo, { highWaterMark: 1024 * 1024 })).on('error', (err) => {
					console.error(`Error writing file: ${err}`);
					res.status(500).end(`Error writing file: ${err}`);
				});
			});
			bb.on('finish', () => {
				console.log(`upload success: ${filename}`);
				let Celement = isImageFile(filename) ? 'img' : isAudioFile(filename) ? 'audio' : isVideoFile(filename) ? 'video' : 'a';
				let other = isImageFile(filename) ? false : isAudioFile(filename) ? false : isVideoFile(filename) ? false : true;
				res.writeHead(201);
				res.end(`<head> <meta http-equiv="refresh" content="0; url=https://sunkist-palace.net/?preset=${other ? '' : '<br>'}<${Celement} ${other ? 'download' : ''} class='${other ? '' : 'openInTab'}' controls title='${filename}' href='temp/${filename}' src='temp/${filename}'>${other ? filename : ''}</${Celement}>"> </head>
				<a href='https://server--maximusmiller2.repl.co/?preset=${filename}'>upload success: ${filename}</a>`);
				io.emit(
					"outMessage",
					`<div class='console message dev'><bx>*</bx> Someone joined uploaded ${filename}. <bx>*</bx> <details><summary>More details</summary>${req.headers['user-agent']}<br>${other ? '' : '<br>'}<${Celement} ${other ? 'download' : ''} class='${other ? '' : 'openInTab'}' controls title='${filename}' href='temp/${filename}' src='temp/${filename}'>${other ? filename : ''}</${Celement}></details></div>`
				);
			});
			req.pipe(bb); //this stands for the Left 4 Dead item
			return 0;
		}
	} catch (error) {
		io.emit('outMessage', `<div class='console message error'> Uploading failed: ${error}</div>`)
	}

	if(req.url.includes('/subscribe')){
		let sub = qData.sub;
		let subbed = subscriptionList.includes(sub)? true: false;
			
		if(!subbed){
			subscriptionList.push(sub);
			io.emit('outMessage', `<div class='console message subscribtion'><bx>*</bx> ${sub} subscribed</div>`);
			res.writeHead(201, { "Content-Type": "text/plain" });
			res.write('subscribed');
			res.end();
		}else{
			res.writeHead(409, { "Content-Type": "text/plain" });
			res.write('already subscribed');
			res.end();
		}
		
		return;
	}
	if (req.method === 'POST') {
			let body = '';

			// Collect data chunks
			req.on('data', chunk => {
					body += chunk.toString(); // Convert buffer to string
			});

			// When all data is received
			req.on('end', () => {
					// Process the complete body
					console.log('Received POST data:', body);
					body = JSON.parse(body);
				
					if (body.message != null && body.message != undefined) {
						if (body.user == null) {
								body.user = "guest";
						}
						sendMessage(body.user, body.message);
					}

					// Set response headers and send response
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end('POST request received');
			});

			// Handle errors during data reception
			req.on('error', (err) => {
					console.error('Error receiving data:', err);
					res.writeHead(500, {'Content-Type': 'text/plain'});
					res.end('Server error');
			});
	}

	if (q.path.includes('.') && (qData.slow == undefined) && (qData.preset == undefined) && (qData.message == undefined)) {
		if (q.path.includes('.wav')) {
			res.setHeader("Content-Type", "audio/wav");
		} else if (q.path.includes('.mp3')) {
			res.setHeader("Content-Type", "audio/mpeg");
		} else if (q.path.includes('.ogg')) {
			res.setHeader("Content-Type", "audio/ogg");
		} else if (q.path.includes('.png')) {
			res.setHeader("Content-Type", "image/png");
		} else if (q.path.includes('.jpg')) {
			res.setHeader("Content-Type", "image/jpeg");
		}else if (q.path.includes('.html')) {
			res.setHeader("Content-Type", "text/html");
		}
		//res.writeHead(200, { "Content-Type": "image/png" });
		try {
			res.write(fs.readFileSync('.' + q.pathname.replace(/%20/g, ' ')));

		} catch (e) {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.write(e.toString());
			console.log("404 " + q.path);

		}
		return res.end();
	}

	if (qData.message != null && qData.message != undefined) {
		if (qData.user == null) {
			qData.user = "guest";
		}
		if(qData.discord != undefined){
			if(isImageFile(qData.message) && qData.message.startsWith('http')){
				qData.message = `<img src="${qData.message}">`;
			}
		}
		sendMessage(qData.user, qData.message);
	}
	if (qData.moderate != undefined) {
		moderate(qData.moderate);
	}
	

	
	
	if(q.path.name == undefined && q.path != '/' && !q.path.includes('?')){


		const marginSettings = 'margin:50px;margin-top:15px;margin-bottom:15px;display:block;padding:15px;';
		
		let directoryPath = path.join(__dirname, q.path);
		fs.readdir('.'+q.path, function (err, files) {
				//handling error
				if (err) {
					res.writeHead(404, { "Content-Type": "text/html" });
					res.write('<h1>' + err + '</h1>');
						res.end();
						return console.log('Unable to scan directory: ' + err);
				} 
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write('<h1>' + q.path + '</h1>');
			res.write('<style>html{background-color:black;color:white;} .entree{'+marginSettings+'} .image{background-color:lightblue;display:block;} .file{background-color:lightgreen;} .folder{background-color:gold;}</style>');

				//listing all files using forEach
				files.forEach(function (file) {
						// Do whatever you want to do with the file
					if(isImageFile(file)){
						res.write(`<a href='${file}' class="entree image" ><img src='${file}' width='50px'>${file}</a> <br>`);

					}else{
						if(!file.includes('.')){
							res.write(`<a href='${file}/' class="entree folder" >${file}</a> <br>`);

						}else{
							res.write(`<a href='${file}'  class="entree file" >${file}</a> <br>`);
						}
					}
				});
			 res.end();
		});
		
		return;
	}

	if(qData.channel == '' || qData.channel == 'null'){
		res.writeHead(200, { "Content-Type": "text/html" });
		res.write( fs.readFileSync('error.html', 'utf8'));
		res.end();
		return;
	}

	
	fs.readFile("index.html", function(err, data) {if(true){
		if (qData.slow == undefined) {
			if(qData.getMessage == undefined && qData.getList == undefined){
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
				//Use getmessage 
			}else if(qData.getMessage == undefined){
				try{res.write(list[qData.getMessage])}catch(e){
					console.log(e);
					res.write(e.toString());
				}
				return res.end();
			}
			if(qData.getList != undefined){
				try{
					res.writeHead(200);
					res.write(" " +list.toString());
				}catch(e){
					console.log(e);
				}
				return res.end();

			}
		
		} else {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write(`<html style="padding-top:25px;"><head><meta charset="utf-8" /><meta http-equiv="refresh" content="5;URL='/?slow&autorefreshed'" />
			<style>
			.MaximusMiller2{background-color:lightblue;} .Afton{background-color:cyan;}.Boxel{background-color:purple;color:white;}
	
			</style>
			</head><body>
			<div style="position:sticky;background-color:grey; font-size:150%;top:0;">
			<script>
			function text(){var e=window.prompt("Say:");window.location.assign("/?slow&message="+encodeURIComponent(e)+"%E2%9B%96&user="+window.localStorage.getItem("username"))}document.addEventListener("keyup",e=>{switch(e.key){case"Enter":text();break;case"Shift":window.location.assign("/?slow&limit=20")}});
			</script>
			<button onclick="text()" href="#aaa" style="position: sticky;">Add to chat.</button>
		<a href="https://sunkist-palace.net/?slow">Refresh text without responding</a>
		<a href="https://sunkist-palace.net/">Go back to normal mode</a></div>
		`);
		}
		if (MEM && qData.cls == undefined) {
			
			if(qData.channel == undefined) {

				
				if(qData.limit){

					let aprilList = list.slice(-qData.limit);
					for (let msg in aprilList) {
						res.write(aprilList[msg]);
					}
					res.write('Limited output to the last '+qData.limit+' messages.');
				}
				else{
					//normal loading
						for (let msg in list) {
							res.write(list[msg]);
						}
				}
			}


			//These channels also save!
			if ((qData.channel == 'devtest' ||
				qData.channel == 'secondary' ||
				qData.channel == 'tertiary' ||
				qData.forever != undefined)) {
				for (let msg in forever[qData.channel]) {

					res.write(forever[qData.channel][msg]);

				}
			}

		}
		res.write("<hr id='lastRead'>");
		if(qData.slow != undefined){
			res.write("<script>document.body.scrollTop = document.body.scrollHeight;</script>")
		}
		//res.write(list.toString().replaceAll(',', ','));
	}
		return res.end();
	});
}).listen(8080);

const io = new Server(server, {
	connectionStateRecovery: {
		// the backup duration of the sessions and the packets
		maxDisconnectionDuration: 2 * 60 * 1000,
		// whether to skip middlewares upon successful recovery
		skipMiddlewares: true,
	}
});

function sendMessage(usr, message, phone, sckt, room = null) {
	let curTime = new Date();

	if (message.startsWith("/moderate")) {
		//if (usr.endsWith("2") || (usr.startsWith("A") && usr.endsWith("n"))) {
		let id = message.split(" ")[1];

		if (list[id] == undefined) {
			askUpdate();
			io.emit(
				"outMessage",
				`<div class='console message removed'><ml>q</ml> ${usr} Tried to moderate a message that didn't exist! (${id})</div>`
			);
			return 1;
		}

		moderate(message.split(" ")[1]);
		askUpdate();
		return true;
		/*} else {
			console.log("@" + usr + ": " + message);
			askUpdate();
			io.emit(
				"outMessage",
				`<div class='console message removed'><ml>q</ml> ${usr} Tried to use a command they weren't authorized to use... (Moderation)</div>`
			);
		}*/
	} else if (message.startsWith("/eval")) {
		//Who doesn't want a backdoor available to practically everyone?
		if (usr.endsWith("2")) {
			eval(message.split(" ").slice(1).join(" "));
			return 1;
		}

	}else if (message.startsWith("/kick")) {
		//Who doesn't want a backdoor available to practically everyone?
		if (usr.endsWith("2")) {
			let target = message.split(" ")[1];
			let reason = message.split(" ").slice(2).join(" ");
			io.to(target).emit("kicked", reason);
			io.emit(
				"outMessage",
				`<div class='console message removed'><ml>q</ml> ${target} was kicked.</div>`
			);
			return 1;
		}
	}else if (message.startsWith("/ban")) {
	try{
	if (usr.endsWith("2")) {
		let target = message.split(" ")[1];
		let tchannel = message.split(" ")[2];
		let reason = message.split(" ").slice(3).join(" ");
		io.to(target).emit("banned", reason);

		//map with username -> array of banned channels and redirect banned connections to banned.html
		if(userBans[tchannel] == undefined){
			userBans[tchannel] = [];
		}
		userBans[tchannel].push(target);
		io.to("admin").emit(
			"outMessage",
			`<div class='console message removed'><ml>q</ml> ${target} was banned from ${tchannel}.</div>`
		);
		return 1;
	}
	}catch(e){
		console.log(e);
	}
	}else if (message.startsWith('/edit')) {
		var id = message.split(' ')[1];
		var txt = message.split(' ').slice(2).join(' ');

		if (list[id] == undefined) {
			if (!isForever(room)) {
				askUpdate();
				io.emit(
					"outMessage",
					`<div class='console message removed'><ml>q</ml> ${usr} Tried to edit a message that didn't exist! (${id} - > ${txt})</div>`
				);
			} else {
				if (forever[room][id].includes(usr) || (usr.endsWith("2") || (usr.startsWith("A") && usr.endsWith("n")))) {
					forever[room][id] = `<div id='${id}' class='message ${usr} ${phone ? "phone" : ""
						}'> <strong class='identifier' onClick='onIdentifer("${usr}")'>${usr} <abbr noicon title='${curTime.toLocaleString(
							"en-US",
							{ timeZone: "US/Arizona" }
						)}'>@ ${curTime.toLocaleTimeString("en-US", {
							timeZone: "US/Arizona",
						})}:</ins></strong> <msgtxt>${txt}</msgtxt> <button class='rightist' onClick="maple(${id
						})">${id} (edited)</button> </div>`;
					askEdit(id, forever[room][id]);
					return true;
				} else {
					askUpdate();
					io.emit(
						"outMessage",
						`<div class='console message removed'><ml>q</ml> ${usr} Tried to edit a message that wasn't theirs... (Edit)</div>`
					);
				}
			}
			return 1;
		}

		if (list[id].includes(usr) || (usr.endsWith("2") || (usr.startsWith("A") && usr.endsWith("n")))) {
			list[id] = `<div id='${id}' class='message ${usr} ${phone ? "phone" : ""
				}'> <strong class='identifier' onClick='onIdentifer("${usr}")'>${usr}  <abbr noicon title='${curTime.toLocaleString(
					"en-US",
					{ timeZone: "US/Arizona" }
				)}'>@ ${curTime.toLocaleTimeString("en-US", {
					timeZone: "US/Arizona",
				})}:</ins></strong> <msgtxt>${txt}</msgtxt> <button class='rightist' onClick="maple(${id
				})">${id} (edited)</button> </div>`;
			askEdit(id, list[id]);
			return true;
		} else {
			askUpdate();
			io.emit(
				"outMessage",
				`<div class='console message removed'><ml>q</ml> ${usr} Tried to edit a message that wasn't theirs... (Edit)</div>`
			);
		}
	} else if (message.startsWith("/join")) {
		var rm = message.split(' ')[1];
		try {
			if ((userBans[rm]) && (userBans[rm].includes(usr))) {
				io.emit(
					"outMessage",
					`<div class='console message removed'><ml>q</ml> ${usr} Tried to join a room they were banned in... (${rm})</div>`
				);
				
				return false;
			}
			
			sckt.join(rm);
			io.to(rm).emit(
				"outMessage",
				`<div class='console message room ${rm}'><bx>C</bx> ${usr} Joined ${rm} (${io.sockets.adapter.rooms.get(rm).size} connected) <a href='users/${rm}.html'>Room/User Page</a>.</div>`
			);
			
		} catch (e) {
			io.emit(
				"outMessage",
				`<div class='console message removed'>ERROR: FROM: ${usr}, MESSAGE: ${message}, OUT: ${e}</div>`
			);
		}

		return true;
	}else if (message.startsWith('/clear')){
		idleList = [];
	}else if(message.startsWith('sv_cheats 1')){
		io.emit(
			"outMessage",
			`<div class='console message'><img src="images/sv_cheats1.png"></div>`
		);
	}else if(message == 'test'){
		io.emit(
			"outMessage",
			`<div class='console message'><img src="images/Clean_example.jpg"></div>`
		);
	}else if(message == 'apple'){
	io.emit(
		"outMessage",
		`<div class='console message'><img src="images/apple.gif"></div>`
	);
	}else if (message.startsWith("/to")) {
		try {
			var rm = message.split(' ')[1];
			var txt = message.split(' ').slice(2).join(' ');
			sendMessage(usr, txt, phone, sckt, rm);
		} catch (e) {
			io.emit(
				"outMessage",
				`<div class='console message removed'>ERROR: FROM: ${usr}, MESSAGE: ${message}, OUT: ${e}</div>`
			);
		}
		return true;
	} else if (message.startsWith("/multi")) {
		try {
			var rep = message.split('%;');
			for (let i = 1; i < rep.length; i++) {
				setTimeout(() => {
					sendMessage(usr, rep[i], phone, sckt, room);
				}, (i * 100) + Math.random() * 100)
			}
		} catch (e) {
			io.emit(
				"outMessage",
				`<div class='console message removed'>ERROR: FROM: ${usr}, MESSAGE: ${message}, OUT: ${e}</div>`
			);
		}
		return true;
	} else if (message.startsWith('/restart') && (usr == 'MaximusMiller2')) {
		io.emit("outMessage", `<div class='console message'> <bx>k</bx><${usr}> ${usr} </${usr}><bx>k</bx> Requested restart (reason: ${message.split(' ').slice(1).join(' ')})</div>`);
		io.emit("outMessage", "<hr restart>");
		console.log(`Shutting down... ( ${message.split(' ').slice(1).join(' ')} )`);
		process.exit(0);

		return false;
	} else if (message.startsWith('/list')) {

		console.log(io.of("/").adapter.rooms);

		var availableRooms = [];
		var rooms = io.of("/").adapter.rooms;
		if (rooms) {
			for (var croom in rooms) {
				if (!rooms[croom].hasOwnProperty(croom)) {
					availableRooms.push(croom);
				}
			}
		}

		console.log(availableRooms);
		io.emit('outMessage', `<div class='console message'><pre> ${JSON.stringify([...io.of("/").adapter.rooms])}</pre></div>`);

	} else if (message.startsWith('/whc')) {
		io.emit('outMessage', `<div class='console message'><pre>${JSON.stringify(whoHasConnected)}</pre></div>`);
	} else if (message.startsWith('/mem')) {
		io.emit('outMessage', `<div class='console message'><pre>%${(os.freemem() / os.totalmem()) * 100} memory free</pre></div>`);
	} else if (message.startsWith('/cout ')){
		try{
		io.emit(
		"outMessage",
		`<div class='console message '>${eval(message.split(' ').slice(1).join(' '))}</div>`);
		}catch(e){
			io.emit(
			"outMessage",
			`<div class='console message '>Error: ${e}</div>`);
		}
	} else if (message.startsWith('/leave')) {
		var rm = message.split(' ')[1];
		io.to(rm).emit(
			"outMessage",
			`<div class='console message room ${rm}'><bx>q</bx> ${usr} left ${rm}.</div>`);
		sckt.leave(rm);

		return true;

	} else if (message.startsWith('/check')) {
		var user = message.split(' ')[1];
		try {
			if(false){
			fs.readFile('status.json', 'utf8', function(err, data) {
				if (err) {
					io.emit('outMessage', `<div class='console message'>ERROR: <pre>${err}</pre></div>`);
					console.log(err);

					return;
				}
				io.emit('outMessage', `<div class='console message ${user}'><pre>${JSON.parse(data)[user]}</pre></div>`);
			});
				}
			getStatus(user);

		} catch (err) {
			console.log(err);
			io.emit('outMessage', `<div class='console message'>ERROR: <pre>${err}</pre></div>`);
		}
	} else if (message.startsWith('/status')) {
		var MonosodiumGutamate = message.split(' ').slice(1).join(' ');
		
		try {
			if(false){
			let name = 'status.json';
			status[usr] = MonosodiumGutamate;
			fs.writeFile(name, JSON.stringify(status), function writeJSON(err) {
				if (err) return console.log(err);
				console.log(JSON.stringify(status));
				console.log('writing to ' + name);
			});

			try {
				fs.readFile('status.json', 'utf8', function(err, data) {
					if (err) {
						io.emit('outMessage', `<div class='console message'>ERROR: <pre>${err}</pre></div>`);
						console.log(err);

						return;
					}
					io.emit('outMessage', `<div class='console message ${user}'><pre>${JSON.parse(data)[user]}</pre></div>`);
				});
			} catch (err) {
				console.log(err);
				io.emit('outMessage', `<div class='console message'>ERROR: <pre>${err}</pre></div>`);
			}
			}
			if(true){
			 client.set(usr, MonosodiumGutamate);
				io.emit('outMessage', client.get("key"));
			}
		} catch (err) {
			console.log(err);
			io.emit('outMessage', `<div class='console message'>ERROR: <pre>${err}</pre></div>`);
		}
	}

	if(((userBans[room]) && (userBans[room].includes(usr))) || ((userBans['general']) && (userBans['general'].includes(usr)) && (room == undefined) )){
		io.emit(
			"outMessage",
			`<div class='console message removed'><ml>q</ml> ${usr} Tried to send a message in a banned room... (${room})</div>`
		);
		return false;
	}
	

	let extendedMessage;
	if (!usr.startsWith("nxm")) {
		if (
			message != ":3" &&
			message != "3" &&
			message != "=3" &&
			message != "&:" &&
			message != "&="
		) {

			let collapsed = false;

			if (list[list.length - 1] != undefined && colcount < 10) {
				if (list[list.length - 1].includes(`<div id='${list.length - 1}' class='message ${usr}`)) {
					collapsed = true;
					colcount++;
				}
			} else {
				colcount = 0;
			}

			var passport = isForever(room) ? room[0] + forever[room].length : list.length;

			let ctime = curTime.toLocaleString(
				"en-US",
				{ timeZone: "US/Arizona" }
			);
			let dtime = curTime.toLocaleTimeString("en-US", {
				timeZone: "US/Arizona",
			});

			extendedMessage = `<div id='${passport}' class='message ${usr} ${collapsed ? 'collapsed' : ''} `;
			extendedMessage += `${phone ? "phone" : ""} ${room != null ? 'room' : ''} ${room != null ? room : ''}'> `;
			extendedMessage += `<strong class='identifier' onClick='onIdentifer("${usr}")'>`;
			extendedMessage += `${usr} ${room != null ? '#<room>' + room + '</room> ' : ''}`;
			extendedMessage += `<abbr noicon title='${ctime}'> @ ${dtime}:</ins></strong> `;
			extendedMessage += `<msgtxt>${message}</msgtxt>`;
			extendedMessage += `<button class='rightist' onClick="maple('${passport}')">${passport}</button> </div>`;

		} else {
			let variationOfACloud = ":3";
			extendedMessage = `<div id='${list.length}' class='message ${usr} ${phone ? "phone" : ""
				}'> <strong class='identifier' onClick='onIdentifer("${usr}")'> ${usr} <abbr noicon title='${curTime.toLocaleString(
					"en-US",
					{ timeZone: "US/Arizona" }
				)}'> </ins></strong> <msgtxt>${variationOfACloud}</msgtxt> </abbr> <button class='rightist' onClick="maple(${list.length
				})">${list.length}</button> </div>`;
		}
	} else {
		extendedMessage = message;
	}

	if (MEM && room == null) {
		list.push(extendedMessage);
	} else {

		//These channels also save!
		if (isForever(room)) {
			forever[room].push(extendedMessage);
		}

		list.length++;

	}

	if (message.search("novis") == -1) {
		console.log("@" + usr + ": " + message);

		try {
			var usersPFP = 'https://sunkist-palace.net/images/pfp/';
			if(usr.includes('<-')){
				switch(usr.split(' <-')[0]){
					case 'MaximusMiller2':
						usersPFP += 'd-MaximusMiller2.webp';
						break;
						case 'Boxel':
						usersPFP += 'd-Boxel.webp';
						break;
						case 'Avonya':
						usersPFP += 'd-Avonya.webp';
						break;
						case 'Afton':
						usersPFP += 'd-Afton.webp';
						break;
					default:
						usersPFP += 'node.png';
						break;
				}
			}else{
				switch(usr){
					case 'MaximusMiller2':
						usersPFP += 'MaximusMiller2.png';
						break;
						case 'Boxel':
						usersPFP += 'Boxel.png';
						break;
						case 'Avonya':
						usersPFP += 'Avonya.jpg';
						break;
						case 'Afton':
						usersPFP += 'Afton.png';
						break;
					default:
						usersPFP += 'node.png';
						break;
				}
			}

			/*
			request({
				method: "POST",
				url: webhookURL,
				formData: {
					content: `${message} ${phone ? "✆" : ""}`,
					username: `${usr} #${room != null?room:"general"}${developmentServer?' on DEV server':''}`,
				avatar_url: usersPFP,
				},
			});*/
		} catch (e) {
			console.log('Unable to send discord message. Err: ' + e);
		}
  
	}

	if (room != null) {
		io.to(room).emit("outMessage", extendedMessage);
		askUpdate(room);
	} else {
		io.to('general').emit("outMessage", extendedMessage);
		askUpdate('general');

	}

}

function askUpdate(tupper) {
	if (tupper != undefined) {
		io.to(tupper).emit("requestUpdate");
	} else {
		io.emit("requestUpdate");
	}
}
function askEdit(id, msg) {
	io.emit('requestEdit', id, msg);
}
function askPingUpdate(usr) {
	io.emit("requestPingUpdate", usr);
}

io.of("/").adapter.on("join-room", (room, id) => {
	onliners.forEach((value, key) => {
		if (value == id) {
			if ((userBans[room]) && (userBans[room].includes(key))) {
				io.emit(
					"outMessage",
					`<div class='console message removed'><ml>q</ml> ${key} Tried to join a room they were banned in... (${room})</div>`
				);
				socket.leave(room);
			}
		}
	});
	
});
io.of("/").adapter.on("leave-room", (room, id) => {
	onliners.forEach((value, key) => {
		if (value == id) {
			//console.log("-" + key + ` LEFT: ` + room);
			if(room == 'general'){
				return;
			}
			if(key == room){
				return;
			}
			if(room == value){
				return;
			}
			io.to(room).emit(
				"outMessage",
				`<div class='console message room ${room}'><bx>q</bx> ${key} left ${room}.</div>`
			);
		}
	});


});
io.emit("outMessage", "<hr restart>");

io.on("connection", (socket) => {
	//Messages
	socket.on("inMessage", (usr, message, phone) => {
		//console.log("@AUTO: " + usr + ":" + message)
		sendMessage(usr, message, phone, socket);
	});


	//Online people
	connected++;
	//console.log("T");

	socket.on('realtime.letter', (data) => {
		io.emit('realtime.letter', data);
	});
	socket.on('realtime.message', (data) => {
		io.emit('realtime.message', data);
	});

	socket.on("indentify", (usrname) => {
		try {
			onliners.set(usrname, socket.id);
			if (!whoHasConnected.includes(usrname)) {
				whoHasConnected.push(usrname);
			}


			for(var everyone in idleList){
				io.to(socket.id).emit("attentionOut", idleList[everyone], "idle");
			}

			//console.log("|" + usrname + `[${connected}]`);
			socket.join(usrname);
			socket.join('general');
			if (usrname == 'MaximusMiller2' || usrname == 'Afton') {
				socket.join('admin');
			}
		} catch (e) {
			console.log(e);
		}
	});

	//Offline people
	socket.on("disconnect", () => {
		try {
			connected--;
			onliners.forEach((value, key) => {
				if (value == socket.id) {
					//console.log("⊥" + key + `[${connected}]`);
					onliners.delete(key);
				}
			});
			io.emit('reqID');
		} catch (e) {

			console.log(e);
		}
	});

	socket.on("setData", (index, value) => {
		serverData[index] = value;
		console.log("Data " + index + " Is now " + value);
	});

	socket.on("getData", (index, callback) => {
		callback(serverData[index]);
		//socket.emit('getDataFinished', index, serverData[index])
		console.log("Got " + index + ": " + serverData[index]);
	});

	socket.on("changeData", (index, change) => {
		console.log(
			`data[${index}]: ${serverData[index]} -> ${serverData[index] + change}`
		);
		serverData[index] += change;
	});

	socket.on("attention", (user, status) => {
		switch(status){
			case "idle":
				io.emit("attentionOut", user, "idle");
				idleList.push(user);
				break;
			case "focused":
				io.emit("attentionOut", user, "focused");
				idleList.splice(idleList.indexOf(user), 1);
				break;
		}
	});

	// TERMINAL EX

	socket.on('login', (username, score)=>{
		if(score == 0 || username == 'null'){
			return false;
		}
		try{
			coworkers.set(username, score);
			console.log(coworkers)
			io.emit("client.all", mapToObj(coworkers));
			io.emit("login", username, score);
		}catch(err){
			console.log(err);
		}
	});
	socket.on('c4', (target, payload)=>{
		if(minefield[target] == undefined){
			minefield[target] = [];
		}
		try{
		minefield[target].push(payload);
		io.emit("minefield.update", minefield);
		io.emit("c4", target, payload);
		}catch(err){
			console.log(err);
		}
	});
	socket.on('c4.exposion', (target, payload)=>{
		minefield[target].splice(minefield[target].indexOf(payload), 1);
		io.emit("minefield.update", minefield);
		io.emit("minefield.explosion");
		io.emit('c4.exposion', target, payload);
	});

	//Typing people
	socket.on("typing", (usr) => {
		try {
			if (talkers.includes(usr)) {
				return;
			}
			let usrTyper = talkers.push(usr);
			console.log(talkers);

			setTimeout(() => {

				talkers.splice(
					talkers.findIndex((value) => {
						return value == usr;
					})
				);
			}, 2 * 1000);

		} catch (e) {
			console.log(e);
		}
	});
});

//Heartbeat
setInterval(() => {
	if(connected != 0){
		io.emit("getTalkers", talkers);
		io.emit("getConnected", connected);
		io.emit("getOnliners", Object.fromEntries(onliners));
	}
}, 250);


//Graceful shutdown
function gracefulRestart(signal) {
	io.emit("outMessage", "<hr restart>");

	console.log("Shutting down...");
	process.exit(0);
}
process.on("SIGTERM", gracefulRestart);
process.on("SIGINT", gracefulRestart);

function isImageFile(filename) {
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
	const fileExtension = filename.split('.').pop().toLowerCase();
	return imageExtensions.includes(fileExtension);
}

// Function to check if a filename represents an audio file
function isAudioFile(filename) {
	const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma'];
	const fileExtension = filename.split('.').pop().toLowerCase();
	return audioExtensions.includes(fileExtension);
}

// Function to check if a filename represents a video file
function isVideoFile(filename) {
	const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'webm'];
	const fileExtension = filename.split('.').pop().toLowerCase();
	return videoExtensions.includes(fileExtension);
}

function isForever(roomer) {
	if (roomer == 'devtest' ||
		roomer == 'secondary' ||
		roomer == 'tertiary') {
		return true;
	} else {
		return false;
	}
}

async function getStatus(userr){
	let result = await client.get(userr);
	io.emit('outMessage', `<div class='console message ${userr}'>${result}</div>`);
}

/** Removes a message from the list */
function moderate(msgId) {
	try {
		list[msgId] = "<div class='console removed'><ml>r</ml>[Removed]</div>";
	} catch (e) {
		console.log(e);
	}

	io.emit("moderate", msgId);
}


const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
		obj[key] = value;
		return obj;
	}, {});
};


io.emit("outMessage", "<hr restart><button onclick='window.location.reload();'>Refresh button</button>");
