document.addEventListener("keydown", (c) => {

	if(c.altKey){
		altpressed = true;
	}else{
		altpressed = false;
	}
	
	if (document.activeElement.tagName != "TEXTAREA") {
		//WEBPAGE
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
				switch (altMode) {
					case true:
						altMode = false;
						msgAp.play();
						break;
					case false:
						altMode = true;
						msgLo.play();
						break;
				}
				alert(altMode);
			default:
				if(!c.ctrlKey && !c.altKey){
					textBox.focus();
				}
				break;
		}
	} else if(document.activeElement == textBox) {
		//TEXTBOX

		//Send
		if (c.key == "Enter" && !c.shiftKey) {
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
		//Auto URL
		if (c.key == "/" && c.altKey) {
			textBox.value = urlify(textBox.value);
		}
		if(c.key == 'Escape'){
			textBox.blur();
		}
		//Auto image
		if (c.key == "Shift" && c.altKey) {
			textBox.value = imgify(textBox.value);
		}
		if ((c.key == "=" && c.altKey)) {
			textBox.value = '/restart';
		}
		if ((c.key == "l" && c.altKey)) {
			setUsr();
		}
		if((c.key == "]" && c.altKey)||(c.key == 'u' && c.altKey)){
			document.getElementById('uploadFile').click();
			
			document.getElementById("menuTitle").innerText = 'Selecting image...';
			window.setTimeout(() => {
				document.getElementById("menuTitle").innerText = sunkistsPalace;
			}, 1000);
		}
		if((c.key == "\\" && c.altKey)||(c.key == 'i' && c.altKey)){
			document.getElementById('upload').click();
		}
		if(c.key == 'ArrowDown' && c.altKey){
			markAsRead();
		}
		if(c.key == 'ArrowUp' && (textBox.selectionStart == textBox.selectionEnd) && (textBox.selectionStart == 0)){
			var allMyMessages = document.getElementsByClassName(window.localStorage.getItem("username"));
			let negatives = 1;
			var lastMessage = allMyMessages[allMyMessages.length - 1];
			if (c.ctrlKey){
					lastMessage = document.getElementById(`${prompt('ID of message to edit: ')}`)
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
		//Auto typing
		if (textBox.value.length >= 2) {
			socket.emit("typing", window.localStorage.getItem("username"));
		}
	}
});

function formatCommands(msg){
	var newMsg = msg.trimEnd()
		.replace(/(?<!\*\*)(?<=\*)(?![*\s])(?:[^*]*[^*\s])?(?=\*)(?!\*\*)/g, "<i>$&</i>")
		.replace(/(?<=\*\*)(?![*\s])(?:[^*]*[^*\s])?(?=\*\*)/g, "<b>$&</b>")
		.replace(
			/(?<=\|\|)(?![|\s])(?:[^|]*[^|\s])?(?=\|\|)/g,
			"<spoiler>$&</spoiler>",
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
			`<style> .${window.localStorage.getItem("username")}::before{background-image:url('$&') !important;}</style>`
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