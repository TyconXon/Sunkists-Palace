var collapseRate = 1;
var _streak = 0;
var lastPerson = '';


function formatMessage(args) {
	let room = args["room"];
	let length = args["id"];
	let usr = args["usr"];
	let	phone = args["phone"];
	let message = args["message"];
	let curTimeString = args['time'].toLocaleString("en-US",{ timeZone: "US/Arizona" });
	let curTimeTimeString = args['time'].toLocaleTimeString("en-US",{ timeZone: "US/Arizona" });
	
	if(lastPerson == usr && _streak<=collapseRate && !phone){
		_streak++;
	}else{
		_streak = 0;
	}
	lastPerson = usr;
	
	let collapsed = (_streak>0)? true : false;

	
	return `<div id='${length}' class='message ${usr} ${collapsed ? 'collapsed' : ''} ${phone ? "phone" : ""
		} ${room != null ? 'room' : ''} ${room != null ? room : ''}'> <strong class='identifier' onClick='pingGen("${usr}")'> ${usr} ${room != null ? '#<room>' + room + '</room> ' : ''} @ <abbr noicon title='${curTimeString}'> ${curTimeTimeString}:</ins></strong> <msgtxt>${message}</msgtxt> <button class='rightist' onClick="maple(${length
		})">${length}</button> </div>`;
}

class Message{
	constructor(message, usr, room, id, phone){
		this.room = room ? room : null;
		this.usr = usr;
		this.phone = phone ? phone : false;
		this.message = message;
		this.id = id;
		this.time = new Date();
	}
}

function insertMessage(message) {
	let newDiv = document.createElement("message");
	// Set the HTML content of the new div
	newDiv.innerHTML = message;
	// Append the new div to the body
	let finalMsg = document.body.appendChild(newDiv);
}
/*
insertMessage(formatMessage({id: 1, room: null, usr: "Elsen", phone: false, message: "test", time:new Date()}))
insertMessage(formatMessage({id: 2, room: 'bbb', usr: "Elsen", phone: false, message: "apple", time:new Date()}))
insertMessage(formatMessage({id: 3, room: null, usr: "Elsen", phone: false, message: "sauce", time:new Date()}))
insertMessage(formatMessage({id: 4, room: null, usr: "Elsen", phone: true, message: "sauced", time:new Date()}))
insertMessage(formatMessage({id: 5, room: null, usr: "Elsen", phone: false, message: "saucedd", time:new Date()}))
insertMessage(formatMessage({id: 6, room: 'jjj', usr: "Elsen", phone: false, message: "sauceddd", time:new Date()}))
insertMessage(formatMessage({id: 7, room: null, usr: "Guest", phone: false, message: "apple", time:new Date()}))
insertMessage(formatMessage({id: 8, room: null, usr: "Guest", phone: true, message: "dog", time:new Date()}))
insertMessage(formatMessage({id: 9, room: null, usr: "Elsen", phone: false, message: "sauce", time:new Date()}))



*/