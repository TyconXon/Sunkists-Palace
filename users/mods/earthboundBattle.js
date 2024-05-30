
/* START EarthBound Backgrounds */
var backing = document.createElement('iframe');
backing.id = "backgroundWebsite";
document.body.appendChild(backing);

const maxBG = 326;
let BG = [Math.ceil(Math.random()*maxBG), Math.ceil(Math.random()*maxBG)];
document.getElementById('backgroundWebsite').src = `https://www.gjtorikian.com/Earthbound-Battle-Backgrounds-JS/?layer1=${BG[0]}&layer2=${BG[1]}&fullscreen=true`;

window.addEventListener('keypress',(c)=>{if(c.key == '-'){
 BG[0] = Math.ceil(Math.random() * maxBG);
		BG[1] = Math.ceil(Math.random() * maxBG);

		document.getElementById('backgroundWebsite').src = `https://www.gjtorikian.com/Earthbound-Battle-Backgrounds-JS/?layer1=${BG[0]}&layer2=${BG[1]}&fullscreen=true`;}});

var divvidine = document.createElement('div');
divvidine.innerHTML = `<style nodraw>
	#backgroundWebsite {
		z-index: -1;
					top: -45%;
					left: 0;
		position: fixed;
		width: -webkit-fill-available;
		aspect-ratio: 1/1;
	}</style>`;
document.body.appendChild(divvidine);

/* END EarthBound Backgrounds */

