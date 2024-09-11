/* START More Customization */

menuCount += 1
menuify()

const myMenu = document.createElement('details')

myMenu.innerHTML = `
  <summary>Personalization</summary>
  <div id="personalization">
   <div>
    <label for="chatboxCheck">Custom Chatbox</label>
    <input type="checkbox" id="chatboxCheck" onclick="uCustom()"><hr>
    <label for="bgColor" id="bgColorText">Background Color</label>
    <input type="color" id="bgColor" value="#000000" disabled oninput="uCustom()"><br>
    <label for="bgTrans">Background Transparency</label>
    <input type="range" id="bgTrans" min="0" max="4" value="4" disabled oninput="uCustom()"><br>
   </div>
   <div>

    <label for="favoriteCheck">Remove Favorites</label>
    <input type="checkbox" id="favoriteCheck" onclick="uCustom()">
   </div>
  </div>

  <style nodraw> 
   #personalization div:nth-child(odd) {
    background: rgba(0,0,0,0.2)!important;
    padding: 5px;
    margin-bottom:10px;
   }
#personalization div:nth-child(even) {
    background: rgba(255,255,255,0.2)!important;
    padding: 5px;
    margin-bottom:10px;
   }
  </style>
`

function uCustom() {

  var trans = 'FF'
  if (document.getElementById('chatboxCheck').checked) {
    document.getElementById('bgColor').disabled = false
    document.getElementById('bgTrans').disabled = false

    if (document.getElementById('bgTrans').value == 0) {
      trans = '00'
    }
    else if (document.getElementById('bgTrans').value == 1) {
      trans = '42'
    }
    else if (document.getElementById('bgTrans').value == 2) {
      trans = '7F'
    }
    else if (document.getElementById('bgTrans').value == 3) {
      trans = 'BF'
    }
    else if (document.getElementById('bgTrans').value == 4) {
      trans = 'FF'
    }
    document.getElementById('soapMode').style.background = document.getElementById('bgColor').value + trans
    document.getElementById('bgColorText').innerText = "Background Color: " + document.getElementById('bgColor').value + trans
  }
  else {
    document.getElementById('bgColor').disabled = true
    document.getElementById('bgTrans').disabled = true
  }
}

document.getElementById('settingGrid').appendChild(myMenu)

/* END More Customization */