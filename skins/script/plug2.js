/*//Server message handling//*/
//When the client recieves a messsage

//sunkist-palace /?getMessage, use the returned html to be inserted before everythin PLEASE

//document.addEventListener("load" , ()=>{
	var request = new XMLHttpRequest();
	request.open('GET', "https://"+window.location.hostname+'?getMessage', true);
	request.onreadystatechange = function() { // request successful
	// we can use server response to our request now
		if (this.readyState == 4 && this.status == 200) {
			var newDivver = document.createElement("message");
			newDivver.innerHTML = request.responseText;
			document.body.appendChild(newDivver);
		}
	}
	request.onerror = function(){
		alert('aaa');
	}
	request.send();
//});

socket.on("outMessage", (message) => {
	let soundURL =
		"https://sunkist-palace.net/sound/usr/extrude.ogg";
	let sndVol = localStorage.getItem('soundVolume');
	let msgSound = new Audio(soundURL);
	msgSound.volume = sndVol;
	msgSound.play();

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
				document.title.replace(sunkistsPalace, splitString(message).usrIdentifier);
				setTimeout(()=>{
					document.title.replace(splitString(message).usrIdentifier, sunkistsPalace);
				}, 5000);
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

		
		if (window.localStorage.getItem("autoFormat")) {
			hljs.highlightAll();
			let elementes = document.getElementsByClassName('openInTab');
			 for(var i = 0; i < elementes.length; i++){
					elementes[i].onclick = function(){ newPopup(this.src);console.log(this.src) };
			 }
		}

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

socket.on("attentionOut", (user, status) => {
	let styleCommand = document.createElement("style");

	switch(status){
		case "idle":
				styleCommand.innerHTML = `.${user}::before{content:'🌙';}`;
			break;
		case "focused":
				styleCommand.innerHTML = `.${user}::before{content:'';}`;
			break;
	}
	document.body.appendChild(styleCommand).setAttribute('nodraw', '');

});


socket.on("kicked", (reason)=>{
	location.assign("/kicked.html?"+reason);
});
socket.on("banned", (reason)=>{
	location.assign("/banned.html?"+reason);
});