/* START Reactive Text */
textBox.addEventListener('keyup', (c) => {
	let text = textBox.value;
	if (text.startsWith('/')) {
		textBox.style.color = 'green';
		textBox.style.backgroundColor = 'black';
		if(text.startsWith('/edit')){
			textBox.style.color = 'orange';
			textBox.style.backgroundColor = 'gray';
		}
	} else if (text.startsWith('<style')){
		textBox.style.color = 'blue';
		textBox.style.backgroundColor = 'gray';
	} else {
		textBox.style.color = 'unset'; //Edit me!
		textBox.style.backgroundColor = 'unset'; //Edit me!
	}
});
/* END Reactive Text */