/* START Lefthand Menu */
const messageLog = document.createElement('div');
messageLog.id = 'messageLog';
document.body.appendChild(messageLog);

document.querySelectorAll('.message').forEach((element) => {
	messageLog.appendChild(element);
})

function splitString(inputString) {

	// Creating an object with named properties
	console.log(inputString);
	const result = {
		id: inputString.match(/((?<=maple\()|(?<=maple\('))[^']+((?=')|(?=\)))/g)[0],
		usrIdentifier: inputString.match(
			/((?<=onIdentifer\(\")|(?<=onIdentifer\(\&quot;))[^(^)]*((?="\))|(?=\&quot;\)))/g,
		)[0],
		/*curTime: inputString.match(/(?<=title=')[0-9]+/[0-9]+/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (AM|PM)(?=')/g)[0],*/
		message: inputString.match(/(?<=<msgtxt>)[^]+?(?=<\/msgtxt>)/g)[0],
	};
	console.log(result);
	setTimeout(() => {
		if (document.getElementById(result.id)) {
			messageLog.appendChild(document.getElementById(result.id));
		}
	}, 50);
	return result;
}

/*document.querySelectorAll('details').forEach((elem)=>{
	elem.setAttribute('open', 'true');
})*/

const traditionalStyle = document.createElement('style')
var blur = 8;
traditionalStyle.setAttribute('nodraw', 'true')
traditionalStyle.innerHTML = `
	body {
		margin:0;
		backdrop-filter:none!important;
	}

	#menu {
		right:unset!important;
		left:0!important;
		top:0;
		backdrop-filter: none!important;
		width:20%!important;
		height:100%;
		position: fixed;
		overflow-y:scroll;
		overflow-x:hidden
	}

	#menu::before {
		backdrop-filter: blur(${blur}px);
		width: 100%;
		height: 100%;
		position: absolute;

		left:0;
		top:0;
		content:'';
		z-index:-1;
	}

	#messageLog {
		position: absolute;
		width:80%;
		right: 0;
		backdrop-filter:blur(${blur}px);
	}

	#messageLog {padding-bottom: 10vh;}
	#messageLog .message:last-child {margin-bottom: 10vh;}

	#soapMode {
		position:fixed;
		bottom: 0!important;
		right: 0!important;
		left: unset!important;
		padding: 5px!important;
		width: 80%!important;
		height:10vh!important;
		margin-top:0!important;
		margin-bottom:0!important;
	}

	.message {border-radius:0;}

	details, [open] {max-height:none!important}
	#settingGrid {grid-template-columns: auto!important;}
	#typingP {display:none;}

	.settings button, .settings a {
		width:100%;
		display:block;
		padding:0;
		margin: 0;
		margin-bottom:5px;
		font-size: 0.9em
	}

	.settings a {border: yellow 3px solid;}
	#lastRead, #splash {display:none}
	`

document.body.appendChild(traditionalStyle)
/* END Lefthand Menu */