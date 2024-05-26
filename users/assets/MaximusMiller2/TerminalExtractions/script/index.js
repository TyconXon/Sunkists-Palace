function dailyPrompt(input){
	if(input[0] != 'l'){
		return false;
	}else{
		return true;
	}
}

const terminal = {
	input : document.getElementById('terminal.input'),
}

const playerData = {
	usedWords : [],
	username: "ERR",
	level: 0,
	net: 0,

	get dogDurability(){
		return Number(localStorage.getItem('playerData.dogDurability') || 0);
	},
	set dogDurability(value){
		
		if(value < 0){
			value = 0;
			this.upgrades.splice(this.upgrades.indexOf('k9'), 1);
			localStorage.setItem('playerData.upgrades', JSON.stringify(playerData.upgrades));
		}

		if(this.upgrades.includes('k9')){
			document.getElementById('k9-badge').hidden = false;
		}else{
			document.getElementById('k9-badge').hidden = true;
		}
		
		localStorage.setItem('playerData.dogDurability', value);
	},
	
	mines: [],
	upgrades: [],
	
	get points(){
		//from local storage
		return Number(localStorage.getItem('playerData.points') || 0);
	},
	
	set points(value){
		//Set localstorage and update counter
		localStorage.setItem('playerData.points', value);
		document.querySelector('points').innerText = this.points;
		
		socket.volatile.emit("login", this.username, this.points);
		//socket.emit("public/score", , this.points);
		return this.points;
	},

	reset : function(){
		localStorage.clear();
		this.usedWords = [];
		this.points = 0;
		location.reload();
	},
	
}

//Initial readings
playerData.usedWords = JSON.parse(localStorage.getItem('playerData.usedWords') || '[]');
playerData.mines = JSON.parse(localStorage.getItem('playerData.mines') || '[]');
playerData.upgrades = JSON.parse(localStorage.getItem('playerData.upgrades') || '[]');

if(playerData.upgrades.includes('k9')){
	document.getElementById('k9-badge').hidden = false;
}

document.getElementById('terminal.history').innerHTML = playerData.usedWords.reverse().join('<br>');
document.querySelector('points').innerText = playerData.points;
playerData.username = localStorage.getItem('playerData.username') || prompt("LOG IN AS:");
localStorage.setItem('playerData.username', playerData.username);
playerData.net = playerData.usedWords.length;

socket.emit("login", playerData.username, playerData.points);

/*
if(playerData.username == "hacker"){
	playerData.points = 999999999;
}
*/

/*
const itemShop = [
	{
		product: "K9 Chip",
		price  : 50,
		description: "A bomb-sniffing computer chip."
	},
	{
		product: "Malicious Trigger",
		price  : 25,
		description: "Plant account vulnrabilities"
	}
];

itemShop.forEach((item)=>{
	document.getElementById('shop.catalogue').innerHTML 
		+= 
`<product>
<h3>${item.product}</h3>
<description>${item.description}</description>
<price>${item.price}</price>
<button>Buy</button>
</product>`;

});*/

var annoyed = false;

var words = {};

fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json')
.then((res) => res.json())
.then((data) => {
	words = data;
})
.catch((error) => {
	console.log(error);
});

var dogWarnLevel = 0;

terminal.input.addEventListener('keyup', (e)=>{
	terminal.input.value = terminal.input.value.toLowerCase().trim();
	let input = terminal.input.value;

	
	
	if(e.key == 'Enter'){
		
		terminal.lastword = terminal.input.value;

		

		if(playerData.mines.includes(input)){
			err("CRITICAL SYSTEM ERROR!");
			new Audio('assets/audio/explode.mp3').play();
			terminal.input.value = "";
			playerData.points -= 3;

			document.querySelector('html').classList.remove('flashbang');
			document.querySelector('html').offsetWidth;
			document.querySelector('html').classList.add('flashbang');

			socket.emit('c4.exposion', playerData.username, input);
			playerData.mines.splice(playerData.mines.indexOf(input), 1);
			localStorage.setItem(
					'playerData.mines',
					JSON.stringify(playerData.mines));

			if(playerData.upgrades.includes('k9')){
				setTimeout(()=>{
					new Audio('assets/audio/saddog.mp3').play();
					playerData.dogDurability -= 0.1;
					alert("K9 DURABILITY: " + playerData.dogDurability);
				}, 2000);
			}

			let xhttp = new XMLHttpRequest();
			xhttp.open("GET", `https://sunkist-palace.net/?message=Player <${playerData.username}>${playerData.username}</${playerData.username}> exploded at ${playerData.points+3} points using the word "${input}"!&user=TerminalExtractions`, true);
			xhttp.send();
			xhttp = new XMLHttpRequest();
			xhttp.open("GET", `https://sunkist-palace.net/?message=<${playerData.username}>${playerData.username}</${playerData.username}>: ${playerData.points}'s leaks: ${playerData.usedWords[Math.floor(Math.random() * playerData.usedWords.length)]} ${playerData.usedWords[Math.floor(Math.random() * playerData.usedWords.length)]} ${playerData.usedWords[Math.floor(Math.random() * playerData.usedWords.length)]}&user=TerminalExtractions`, true);
			xhttp.send();
			delete xhttp;

			return;
		}


		if(input == 'test_me' || input == 't') {
			exam();
			terminal.input.value = '';
			return;
		}

		if(input == 'number_duel' || input == 'nd'){
			numberDuel();
			terminal.input.value = '';
			return;
		}
		
		if(input.length <= 2){
			err("Error: too short!");
			new Audio('assets/audio/warningbell1.wav').play();
			terminal.input.value = '';
			return;
		}
		//Requirement
		if(!dailyPrompt(input)){
			err("Error: deosn't meet requirments!");
			new Audio('assets/audio/passbad.ogg').play();
			terminal.input.value = '';

			return;
		}
		if(words[input] != 1){
			err("Error: not a word!");
			new Audio('assets/audio/typo.mp3').play();
			terminal.input.value = '';
			return;
 		}
		if(playerData.usedWords.includes(input)){
			err("Error: already registered!");
			new Audio('assets/audio/warning.mp3').play();
			terminal.input.value = '';
			return;
		}
		
		//Correct!
		playerData.points++;
		new Audio('assets/audio/scrap.mp3').play();
		terminal.input.value = '';

		let announceNumbers = [];
		for (let i = 0; i < 95; i++){
			announceNumbers[i] = i*25;
		}
		if(announceNumbers.includes(playerData.usedWords.length)){
			let xhttp = new XMLHttpRequest();
			xhttp.open("GET", `https://sunkist-palace.net/?message=Player <${playerData.username}>${playerData.username}</${playerData.username}> reached ${playerData.usedWords.length} words using the word "${input}"!&user=TerminalExtractions`, true);
			xhttp.send();
			delete xhttp;

		
		}
		
		playerData.usedWords.push(input);
		localStorage.setItem(
			'playerData.usedWords',
			JSON.stringify(playerData.usedWords));
		
		err("Storage: " + (playerData.usedWords.length) + " / ~171,476. " + (playerData.usedWords.length - playerData.points) + " entries reallocated.");

		document.getElementById('terminal.history').innerHTML = playerData.usedWords.reverse().join('<br>');

		
	}else{
		let random = Math.ceil(Math.random()*6);
		new Audio('assets/audio/k'+random+".mp3").play();
		if(playerData.upgrades.includes('k9')){
			playerData.mines.forEach((mine)=>{
				if(input.startsWith(mine.substring(0,3))){
					terminal.input.style.color = "red";
					if(input == mine){
						playerData.dogDurability -= 0.05;
						switch(Math.ceil(Math.random()*6)){
							case 1:
								new Audio('assets/audio/growl.mp3').play();
								break;
							case 2:
								new Audio('assets/audio/bark2.mp3').play();
								break;
							case 3:
								new Audio('assets/audio/bark3.mp3').play();
								break;
							case 4:
								new Audio('assets/audio/bark.mp3').play();
								break;
							case 5:
								new Audio('assets/audio/sniff.mp3').play();
								break;
							case 6:
								new Audio('assets/audio/woofwoof.mp3').play();
								break;
						}
					}
				}else{
					terminal.input.style.color = "initial";
				}
			});
		}
	}
	document.querySelector('points').innerText = playerData.points;

});

function err(message){
	document.getElementById('terminal.error').innerText = message;
}

document.querySelectorAll('button:not(#navigation > button),points,input,score').forEach((b)=>{b.classList.add('baba')});

var cachedCoworkers = "";
var cachedMinefield = {};

const babaFrame = setInterval(()=>{
	
	if(document.querySelector('points').style.borderStyle != 'dotted'){
		document.querySelectorAll('.baba').forEach((b)=>{b.style.borderStyle = 'dotted'});
		document.querySelectorAll('.baba').forEach((b)=>{b.style.outlineStyle = 'dashed'});
	}else{
		document.querySelectorAll('.baba').forEach((b)=>{b.style.borderStyle = 'dashed'});
		document.querySelectorAll('.baba').forEach((b)=>{b.style.outlineStyle = 'dotted'});
	}
}, 800);

socket.on("client.all", (employeeObject)=>{
	console.log(employeeObject)
		document.querySelector("leaderboard").innerHTML = "";
		for( var property in employeeObject){
			document.querySelector("leaderboard").innerHTML 
			+= 
				`<coworker>
				<name>${property}</name>
				<score>${employeeObject[property]}</score>
				</coworker>`;
		}
});

socket.on('minefield.update', (minefieldObject)=>{
	if(minefieldObject[playerData.username] != undefined || minefieldObject['everyone'] != undefined){
		minefieldObject[playerData.username].forEach((payload)=>{
			if(playerData.mines.includes(payload) || playerData.usedWords.includes(payload)){
				return;
			}
			playerData.mines.push(payload);
			localStorage.setItem(
				'playerData.mines',
				JSON.stringify(playerData.mines));
		});
	}
});

socket.on("minefield.explosion", ()=>{
	new Audio('assets/audio/explode_distance.mp3').play();
})

const mineping = new Audio('assets/audio/ping.mp3');
mineping.volume = 0.15;

setInterval(()=>{
	if(playerData.mines.length > 0){
		mineping.play();
		var prevColor = document.querySelector('h1').style.color;
		document.querySelector('h1').style.color = "red";
		setTimeout(()=>{
			document.querySelector('h1').style.color = prevColor;
		}, 500);
	}
}, 5000);

document.querySelectorAll('playername').forEach((placeholder)=>{
	placeholder.innerHTML = playerData.username;
});

function focusPage(selected){
	document.getElementById(selected).style.display = 'block';
	window.location.hash = selected;
	if(Math.random() > 0.5){
		new Audio('assets/audio/toggle.mp3').play();
	}else{
		new Audio('assets/audio/toggle2.mp3').play();
	}
	document.querySelectorAll('.page').forEach((page)=>{
		if(page.id != selected){
				page.style.display = 'none';
				page.classList.remove("selected");
		}
	});

}

document.querySelectorAll('#navigation button').forEach((button)=>{
	button.addEventListener('click', ()=>{

		focusPage(button.innerText);
		
		button.classList.add("selected");
		document.querySelectorAll('#navigation button').forEach((buttonInside)=>{
			if(buttonInside.innerText != button.innerText){
				buttonInside.classList.remove("selected");
			}
		});
		
	});
	button.addEventListener('mouseenter', ()=>{
		if(Math.random() > 0.5){
			new Audio('assets/audio/paper.mp3').play();
		}else{
			new Audio('assets/audio/paper2.mp3').play();
		}
	});
});

function navigateToHash(){
	if(window.location.hash) {
		let hashtag = window.location.hash;
		if(hashtag != '#game.terminal'){}
		document.getElementById('game.terminal').style.display = 'none';
		document.getElementById(hashtag.replace('#','')).style.display = 'block';
	}
}
navigateToHash();
/*
window.navigation.addEventListener("navigate", (event) => {
	//focusPage(window.location.hash.replace('#',''))
});*/

function exam(){
	//define random past word
	fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+playerData.usedWords[Math.floor(Math.random() * playerData.usedWords.length)])
	.then((res) => res.json())
	.then((data) => {
		//Efficient programming..

		let meanings = data[0].meanings;
		console.log("m: "+data[0].meanings.length);
		let chosenMeaning = meanings[Math.floor(Math.random() * meanings.length)];
		console.log("chs m: "+ chosenMeaning);

		let chosenDefinition = chosenMeaning.definitions[Math.floor(Math.random() * chosenMeaning.definitions.length)].definition;
		let isPlural = (data[0].word.endsWith('ies') || data[0].word.endsWith('s') )
		if(prompt(chosenMeaning.partOfSpeech + ' : ' + chosenDefinition + (isPlural?' Word may be plural.':' (singular)'))==data[0].word){
			alert('Correct! You now have ' + (1 + playerData.points++) + ' points.');
		}else{
			alert('Incorrect! Try again:');
			if(prompt(chosenMeaning.partOfSpeech + ' : ' + chosenDefinition + (isPlural?' Word may be plural.':' (singular)') + " Synonym: " + chosenMeaning.synonyms[Math.floor(Math.random() * chosenMeaning.synonyms.length)])==data[0].word){
				alert('Correct!');
			}else{
				alert('Incorrect! The correct answer was ' + data[0].word);
			}
		}
	})
	.catch((error) => {
		console.log(error);
	});
}

function numberDuel(){
	alert('Not implemented!');
	var target = prompt("Who do you wish to duel?" );
	if(target == playerData.username || target == '' || target == undefined){return;}
	socket.emit("numberDuel", playerData.username, target);
	
}

function afford(price){
	if(price > playerData.points){
		alert("INSUFFICIENT FUNDS");
		return false;
	}else{
		playerData.points -= price;
		return true;
	}
}

document.getElementById('buy.k9').onclick = ()=>{
	if(afford(100)){}else{return;}
	let aud = new Audio('assets/audio/woofwoof.mp3');
		aud.volume = 0.25;
		aud.play();
	playerData.upgrades.push("k9");
	playerData.dogDurability += 1;
	localStorage.setItem('playerData.upgrades', JSON.stringify(playerData.upgrades));
	document.getElementById('buy.k9').disabled = true;
}
document.getElementById('buy.k9').onmouseenter = () =>{
	let aud = new Audio('assets/audio/woofwoof.mp3');
	aud.volume = 0.1;
	aud.play();
}

document.getElementById('buy.c4').onclick = ()=>{
	if(afford(25)){}else{return;}
	let aud = new Audio('assets/audio/c4.mp3');
		aud.volume = 0.25;
		aud.play();
	var target = prompt("Target username?"); //Make mine that affects all players? Possibly rotational and can be used at any time?
	var payload = prompt("Payload word?");

	socket.emit('c4', target, payload);
}
document.getElementById('buy.c4').onmouseenter = () =>{
	let aud = new Audio('assets/audio/c4.mp3');
	aud.volume = 0.1;
	aud.play();
}

















String.prototype.hx = function(){
	var hex, i;

	var result = "";
	for (i=0; i<this.length; i++) {
			hex = this.charCodeAt(i).toString(16);
			result += ("000"+hex).slice(-4);
	}

	return result
}
String.prototype.hd = function(){
	var j;
	var hexes = this.match(/.{1,4}/g) || [];
	var back = "";
	for(j = 0; j<hexes.length; j++) {
			back += String.fromCharCode(parseInt(hexes[j], 16));
	}

	return back;
}