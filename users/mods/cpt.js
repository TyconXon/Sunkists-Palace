/* START Custom Placeholder Text */

menuCount += 1
menuify()

const pTMenu = document.createElement('details');

pTMenu.innerHTML = `
	<summary>Placeholder Text</summary>
	<button onclick="addPT()">Add PT</button>
	<button onclick="randomPT()">Random PT</button>
	<button onclick="listPT()">List PTs</button>
	<button onclick="setENTIREPT()">Mass PTs</button>
	<button onclick="clearPT()">Clear ALL PTs</button>
	<div id="pTs"></div>
	<style nodraw>
	.placeholderItem {background: rgba(0,0,0,0.1)}
	</style>
`

var placeholders = JSON.parse(localStorage.getItem('placeholders')) || []
let list;

function addPT() {
	placeholders.push(prompt('Enter a custom placeholder text.'))
	document.getElementById('soapMode').placeholder = placeholders[placeholders.length - 1]
	localStorage.setItem('placeholders', JSON.stringify(placeholders))
	updateList()
}

function randomPT() {
	document.getElementById('soapMode').placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
}

function clearPT() {
	localStorage.removeItem('placeholders');
	placeholders = [];
	updateList()
	refreshSplash()
	alert('Cleared!')
}

function listPT() {
	alert(JSON.stringify(placeholders))
}

function setENTIREPT() {
	placeholders = JSON.parse(prompt('Enter PTs.'))
	document.getElementById('soapMode').placeholder = placeholders[placeholders.length - 1]
	localStorage.setItem('placeholders', JSON.stringify(placeholders))
	updateList()
}

function setPT(pt) {
	document.getElementById('soapMode').placeholder = placeholders[pt];
}

function removePT(pt) {
	placeholders.splice(pt, 1);
	localStorage.setItem('placeholders', JSON.stringify(placeholders))
	updateList()
}

function updateList() {
	list = "";
	for (let i = 0; i < placeholders.length; i++) {
		list += `<div class='placeholderItem'><p>${placeholders[i]}</p>  <button onclick='setPT(${i})'>Set to item</button><button onclick='removePT(${i})'>Remove item</button></div><br>`
	}
	document.getElementById('pTs').innerHTML = list
}

function refreshSplash() {
	document.getElementById('soapMode').placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
}

document.getElementById('settingGrid').appendChild(pTMenu)
updateList();
refreshSplash();

/* END Custom Placeholder Text */
