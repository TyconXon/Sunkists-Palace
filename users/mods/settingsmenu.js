/* START Settings Menu */
document.getElementById('settingGrid').setAttribute('popover', 'auto');
var xButton = document.createElement('button');
	xButton.innerText = 'Settings';
	xButton.setAttribute('popovertarget', 'settingGrid');
	xButton.id = "settingsButton";
document.getElementById('menu').appendChild(xButton);

if(!window.localStorage.getItem('style').includes("START Settings Menu")){

	window.localStorage.setItem('style', window.localStorage.getItem('style') + ' ' + `/* START Settings Menu */ #settingButton{
	 width: 100%;
	 margin: 0px;
	 background: black;
	 color: white;
	}
	#settingGrid{
	 background-color: rgba(50,50,50,0.5);
	 backdrop-filter: blur(3px);
	} 
	/* END Settings Menu */` );
}

/* END Settings Menu */

