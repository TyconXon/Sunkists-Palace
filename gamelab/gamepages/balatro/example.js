const immediateMode = false
const info = document.getElementById("Info")

const game = {
	inStore : false,
	alive : true,
	round : 0,
	ante : 0,
	level : 0,
	blind : {
		minimum : 300,
		currentScore : 0,
		hands : 4,
		discards : 4,
		payout : 3,
		name : "Initial blind",
		inPlay : false
	},
	player: {
		initialHands : 4,
		initialDiscards : 4,
		handSize : 7,
		money: 4,
		jokers: [],
		addJoker: function(joker){
			//alert("New Joker! " + JSON.stringify(joker))
			if(this.jokers.length < this.jokersMaximum){
				document.getElementById("jokers").innerHTML += `<img class="joker" src='img/Jokers/joker_${joker.id}.png'></img>`
				this.jokers.push(joker)
			}
		},
		jokersMaximum : 5,
	}
}

//Tell the library which element to use for the table
cards.init({table:'#card-table', type:STANDARD, cardback:"blue", RULEBOOK:RULEBOOK, acesHigh:true, immediateMode:immediateMode});

//Create a new deck of cards
deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x += 250;
deck.y += 140;

cards.all.forEach(card => {
	if (Math.random() > 0.85){
		card.enhancement = RULEBOOK.enhancements.bonus
	}
	if (Math.random() > 0.95){
		card.enhancement = RULEBOOK.enhancements.glass
	}
	if (Math.random() > 0.85){
		card.enhancement = RULEBOOK.enhancements.mult
	}
});

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:true, y:245});
lowerhand = new cards.Hand({faceUp:true,  y:340});

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 250;


//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	startBlind()
});

function startBlind(){
	deck.deal(game.player.handSize, [lowerhand], 50, function() {
		game.blind.inPlay = true
		document.getElementById("play").innerText = "Play"
	});
}

function nextBlind(){
	if(game.level == 2){
		game.ante++
		game.level = 0
	}else{
		game.level++
	}
	game.round++
	game.blind = RULEBOOK.buildBlind(game.level, game.ante)
	game.blind.hands = game.player.initialHands
	game.blind.discards = game.player.initialDiscards
	game.blind.currentScore = 0
	game.blind.inPlay = false
}

upperhand.click(function(card){
	lowerhand.addCard(card);
	upperhand.render({immediate:true});
	lowerhand.render({immediate:true});
});


lowerhand.click(function(card){
	if(upperhand.length < 5){
		upperhand.addCard(card);
		upperhand.render({immediate:true});
		lowerhand.render({immediate:true});
	}
});



document.addEventListener("keydown", (ev)=>{
	if (ev.key == "a"){
		$("#play").click()
	}
	if(ev.key == "d"){
		$('#discard').click()
	}
	if(ev.key == "z"){
		alert(detectHandType(upperhand))
	}
	if(ev.key == "Enter"){
		// if(game.blind.name == "Initial blind" && document.getElementById("deal").hidden == false){
		// 	$("#deal").click()
		// }else{
			$("#play").click()
		// }
	}
	if(ev.key == "Backspace"){
		deselectCardByPlacement(0)
	}

	if(ev.key == parseInt(ev.key)){
		if (!ev.ctrlKey){
			selectCardByPlacement(parseInt(ev.key)-1)
		}else{
			ev.preventDefault()
			deselectCardByPlacement(parseInt(ev.key)-1)
		}
	}
})



function selectCardByPlacement(id){
	if(upperhand.length < 5){
		upperhand.addCard(lowerhand[id]);
		upperhand.render({immediate:true});
		lowerhand.render({immediate:true});
	}
}

function deselectCardByPlacement(id){
	lowerhand.addCard(upperhand[id]);
	upperhand.render({immediate:true});
	lowerhand.render({immediate:true});
}


$('#play').click(function(){
	if(game.blind.inPlay){
		Playhand()
	}else{
		startBlind()
	}
})
$('#discard').click(function(){
	if(game.blind.discards <= 0){
		alert("You don't have any discards left!")
		return
	}
	discardSelected()
	game.blind.discards--
	
})


function Playhand(){
	if(upperhand.length == 0){
		return
	}
	let handType = detectPokerHand(upperhand)
	game.blind.currentScore += calculateScore(handType)
	discardSelected()
	game.blind.hands--

	if(game.blind.currentScore >= game.blind.minimum){ 
		winBlind()
	}
}

function winBlind(){
	deck.addCards(cards.all)
	deck.render()
	game.player.money+=game.blind.payout
	nextBlind()
	document.getElementById("play").innerText = "Next"
}

function discardSelected(){
	if(game.blind.currentScore < game.blind.minimum){
		deck.deal(upperhand.length, [lowerhand], 50)
	}
	discardPile.addCards(upperhand)
	discardPile.render();
	upperhand.render()
	lowerhand.render()
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

function getPreplayScoreOfCards(scoringCards, chips){
	scoringCards.forEach(card => {
		if(doesntViolateBlind(card)){
			if(card.rank == 1){
				chips += 13
			}
			if(card.enhancement == RULEBOOK.enhancements.bonus){
				chips += 50
			}
			chips += card.rank 
		}
	});
	return chips
}


function getPreplayMultOfCards(scoringCards, base){
	var mult = base
	scoringCards.forEach(card => {
		if(doesntViolateBlind(card)){
			if(card.enhancement == RULEBOOK.enhancements.mult){
				mult += 5
			}
			if(card.enhancement == RULEBOOK.enhancements.glass){
				mult *= 2
			}
		}
	});

	return mult
}

function calculateMultiplier(handType, mult, chips){
	let givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
	game.player.jokers.forEach(joker => {
		joker.hooks.forEach(jHooks => {
			if(jHooks.in == "afterCardsScoreHook"){
				var jokerHookOutput = joker.afterCardsScoreHook(givenInformation)
				if(jHooks.out.includes("currentMultiplier")){
					mult = jokerHookOutput.currentMultiplier
				}
			}
		});
	});
	return mult
}
function calculateChips(handType, mult, chips){
	let givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
	game.player.jokers.forEach(joker => {
		joker.hooks.forEach(jHooks => {
			if(jHooks.in == "afterCardsScoreHook"){
				var jokerHookOutput = joker.afterCardsScoreHook(givenInformation)
				if(jHooks.out.includes("currentChips")){
					chips = jokerHookOutput.currentChips
				}
			}
		});
	});
	return chips
}

function calculateScore(handType){
	var chips = getPreplayScoreOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].chips)
	var mult = getPreplayMultOfCards(handType.scoringCards,RULEBOOK.basePokerHands[handType.hand].mult)
	return calculateChips(handType, mult, chips) * calculateMultiplier(handType, mult, chips)
}

setInterval(() => {
	updateInfo()
}, 50);

function updateInfo(){
	if(!game.alive){
		info.innerHTML = "You failed!"
		return
	}

	if(game.blind.discards <= 0){
		document.getElementById("discard").disabled = true
	}else{
		document.getElementById("discard").disabled = false
	}


	let handType = detectPokerHand(upperhand)
	info.innerHTML = `{${game.player.money}$ | ${game.ante}A | ${game.round}R} (<b>${game.blind.hands}</b> H | <b>${game.blind.discards}</b> D) ${game.blind.name} : [${game.blind.currentScore} / ${game.blind.minimum}] | `
	if(upperhand.length == 0){
		return
	}
	var chips = getPreplayScoreOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].chips)
	var mult = getPreplayMultOfCards(handType.scoringCards,RULEBOOK.basePokerHands[handType.hand].mult)

	info.innerHTML += `${handType.hand} : <chips>${calculateChips(handType, mult, chips)}</chips> x <mult> ${calculateMultiplier(handType,mult,chips)} </mult>`
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
    } else if (rankCounts.length > 1 &&rankCounts[0][1] === 3 && rankCounts[1][1] === 2) {
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

window.addEventListener("load", ()=>{
	// game.player.addJoker(RULEBOOK.jokers.gluttonousJoker)
	game.player.addJoker(RULEBOOK.jokers.halfJoker)
	// game.player.addJoker(RULEBOOK.jokers.joker)

	setTimeout(() => {
		document.getElementById("deal").click()
	}, 50);
});