/*//Global variables//*/
const socket = io(); //Socket to server
var newMessageCount = 0;
var altMode = true; //Determines if the page will autoscroll on a new message on automode
var pingList = []; //Webpage sized ping-list
var curServerData = {};
var unfocusedLevel = 0;
let sndVol = 0.3;


const textBox = document.getElementById("soapMode");
var sunkistsPalace = 'Sunkist\'s Palace';
var altpressed = false;
var shiftpressed = false;
let devmode = false;
const bc = new BroadcastChannel("sunkist");

bc.onmessage = (message)=>{
	if(message.data == 'style'){
		harvestOranges();
	}
}

setTimeout(()=>{
	document.documentElement.style.scrollBehavior = 'smooth';

}, 500);

// Custom title
if(!localStorage.getItem("suffix")){
	localStorage.setItem("suffix", 'Sunkist\'s Palace');
}else{
	document.getElementById("menuTitle").innerText = localStorage.getItem("suffix");
	document.title = localStorage.getItem("suffix");
	sunkistsPalace = localStorage.getItem("suffix");
}
document.getElementById('suffix').oninput = function () {
	sunkistsPalace = document.getElementById('suffix').value;
	localStorage.setItem("suffix", sunkistsPalace);
	document.title = document.getElementById('suffix').value;
	document.getElementById("menuTitle").innerText = document.getElementById('suffix').value;
}
/*
var rightNow = new Date();
if(rightNow.getUTCMonth() == 3 && rightNow.getUTCDay() == 1){
	sunkistsPalace = 'tommy';
	document.getElementById("menuTitle").innerText = 'tommy';
	document.title = 'tommy land';
	
}*/

var URLparams = new URLSearchParams(document.location.search);
if(URLparams.get('channel') != undefined){
	addEventListener('load', ()=>{
		sunkistsPalace += '/' + URLparams.get('channel');
		document.getElementById("menuTitle").innerText = sunkistsPalace;
		var icantthinkofanameforthis = document.createElement('style');
		icantthinkofanameforthis.innerHTML = '.message:not(.room){display:none;}';
		document.body.append(icantthinkofanameforthis)
		message('/leave general');
		message('/join ' + URLparams.get('channel'));
		document.getElementById('prefix').value = '/to ' + URLparams.get('channel') + ' ';
	});

}

// Load existing favorites from localStorage
document.addEventListener("DOMContentLoaded", function () {
		renderFavorites();
	let elementes = document.getElementsByClassName('openInTab');
	 for(var i = 0; i < elementes.length; i++){
			elementes[i].onclick = function(){ newPopup(this.src);console.log(this.src) };
	 }
});

document.getElementById("text-input").addEventListener('keydown', function(e){
	if(e.key == "Enter" && e.shiftKey != true){
		e.preventDefault();
		addToFavorites();
	}
})

// Favorites

function addToFavorites() {
		var textInput = document.getElementById("text-input");
		var text = textInput.value;

		if (text === "") {
				alert("Please enter text before adding to favorites.");
				return;
		}

		var favorites = getFavorites();
		favorites.push(text);
		saveFavorites(favorites);
		renderFavorites();
		textInput.value = "";
}

function deleteFavorite(index) {
		var favorites = getFavorites();
		favorites.splice(index, 1);
		saveFavorites(favorites);
		renderFavorites();
}

function copyToClipboard(text) {
	copy(text);
}

function getFavorites() {
		return JSON.parse(localStorage.getItem("Cfavorites")) || [];
}

function saveFavorites(favorites) {
		localStorage.setItem("Cfavorites", JSON.stringify(favorites));
}

function settingChange(stng){
	if(stng == 'pingSound' || stng == 'titlePrefix'){
		localStorage.setItem(stng, document.getElementById(stng).checked);
		if(document.getElementById(stng).checked && stng == 'pingSound'){
			document.getElementById('pingSoundUrl').disabled = false;
		}else{
			document.getElementById('pingSoundUrl').disabled = true;
		}
		return;
	}
	localStorage.setItem(stng, document.getElementById(stng).value);
}
localStorage.setItem('soundVolume', 0.35)
localStorage.setItem('pingSoundVolume', 0.5)
localStorage.setItem('pingSound', false)
localStorage.setItem('pingSoundUrl', '')
// document.getElementById('soundVolume').value = localStorage.getItem('soundVolume') ? localStorage.getItem('soundVolume') : 0.7;
// document.getElementById('pingSoundVolume').value = localStorage.getItem('pingSoundVolume') ? localStorage.getItem('pingSoundVolume') : 1;
// document.getElementById('pingSound').checked = localStorage.getItem('pingSound') ? localStorage.getItem('pingSound') : false;
// document.getElementById('pingSoundUrl').value = localStorage.getItem('pingSoundUrl') ? localStorage.getItem('pingSoundUrl') : '';


// if(document.getElementById('pingSound').checked){
// 	document.getElementById('pingSoundUrl').disabled = false;
// }else{
// 	document.getElementById('pingSoundUrl').disabled = true;
// }

function renderFavorites() {
		var favoritesList = document.getElementById("favorites-list");
		favoritesList.innerHTML = "";

		var favorites = getFavorites();
		favorites.forEach(function (text, index) {
				var listItem = document.createElement("textarea");
				listItem.className = "favorite-item";
				listItem.draggable = true;
				listItem.readonly=true;


					listItem.addEventListener("contextmenu", function () {
						deleteFavorite(index);
					});
					listItem.addEventListener("dragend", function () {
						deleteFavorite(index);
					});

					listItem.addEventListener("click", function () {
						copyToClipboard(text);
				});

				listItem.textContent = text;
				favoritesList.appendChild(listItem);
		});
}

//--

Storage.prototype.setObj = function(key, obj) {
	return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
	return JSON.parse(this.getItem(key));
};

/*//Text sciences//*/
function urlify(text) {
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(urlRegex, function(url) {
		return '<a href="' + url + '" target="_blank">' + url + "</a>";
	});
}
function markAsRead(){
	newMessageCount = 0;
	document.getElementById("title").innerText =
		sunkistsPalace
	// document.getElementById("menuTitle").style.color = "yellow";
	// document.getElementById("menuTitle").style.textShadow =
		// "0px 0px 10px yellow";

	document.getElementById("menuTitle").innerText =
		sunkistsPalace;
	document.getElementById("icon").href =
		"images/favi.png";
	document.getElementById("menuTitle").className = 'titleRead'
}

document.getElementById("sStyle").value =
	window.localStorage.getItem("style");
document.getElementById("sJs").value =
	window.localStorage.getItem("js");

harvestOranges();

addEventListener('load', ()=>{
	if(hasQueryParameter("safe")) {return;}

	var lemon = document.createElement("script");
	lemon.innerHTML = window.localStorage.getItem("js");
	lemon.setAttribute('nodraw', true);
	document.body.appendChild(lemon);
});

document.getElementById("sSub").onclick = function() {
	if (document.getElementById("sStyle").value.includes("novis")) {
		alert(
			"Editing novis is not allowed and is against the comfort and privacy of our users.",
		);
		return;
	}

	window.localStorage.setItem(
		"style",
		document.getElementById("sStyle").value,
	);
	harvestOranges();
	
};
document.getElementById("sSubJs").onclick = function() {
	if (document.getElementById("sJs").value.includes("novis")) {
		alert(
			"Editing novis is not allowed and is against the comfort and privacy of our users.",
		);
		return;
	}
	window.localStorage.setItem(
		"js",
		document.getElementById("sJs").value,
	);
};

function harvestOranges(){
	if(hasQueryParameter('safe')) {return;}

	var orange = document.createElement("style");
	if(document.querySelector('[autogen]') != null){
		document.querySelector('[autogen]').outerHTML = '';
	}

	orange.innerHTML = window.localStorage.getItem("style");
	orange.setAttribute('nodraw', true);
	orange.setAttribute('autogen' , true);
	document.body.appendChild(orange);


	document.body.appendChild(orange);
}

function imgify(text) {
	var urlRegex = /(https?:\/\/[^\s]+(\.png|\.jpg|\.gif|\.webp|\.jpeg))/g;
	if (urlRegex.test(text)) {
		return text.replace(urlRegex, function(url) {
			return '<img src="' + url + '">';
		});
	} else {
		var gRegex =
			/(?<=https:\/\/drive\.google\.com\/file\/d\/)([A-z-0-9]+)/g;
		if (gRegex.test(text)) {
			return text.replace(gRegex, (url) => {
				return "<img src='https://drive.google.com/uc?id=" + url + "'>";
			});
		}
	}
}
/*//Message data extractor//*/
function splitString(inputString) {
	try{
	// Creating an object with named properties
console.log(inputString);
		const result = {
			id: inputString.match(/((?<=maple\()|(?<=maple\('))[^']+((?=')|(?=\)))/g)[0],
			usrIdentifier: inputString.match(
				/((?<=onIdentifer\(\")|(?<=onIdentifer\(\&quot;))[^(^)]*((?="\))|(?=\&quot;\)))/g,
			)[0],
			/*curTime: inputString.match(/(?<=title=')[0-9]+/[0-9]+/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (AM|PM)(?=')/g)[0],*/
			message: inputString.match(/(?<=<msgtxt>)[^]+?(?=<\/msgtxt>)/g)[0],
		};
		console.log(result);
		return result;
	}catch(e){
		console.log(e);
	}
}

/*//Notification system//*/
try{
Notification.requestPermission().then((result) => {
	console.assert(result);
});
}catch(err){
	console.log(err)
}

function notify(bodyT, header = "Sunkist", image = "") {
	return new Notification(header, {
		body: bodyT,
		icon: image,
	});
}

document
	.getElementById("soapMode")
	.classList.add(window.localStorage.getItem("username"));

//Checks messages for pings, and styles them
function checkPings() {
	//Get every element with their usrname
	let search = document.getElementsByTagName(
		window.localStorage.getItem("username"),
	);
	//And for each one
	for (let index = 0; index < search.length; index++) {
		//Add the ping class (cool effects)
		search[index].classList.add("ping");
		search[index].style.display = "inline-block";

		//But now, for every one that is after the read line AND not already checked
		if (
			pingList[index] != "pinger" &&
			search[index].compareDocumentPosition(
				document.getElementById("lastRead"),
			) == 2
		) {
			//Check it
			pingList[index] = "pinger";
			try {
				navigator.vibrate(222);
			} catch (error) {
				
			}
		
			//Play a random, cool sound
			switch (Math.floor(Math.random() * 5)) {
				case 0:
					var msgHo = new Audio(
						window.location.origin + "/sound/say/itoi/shield-3.mp3",
					);
					break;
				case 1:
					var msgHo = new Audio(
						window.location.origin + "/sound/say/itoi/shield-3.mp3",
					);
					break;
				case 3:
					var msgHo = new Audio(
						window.location.origin + "/sound/say/itoi/paralysis.mp3",
					);
					break;
				case 4:
					var msgHo = new Audio(
						window.location.origin + "/sound/say/itoi/shieldkill.mp3",
					);
					break;
			}
			msgHo.volume = 0.50;

			msgHo.play();
		}
	}
}

//Reply functions
function reply(msgId) {
	document.getElementById(msgId).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});


	let rng = Math.random();
	if (rng <= 0.666) {
		soundURL =
			window.location.origin + "/sound/say/valve/portal/portal_enter_01.wav";
	} else if (rng <= 0.333) {
		soundURL =
			window.location.origin + "/sound/say/valve/portal/portal_enter_02.wav";
	} else  {
		soundURL =
			window.location.origin + "/sound/say/valve/portal/portal_enter_03.wav";
	}

	let sound = new Audio(soundURL);
	sound.volume = 0.2;
	sound.play();

	document.getElementById(msgId).classList.add("reply");
	window.setTimeout(() => {
		document.getElementById(msgId).classList.remove("reply");
		let rng = Math.random();
		if (rng >= 0.666) {
			soundURL =
				window.location.origin + "/sound/say/valve/portal/portal_fizzle_01.wav";
		} else if (rng >= 0.333) {
			soundURL =
				window.location.origin + "/sound/say/valve/portal/portal_fizzle_02.wav";
		} else  {
			soundURL =
				window.location.origin + "/sound/say/valve/portal/portal_fizzle2.wav";
		}

		let sound = new Audio(soundURL);
		sound.volume = localStorage.getItem('specialSoundVolume') ? localStorage.getItem('specialSoundVolume') : 0.2;
		sound.play();

	}, 3000);
}
// Function to get query parameters from the URL
function getQueryParameter(name) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name);
}

// Function to see if a query parameter is in the URL
function hasQueryParameter(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}

// Read the value of the 'preset' query parameter
const presetValue = getQueryParameter('preset');

// Check if the 'preset' value is present and not empty
if (presetValue) {
		console.log('Preset value:', presetValue);
		textBox.value = presetValue;
} else {
		console.log('No preset value found in the URL.');
}

textBox.onpaste = function (event) {
		var items = (event.clipboardData || event.originalEvent.clipboardData).items;
		console.log(JSON.stringify(items)); // might give you mime types
		for (var index in items) {
				var item = items[index];
				if (item.kind === 'file') {
						var blob = item.getAsFile();
						var reader = new FileReader();
						reader.onload = function (event) {
							let url = event.target.result;

							var xhr = new XMLHttpRequest();
							xhr.onload = function() {

								let imgBlob = xhr.response;
								
								// Load img blob to input
								let fileName = `image_${Date.now()}.png`;
								let file = new File([imgBlob], fileName,{type:"image/png", lastModified:new Date().getTime()}, 'utf-8');
								let container = new DataTransfer(); 
								container.items.add(file);
								document.getElementById('uploadFile').files = container.files;

								var reader = new FileReader();
								reader.onload = function(e) {
									textBox.style.backgroundImage = 'url('+e.target.result+')';
								}
								reader.readAsDataURL(document.getElementById('uploadFile').files[0]); // convert to base64 string
								
								document.getElementById("menuTitle").innerText = 'Pasted image!';
								window.setTimeout(() => {
									document.getElementById("menuTitle").innerText = sunkistsPalace;
								}, 1000);

							};
							xhr.open('GET', url);
							xhr.responseType = 'blob';
							xhr.send();
	
							
						}; 
						reader.readAsDataURL(blob);
				}
		}
};

document.getElementById('uploadFile').onchange = function(e)	{
	const file = e.target.files[0];
	
	var reader = new FileReader();
	reader.onload = function(e) {
		textBox.style.backgroundImage = 'url('+e.target.result+')';
	}
	reader.readAsDataURL(file); // convert to base64 string

}

function retReplyGen(msgId){
	console.log("replyGen");
	console.log(document.getElementById(msgId).innerHTML);
	let userReplied = document
		.getElementById(msgId)
		.firstElementChild.innerHTML.split(" ")[1];
	return textToCopy = `<button onclick='reply(${msgId})' title='${msgId}'>&#11177; <${userReplied}>${userReplied}</${userReplied}>:<${userReplied}>${extractContent(splitString(document.getElementById(msgId).outerHTML).message).substr(0,25)}</${userReplied}></button>`;

}

function replyGen(msgId) {
	console.log("replyGen");
	console.log(document.getElementById(msgId).innerHTML);
	let userReplied = document
		.getElementById(msgId)
		.firstElementChild.innerHTML.split(" ")[0];
	console.log(userReplied);
	console.log(document
						 .getElementById(msgId)
						 .firstElementChild.innerHTML)
	let textToCopy = `<button onclick='reply("${msgId}")' title='${msgId}'>&#11177; <${userReplied}>${userReplied}</${userReplied}>:<${userReplied}>${extractContent(splitString(document.getElementById(msgId).outerHTML).message).substr(0,25)}</${userReplied}></button>`;
	textBox.value += textToCopy;

	
			let rng = Math.random();
			if (rng <= 0.166) {
				soundURL =
					window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_blue_01.wav";
			} else if (rng <= 0.333) {
				soundURL =
					window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_blue_02.wav";
			} else if(rng <= 0.5) {
				soundURL =
					window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_blue_03.wav";
			}else if(rng <= 0.6){
				soundURL =
				window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_red_01.wav";
			}else if(rng <= 0.833){
				soundURL =
				window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_red_02.wav";
			}else{
				soundURL =
				window.location.origin + "/sound/say/valve/portal/wpn_portal_gun_fire_red_03.wav";
			}
			let sound = new Audio(soundURL);
			sound.volume = 0.6;
			sound.play();

			let oldTitle = document.getElementById("menuTitle").innerText;
			document.getElementById("menuTitle").innerText = 'Copied reply link!';
			window.setTimeout(() => {
				document.getElementById("menuTitle").innerText = oldTitle;
			}, 500);
			textBox.focus();
		
}

function onIdentifer(user){
	if(shiftpressed){
		newTab(window.location.origin + '/users/'+user+'.html');
		return;
	}
	newPopup(window.location.origin + '/?channel='+user+'&cls')//Could go to their own bio page when that is a normal thing
}

function maple(num) {
	if(true){
		replyGen(num);
	}else{
		copy(`/edit ${num} `);
	}
}

function pingGen(usr) {
	let textToCopy = `<${usr}>${usr}</${usr}>`;
	let textArea = document.createElement("textarea");
	textArea.value = textToCopy;
	textBox.value += textToCopy;


	document.body.appendChild(textArea);

	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {
			let oldTitle = document.getElementById("menuTitle").innerText;
			document.getElementById("menuTitle").innerText = 'Copied!';
			window.setTimeout(() => {
				document.getElementById("menuTitle").innerText = oldTitle;
			}, 500);

		})
		.catch((err) => {
			alert("Failed to copy text: ", err);
		})
		.finally(() => {
			document.body.removeChild(textArea);
			//text(textToCopy);
		});
}

function extractContent(s) {
	var span = document.createElement('span');
	span.innerHTML = s;
	return span.textContent || span.innerText;
};

function copy(msg) {
	let textArea = document.createElement("textarea");

	textArea.value = msg;
	textBox.value += textToCopy;


	navigator.clipboard
		.writeText(msg)
		.then(() => {
			let oldTitle = document.getElementById("menuTitle").innerText;
			document.getElementById("menuTitle").innerText = 'Copied!';
			window.setTimeout(() => {
				document.getElementById("menuTitle").innerText = oldTitle;
			}, 500);

		})
		.catch((err) => {
			alert("Failed to copy text: ", err);
		})
		.finally(() => {
			document.body.removeChild(textArea);
			//text(textToCopy);
		});
}

//Sends the message to the server
function message(txt) {
	if (txt.startsWith("/join")) {
		// Create a new message element
		const newDiv = document.createElement("message");
		// Set the HTML content of the new div
		newDiv.innerHTML =
			'<div style="console join message"> Joined channel:' +
			txt.split(" ")[1] +
			"</div>";
		// Append the new div to the body
		const finalMsg = document.body.appendChild(newDiv);
	}
	socket.emit(
		"inMessage",
		window.localStorage.getItem("username"),
		txt,
		screen.orientation.type.includes('por'),
	);
}
//Legacy
function text(preMsg = "") {
	var prompt = window.prompt(
		`say: ${preMsg == "" ? "" : "A reply button will be attached"}`,
	);
	if (prompt == "" || prompt == "null" || prompt == null) {
		return false;
	}
	if (preMsg != "") {
		prompt = preMsg + prompt;
	}

	if (window.localStorage.getItem("autoUpdate") == "true") {
		message(prompt);
		return false;
	}

	if (prompt == "null" || prompt == null) {
		window.location.assign("https://server--maximusmiller2.repl.co/");
	} else {
		window.location.assign(
			"https://server--maximusmiller2.repl.co/?message=" +
			prompt +
			"&user=" +
			window.localStorage.getItem("username"),
		);
	}
}

function nickname(){
	window.localStorage.setItem("username", window.prompt("Nickname:") + "<omit> " + window.prompt("Real username") + " </omit>");
	alert('You can clear your nickname by relogging in');
}

//TODO: idle detection and blurred title changes need to be timedout to be after the new message title change.

var wasIdle = false;
window.onblur = ()=>{
 setTimeout(()=>{
	 if (!document.hasFocus() && !wasIdle){/*
			 socket.emit("attention", window.localStorage.getItem("username"), "idle");
			 wasIdle = true;
			 document.title += "🌙";*/
	 }
 }, 60000)
}
window.onfocus = ()=>{
 if(wasIdle){/*
	 socket.emit("attention", window.localStorage.getItem("username"), "focused");
	 wasIdle = false;
	 document.title = document.title.replaceAll("🌙", "");*/
 }
}

document.getElementById("uploadForm").addEventListener("submit", (event)=>{
	
		var url = "/upload";

			if(devmode){
				url = '/upload?dir=' + prompt('save dir (ex: /temp/)','/temp/');
			}
		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.onload = function() { // request successful
		// we can use server response to our request now
			let filename = document.getElementById("uploadFile").value.replace('C:\\fakepath\\', '').replace(/ /g, '_').replace(/"/g, '-').replace(/'/g, '-');
			let Celement = isImageFile(filename) ? 'img' : isAudioFile(filename) ? 'audio' : isVideoFile(filename) ? 'video' : 'a';
			let other = isImageFile(filename) ? false : isAudioFile(filename) ? false : isVideoFile(filename) ? false : true;
			textBox.value += (`${other ? '' : '<br>'}<${Celement} ${other ? 'download' : ''} class='${other ? '' : 'openInTab'}' controls title='${filename}' href='temp/${filename}' src='temp/${filename}'>${other ? filename : ''}</${Celement}>`);
			textBox.style.backgroundImage = 'none';
		};

		request.onerror = function() {
			// request failed
		};

		request.send(new FormData(event.target)); // create FormData from form that triggered event
		event.preventDefault();
	
});
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

function loadedDiceRoll(firstProb, firstChoice, ...args) {
    if (args.length === 0) {
        return firstChoice; // If no other arguments, always return the first choice
    }
    if (firstProb < 0 || firstProb > 1) {
        throw new Error("Probability must be between 0 and 1");
    }

    const randomNum = Math.random();

    // If the random number falls within the range of the first argument's probability, return it
    if (randomNum < firstProb) {
        return firstChoice;
    }

    // Otherwise, return a random choice from the rest of the arguments
    const remainingProb = (1 - firstProb);
    const randomIndex = Math.floor(Math.random() * args.length);
    
    return args[randomIndex];
}

function randomChoice(...args) {
    if (args.length === 0) {
        return null; // Return null if no arguments are passed
    }
    const randomIndex = Math.floor(Math.random() * args.length);
    return args[randomIndex];
}

function playSound(soundURL) {
    let sound = new Audio(soundURL);
    sound.volume = sndVol;
    sound.play();
}


/*
if(rightNow.getUTCMonth() == 3 && rightNow.getUTCDay() == 1){
	document.getElementById('soapMode').style.backgroundImage = "url('../images/Tommy.png')";
	document.getElementById('menuTitle').style.backgroundImage = "url('../images/tommy.jpg')";
	document.getElementById('menuTitle').style.backgroundSize = "20%";
	document.getElementById('soapMode').style.backgroundSize = "10%";
	document.getElementById('soapMode').style.backgroundBlendMode = "multiply";
	document.getElementById('soapMode').classList.add("colorful");
	document.getElementById('soapMode').classList.add("ns");
	document.getElementById('soapMode').style.textShadow = 'none';
	document.getElementById('soapMode').style.color = "transparent";
	sunkistsPalace = 'tommy';
	document.getElementById("menuTitle").innerText = 'tommy';
	document.title = 'tommy land';
	
	switch(Math.round(Math.random()*10)){
		case 3:
			document.querySelectorAll('a, button, input, .Boxel, details, summary, textarea, select, option, label, span, p, h1, h2, h').forEach((e)=>{
				e.innerText = 'tommy';
			});
			break;
		case 5:
			document.querySelectorAll('*').forEach((e)=>{
				e.style.backgroundImage = 'url("../images/tommy.webp")';
			});
			break;
			case 6:
			document.getElementById("menuTitle").innerText = 'sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist sunkist';
			document.querySelectorAll('*').forEach((e)=>{
				e.style.backgroundImage = 'url("../images/2Sunkist.png")';
			});
			break;
			case 7:
			document.querySelectorAll('*').forEach((e)=>{
				e.classList.add('scrambled');
			});
			break;
		case 2:
			console.log('seasick')
			document.querySelector('html').style.transition = '2s ease';
			setTimeout(()=>{
			setInterval(()=>{
				Math.random() > 0.5 ? document.querySelector('html').style.rotate = Math.random()*2+'deg' : document.querySelector('html').style.rotate = Math.random()*-2+'deg';
			}, 100+Math.random()*5000);
			}, 1000+Math.random()*2000);
			break;
	}
	
}*/
