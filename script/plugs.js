//User-defined
let msgCausesSounds = true;
//Internal
var sanLevel = 0;
var singLevel = 0;

/*//Server message handling//*/
//When the client recieves a messsage
socket.on("outMessage", recieveMessage);

// Map user identifiers to sound URL options
const userSounds = {
	MaximusMiller2: loadedDiceRoll(0.1, 'say/toby/snd_select.wav',  'say/toby/text.mp3'),
	Boxel: loadedDiceRoll(0.02, 'say/itoi/wow.mp3', 'usr/Fox_idle3.ogg'),
	Afton: loadedDiceRoll(0.15, 'say/toby/snd_pombark.wav', 'usr/alert2.mp3'),
	Elsen: 'Global.wav',
	default: 'say/toby/snd_text.wav'
};

// Map message keywords to sound URL options. = will redirect to another entree.
const messageSounds = new Map([
	["zap", '/sound/usr/Electric.mp3'],
	["dog", '/sound/say/toby/snd_pombark.wav'],
	["bark", '=dog'],
	["meow", randomCatSound()],
	[":3", "=meow"],
	["Meow", "=meow"],
	["3", "=meow"],
	["die", '/sound/say/itoi/die.mp3'],
	["fox", randomChoice('/sound/usr/Fox_idle3.ogg' , '/sound/usr/Fox_idle2.ogg')],
	["Fox", "=fox"],
	//Toby Fox
	["boom", '/sound/say/toby/snd_badexplosion.wav'],
	["explosion", '=boom'],
	["explode", "=boom"],
	["ralsei", resetSingLevel()],
	["smile", '/sound/say/toby/snd_smile.wav'],
	["I can do anything!", "/sound/say/toby/snd_joker_anything.wav"],
	//Itoi
	["Wow!", '/sound/say/itoi/008-Earthbound-Now-Let_s-Go.mp3'],
	["Whoa!", '/sound/say/itoi/015-Earthbound-Whoa.mp3'],
	["Win", '/sound/say/itoi/you win!.mp3'],
	["sanctuary", getSanctuarySound()],
	["spooky", '/sound/say/itoi/159-Earthbound-Spooky.mp3'],
	["ok", '/sound/say/itoi/170-Earthbound-OK_Ssuka.mp3'],
	["scary", "/sound/say/itoi/Scary.mp3"],
	["break", "/sound/say/itoi/Random_break.ogg"],
	["heal", "/sound/say/itoi/ailment.mp3"],
	["kill", "/sound/say/itoi/attack.mp3"],
	//Hakita
	["punch", "/sound/say/hakita/PunchSwoosh.ogg"],
	["feedbacker", "=punch"],
	["spawn", "/sound/say/hakita/portal.ogg"],
	["husk", "=spawn"],
	["streetcleaner", "=spawn"],
	["ferryman", "/sound/say/hakita/PortalFerryman.ogg"],
	["mannequin", "/sound/say/hakita/MannequinSkitter.wav"],
	["Devil May Cry","/sound/say/hakita/devilmaycry.wav"],
	["enraged", "/sound/say/hakita/enraged.mp3"],
	["kys", "=enraged"],
	["Yes, that's it!", "/sound/say/hakita/Sp_yesthatsit.ogg"],
	["wicked", "/sound/say/hakita/wicked.wav"],
	["ricoshot", "/sound/say/hakita/coinflip.wav"],
	["bribe", "=ricoshot"],
	["coin", "=ricoshot"],
	["marksman", "=ricoshot"],
	["Full auto", "/sound/say/hakita/fullauto.wav"],
	["Fuller auto", "/sound/say/hakita/fullerauto.wav"],
	//Lindroth
	["tyro", randomChoice("/sound/say/lindroth/1.ogg", "/sound/say/lindroth/2.ogg", "/sound/say/lindroth/3.ogg", "/sound/say/lindroth/4.ogg", "/sound/say/lindroth/5.ogg")],

]);

function recieveMessage(message) {
    console.debug("Receiving message: " + message);
	let eMessage = externalMessageEdits(message);
    findSound(eMessage);
	createNewMessageLine();
	createMessage(eMessage)

    // Handle auto-formatting if enabled
    if (window.localStorage.getItem("autoFormat")) {
        document.getElementsByClassName('openInTab').forEach(element => {
            element.onclick = () => newPopup(element.src);
        });
    }

    // Recheck pings and scroll if in alt mode
    checkPings();
    if (altMode) {
        document.body.scrollTop = document.body.scrollHeight;
    }
}

function createNewMessageLine(){
	if (!document.hasFocus() || !altMode) {
        if (unfocusedLevel === 0) {
            const rule = document.createElement('hr');
            const readMessage = document.createElement('button');

            readMessage.innerHTML = "Read Messages";
            readMessage.style.backgroundColor = 'red';
            readMessage.style.padding = 'auto';

            // Mark as read and remove elements on click
            readMessage.onclick = () => {
                markAsRead();
                readMessage.remove();
                rule.remove();
            };

            document.body.appendChild(rule);
            document.body.appendChild(readMessage);

            unfocusedLevel = 1;
        }
    } else {
        try {
            navigator.vibrate(22);
        } catch (error) {
            console.log("Can't vibrate.");
        }
        unfocusedLevel = 0;
    }
}

function createMessage(message){
	    // Create and append a new message element
		const newDiv = document.createElement("message");
		newDiv.innerHTML = message;
		document.body.appendChild(newDiv);
}

function findSound(message) {
    if (message.includes('console message room')) {
        playSound('/sound/usr/error.ogg');
        return;
    }

    let soundURL = '/sound/';
    let msgParts = splitString(message);
    
    if (!msgParts) {
		//if we couldn't figure out the messageparts
		playSound()
		return
	};    
    soundURL += userSounds[msgParts.usrIdentifier] || 'say/toby/snd_text.wav';

	let _chosen = "";
	if(messageSounds.get(msgParts.message).startsWith('=')){
		//If has shorctut notation
		let shortcutPointsTo = messageSounds.get(msgParts.message).replace('=', '');
		_chosen = messageSounds.get(shortcutPointsTo)
	}else{
		_chosen = messageSounds.get(msgParts.message);
	}

    soundURL = _chosen || soundURL;

    playSound(soundURL);
}

// Helper functions
function randomCatSound() {
    return randomChoice('/sound/usr/Cat_idle1.ogg','/sound/usr/Cat_idle2.ogg','/sound/usr/Cat_idle3.ogg');
}

function resetSingLevel() {
	//Flip-flop between the ralsei sounds
    singLevel = 1 - singLevel;
    return singLevel ? '/sound/say/toby/snd_ralseising2.wav' : '/sound/say/toby/snd_ralseising1.wav';
}

const sanctuarySounds = [
	'/sound/say/itoi/122.mp3', '/sound/say/itoi/123.mp3', '/sound/say/itoi/124.mp3', '/sound/say/itoi/125.mp3',
	'/sound/say/itoi/126.mp3', '/sound/say/itoi/127.mp3', '/sound/say/itoi/128.mp3', '/sound/say/itoi/129.mp3',
	'/sound/say/itoi/048.mp3', '/sound/say/itoi/049.mp3', '/sound/say/itoi/050.mp3', '/sound/say/itoi/051.mp3',
	'/sound/say/itoi/052.mp3', '/sound/say/itoi/053.mp3', '/sound/say/itoi/054.mp3'
];
function getSanctuarySound() {

    let sound = sanctuarySounds[sanLevel] || sanctuarySounds[0];
    sanLevel = (sanLevel + 1) % sanctuarySounds.length;
    return sound;
}





socket.on("getConnected", (con) => {
	document.getElementById("onlineNumber").innerHTML = con;
	if(localStorage.getItem('titlePrefix')){
		//document.getElementById("title").innerText = `[${con}] ${sunkistsPalace} ${newMessageCount>0?"+ "+newMessageCount:""}`;
	}
});
socket.on("moderate", (msg) => {
	document.getElementById(msg).innerHTML =
		"<div class='removed'>[Removed]</div>";
});
socket.on("requestEdit", (id, msg) => {
	document.getElementById(id).innerHTML = msg;
	setTimeout(()=>{
		document.getElementById(id).outerHTML = msg;
	},1500)
});
//Tell server who you are after giving yourself time to realize who you are
setTimeout(() => {
	socket.emit("indentify", window.localStorage.getItem("username"));
}, 20);
//Make sure the server knows who you are ever 15 seconds
setInterval(() => {
	socket.emit("indentify", window.localStorage.getItem("username"));
}, 15000);
socket.on("reqID", () => {
	socket.emit("indentify", window.localStorage.getItem("username"));
});
socket.on("getTalkers", (talkers) => {
	let formattedTalkers = "";
	for (var personIndex = 0; personIndex < talkers.length; personIndex++) {
		let person = talkers[personIndex];
		formattedTalkers += `<span class='${person}' onclick='pingGen("${person}")'> ${person} </span>, `;
	}
	document.getElementById("talkorinos").innerHTML = formattedTalkers;
});
socket.on("getOnliners", (onliners) => {
	let formattedOnline = "";
	let onlinePeople = Object.keys(onliners);
	for (
		var personIndex = 0; personIndex < onlinePeople.length; personIndex++
	) {
		let person = onlinePeople[personIndex];
		formattedOnline += `<span class='${person}' onclick='pingGen("${person}")'> ${person} </span>, `;
	}

	if(!onlinePeople.includes(window.localStorage.getItem("username"))){
		socket.emit("indentify", window.localStorage.getItem("username"));
	}

	document.getElementById("onlineCount").innerHTML = formattedOnline;
});
//When the client has a new message since last refresh
socket.on("requestUpdate", () => {
	//Only show notifications if the client isn't focused on auto, or not on auto
	if (
		!document.hasFocus() || !altMode
	) {
		newMessageCount++;
		document.getElementById("title").innerText =
			sunkistsPalace+" +"+ newMessageCount;
		document.getElementById("menuTitle").style.color = "blue";
		document.getElementById("menuTitle").style.textShadow =
			"0px 0px 10px blue";

		document.getElementById("menuTitle").innerText =
			sunkistsPalace+"[+" + newMessageCount + "]";
		document.getElementById("icon").href =
			"/images/faviupdate.png";
	}
});
socket.on("getDataFinished", (data) => {
	curServerData = data;
});
socket.on("attentionOut", (user, status) => {/*
	let styleCommand = document.createElement("style");

	switch(status){
		case "idle":
				document.querySelector(user).innerText = `🌙`;
			break;
		case "focused":
				styleCommand.innerHTML = `.${user}::before{content:'';}`;
			break;
	}*/
	//document.body.appendChild(styleCommand).setAttribute('nodraw', '');

});

socket.on("kicked", (reason)=>{
	location.assign("/kicked.html?"+reason);
});
socket.on("banned", (reason)=>{
	location.assign("/banned.html?"+reason);
});