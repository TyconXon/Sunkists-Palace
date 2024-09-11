/* START Typing Sounds */
textBox.addEventListener('keyup', (c) => {
	let random = Math.ceil(Math.random()*6);
	let a = new Audio('sound/typin/k'+random+".mp3");
	a.volume = 0.3;
	a.play();
});

document.querySelectorAll('button,a,title,input,summary').forEach((button)=>{
	button.addEventListener('click', ()=>{
		if(Math.random() > 0.5){
			let a = new Audio('sound/typin/toggle.mp3')
			a.volume = 0.1;
			a.play();
		}else{
			let a = new Audio('sound/typin/toggle2.mp3')
			a.volume = 0.1;
			a.play();
		}
	});
	button.addEventListener('mouseenter', ()=>{
		if(Math.random() > 0.5){
			let a = new Audio('sound/typin/paper.mp3')
			a.volume = 0.1;
			a.play();
		}else{
			let a = new Audio('sound/typin/paper2.mp3')
			a.volume = 0.1;
			a.play();
		}
	});
});
/* END Typing Sounds */