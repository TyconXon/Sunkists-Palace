const workshop = {
	clientCommands : [],
	onMessage : new Event("inmessage"),
	addSplash : function(text){
		splashText.push();
	}
}

//Example plugins:
//Client command methods
workshop.clientCommands.push((inputStr)=>{
	//Replaces all instances of "/dog" in input with "cat"
	return inputStr.replace(
		"/dog",
		'cat');
})

//Add Splash text
workshop.addSplash("Welcome. Welcome to City 17.");

//Listen for on message
document.addEventListener(workshop.onMessage, (e)=>{
	console.log(e.fullData + " " + e.message + " " + e.user);
});