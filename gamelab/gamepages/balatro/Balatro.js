// Enable or disable immediate mode for rendering
const immediateMode = false;
const info = document.getElementById("Info");
const storeTopShelf = document.getElementById("upper-shelf");
var showFullyCalculatedHand = false;
var countingScore = false;

var pixelSize = 750.0;
var backgroundColors = [
	[0.871, 0.267, 0.231],
	[0.0, 0.42, 0.706],
	[0.086, 0.137, 0.145],
]

// Game state and configuration
const game = {
	inShop: false,
	alive: true,
	round: 0,
	ante: 0,
	level: 0,
	blind: {
		minimum: 300,
		currentScore: 0,
		hands: 4,
		discards: 4,
		payout: 3,
		name: "Initial blind",
		inPlay: false
	},
	player: {
		initialHands: 4,
		initialDiscards: 4,
		handSize: 8,
		money: 3,
		topShelfMax : 2,
		jokers: [],
		timesPokerHandPlayed: {
			"Full House" : 0
		},
		jokersMaximum: 5,
		addJoker: function (joker) {
			if (this.jokers.length < this.jokersMaximum) {
				// Create the new joker span element
				const jokerEl = document.createElement('span');
				jokerEl.classList.add('joker', 'in-play');
				jokerEl.id = joker.id + Date.now();
				joker.elementId = jokerEl.id
				jokerEl.title = joker.name;
		
				// Create the img element for the joker image
				const jokerImg = document.createElement('img');
				jokerImg.src = `img/Jokers/joker_${joker.id}.png`;
				jokerEl.appendChild(jokerImg);
		
				// Create the tooltip span
				const tooltipText = document.createElement('span');
				tooltipText.classList.add('tooltiptext');
				tooltipText.innerHTML = `${joker.description} <br> [Selling for $${Math.ceil(joker.price / 2)}]`;
				jokerEl.appendChild(tooltipText);
		
				// Attach the click event listener
				jokerEl.addEventListener('click', () => {
					jokerClick(`${joker.elementId}`, joker);
				});
		
				// Append the new joker element to the container
				document.getElementById('jokers').appendChild(jokerEl);
		
				// Add the joker to the player's collection
				this.jokers.push(joker);
			}
		}
	}
};

// Initialize card library
cards.init({ table: '#card-table', type: STANDARD, cardback: "blue", RULEBOOK: RULEBOOK, acesHigh: true, immediateMode: immediateMode });

// Create deck and adjust position
const deck = new cards.Deck();
deck.x += 260;
// deck.y += 140;

// Apply enhancements to cards
cards.all.forEach(card => {
	
	// let randomChoice = Math.floor(Math.random() * 9)
	// switch (randomChoice) {
	// 	case 1:
	// 		card.enhancement = RULEBOOK.enhancements.none;
	// 		break;
	// 	case 2:
	// 		card.enhancement = RULEBOOK.enhancements.bonus;
	// 		break;
	// 	case 3:
	// 		card.enhancement = RULEBOOK.enhancements.mult;
	// 		break;
	// 	case 5:
	// 		card.enhancement = RULEBOOK.enhancements.glass;
	// 		break;
	// 	case 6:
	// 		card.enhancement = RULEBOOK.enhancements.steel;
	// 		break;
	// 	case 8:
	// 		card.enhancement = RULEBOOK.enhancements.gold;
	// 		break;	
	// 	case 9:
	// 		card.enhancement = RULEBOOK.enhancements.lucky;
	// 		break;
	// }
});

deck.addCards(cards.all);
deck.render({ immediate: true });

// Create player hands and discard pile
const upperhand = new cards.Hand({ faceUp: true, y: 0 });
const lowerhand = new cards.Hand({ faceUp: true, y: 250 });
const discardPile = new cards.Deck({ faceUp: true });
discardPile.x += 360;

// Deal button event listener
$('#deal').click(() => {
	$('#deal').hide();
	startBlind();

	let jokerKeys = Object.keys(RULEBOOK.jokers)
	document.querySelector("footer").innerText += `  | AutoUpdate info: [${jokerKeys.length}/150 jokers]`

});

// Start a blind
function startBlind() {
	
	cards.shuffle(deck)
	showBlind()
	game.inShop = false;
	
	deck.deal(game.player.handSize, [lowerhand], 100, () => {
		game.blind.inPlay = true;
		document.getElementById("play").innerText = "Play";
		setupShop();
		sortHand();
		if(game.blind.description){
			alert(game.blind.description);
		}
	},game.blind);
}

function showBlind(){
	document.getElementById('card-table').hidden = false;
	document.getElementById('store-box').hidden = true;
	$('#discard').show();
}
function showShop(){
	document.getElementById('card-table').hidden = true;
	document.getElementById('store-box').hidden = false;
	$('#discard').hide();
}

function jokerClick(id,joker){
	try{
		// alert(id)
	let jokerEl = document.getElementById(id);
	if(confirm(`Are you sure you wish to sell ${joker.name} for $${Math.ceil(joker.price / 2)}?`)){
		game.player.jokers.splice(game.player.jokers.at(joker));
		jokerEl.outerHTML = '';
		game.player.money += Math.ceil(joker.price / 2)
	}
	}catch(err){
		alert(err)
	}
}

// Move to next blind
function nextBlind() {
	game.level = (game.level === 2) ? 0 : game.level + 1;
	if (game.level === 0) game.ante++;
	game.round++;
	game.blind = RULEBOOK.buildBlind(game.level, game.ante);
	Object.assign(game.blind, {
		hands: game.player.initialHands,
		discards: game.player.initialDiscards,
		currentScore: 0,
		inPlay: false
	});
	backgroundColors = game.blind.colors;
	game.inShop = true;
	setupShop();
}
function setupShop(){
	//Empty shop
	storeTopShelf.innerHTML = "";
	
	for (let index = 0; index < game.player.topShelfMax; index++) {
		let jokerKeys = Object.keys(RULEBOOK.jokers)
		let randomChoice = jokerKeys[Math.ceil( Math.random() * (jokerKeys.length-1) )]
		let uid = Math.floor( Math.random() * 10000 )
		storeTopShelf.innerHTML += `<button class="joker in-shop" title="${RULEBOOK.jokers[randomChoice].name}" onclick="buy('${randomChoice}','store${uid}')" id="store${uid}"><span class="price">$${RULEBOOK.jokers[randomChoice].price}</span><img src='img/Jokers/joker_${RULEBOOK.jokers[randomChoice].id}.png'><span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span></button>`
	}

	for (let index = 0; index < 3; index++) {

		let planetKeys = Object.keys(RULEBOOK.basePokerHands);
		let rng = Math.ceil( Math.random() * (planetKeys.length-1) );
		let randomChoice = planetKeys[rng];
		let uid = Math.floor( Math.random() * 10000 );
		let descriptionText = `Upgrade ${randomChoice} to level ${RULEBOOK.basePokerHands[randomChoice].level + 1}:</br> <chips> + ${RULEBOOK.basePokerHands[randomChoice].upgrade[0]} </chips> x <mult> + ${RULEBOOK.basePokerHands[randomChoice].upgrade[1]} </mult>`
		storeTopShelf.innerHTML += `<button class="joker in-shop" title="${randomChoice}" onclick="buy('${randomChoice}','store${uid}')" id="store${uid}"><span class="price">$${RULEBOOK.basePokerHands[randomChoice].level+3}</span><img src='img/Usables/usable_${RULEBOOK.basePokerHands[randomChoice].id}.png'><span class="tooltiptext">${descriptionText}</span></button>`
	}
	storeTopShelf.innerHTML += `<button class="joker in-shop" title="Incantation" onclick="buy('Incantation','store_inc')" id="store_inc"><span class="price">$7</span><img src='img/Usables/usable_42.png'><span class="tooltiptext">Add 10 random enhanced cards to your deck.</span></button>`

}

function buy(key, uid){
	let planetKeys = Object.keys(RULEBOOK.basePokerHands)
	let jokerKeys = Object.keys(RULEBOOK.jokers)
	//alert(key)

	if(planetKeys.includes(key)){
		buy_planet(key, uid)
	}else if(jokerKeys.includes(key)){
		buy_joker(key,uid)
	}else if(key == "Incantation"){
		if ( game.player.money < 7){
			alert("Not enough money!");
			return;
		}
		new Audio('snd/coin1.ogg').play();
		game.player.money -= 7;
		document.getElementById("store_inc").innerHTML = "SOLD OUT!";
		_TEMP_incantation();
	}
}

function _TEMP_incantation(){
	try{
		for (let index = 0; index < 10; index++) {
			let randomSuit = Math.floor(Math.random() * 4);
			let chosenSuit = "none";
			switch (randomSuit) {
				case 0:
					chosenSuit = 'h'
					break;
				case 1:
					chosenSuit = 's'
					break;
				case 2:
					chosenSuit = 'd'
					break;
				case 3:
					chosenSuit = 'c'
			}

			let card = new cards.Card(chosenSuit, Math.ceil(Math.random() * 13), '#card-table');
			let randomChoice = Math.floor(Math.random() * 9)
			switch (randomChoice) {
				case 1:
					card.enhancement = RULEBOOK.enhancements.none;
					break;
				case 2:
					card.enhancement = RULEBOOK.enhancements.bonus;
					break;
				case 3:
					card.enhancement = RULEBOOK.enhancements.mult;
					break;
				case 4:
				case 5:
					card.enhancement = RULEBOOK.enhancements.glass;
					break;
				case 6:
				case 7:
					card.enhancement = RULEBOOK.enhancements.steel;
					break;
				case 8:
					card.enhancement = RULEBOOK.enhancements.gold;
					break;	
				case 9:
					card.enhancement = RULEBOOK.enhancements.lucky;
					break;
			}
			cards.all.push(card);
			card.el.click((ev)=>{
				document.querySelector("h1").innerText = `${card}`
			
				if (card.container) {
				  var handler = card.container._click;
				  if (handler) {
					handler.func.call(handler.context || window, card, ev);
				  }
				}
			  });
			// alert(cards.mouseEvent)
			deck.addCard(card);
			cards.shuffle(deck);
			deck.render({immediate:true});

		}
	}catch(error){
		alert(error)
	}
}

function buy_planet(planetKey, uid){
	if ( game.player.money < RULEBOOK.basePokerHands[planetKey].level + 3){
		alert("Not enough money!");
		return;
	}
	new Audio('snd/coin1.ogg').play();

	game.player.money -= RULEBOOK.basePokerHands[planetKey].level + 3;
	upgradePokerHand(planetKey, 1)
	document.getElementById(uid).innerHTML = "SOLD OUT!";
	document.getElementById(uid).disabled = true;
}


function buy_joker(jokerKey, uid){
	if ( game.player.money < RULEBOOK.jokers[jokerKey].price ){
		alert("Not enough money!");
		return;
	}
	if( game.player.jokersMaximum < game.player.jokers.length + 1 ){
		alert("No more joker slots left!");
		return;
	}
	new Audio('snd/coin1.ogg').play();

	game.player.money -= RULEBOOK.jokers[jokerKey].price;
	game.player.addJoker(RULEBOOK.jokers[jokerKey]);
	document.getElementById(uid).innerHTML = "SOLD OUT!";
	document.getElementById(uid).disabled = true;
}

function upgradePokerHand(hand, times = 1){
	saidHand = RULEBOOK.basePokerHands[hand];
	saidHand.level += times;
	saidHand.chips += (times * saidHand.upgrade[0]);
	saidHand.mult += (times * saidHand.upgrade[1]);
	alert(`Upgraded ${hand}!`)
}


// Handle card movement between hands
upperhand.click(card => transferCard(card, upperhand, lowerhand));
lowerhand.click(card => {
	if (upperhand.length < 5) transferCard(card, lowerhand, upperhand);
});

function transferCard(card, fromHand, toHand) {
	if(countingScore){return;}
	toHand.addCard(card);
	fromHand.render({ immediate: true });
	toHand.render({ immediate: true });
	if(fromHand == lowerhand){
		new Audio('snd/cardSlide1.ogg').play();
	}else{
		new Audio('snd/cardSlide2.ogg').play();
	}
}

// Keybindings for gameplay actions
document.addEventListener("keydown", ev => {
	const keyActions = {
		'a': () => $("#play").click(),
		'd': () => $('#discard').click(),
		'z': () => alert(detectPokerHand(upperhand)),
		'Enter': () => $("#play").click(),
		'Backspace': () => deselectCardByPlacement(0),
		'k' : sortHand,
	};
	if (keyActions[ev.key]) keyActions[ev.key]();
	if (ev.ctrlKey) ev.preventDefault();
	if (!isNaN(ev.key)) ev.ctrlKey ? deselectCardByPlacement(ev.key - 1) : selectCardByPlacement(ev.key - 1);
});

// Card selection/deselection functions
function selectCardByPlacement(id) {
	if (upperhand.length < 5) transferCard(lowerhand[id], lowerhand, upperhand);
}

function deselectCardByPlacement(id) {
	transferCard(upperhand[id], upperhand, lowerhand);
}

function sortHand () {
	lowerhand.sort((a, b) => b.rank - a.rank); lowerhand.render()
}

// Button click events
$('#play').click(() => {if(!countingScore){game.blind.inPlay ? Playhand() : startBlind()}});
$('#discard').click(() => {
	if (game.blind.discards <= 0) return alert("You don't have any discards left!");
	discardSelected();
	game.blind.discards--;
});

$("#deck-count").click(()=>{
	alert(cards.all.toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll('H','♥').replaceAll('C','♣').replaceAll('D','♦').replaceAll('S','♠'));
});
deck.click(()=>{
	alert(deck.toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll('H','♥').replaceAll('C','♣').replaceAll('D','♦').replaceAll('S','♠'));
});

// Gameplay mechanics
async function Playhand() {
	if (upperhand.length === 0) return;

	let handType = detectPokerHand(upperhand);
	game.blind.currentScore += await calculateScore(handType, true);
	// upgradePokerHand(handType.hand)

	if( isNaN(game.player.timesPokerHandPlayed[handType.hand]) ){
		game.player.timesPokerHandPlayed[handType.hand]  = 1;
	}else{
		game.player.timesPokerHandPlayed[handType.hand] += 1;
	}

	discardSelected();
	game.blind.hands--;

	if(game.blind.hooks){
		if(game.blind.hooks.includes('afterPlayHook')){
			game.blind.afterPlayHook();
		}
	}
	if (game.blind.currentScore >= game.blind.minimum){
		winBlind();
	}else if(game.blind.hands == 0){
		game.alive = false;
		info.innerHTML  = `<h1>You failed!</h1> No hands left. Score: ${game.blind.currentScore} / ${game.blind.minimum} <br> <button href="javascript();" onclick="location.reload()">Play again?</button>`
		document.getElementById('game-box').hidden = true
	}
}

function winBlind() {
	let newMoney = game.blind.payout
	lowerhand.forEach(card => {
		if (card.enhancement == RULEBOOK.enhancements.gold){
			game.player.money += 3;
		}
	});
	newMoney += game.blind.discards;
	game.player.money += newMoney;
	//alert(`${game.blind.name} won! ${newMoney} dollars awarded. Finishing score: ${game.blind.currentScore} / ${game.blind.minimum}`)
	$('#popoverButton').click();
	$('#controls').hide();
	$('#popoverText').html(`${game.blind.name} won! <br> <money>${newMoney} dollars awarded.</money>`);
	deck.addCards(cards.all);
	deck.render();
	document.getElementById("play").innerText = "Next";
}

$('#closingPop').click(()=>{
	new Audio('snd/coin1.ogg').play();
	nextBlind();
	showShop();
	$('#controls').show();
});

function discardSelected() {
	if (game.blind.currentScore < game.blind.minimum) {
		deck.deal(upperhand.length, [lowerhand], 50, ()=>{/*sortHand();*/}, game.blind);
	}
	discardPile.addCards(upperhand);
	discardPile.render();
	upperhand.render();
	lowerhand.render();
}

function pokerHandsInfo(){

}

// Game information updater
setInterval(updateInfo, 50);
function updateInfo() {
	if (!game.alive) return pixelSize = 125.0;
	$('#discard').prop("disabled", (game.blind.discards <= 0 || !game.blind.inPlay));

	document.getElementById('deck-count').innerText = `${deck.length} / ${cards.all.length}`

	let handType = detectPokerHand(upperhand);

	document.querySelector('#blindName').innerText = game.blind.name
	document.querySelector('#blindDescription').innerHTML = `Score at least: <b>${game.blind.minimum}</b>`
	document.querySelector('#roundScore').innerText = game.blind.currentScore
	document.querySelector('#infoHands').innerText = game.blind.hands
	document.querySelector('#infoDiscards').innerText = game.blind.discards
	document.querySelector('#infoRound').innerText = game.round
	document.querySelector('#infoAnte').innerText = game.ante
	document.querySelector('#infoMoney').innerText = game.player.money
	document.querySelector('#shopText').innerHTML = `Shop ( $${game.player.money} )`;


	if(game.inShop){
		pixelSize = 325.0;
	}else{
		pixelSize = 750.0;
	}
	
	// info.innerHTML = `{ <money>$${game.player.money}</money> | Ante ${game.ante} | Round ${game.round} } </br> ( <hands>${game.blind.hands} Hands</hands> | <discards>${game.blind.discards} Discards</discards> ) </br> ${game.blind.name} : [${game.blind.currentScore} / <b>${game.blind.minimum}</b>] </br> `;
	if(!countingScore){
	if (upperhand.length > 0){
		let chips = getPreplayScoreOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].chips);
		let mult = getPreplayMultOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].mult);

		document.getElementById('playingHandName').innerHTML = handType.hand
		document.getElementById('playingHandLevel').innerHTML = `lvl. ${RULEBOOK.basePokerHands[handType.hand].level}`
		if (showFullyCalculatedHand){
			// document.getElementById('playingHandChips').innerHTML = calculateChips(handType, mult, chips)
			// document.getElementById('playingHandMult').innerHTML = calculateMultiplier(handType, mult, chips)	
		}else{
			document.getElementById('playingHandChips').innerHTML = RULEBOOK.basePokerHands[handType.hand].chips
			document.getElementById('playingHandMult').innerHTML = RULEBOOK.basePokerHands[handType.hand].mult
		}
		

		// info.innerHTML += `${handType.hand} (lvl. ${RULEBOOK.basePokerHands[handType.hand].level}): <chips>${calculateChips(handType, mult, chips)}</chips> x <mult>${calculateMultiplier(handType, mult, chips)}</mult>`;
	}else{
		document.getElementById('playingHandName').innerHTML = '‎'
		document.getElementById('playingHandLevel').innerHTML = '‎'
		document.getElementById('playingHandChips').innerHTML = 0
		document.getElementById('playingHandMult').innerHTML = 0
	}
	}
}

const satisfyingElement = document.getElementById('satisfaction');
async function satisfactionTextUpdate(text,element,color){
try {
		satisfyingElement.innerText = text;
		satisfyingElement.style.backgroundColor = color;
		let toLeft = getOffset(element).left + (Number(element.style.width.slice(0,-2)) /4)
		let toRight = getOffset(element).top + (Number(element.style.height.slice(0,-2)) /4)
		$(satisfyingElement).animate({left: toLeft+"px", top: toRight+"px"}, 0);
		satisfyingElement.style.opacity = 0.5;
		satisfyingElement.style.scale = 0.5;
		$(satisfyingElement).animate({opacity: 1, scale: 1}, 200);
} catch (error) {
	alert(error)
}

}

function doesntViolateBlind(card){
	if(game.blind.cardCheckHook){
		if(game.blind.cardCheckHook(card)){
			return true
		}else{
			return false
		}
	}else{
		return true
	}
}

async function getPreplayScoreOfCards(scoringCards, chips, animated = false){
	
	for (let card of scoringCards){
		let beforeChips = chips;
		if(doesntViolateBlind(card)){
			if(card.rank == 1){
				chips += 13
			}
			if(card.enhancement == RULEBOOK.enhancements.bonus){
				chips += 50
			}
			chips += card.rank;
			chips += card.chipBonus;


			if (animated) {
				satisfactionTextUpdate(`+ ${chips - beforeChips}`, card.el[0], "blue");
				let playingHandChips = document.getElementById('playingHandChips');
				playingHandChips.innerText = chips;
				new Audio('snd/chips1.ogg').play();
				await delay(550);
			}
		}
	}
	return chips
}


async function getPreplayMultOfCards(scoringCards, base, animated = false){
	var mult = base

	for (let card of scoringCards){
		let beforeMult = mult;
		if(doesntViolateBlind(card)){
			if(card.enhancement == RULEBOOK.enhancements.mult){
				mult += 5
			}
			if(card.enhancement == RULEBOOK.enhancements.glass){
				mult *= 2
			}
			if (animated && (mult != beforeMult )) {
				satisfactionTextUpdate(`+ ${mult - beforeMult}`, card.el[0], 'red');
				let playingHandText = document.getElementById('playingHandMult');
				playingHandText.innerText = mult;
				new Audio("snd/multhit1.ogg").play();
				await delay(550);
			}
		}
	}
	for (let card of lowerhand){
		if(doesntViolateBlind(card)){
			if(card.enhancement == RULEBOOK.enhancements.steel){
				mult *= 1.5;
				if (animated) {
					satisfactionTextUpdate(`* 1.5`, card.el[0], 'red');
					let playingHandText = document.getElementById('playingHandMult');
					playingHandText.innerText = mult;
					await delay(550);
				}
			}
		}
	}

	return mult
}

function executeLateJokers(handType, mult, chips){
	var givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
	game.player.jokers.forEach(joker => {
		joker.hooks.forEach(jHooks => {
			if(jHooks.in == "afterCardsScoreHook"){
				var jokerHookOutput = joker.afterCardsScoreHook(givenInformation)
				if(jHooks.out.includes("currentMultiplier")){
					mult = jokerHookOutput.currentMultiplier
					givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
				}
			}
		});
	});
	return 
}


async function calculateMultiplier(handType, mult, chips, animated = false){
	var givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
	for(joker of game.player.jokers){
		for(jHooks of joker.hooks){
			if(jHooks.in == "afterCardsScoreHook"){
				var jokerHookOutput = joker.afterCardsScoreHook(givenInformation)
				if(jHooks.out.includes("currentMultiplier")){
					if (animated && mult != jokerHookOutput.currentMultiplier) {
						satisfactionTextUpdate(`+ ${jokerHookOutput.currentMultiplier - mult}`, document.getElementById(joker.elementId), 'red');
						let playingHandText = document.getElementById('playingHandMult');
						playingHandText.innerText = jokerHookOutput.currentMultiplier;
						new Audio("snd/multhit1.ogg").play();
						await delay(550);
					}
					mult = jokerHookOutput.currentMultiplier
					givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
				}
			}
		}
	}
	return mult
}

async function calculateChips(handType, mult, chips, animated = false){
	// alert('a')
	let givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
	for(joker of game.player.jokers){
		for(jHooks of joker.hooks){
			if(jHooks.in == "afterCardsScoreHook"){
				var jokerHookOutput = joker.afterCardsScoreHook(givenInformation)
				if(jHooks.out.includes("currentChips")){
					if (animated) {
						satisfactionTextUpdate(`+ ${jokerHookOutput.currentChips - chips}`, document.getElementById(joker.elementId), 'blue');
						let playingHandText = document.getElementById('playingHandChips');
						playingHandText.innerText = jokerHookOutput.currentChips;
						await delay(550);
					}
					chips = jokerHookOutput.currentChips
					givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
				}
			}
		}
	}
	return chips;
}

satisfyingElement.style.display = 'none';

async function calculateScore(handType, animated = false){
	try {

		for (let zjoker of game.player.jokers) {
			if (zjoker.beforeScoreHook){

				zjoker.beforeScoreHook({handType:handType});
				document.getElementById('playingHandChips').innerHTML = RULEBOOK.basePokerHands[handType.hand].chips
				document.getElementById('playingHandMult').innerHTML = RULEBOOK.basePokerHands[handType.hand].mult
				document.getElementById('playingHandLevel').innerHTML = `lvl. ${RULEBOOK.basePokerHands[handType.hand].level}`
			}
		}

		//Lock constant info update and player interactions
		countingScore = true;
		
		//Show which cards score
		for (let card of handType.scoringCards) {
			card.el[0].classList.add('scoringCard');
			new Audio('snd/card1.ogg').play();
			await delay(250);
		}
		await delay(250);

		for (let zjoker of game.player.jokers) {
			if (zjoker.beforeScoreHook){zjoker.beforeScoreHook({handType:handType})}
		}

		satisfyingElement.style.display = 'inline-block';
	
		//Calculate
		var chips = await getPreplayScoreOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].chips, animated)
		var mult = await getPreplayMultOfCards(handType.scoringCards,RULEBOOK.basePokerHands[handType.hand].mult, animated)
		
		let finalChips = await calculateChips(handType, mult, chips, animated);
		let finalMult = await calculateMultiplier(handType, mult, chips, animated);

		//Finished - unlock update and controls, reset played card animations.
		countingScore = false;
		satisfyingElement.style.display = 'none';
		for (let card of handType.scoringCards) {
			card.el[0].classList.remove('scoringCard');
		}


		return finalChips * finalMult;
	} catch (error) {
		alert(error)
	}
}

function detectPokerHand(cards) {
    if (cards.length == 0) return { hand: "Invalid hand", scoringCards: [] };
    
    let ranks = {}, suits = {};
    let rankValues = [];
    let rankMap = {};
    
    // Parse cards
    for (let card of cards) {
        let suit = card.name[0];
        let rank = parseInt(card.name.slice(1));
        
        ranks[rank] = (ranks[rank] || 0) + 1;
        suits[suit] = (suits[suit] || 0) + 1;
        rankValues.push(rank);
        rankMap[card] = rank;
    }
    
    rankValues.sort((a, b) => a - b);
    let uniqueRanks = Object.keys(ranks).length;
    let isFlush = cards.length === 5 && Object.keys(suits).length === 1;
    let isStraight = uniqueRanks === 5 && (rankValues[4] - rankValues[0] === 4 || rankValues.join() === "2,3,4,5,14");
    
    // Identify hands
    let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    let hand = "High Card";
    let scoringRanks = new Set();
    
    if (isFlush && isStraight && rankValues.includes(14)) {
        hand = "Royal Flush";
        scoringRanks = new Set(rankValues);
    } else if (isFlush && isStraight) {
        hand = "Straight Flush";
        scoringRanks = new Set(rankValues);
    } else if (rankCounts[0][1] === 4) {
        hand = "Four of a Kind";
        scoringRanks.add(parseInt(rankCounts[0][0]));
    } else if (rankCounts.length > 1 && rankCounts[0][1] === 3 && rankCounts[1][1] === 2) {
        hand = "Full House";
        scoringRanks.add(parseInt(rankCounts[0][0]));
        scoringRanks.add(parseInt(rankCounts[1][0]));
    } else if (isFlush) {
        hand = "Flush";
        scoringRanks = new Set(rankValues);
    } else if (isStraight) {
        hand = "Straight";
        scoringRanks = new Set(rankValues);
    } else if (rankCounts[0][1] === 3) {
        hand = "Three of a Kind";
        scoringRanks.add(parseInt(rankCounts[0][0]));
    } else if (rankCounts.length > 1 && rankCounts[0][1] === 2 && rankCounts[1][1] === 2) {
        hand = "Two Pair";
        scoringRanks.add(parseInt(rankCounts[0][0]));
        scoringRanks.add(parseInt(rankCounts[1][0]));
    } else if (rankCounts[0][1] === 2) {
        hand = "One Pair";
        scoringRanks.add(parseInt(rankCounts[0][0]));
    }else{
		scoringRanks.add(parseInt(rankValues[0]))
	}
    
    let scoringCards = cards.filter(card => scoringRanks.has(rankMap[card]));
    
    return { hand, scoringCards };
}

function getOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
	  left: rect.left + window.scrollX,
	  top: rect.top + window.scrollY
	};
}

const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
};
  
// const sample = async () => {
// 	alert('a');
// 	console.log('waiting...')
// 	let delayres = await delay(3000);
// 	alert('b');
// };
//   sample();

// Auto-start game
window.addEventListener("load", () => {
	// game.player.addJoker(RULEBOOK.jokers.lustyJoker);
	// game.player.addJoker(RULEBOOK.jokers.gluttonousJoker);
	// game.player.addJoker(RULEBOOK.jokers.greedyJoker);

	setTimeout(() => $('#deal').click(), 50);
});


