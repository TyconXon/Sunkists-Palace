function shortcutDirectory(c){

	altpressed = c.altKey;
	shiftpressed = c.shiftKey;

	toggleStyleMenu(c)

	if (document.activeElement.tagName != "TEXTAREA") {
		escappedShorcuts(c);
	} else if(document.activeElement == textBox) {
		
		if (c.key == "Enter" && !c.shiftKey) {
			sendMessage(c)
		}
		//Auto URL
		if (c.key == "/" && c.altKey) {
			buildLinks(c);
		}
		if(c.key == 'Escape'){
			textBox.blur();
		}
		
		if (c.key == "Shift" && c.altKey) {
			//Auto image
			textBox.value = imgify(textBox.value);
		}
		if (c.key == "=" && c.altKey) {
			textBox.value = '/restart';
		}
		if (c.key == "l" && c.altKey) {
			setUsr();
		}
		if((c.key == "]" && c.altKey)||(c.key == 'u' && c.altKey)){
			uploadShortcut(c);
		}
		if((c.key == "\\" && c.altKey)||(c.key == 'i' && c.altKey)){
			document.getElementById('upload').click();
		}
		if(c.key == 'r' && c.altKey){
			harvestOranges();
		}
		if(c.key == 'm' && c.altKey){
			newPopup(window.location.origin + '/workshop.html')
		}
		if(c.key == 'ArrowDown' && c.altKey){
			markAsRead();
		}
		if(c.key == 'ArrowUp' && (textBox.selectionStart == textBox.selectionEnd) && (textBox.selectionStart == 0)){
			friendlyEdit(c.ctrlKey, c.shiftKey);
		}
		//Auto typing
		if (textBox.value.length >= 2) {
			socket.emit("typing", window.localStorage.getItem("username"));
		}
	}

}

function buildLinks(c){
	textBox.value = urlify(textBox.value);
	textBox.focus();
	textBox.setSelection(textBox.value.indexOf('target="_blank">')+15, textBox.value.indexOf('target="_blank">')+15)}
function toggleStyleMenu(c){
	if(c.shiftKey && c.altKey && c.key == " "){
		c.preventDefault();
		try{
			document.getElementById('settingsButton').click();
		}catch(error){
		}
		document.getElementById('thesettings').children[0].click();
		document.getElementById('sCss').showPopover();
	}

	if(document.activeElement === document.getElementById("sStyle")){
		if(c.key == 's' && c.ctrlKey){
		 c.preventDefault();
		 document.getElementById('sSub').click();
		}
		if(c.shiftKey && c.altKey && c.key == " "){
			document.getElementById('sCss').hidePopover();
		}
	 }
}
function sendMessage(c){
		c.preventDefault();
		let msg = textBox.value;
		if (msg.trim() == "") {
			textBox.value = "";

			return false;
		}
		msg = document.getElementById('prefix').value + msg ;


		if(!c.altKey){
			if (msg.startsWith("\\multi")) {

					var rep = msg.split('%;');
					for(let i = 1; i < rep.length; i++){
						setTimeout(()=>{
							message(formatCommands(rep[i]));
						}, (i * 100))
					}
			}else{
				message(formatCommands(msg));
			}
			refreshSplash();
			markAsRead();
		}else{
			message(msg);
		}
		if(navigator.onLine == true){
		textBox.value = "";
		}else{
			alert('It seems you may be offline or have a bad connection.');
			if(confirm('Do you want to go to the slow-wifi version?')){
				window.location.assign('https://sunkist-palace.net/?slow&msg='+msg+'&user='+window.localStorage.getItem("username"));
			}
		}

	
}
function escappedShorcuts(c){
	switch (c.key) {
		//Legacy chat
		case "Enter":
			if (c.shiftKey) {
				text();
			} else {
				c.preventDefault();
				textBox.focus();
			}
			break;
			//Refresh
		case "Shift":
			//window.location.assign("https://sunkist-palace.net/?refresh");
			break;
			//Toggle autoscroll
		case ".":
			c.preventDefault();
			altMode = !altMode;
			alert(altMode?"Autoscroll enabled":"Autoscroll disabled");
			break;
		default:
			if(!c.ctrlKey && !c.altKey){
				textBox.focus();
			}
			break;
	}
}
function uploadShortcut(c){
	document.getElementById('uploadFile').click();

	document.getElementById("menuTitle").innerText = 'Selecting image...';
	window.setTimeout(() => {
		document.getElementById("menuTitle").innerText = sunkistsPalace;
	}, 1000);
}

document.addEventListener("keydown", shortcutDirectory);

function formatCommands(msg){
	var newMsg = msg.trimEnd()
		.replace(/(?<!\*\*)\*(?![*\s])(?:[^*]*[^*\s])?\*(?!\*\*)/g, (match)=>{
			return `<i>${match.replaceAll('|','')}</i>`;
		})
		.replace(/(?<=\*\*)(?![*\s])(?:[^*]*[^*\s])?(?=\*\*)/g, "<b>$&</b>")
		.replace(
			/\|\|(?![|\s])(?:[^|]*[^|\s])?\|\|/g,
			(match)=>{return `<spoiler>${match.replaceAll('|','')}</spoiler>`}
		)
		.replace(/(?<=\_\_)(?![_\s])(?:[^_]*[^_\s])?(?=\_\_)/g, "<u>$&</u>")
		.replace(
			/\~\~(?![~\s])(?:[^~]*[^~\s])?\~\~/g,
			"<strike>$&</strike>",
		)
		.replace(
			/(?<!\`)\`(?![`])(?:[^`]*[^`])?\`/g,
			"<pre><code>$&</code></pre>",
		)
		/*.replace(/\n/g, "<br>")*///Messes up code
		.replace(
			/(?<=\`\`)(?![`])(?:[^`]*[^`])?(?=\`\`)/g,
			"<script>$&</script>",
		)
		.replace(/(?<=@)[\S]+/g, "<$&>$&</$&>")/*
		.replace(
			/(?<!&#)(?<=\s#)[\S]+/g,
			"<button onclick=\"copy('/join $&')\">$&</button>",
		)*///Messes up code and links
		.replace(
			/:fire:/g,
			'&#128293;'
		)
		.replace(
			/(?<=^\/pfp )[^\s]+$/,
			`<style nodraw> .${window.localStorage.getItem("username")}::before{background-image:url('$&') !important;background-size:cover;background-position:center;}</style>`
		)
		.replace(
			/(?<=^\/color )[^]+$/,
			`<style> .${window.localStorage.getItem("username")}{color: $& !important;}</style>`
		)
		.replace(
			/(?<=^\/bg )[^]+$/,
			`<style> .${window.localStorage.getItem("username")}{background-color: $& !important;}</style>`
		)
		.replace(
			/(?<=^\/font )[^]+$/,
			`<style> .${window.localStorage.getItem("username")}{font-family: '$&' !important;}</style>`
		)
		.replace(
			/(?<=^\/border )[^\s]+$/,
			`<style> .${window.localStorage.getItem("username")}::before{border-image-source:url('$&') !important;}</style>`
		)
		.replace(
			/(?<=^\/button )[^]+$/,
			`<style> .${window.localStorage.getItem("username")} button{background-color: $& !important;}</style>`
		)/*
		.replace(
			/\^>([\S]+)/g,
			`${retReplyGen(msg.match(/(?<=\^>)([a-z]?)([\d]+)/g))}`
		)*/
		.replace(
			/(?<=^\/ns )[^]+$/,
			`<style> .${window.localStorage.getItem("username")}{text-shadow: 0px 0px 5px $& !important;}</style>`
		)
		.replace(
			/(?<=^\/quick )[^]+$/,
			`<style> .${window.localStorage.getItem("username")}::before{content:'$&';} </style>`
		)
		.replace(
			/(?<=^\/idle)$/,
			`<style nodraw> .${window.localStorage.getItem("username")}::before{content:'🌙';} </style>`
		)
		.replace(
			/(?<=^\/programming)$/,
			`<style nodraw> .${window.localStorage.getItem("username")}::before{content:'💻';} </style>`
		)
		.replace(
			/(?<=^\/dnd)$/,
			`<style nodraw> .${window.localStorage.getItem("username")}::before{content:'🔕';} </style>`
		)
		.replace(
			/(?<=^\/class)$/,
			`<style nodraw> .${window.localStorage.getItem("username")}::before{content:'🏫';} </style>`
		)
		.replace(
			/(?<=^\/clear)$/,
				`<style> .${window.localStorage.getItem("username")}::before{content:'';} </style>`
		)
		.replace(
			/(?<=^\/pkfire )[^]+$/,
			`<style> .$&{display:none;} </style>`
		)
		.replace(
			/(?<=^\/cd )[^]+$/,
			`(Setting background image to $&...)<style nodraw> 
			html{background-image: url(images/rain.gif),url('$&') !important;background-attachment: fixed;background-size: cover;image-rendering: auto;}
			</style>`
		)
		.replace(
			/(?<=^\/dvd )[^]+$/,
			`<style> html{background-image: url('$&') !important;background-attachment: fixed;background-size:cover;}</style>`
		)
		.replace(
			"\\mention Boxel",
			'<@565674394249199617> (Boxel)'
		)
		.replace(
			"\\mention Afton",
			'<@814541916040331294> (Afton)'
		)
		.replace(
			"\\mention MaximusMiller2",
			'<@542899543608655872> (MaximusMiller2)'
		)
		.replace(
			"\\mention Avonya",
			'<@901409358427066409> (Avonya)'
		)
		.replace(
			'/pkfire',
			''
		)/* //doesn't work
		.replace(
			/(?<=^\/bind )([^\s]+) ([^]+)/g,
			`<script> document.addEventListener('keydown', (c) =>{
				if(c=='$1' && c.altKey && document.activeElement.tagName != 'TEXTAREA'){ 
				 $2};
			});</script>`
		)*/
		.replace(
			/:sob:/g,
			'&#128557;'
		)
		.replace(
			/:skull:/g,
			'&#9760;'
		)
		.replace(
			/^(:headcrab:)$/g,
			'<img src="https://sunkist-palace.net/images/stickers/headcrab.png">'
		);
	/*
	for(i = 0; i < workshop.clientCommands.length; i++){
		try{
		newMsg = workshop.clientCommands[i](newMsg);
		}catch(e){
			alert("PLUGIN ERROR: "+e);
		}
	}
	*/

	return newMsg;

}

textBox.addEventListener('paste', (e) =>{

	let pastedText = e.clipboardData.getData('Text');

	if(shiftpressed){
		return;
	}
	
	if (pastedText.startsWith('https://') && (!isImageFile(pastedText))){
		setTimeout(()=>{
			let startOfURL = textBox.value.lastIndexOf(pastedText);
			let splitTextbox = textBox.value.split('');
			splitTextbox.splice(startOfURL, pastedText.length, urlify(pastedText));
			textBox.value = splitTextbox.join('');
		textBox.setSelectionRange(textBox.value.lastIndexOf(pastedText), textBox.value.lastIndexOf(pastedText) + pastedText.length)
		},10)
	}
	if(isImageFile(pastedText)){
		setTimeout(()=>{
			let startOfURL = textBox.value.lastIndexOf(pastedText);
			let splitTextbox = textBox.value.split('');
			splitTextbox.splice(startOfURL, pastedText.length, imgify(pastedText));
			textBox.value = splitTextbox.join('');
		},10)
	}
});

function friendlyEdit(ctrlKey, shiftKey){
	var allMyMessages = document.getElementsByClassName(window.localStorage.getItem("username"));
	let negatives = 1;
	var lastMessage = allMyMessages[allMyMessages.length - 1];
	if (ctrlKey){
			lastMessage = document.getElementById(`${prompt('ID of message to edit: ')}`)
	}
	if(shiftKey){
		replyGen(prompt('ID of the message to reply to: '));
		c.preventDefault();
		return;
	}
	//if last of allmessages == mine {

	//let edits = prompt('Editing ' + lastMessage.id,splitString(lastMessage.outerHTML).message);
	if(/*edits != null*/ textBox.value != ''){
		if(!confirm('Replace current message with edit?')){
			return;
		}
	}
		//message( '/edit '+lastMessage.id+' '+edits);
		textBox.focus();

		textBox.value = '/edit '+lastMessage.id+' ' + splitString(lastMessage.outerHTML).message;
		setTimeout(()=>{
			textBox.selectionEnd = textBox.value.length;
			textBox.selectionStart = textBox.value.length;
		}, 5);


}
