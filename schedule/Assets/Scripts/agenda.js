/**Schedule Type Display */
const sType = document.getElementById('schedTypeDisplay'); 
/**Developer console for outputting messages */
const devconsole = document.getElementById("dev");
/**Index key string */
const indexKey = "agendaIndex";
/**Empty JSON for blank, new index */
const emptyJSON = {};
/**Agenda index from local storage as a string */
var agendaIndex = localStorage.getItem(indexKey);
/**Default schedule type */
let schedType = "PM";

if(agendaIndex == null){localStorage.setItem(indexKey, JSON.stringify(emptyJSON));}
/**Parsed index */
function pIndex(){return JSON.parse(agendaIndex);}
/** Update Index */
function uIndex(newIndex){localStorage.setItem(indexKey,JSON.stringify(newIndex));}
devconsole.innerText = pIndex();


function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var ampm = hours >= 12 ? 'PM' : 'AM'; // condition ? truthy statement : falsy statement
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + seconds + 's ' + ampm;
	return strTime;
}




var heartbeat = setInterval(function(){
	
	let currentDater = new Date();
	document.getElementById("time").innerText = formatAMPM(currentDater);

		if(currentDater.getDay() == 5){
			var isFriday = true;
		}else{
			var isFriday = false;
		}
	
	try {
		document.getElementById("currentClass").innerText = schedule.getClass(schedType,isFriday).name;
	} catch (error) {
		if(error instanceof TypeError){
			currentClass = {start:[0,0 ],end:[24,0],name:"None"};
			devconsole.innerText = currentDater + error;
		}else{
			alert("Error getting currentClass. Err:" + error);
		}
	}
	
	

}, 10);

function storeProduct(identificationBand){
	let objDate = new Date();
	let storedDate = "" + objDate.getFullYear() +"/"+ objDate.getMonth() + "/" + objDate.getDate() +"/"+ objDate.getHours() + "/" + objDate.getSeconds();
	let inValue = document.getElementById(identificationBand).value;
	let temporaryJSON = pIndex();
	temporaryJSON.storedDate = inValue;
	alert(temporaryJSON.storedDate)
	uIndex(temporaryJSON);
	alert(pIndex(agendaIndex).storedDate);
}