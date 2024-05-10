/*User functions*/
function dataSet(index, value) {
	socket.emit("setData", index, value);
}

function dataGet(index, back) {
	socket.emit("getData", index, back);
}

function dataGetWait(index, back) {
	dataGet(index, back);
}

function dataChange(index, change) {
	socket.emit("changeData", index, change);
}

function tts(textToSpeak) {
	window.speechSynthesis.speak(new SpeechSynthesisUtterance(textToSpeak));
}

function newPopup(url) {
	popupWindow = window.open(
		url,
		"popUpWindow",
		"height=600,width=800,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes",
	);
}
function newTab(url) {
	popupWindow = window.open(
		url,
		"_blank"
	);
}
