
const headerPeriod = document.getElementById("mainTitleHeader");
const headerSpecifics = document.getElementById("Specifics");
const headerClock = document.getElementById("Clock");
const headerTime = document.getElementById("Time");
const sType = document.getElementById('schedTypeDisplay');
//const batt = await navigator.getBattery();


/**Developer console for outputting messages */
const devconsole = document.getElementById("sting");

const settingsKey = "QuickScheduleSettings";
var settingsIndex = localStorage.getItem(settingsKey);

/*Initialize default if not present*/
if(settingsIndex == null){localStorage.setItem(settingsKey, JSON.stringify("{}"));}
/**Parsed index */
function pIndex(){return JSON.parse(settingsIndex);}
/** Update Index */
function uIndex(newIndex){localStorage.setItem(settingsKey,JSON.stringify(newIndex));}
devconsole.innerText = JSON.stringify(pIndex());

//enums
const C_HOUR = 0;
const C_MINUTE = 1;
const C_FRIDAY = 3;


let schedType = "PM";
document.getElementById("DeleteOnJavascript").remove();



//StackOverflow - https://stackoverflow.com/a/8888498 
//Don't waste time doing things other people have done! (dont quote me on that :pray:)
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

//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb 
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
  }
  
  
  
function reportCalmError(err){
	let _reportedDate = new Date();
	document.getElementById("dev").innerText = _reportedDate.getHours() +","+  _reportedDate.getMinutes() +","+ _reportedDate.getSeconds()+":   "+err;
}


var heartbeat = setInterval(function(){
	
	let currentDater = new Date();

	if(currentDater.getDay() == C_FRIDAY){
		var isFriday = true;
	}else{
		var isFriday = false;
	}
	

	//GET CURRENT CLASS BLOCK
		try {
			var currentClass = schedule.getClass(schedType,isFriday);
		} catch (error) {
			if(error instanceof TypeError){
				currentClass = {start:[0,0 ],end:[24,0],name:"None"};
				//reportCalmError(error);
					
			}else{
				alert("Error getting currentClass. Err:" + error);
			}
		}

		
	headerPeriod.innerText = currentClass.name;
	headerClock.innerText = formatAMPM(currentDater);


	headerSpecifics.innerText = 
		"From: " + currentClass.start[C_HOUR]+":"+currentClass.start[C_MINUTE]+
		", To: " +currentClass.end[C_HOUR]+":"+currentClass.end[C_MINUTE];

	if((currentClass.end[C_MINUTE] - currentDater.getMinutes()) < 0){ //If less than an hour
		headerTime.innerText = "Minutes: " + 
			( 60 + ( currentClass.end[C_MINUTE] - currentDater.getMinutes() ) ); 

	}else if( ( currentClass.end[C_HOUR] - currentDater.getHours() ) > 0 ) { //If more than an hour
		headerTime.innerText = 
			"Hours: " + ( currentClass.end[C_HOUR] - currentDater.getHours() ) +
			 ", Minutes: " + ( currentClass.end[C_MINUTE] - currentDater.getMinutes() );
	}else{
		headerTime.innerText = 
			"Minutes: " + ( currentClass.end[C_MINUTE] - currentDater.getMinutes() );
	}

	//Battery
	document.getElementById("battery").innerText = navigator.getBattery().level;
}, 10);


function inputBgcolorUpdate(){
try {
		var bodystyle	= document.body.style;
		var panelstyle 	= document.getElementById("Main").style;
		var clockstyle	= document.getElementById("Clock").style;

		var xColor 				=  document.getElementById("input.bgcolor"			);
		var xColorBlur 			=  document.getElementById("input.bgcolor.blur"		);
		var xRepeat 			=  document.getElementById("input.bgimg.repeat"		);
		var xSize 				=  document.getElementById("input.bgimg.size"		);
		var xBGColor 			=  document.getElementById("input.bgimg.bgcolor"	);
		var xAttach 			=  document.getElementById("input.bgimg.attachment"	);
		var xColorTransparency 	=  document.getElementById("input.bgcolor.transparency");
		var xGlow				=  document.getElementById("glowclock");
	
		var previous = pIndex()

		var aColor = hexToRgb(previous.hColor);
		
		if (previous.hColor != null) {
			var aColor = hexToRgb(previous.hColor);
			//alert("rgba("+aColor.r+","+aColor.g+","+aColor.b)
			panelstyle.backgroundColor 	= "rgba("+aColor.r+","+aColor.g+","+aColor.b+","+previous.hColorTransparency+")";
			xColor.value = previous.hColor;
			xColorTransparency.value = previous.hColorTransparency *100;
		}
		
		if (previous.hColorBlur !=null) {
			panelstyle.backdropFilter 	= 'blur('+previous.hColorBlur+'px)';
			xColorBlur.value = previous.hColorBlur;
		}

		if (previous.hRepeat != null) {
			bodystyle.backgroundRepeat 		= previous.hRepeat;
			xRepeat.value = previous.hRepeat;
		}
		if (previous.hSize != null) {
			bodystyle.backgroundSize	 	= (previous.hSize+"%");
			xSize.value = previous.hSize;
		}
		if (previous.hBGColor != null) {
			bodystyle.backgroundColor 		= previous.hBGColor;
			xBGColor.value = previous.hBGColor;
		}
		if (previous.hAttach != null) {
			bodystyle.backgroundAttachment 	= previous.hAttach;
			xAttach.value = previous.hAttach;
		}
		if (previous.hGlow != null) {
			document.getElementById("Clock").style.textShadow = "0 0px "+previous.hGlow+"px red";
			xGlow.value = previous.hGlow;
		}
		if(previous.hclock != null){
			var aClock = hexToRgb(previous.clock);
			clockstyle.color	  = "rgb("+aClock.r+","+aClock.g+","+aClock.b+")";
			clockstyle.textShadow = "0 0px "+hGlow+"px "+"rgb("+aClock.r+","+aClock.g+","+aClock.b+")";	
		}
		if(previous.hclockbg != null && previous.hclockbgtrans != null){ 
			var aClockBG = hexToRgb(previous.hclockbg); 
			clockstyle.backgroundColor = "rgba("+aClockBG.r+","+aClockBG.g+","+aClockBG.b+","+previous.hclockbgtrans+")";
		}
		/*
		if (previous.hFileAllowed && previous.file != null) {
			var hFile = JSON.stringify(URL.createObjectURL(previous.file));
			alert(hFile)
			bodystyle.backgroundImage = "url(" + hFile + ")";
		}
		*/
} catch (error) {
	reportCalmError(error);
}
}
inputBgcolorUpdate();


function inputBgcolorSubmit(){
	try {
		var bodystyle	= document.body.style;
		var panelstyle 	= document.getElementById("Main").style;
		var clockstyle	= document.getElementById("Clock").style;

		var hColor 				=  document.getElementById("input.bgcolor"			).value;
		var hColorBlur 			=  document.getElementById("input.bgcolor.blur"		).value;
		var hRepeat 			=  document.getElementById("input.bgimg.repeat"		).value;
		var hSize 				=  document.getElementById("input.bgimg.size"		).value;
		var hBGColor 			=  document.getElementById("input.bgimg.bgcolor"	).value;
		var hAttach 			=  document.getElementById("input.bgimg.attachment"	).value;
		var hColorTransparency 	= (document.getElementById("input.bgcolor.transparency").value)/100;
		var hGlow				= (document.getElementById("glowclock").value				  );
		var hFilter				=  document.getElementById('bgfilter').value;
		var hclock				=  document.getElementById('clockcolor').value;
		var hclockbg			=  document.getElementById('bgclockcolor').value;
		var hclockbgtrans		=  document.getElementById('clocktrans').value;



		try {
			var file = document.getElementById('input.bgimg').files[0]; //[Object file], stringifing this returns NOTHING: {}
			var hFile = JSON.stringify(URL.createObjectURL(file));
			var hFileAllowed = true;
		} catch (error) {
			var hFileAllowed = false;
			reportCalmError(error)
		}	
		try {
			var pnlfile = document.getElementById('input.panelimg').files[0]; //[Object file], stringifing this returns NOTHING: {}
			var pnlhFile = JSON.stringify(URL.createObjectURL(pnlfile));
			var pnlhFileAllowed = true;
		} catch (error) {
			var pnlhFileAllowed = false;
			reportCalmError(error)
		}
		var aColor = hexToRgb(hColor);

		//alert("rgba("+aColor.r+","+aColor.g+","+aColor.b)
		
		panelstyle.backgroundColor 	= "rgba("+aColor.r+","+aColor.g+","+aColor.b+","+hColorTransparency+")";
		//alert(panelstyle.backgroundColor)
		panelstyle.backdropFilter 	= 'blur('+hColorBlur+'px)';
		
		var aClock = hexToRgb(hclock);
		var aClockBG = hexToRgb(hclockbg);
		clockstyle.color	  = "rgb("+aClock.r+","+aClock.g+","+aClock.b+")";
		clockstyle.textShadow = "0 0px "+hGlow+"px "+"rgb("+aClock.r+","+aClock.g+","+aClock.b+")";
		clockstyle.backgroundColor = "rgba("+aClockBG.r+","+aClockBG.g+","+aClockBG.b+","+hclockbgtrans+")"
		

		bodystyle.backgroundRepeat 		= hRepeat;
		bodystyle.backgroundSize	 	= (hSize+"%");
		bodystyle.backgroundColor 		= hBGColor;
		bodystyle.backgroundAttachment 	= hAttach;
		bodystyle.imageRendering		= hFilter;

		if (hFileAllowed) {
			bodystyle.backgroundImage = "url(" + hFile + ")";
		}
		if (pnlhFileAllowed) {
			panelstyle.backgroundImage = "url(" + pnlhFile + ")";
		}
		uIndex(
			{
				"hColor"			:hColor,
				"hColorBlur"		:hColorBlur,
				"hRepeat"			:hRepeat,
				"hSize"				:hSize,
				"hBGColor"			:hBGColor,
				"hAttach"			:hAttach,
				"hColorTransparency":hColorTransparency,
			//	"file"				:file,
				"hFileAllowed"		:hFileAllowed,
				"hGlow"				:hGlow,
				"hFilter"			:hFilter,
				"hclock"			:hclock, 
				"hclockbg"			:hclockbg,
				"hclockbgtrans"		:hclockbgtrans,
			}
		);
		
	} catch (error) {
		reportCalmError(error);
	}
}
