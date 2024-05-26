//Maxwell did NOT make this.


const TV = document.getElementById('screen');//Word
const DISPLAY_TIME = document.getElementById('time');//Points
const DISPLAY_POINTS = document.getElementById('cpoints');//Points

const AudioClip = {
	bestChannelPass: new Audio("AudioClip/Best_Channel_Pass.wav"),
	cableFix: new Audio("AudioClip/Cable_Fix.wav"),
	connectingToTV: new Audio("AudioClip/Connecting to TV.wav"),
	cpGain: new Audio("AudioClip/CP_Gain.wav"),
	introStatic: new Audio("AudioClip/Intro_Static.wav"),
	staticFail: new Audio("AudioClip/Static_Fail.wav"),
	staticSwitchChannel: new Audio("AudioClip/Static_Switch_Channel.wav"),
	trackingIncreasePoint: new Audio("AudioClip/Tracking_Increase_Point.wav"),
	trackingIncreaseStatic: new Audio("AudioClip/Tracking_Increase_Static.wav"),
	tvControlSwitch: new Audio("AudioClip/TV_Control_Switch3.wav"),
	tvOff: new Audio("AudioClip/TV_Off.wav"),
	error1: new Audio("AudioClip/Error1.wav"),
	error2: new Audio("AudioClip/Error2.wav"),
	error3: new Audio("AudioClip/Error3.wav"),
	camShopSwitch: new Audio("AudioClip/Cam_Shop_Switch.wav"),
	comboEnd: new Audio("AudioClip/Combo_end.wav"),
};
AudioClip.trackingIncreasePoint.volume = 0.35;
AudioClip.introStatic.volume = 0.3;
AudioClip.introStatic.play();


//Settings
var color = ["red", "blue", "green", "cyan", "yellow", "purple"];//6 Colors
var addTime = 0.35;
var timeSinceLastAnswer = 15;
var noMechanicsChance = 3;
var currentSherlockStep = 0;
var sherlockMin = 0.85;
var sherlockMax = 0.65;
var sherlockStepMin = 3;
var sherlockStepMax = 20;
var sherlockSymbol = "+";
switch (Math.ceil(Math.random() * 10)) {
	case 1:
		sherlockSymbol = "|";
		break;
	case 2:
		sherlockSymbol = "X";
		break;
	case 3:
		sherlockSymbol = "$";
		break;
	case 4:
		sherlockSymbol = "*";
		break;
	case 5:
		sherlockSymbol = "@";
		break;
	case 6:
		sherlockSymbol = "#";
		break;
}

//Defaults
var POINTS = -1;
var timemax = timeSinceLastAnswer;
let failure = 0;
let correct = false;
let started = false;
var invertedControls = false;
var dim = 100;
var previousTime = 0;
var previousStart = timeSinceLastAnswer;
var currentMechanic = null;
var blurramount = 10;
var newSettings = false;
var antijack = false;
var connectionStrength = 0;


const updater = setInterval(update, 50);

function skipStart(){
	document.querySelector("#gameTitle").style.animationDelay = "-2s";
	document.querySelector("#fadein").style.animationDelay = "-1.5s";
	document.querySelector("#gameTitle").style.pointerEvents = 'auto';
}

/** STORAGE STUFF********************************************************************************************************* */

var savedData = {
	scoring: {
		modifiers: {
			inverted: null,
			scrambled: null,
			flipped: null,
			backwards: null,
			waited: null,
			batteried: null,
			colored: null,
			blurred: null,
		},

		combinations: {

		},
		timer: {
			best: null,
			previous: null
		},
		word: {

		},
		color: {

		},
		score: {
			best: null,
			previous: null
		}
	},
	settings: {

	}
};

//Initiate storage
if (localStorage.getItem("Vault") == null) {
	saveStorage();
}
savedData = getStorage();

function getStorage() {
	return JSON.parse(localStorage.getItem("Vault"));
}
function saveStorage() {
	localStorage.setItem("Vault", JSON.stringify(savedData));
}
var storageLibrarian = {
	scoring: {
		modifiers: {
			get: function(mechanic) {
				return savedData.scoring.modifiers[mechanic];
			},
			set: function(activeMechanic) {
				savedData.scoring.modifiers[activeMechanic] += 1;
				saveStorage();
			}
		},
		timer: {
			get: function(bestORprevious) {
				if ("best" == bestORprevious) {
					return savedData.scoring.timer.best;
				} else {
					return savedData.scoring.timer.previous;
				}
			},
			set: function(time, isBest) {
				if (true == isBest) {
					savedData.scoring.timer.best = time;
				} else {
					savedData.scoring.timer.previous = time;
				}
				saveStorage();
			}
		},
		word: {
			get: function(aword) {
				if (savedData.scoring.word[aword] == null) {
					return 0;
				} else {
					return savedData.scoring.word[aword];
				}
			},
			set: function(aword) {
				savedData.scoring.word[aword] += 1;
				saveStorage();
			}
		},
		color: {
			get: function(acolor) {
				if (savedData.scoring.color[acolor] == null) {
					return 0;
				} else {
					return savedData.scoring.color[acolor];
				}
			},
			set: function(acolor) {
				savedData.scoring.color[acolor] += 1;
				saveStorage();
			}
		},
		score: {
			get: function(bestORprevious) {
				if ("best" == bestORprevious) {
					return savedData.scoring.score.best;
				} else {
					return savedData.scoring.score.previous;
				}
			},
			set: function(ascore, isBest) {
				if (true == isBest) {
					savedData.scoring.score.best = ascore;
				} else {
					savedData.scoring.score.previous = ascore;
				}
				saveStorage();
			}
		},
	}
}

var channelPoints = 0;

for (const key in savedData.scoring.modifiers) {
	const element = savedData.scoring.modifiers[key];
	channelPoints+=element;
}
const splashText = document.querySelector("#gameSplash");

switch (Math.floor(Math.random()*5)) {
	case 0:
		splashText.innerText = `Channel points: ${channelPoints}`;
		break;
	case 1:
		splashText.innerText = `Best score: ${savedData.scoring.score.best}`;
		break;
	case 2:
		splashText.innerText = `Deaths to cyan: ${savedData.scoring.word.cyan}`;
		break;
	case 3:
		splashText.innerText = `Deaths to scrambled: ${savedData.scoring.modifiers.scrambled}`;
		break;
	case 4:
		splashText.innerText = `Deaths to flipped: ${savedData.scoring.modifiers.flipped}`;
		break;
}



var settings = {
	timerAdjustment: null,
	colorListInput: null,
	mechanics: {
		inverted: null,
		scrambled: null,
		flipped: null,
		backwards: null,
		waited: null,
		batteried: null,
		colored: null,
		blurred: null,
	},
	mechanicsArrayFunc: function() {
		let retray = [];
		for (let i = 0; i <= 7; i++) {
			retray[i] = document.getElementById('mechanics-' + i).checked;
		}
		return retray;
	},
	mechanicsArray: null,
	mechanicsKey: [
		"inverted", "scrambled", "flipped", "backwards", "waited", "batteried", "colored", "blurred"
	],
	mechanicsCount: function() {
		var ammount = 0;
		for (let i = 0; i <= savedData.settings.mechanicsArray.length; i++) {
			if (savedData.settings.mechanicsArray[i]) {
				ammount++;
			}
		}

		return ammount;
	},
	countedMechanics: null,
};
document.getElementById("consoleJSON").innerText = JSON.stringify(getStorage(), null, 2);


/** KEY STUFF********************************************************************************************************* */

//Response
function sendInput(Boolean) {
	//Boolean if the user thinks the word is correct
	if (failure != 1 && started == true) {

	if (currentSherlockStep >= sherlockStepMin && currentSherlockStep <= sherlockStepMax) {
		flip();
		return;
	}
		if (invertedControls == false && currentMechanic != "waited") {
			if (correct == Boolean) {
				flip();
			} else {
				fail(2);
			}
		} else if (invertedControls == true) {
			if (correct != Boolean) {
				flip();
			} else {
				fail(2);
			}
		} else if (currentMechanic == "waited") {
			fail(2);
		} else if (currentMechanic == "batteried") {
			AudioClip.error1.play();
		}

	}

}
//Keys
document.addEventListener("keydown", function(event) {
	//switch statement instead
	switch (event.key) {
		case "g":
			sendInput(true);
			break;
		case "h":
			sendInput(false);
			break;
		case "Enter":
			AudioClip.staticSwitchChannel.play();
			if (started == false && !antijack) {
				antijack = true;
				buttonMain();
			}
			if (failure == 1) {
				window.location.reload();
			}
			break;
		case "k":
			AudioClip.staticSwitchChannel.play();
			if (started == false) {
				main();
			}
			if (failure == 1) {
				window.location.reload();
			}
			break;
		case " ": //Spacebar
			if (started == true && currentMechanic == "blurred") {
				AudioClip.staticSwitchChannel.play();
				blurramount -= 10;
				TV.style.filter = "blur(" + blurramount + "px)";
			} else if (started == true && currentMechanic == "batteried") {
				connectionStrength++;
				AudioClip.staticSwitchChannel.play();
				document.getElementById("modifier").innerText = "CONNECTION: " + connectionStrength + "/20";

				if (connectionStrength == 20) {
					flip();
				}
			}
			break;
		case "=":
			if (started == false) {
				AudioClip.staticSwitchChannel.play();
				document.getElementById("color-list-input").value = "red,blue,green,cyan,yellow,purple,orange,maroon,pink,gray,white,lime,teal";
			}
			break;
		case "-":
			if (started == false) {
				AudioClip.staticSwitchChannel.play();
				document.getElementById("color-list-input").value = "red,blue,green,yellow,purple";
			}
			break;
		case "p":
			if (started == false) {
				document.getElementById("color-list-input").value = document.getElementById("color-list-input").value + ",pink";
			}
			break;
		case "`":
			AudioClip.staticSwitchChannel.play();
			alert(JSON.stringify(getStorage()));
			document.getElementById("consoleJSON").innerText = JSON.stringify(getStorage(), null, 2);
			break;
		case "Tab":
			AudioClip.staticSwitchChannel.play();
			newSettings = true;
			document.getElementById("allTheSettings").hidden = false;
			resetButtons();
			break;
	}
	//Do a for loop for if a number 1-7 is pressed, and then set the correlating mechanic
	//The rest make colors
	if (started == false) {
		document.getElementById('mechanics-' + event.key).checked = !(document.getElementById('mechanics-' + event.key).checked);
	}

});
//Mouse
document.addEventListener("mouseup", function(event) {
	if (window.mobileCheck()) {
		return null;
	}
	switch (event.button) {
		case 0:
			sendInput(true);
			break;
		case 2:
			sendInput(false);
			break;
	}
});

function resetButtons() {
	try {
		for (let i = 0; i < savedData.settings.mechanicsArray.length; i++) {
			document.getElementById('mechanics-' + i).checked = savedData.settings.mechanicsArray[i];
		}
		document.getElementById('color-list-input').value = savedData.settings.colorListInput;
	} catch (err) {
		alert(err);
	}
}

/** UPDATE********************************************************************************************************* */
function update() {

	addTime = decimalAdjust("floor", Math.random(), -1) + 0.25;

	if (failure != 1 && started == true) {

		//Time
		if (timeSinceLastAnswer <= 0) {
			//Fail by time when out of time
			fail(1);
		} else {
			//Subtract the time 
			timeSinceLastAnswer -= 0.05;

			previousTime += 0.05;

			if (timeSinceLastAnswer <= 5) {
				dim -= 1; //When runnning out of time, dim the screen

			}
			DISPLAY_TIME.innerHTML = "TIME: " + decimalAdjust("floor", timeSinceLastAnswer, -2);
		}
		//screen dimming
		//TODO: REMOVE THIS THIS IS BAD
		//document.body.style.filter = "brightness(" + dim + "%)";

	}

	DISPLAY_POINTS.innerHTML = "POINTS: " + POINTS;
}


/** FAIL********************************************************************************************************* */
function fail(reason) {
	if (failure != 1) { //Fail once only
		failure = 1;

		document.getElementById('game').hidden = true;
		document.getElementById('dead').hidden = false;
		//document.body.style.backgroundImage = "none";
		document.body.style.backgroundColor = '#0a0a0a';
		document.getElementById('icon').href = "images/TVdead.png";

		AudioClip.tvOff.play();


		var colorful = TV.style.color;
		var textiful = TV.innerText;

		storageLibrarian.scoring.color.set(colorful);
		storageLibrarian.scoring.word.set(textiful);
		storageLibrarian.scoring.modifiers.set(currentMechanic);

		document.getElementById('pathologicalScore').innerText =
			POINTS + " points out of your best score of " + storageLibrarian.scoring.score.get("best");

		if (storageLibrarian.scoring.score.get("best") < POINTS) { storageLibrarian.scoring.score.set(POINTS, true); } else { storageLibrarian.scoring.score.set(POINTS, false); }

		document.getElementById('pathologicalStats').innerText =
			textiful.toUpperCase() + " as " + colorful + ", you have died " + storageLibrarian.scoring.color.get(colorful) + " times to this color, and " + storageLibrarian.scoring.word.get(textiful) + " times to that word.";

		document.getElementById('pathologicalMemory').innerText =
			"Deaths to " + currentMechanic + " mechanic: " + storageLibrarian.scoring.modifiers.get(currentMechanic) + ".";

		if (storageLibrarian.scoring.timer.get("best") < timeSinceLastAnswer) { storageLibrarian.scoring.timer.set(timeSinceLastAnswer, true); } else { storageLibrarian.scoring.timer.set(timeSinceLastAnswer, false); }

		//Animation logic
		document.getElementById('pathology').classList.add('wakeupMessageClass');
		document.getElementById('pathologicalScore').classList.add('wakeupTextClass');
		document.getElementById('pathologicalStats').classList.add('wakeupTextClass');
		document.getElementById('pathologicalMemory').classList.add('wakeupTextClass');
		document.getElementById('restartButton').classList.add('wakeupTextClass');

		switch (reason) {
			case 1: //Time
				document.getElementById('pathology').innerText = "LOST CONNECTION...";
				break;
			case 2: //Failure
				//Score system & save the cause of death
				break;
		}
	}
}

var msgstate = false;

/** FLIP********************************************************************************************************* */
/** ********************************************************************************************************* */
function flip() {

	//Play sfx
	AudioClip.trackingIncreasePoint.currentTime = 0;
	AudioClip.trackingIncreasePoint.play();

	//Congratualating sfx
	if (POINTS == storageLibrarian.scoring.score.get("previous")) {
		AudioClip.trackingIncreaseStatic.play();
	}
	if (POINTS == storageLibrarian.scoring.score.get("best")) {
		AudioClip.trackingIncreaseStatic.play();
	}

	//Reset moving parts
	TV.hidden = false;
	currentMechanic = null;
	document.body.style.backgroundColor = "white";
	TV.classList.remove("flipped");
	TV.classList.remove("scrambled");
	document.getElementById("modifier").innerText = "...";
	invertedControls = false;
	TV.style.filter = "";
	document.getElementById("modifier").classList.remove("important");




	//Mechanics logic
	try {

		//Set a variable to be equal to the current mechanic

		//There's something wrong with how the counted mechanics are saved, so instead it will just always individually check
		if (true) {
			let alreadyApplied = false;

			if (savedData.settings.mechanics.backwards && !alreadyApplied) {
				if (Math.ceil(Math.random() * 6) == 1) {
					alreadyApplied = true;
					currentMechanic = "backwards";
					//Backwards controls

					invertedControls = true;
					document.getElementById("modifier").innerText = "INVERTED CONTROLS";
					AudioClip.error1.play();
				}
			}
			if (savedData.settings.mechanics.batteried && !alreadyApplied) {
				if (Math.ceil(Math.random() * 5) == 1) {
					alreadyApplied = true;
					connectionStrength = 0;
					currentMechanic = "batteried";
					//Do logic 
					TV.hidden = true;

				}
			}
			if (savedData.settings.mechanics.blurred && !alreadyApplied) {
				if (Math.ceil(Math.random() * 3) == 1) {
					alreadyApplied = true;
					currentMechanic = "blurred";
					AudioClip.cableFix.play();

					blurramount = Math.random() * 100;
					TV.style.filter = "blur(" + blurramount + "px)";

					//Do logic 
				}
			}
			if (savedData.settings.mechanics.colored && !alreadyApplied) {
				if (Math.ceil(Math.random() * 5) == 1) {
					alreadyApplied = true;
					currentMechanic = "colored";


					//Do logic 
				}
			}
			if (savedData.settings.mechanics.flipped && !alreadyApplied) {
				if (Math.ceil(Math.random() * 4) == 1) {
					alreadyApplied = true;
					currentMechanic = "flipped";

					TV.classList.add("flipped");
				}
			}
			if (savedData.settings.mechanics.inverted && !alreadyApplied) {
				if (Math.ceil(Math.random() * 3) == 1) {
					alreadyApplied = true;
					currentMechanic = "inverted";

					let backColor = color[Math.ceil(Math.random() * color.length)];
					while (backColor == TV.style.color) {
						backColor = color[Math.ceil(Math.random() * color.length)];
					}
					document.body.style.backgroundColor = backColor;
				}
			}
			if (savedData.settings.mechanics.scrambled && !alreadyApplied) {
				if (Math.ceil(Math.random() * 3) == 1) {
					alreadyApplied = true;
					currentMechanic = "scrambled";
					TV.classList.add("scrambled");

					//Do logic 
				}
			}
			if (savedData.settings.mechanics.waited && !alreadyApplied) {
				if (Math.ceil(Math.random() * 6) == 1) {
					alreadyApplied = true;
					currentMechanic = "waited";

					//Do logic 
					window.setTimeout(function() {
						if (failure == 0) {
							timeSinceLastAnswer += 1.1;
							flip();
						}
					}, 1000);
				}
			}

			if (currentMechanic == null) {
				document.getElementById("modifier").innerText = "...";
			} else {
				document.getElementById("modifier").innerText = currentMechanic;
			}
			if (currentMechanic == "backwards") {
				document.getElementById("modifier").innerText = "INVERTED CONTROLS";
				document.getElementById("modifier").classList.add("important");
			}
			if (currentMechanic == "waited") {
				document.getElementById("modifier").innerText = "[DON'T SWITCH]";
				document.getElementById("modifier").classList.add("important");
			}
			if (currentMechanic == "blurred") {
				document.getElementById("modifier").innerText = "PRESS SPACE TO UNBLUR";
			}
			if (currentMechanic == "batteried") {
				document.getElementById("modifier").innerText = "LOST CONNECTION (PRESS SPACE)";
				document.getElementById("modifier").classList.add("important");
			}
		}
	} catch (err) {
		if (!window.mobileCheck()) {
			alert("Mechanics logic: " + err);
		}
	}

	let correctnessly = Math.floor(Math.random() * 2);

	//Sherlock logic
	if (previousTime < sherlockMin) {
		currentSherlockStep++;
		document.getElementById("sherlock").innerText += sherlockSymbol;
		AudioClip.cpGain.currentTime = 0;
		AudioClip.cpGain.play();

	} else if (previousTime > sherlockMax) {
		if (currentSherlockStep > 1) {
			AudioClip.introStatic.play();
		}
		currentSherlockStep = 0;
		document.getElementById("sherlock").innerText = "";
		document.getElementById("sherlock").classList.remove("sherlock");

	}
	previousTime = 0;

	if (currentSherlockStep >= sherlockStepMin && currentSherlockStep <= sherlockStepMax) {
		correctnessly = 1;
		document.getElementById("sherlock").classList.add("sherlock");
	} else if (currentSherlockStep >= sherlockStepMax) {
		currentSherlockStep = 0;
		document.getElementById("sherlock").classList.remove("sherlock");
		document.getElementById("sherlock").innerText = "";

		AudioClip.cableFix.currentTime = 0;
		AudioClip.cableFix.play();
	}

	//Reset time and dimmness
	timeSinceLastAnswer += addTime;
	dim = 100;

	//Add points
	POINTS++;

	console.group(POINTS);

	if (correctnessly == 1) {
		correct = true;

		let chosenColor = color[Math.floor(Math.random() * color.length)];
		//Set colors and text
		TV.style.color = chosenColor;
		TV.innerText = chosenColor;

	} else {
		correct = false;

		//Choose fake colors
		var fakeColor = color[Math.floor(Math.random() * color.length)];
		var fakeText = color[Math.floor(Math.random() * color.length)];

		//Make sure they aren't the same
		while (fakeText == fakeColor) {
			fakeColor = color[Math.floor(Math.random() * color.length)];
			fakeText = color[Math.floor(Math.random() * color.length)];
		}

		//Set colors & text
		TV.style.color = fakeColor;
		TV.innerText = fakeText;
	}

	if (currentSherlockStep >= sherlockStepMin && currentSherlockStep <= sherlockStepMax) {
		TV.innerText = 'CLICK';
	}
	if (currentSherlockStep+10 >= sherlockStepMax) {
		TV.innerText = msgstate?'DOWN':'SLOW';
		msgstate = !msgstate;
	}
	if (currentSherlockStep >= sherlockStepMax) {
		TV.innerText = "STOP";
	}

	//Animation logic
	TV.classList.remove('animationClass');
	void TV.offsetWidth; //force replay animation
	TV.classList.add('animationClass');

	console.log("Logic  :   " + fakeColor + fakeText + correct);

	console.groupEnd(POINTS);
}


/** ********************************************************************************************************* */
/** MAIN********************************************************************************************************* */
/** ********************************************************************************************************* */
function main() {
	started = true;
	document.getElementById("connecting").hidden = true;
	document.getElementById("game").hidden = false;
	document.getElementById("pregame").hidden = true;

	document.getElementById('icon').href = "images/TV2.png";
	AudioClip.introStatic.volume = 0;

	if (window.mobileCheck()) {
		document.getElementById("mobileCon").hidden = false;
	}

	//Proccess settings

	try {
		if (newSettings == true || localStorage.getItem("uninitiated") == null) {
			document.getElementById("allTheSettings").hidden = false;
			localStorage.setItem("uninitiated", "false");


			settings = {
				timerAdjustment: document.getElementById('timer-adjustment').value,
				colorListInput: document.getElementById('color-list-input').value,
				mechanics: {
					inverted: document.getElementById('mechanics-0').checked,
					scrambled: document.getElementById('mechanics-1').checked,
					flipped: document.getElementById('mechanics-2').checked,
					backwards: document.getElementById('mechanics-3').checked,
					waited: document.getElementById('mechanics-4').checked,
					batteried: document.getElementById('mechanics-5').checked,
					colored: document.getElementById('mechanics-6').checked,
					blurred: document.getElementById('mechanics-7').checked,
				},
				mechanicsArrayFunc: function() {
					let retray = [];
					for (let i = 0; i <= 7; i++) {
						retray[i] = document.getElementById('mechanics-' + i).checked;
					}
					return retray;
				},
				mechanicsArray: null,
				mechanicsKey: [
					"inverted", "scrambled", "flipped", "backwards", "waited", "batteried", "colored", "blurred"
				],
				mechanicsCount: function() {
					var ammount = 0;
					for (let i = 0; i <= savedData.settings.mechanicsArray.length; i++) {
						if (savedData.settings.mechanicsArray[i]) {
							ammount++;
						}
					}

					return ammount;
				},
				countedMechanics: null,
				sherlock: {
					sherlockChecked: document.getElementById("blahblahblah-0").checked,
					sherlockMin: document.getElementById("sherlockMin").value,
					sherlockStepMin: document.getElementById("sherlockStepMin").value,
					sherlockStepMax: document.getElementById("sherlockStepMax").value,
				}
			};

			savedData.settings = settings;
			saveStorage();

		}
		//Make the color list settings lowercase, replace all the spaces with nothing, and split it into an array each comma
		color = savedData.settings.colorListInput.toLowerCase().replaceAll(" ", "").split(",");
		savedData.settings.mechanicsArray = settings.mechanicsArrayFunc(); //Will exist by the time it gets here, dw
		savedData.settings.countedMechanics = settings.mechanicsCount();

		sherlockMin = savedData.settings.sherlock.sherlockMin;
		sherlockMax = sherlockMin;
		sherlockStepMin = savedData.settings.sherlock.sherlockStepMin;
		sherlockStepMax = savedData.settings.sherlock.sherlockStepMax;


	} catch (err) {
		alert(err);
	}

	flip();
}

function buttonMain() {
	AudioClip.connectingToTV.play();

	document.getElementById("connecting").hidden = false;
	document.getElementById("pregame").hidden = true;

	//document.getElementById("connectingMessage").classList.add('animationClass');

	setTimeout(function() {
		document.getElementById("dot1").style.visibility = "visible";
	}, 500);
	setTimeout(function() {
		document.getElementById("dot2").style.visibility = "visible";
	}, 1500);
	setTimeout(function() {
		document.getElementById("dot3").style.visibility = "visible";
	}, 2500);

	AudioClip.connectingToTV.onended = function() {
		main();
	}
}

















/** FROM MDN
 * Adjusts a number to the specified digit.
 *
 * @param {"round" | "floor" | "ceil"} type The type of adjustment.
 * @param {number} value The number.
 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
function decimalAdjust(type, value, exp) {
	type = String(type);
	if (!["round", "floor", "ceil"].includes(type)) {
		throw new TypeError(
			"The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
		);
	}
	exp = Number(exp);
	value = Number(value);
	if (exp % 1 !== 0 || Number.isNaN(value)) {
		return NaN;
	} else if (exp === 0) {
		return Math[type](value);
	}
	const [magnitude, exponent = 0] = value.toString().split("e");
	const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
	// Shift back
	const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
	return Number(`${newMagnitude}e${+newExponent + exp}`);
}

/** 
*https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
**/
function invertHex(hex) {
	return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

window.mobileCheck = function() {
	let check = false;
	(function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

