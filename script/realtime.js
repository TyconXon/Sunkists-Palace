const socket = io(); //Socket to server

socket.on('realtime.letter', (data) =>{
	if(data.length == 1){
		document.body.innerHTML += data;
	}else{
		if(data == 'Backspace'){
			document.body.innerHTML = document.body.innerHTML.slice(0, -1);
		}
		if(data == 'Enter'){
			document.body.innerHTML += '<br>';
		}
	}
	
});

socket.on("realtime.message", (message) => {
	document.body.innerHTML += message;
});

var memory = '';

addEventListener('keydown', (e) =>{
	if(e.altKey){
		e.preventDefault();
		if(e.key == 'Backspace'){
			memory = memory.slice(0, -1);
			document.body.innerHTML = document.body.innerHTML.slice(0, -1);

		}else if(e.key == 'Enter'){
			memory += '<br>';
			document.body.innerHTML += '<br>';

		}else if(e.key == 'Alt' || e.key == 'Shift'){
			
		}else{
			memory += e.key;
			document.body.innerHTML +=  e.key;

		}
	}else{
		socket.emit('realtime.letter', e.key);
		if(memory.length > 0){
			socket.emit('realtime.message', memory);
			memory = '';
		}
	}
});


document.body.style.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
document.body.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
