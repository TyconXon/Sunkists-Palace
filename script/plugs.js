/*//Server message handling//*/
//When the client recieves a messsage
socket.on("outMessage", (message) => {
	console.log(message);
	//Only available for autoMode

	let soundURL =
		"https://sunkist-palace.net/sound/";
	let sndVol = localStorage.getItem('soundVolume');
	if (splitString(message) != false) {
		switch (splitString(message).usrIdentifier) {
			case "MaximusMiller2":
				if (Math.random() < 0.1) {
					soundURL += "say/toby/snd_select.wav";
				} else {
					soundURL += "say/toby/text.mp3";
				}
				break;
			case "Boxel":
				if (Math.random() < 0.12) {
					soundURL += "wow.mp3";
				} else {
					soundURL += "usr/Fox_idle3.ogg";
				}
				break;
			case "Afton":
				if (Math.random() < 0.15) {
					soundURL += "say/toby/snd_pombark.wav";
				} else {
					soundURL += "usr/alert2.mp3";
				}

				break;
			case 'Elsen':
				soundURL += 'Global.wav';
				break;
			default:
				soundURL += "say/toby/snd_text.wav";

				break;
		}
		switch (splitString(message).message) {
			case "dog":
			case "bark":
				soundURL =
					"https://sunkist-palace.net/sound/say/toby/snd_pombark.wav";
				break;
			case ":3":
			case "&:":
			case "Meow":
			case "cat":
			case "3":
			case "meow":
				let rng = Math.random();
				if (rng <= 0.333) {
					soundURL =
						"https://sunkist-palace.net/sound/usr/Cat_idle1.ogg";
				} else if (rng <= 0.666) {
					soundURL =
						"https://sunkist-palace.net/sound/usr/Cat_idle2.ogg";
				} else {
					soundURL =
						"https://sunkist-palace.net/sound/usr/Cat_idle3.ogg";
				}
				break;
			case "die":
				soundURL =
					"https://sunkist-palace.net/sound/itoi/die.mp3";
				break;
			case "Fox":
			case "fox":
				if (Math.random() > 0.5) {
					soundURL =
						"https://sunkist-palace.net/sound/usr/Fox_idle3.ogg";
				} else {
					soundURL =
						"https://sunkist-palace.net/sound/usr/Fox_idle2.ogg";
				}
				break;
			case "explode":
			case "boom":
				soundURL =
					"https://sunkist-palace.net/sound/say/toby/snd_badexplosion.wav";
				break;
			case "ralsei":
				if (singLevel == 0) {
					soundURL =
						"https://sunkist-palace.net/sound/say/toby/snd_ralseising1.wav";
					singLevel = 1;
				} else {
					soundURL =
						"https://sunkist-palace.net/sound/say/toby/snd_ralseising2.wav";
					singLevel = 0;
				}
				break;
			case "smile":
				/*//soundURL =
					"https://sunkist-palace.net/sound/say/toby/snd_smile.wav";
				break;
			case "Wow!"://*/
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/008-Earthbound-Now-Let_s-Go.mp3";
				break;
			case "Whoa!":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/015-Earthbound-Whoa.mp3";
				break;
			case "Win!":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/035-Earthbound-YouWin.mp3";
				break;
			case "sanctuary":
				switch (sanLevel) {
					case 8:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/048.mp3";
						sanLevel++;
						break;
					case 9:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/049.mp3";
						sanLevel++;
						break;
					case 10:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/050.mp3";
						sanLevel++;
						break;
					case 11:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/051.mp3";
						sanLevel++;
						break;
					case 13:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/052.mp3";
						sanLevel++;
						break;
					case 14:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/053.mp3";
						sanLevel++;
						break;
					case 15:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/054.mp3";
						sanLevel = 0;
						break;
					case 0:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/122.mp3";
						sanLevel++;
						break;
					case 1:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/123.mp3";
						sanLevel++;
						break;
					case 2:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/124.mp3";
						sanLevel++;
						break;
					case 3:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/125.mp3";
						sanLevel++;
						break;
					case 4:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/126.mp3";
						sanLevel++;
						break;
					case 5:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/127.mp3";
						sanLevel++;
						break;
					case 6:
						soundURL =
							"https://sunkist-palace.net/sound/say/itoi/128.mp3";
						sanLevel++;
						break;
					case 7:
						soundURL =
							"https://sunkist-palace.net/say/sound/itoi/129.mp3";
						sanLevel++;
						break;
				}

				break;
			case "spooky":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/159- Earthbound - Spooky___.mp3";

				break;
			case "ok":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/170- Earthbound - OK _Ssuka_.mp3";
				break;
			case "active":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/active.mp3";
				break;
			case "fiddlesticks":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/bugreporter_failed.wav";
				break;
			case "screenshot":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/bugreporter_succeeded.wav";
				break;
			case "[":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/ding_off.wav";
				break;
			case "]":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/ding_on.wav";
				break;
			case "drunk":
				soundURL =
					"https://sunkist-palace.net/sound/usr/Drunk.mp3";
				break;
			case "zap":
				soundURL =
					"https://sunkist-palace.net/sound/usr/Electric.mp3";
				break;
			case "anticitizen":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/halflife/voice/f_anticitizenreport_spkr.wav";
				break;
			case "anticivil":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/halflife/voice/f_anticivil1_5_spkr.wav";
				break;
			case "clamp":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/halflife/voice/f_anticivilevidence_3_spkr.wav";
				break;
			case "malcompliance":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/halflife/voice/f_capitalmalcompliance_spkr.wav";
				break;
			case "old times":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_06.ogg";
				break;
			case "misplaced":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_12a_edited.ogg";
				break;
			case "choose":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_choose1.ogg";
				break;
			case "get off":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_exit10.ogg";
				break;
			case "unforeseen consequences":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_mono9.ogg";
				break;
			case "no regrets":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_noreg.ogg";
				break;
			case "rise and shine":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_riseshine.ogg";
				break;
			case "snarl":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/Gman_snarl01.ogg";
				break;
			case "buzz":
				soundURL =
					"https://sunkist-palace.net/sound/say/itoi/hackbuzzer.wav";
				break;
			case "medic":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/tf2/medic_standonthepoint04.mp3";
				break;
			case "thanks":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/tf2/medic_thanks01.mp3";
				break;
			case "thank you":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/tf2/medic_thanksfortheheal01.mp3";
				break;
			case "start":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/tf2/mm_round_start_casual.wav";
				break;
			case "mad":
				soundURL =
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/sound/NPC_VO_rosie_combat_01.wav.mp3";
				break;
			case "thunder":
				soundURL =
					"https://sunkist-palace.net/sound/say/valve/halflife/voice/thunder2.wav";
				break;
			case "13":
				soundURL =
					"https://sunkist-palace.net/sound/Tally Hall - Marvin's Marvelous Mechanical Museum - 13 13.ogg";
				break;
		}
		//Create a sound from this link
		let msgSound = new Audio(soundURL);
		msgSound.volume = sndVol;
		
		//Then play it
		msgSound.play();
	}

	/*
	let eventData = {
		fullData: message,
		user: splitString(message).usrIdentifier,
		message: splitString(message).message
	}

	document.dispatchEvent(eventData);
	*/

	if (true) { //If was for no automode
		// Create a new message element
		const newDiv = document.createElement("message");
		// Set the HTML content of the new div
		newDiv.innerHTML = message;

		

		if (!document.hasFocus() || !altMode) {
			if (unfocusedLevel == 0) {
				var rule = document.createElement('hr');
				var readMessage = document.createElement('button');
				readMessage.innerHTML = "Read Messages";
				readMessage.onclick =()=>{markAsRead();readMessage.remove();rule.remove();};
				readMessage.style.backgroundColor = 'red';
				readMessage.style.padding = 'auto';
				document.body.appendChild(rule);
				document.body.appendChild(readMessage);

				unfocusedLevel = 1;
			}
		} else {
			try {
				navigator.vibrate(22);
			} catch (error) {
				
			}
			
			unfocusedLevel = 0;
		}

		// Append the new div to the body
		const finalMsg = document.body.appendChild(newDiv);
		
		if(rightNow.getUTCMonth() == 3 && rightNow.getUTCDay() == 1 && Math.random()>0.5){
			for(let i = 0; i < Math.round(Math.random()*8); i++){
				var request = new XMLHttpRequest();
				request.open('GET', 'https://random-word-api.herokuapp.com/word', true);
				request.onreadystatechange = function() { // request successful
				// we can use server response to our request now
					if (this.readyState == 4 && this.status == 200) {
						let someonesLastMessage = document.getElementsByClassName('message');
						let someonesVeryLastMessage = someonesLastMessage[someonesLastMessage.length - 1]
						if(Math.random()>0.5){
							someonesVeryLastMessage.innerHTML = someonesVeryLastMessage.innerHTML.replace('<msgtxt>', '<msgtxt>' + /[a-z]+/.exec(this.responseText)[0] + " ");
						}else{
							someonesVeryLastMessage.innerHTML = someonesVeryLastMessage.innerHTML.replace('</msgtxt>', " " + /[a-z]+/.exec(this.responseText)[0] + " </msgtxt>");
						}
						
					}
				};
		
				request.onerror = function() {
					// request failed
				};
		
				request.send();
			}
		}

		if (window.localStorage.getItem("autoFormat")) {
			hljs.highlightAll();
			let elementes = document.getElementsByClassName('openInTab');
			 for(var i = 0; i < elementes.length; i++){
					elementes[i].onclick = function(){ newPopup(this.src);console.log(this.src) };
			 }
		}

/*
		if (window.localStorage.getItem("notificationLevel") == "2") {
			var splitted = splitString(message);
			var styles = window.getComputedStyle(newDiv, "::before");
			console.log(styles.getPropertyValue("background-image"));
			console.log(JSON.stringify(styles));

			if (
				!(
					splitted.usrIdentifier ==
					window.localStorage.getItem("username")
				)
			) {
				notify(
					splitted.message,
					splitted.usrIdentifier,
					"https://javascriptreminiscentofpragmaticgears.maximusmiller2.repl.co/pre.gif",
				);
			}
		}
*/
		//Recheck pings
		checkPings();
		//If altmode is enabled, rescroll the page
		if (altMode) {
			//Scroll to the bottom, basically
			document.body.scrollTop = document.body.scrollHeight;
		}
	}
});
socket.on("getConnected", (con) => {
	document.getElementById("onlineNumber").innerHTML = con;
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