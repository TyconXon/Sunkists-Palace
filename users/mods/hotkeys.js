/* START HotKeys */

if(window.localStorage.getItem('MaximusMiller2.HotKeys.read') == null){
	alert('(You will only see this once)')
	alert('Hello! Thank you for using HotKeys! Use Shift+Alt+Tilde to open the menu, or use the settings dropdown!')
	window.localStorage.setItem('MaximusMiller2.HotKeys.read', true);
}

try{
const hotkeysMenu = document.createElement('div');
hotkeysMenu.id = 'hotkeysMenu';
hotkeysMenu.setAttribute('popover', 'auto');
hotkeysMenu.innerHTML = "GUI settings page is a work in progress. Use Ctrl+Shift+[0 to 9] to save the current textbox while it's not empty, and while it's empty, use the same shortcut to load.";
	
document.body.append(hotkeysMenu);


document.addEventListener(('keydown'), (c)=>{
	if(c.ctrlKey && c.key == '~'){
		document.getElementById('hotkeysMenu').showPopover();
	}
	if(c.ctrlKey && c.code.startsWith('Digit')){
		if(textBox.value == ''){
			textBox.value = window.localStorage.getItem('MaximusMiller2.HotKeys.'+c.code);
		}else if(confirm("Save current text to "+c.code + "?")){
			window.localStorage.setItem('MaximusMiller2.HotKeys.'+c.code, textBox.value);
			alert("Saved!");
		}
	}
});
}catch(error){
	alert(error);
}

/* END HotKeys */