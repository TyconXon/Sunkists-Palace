/* START Cookie. */

menuCount += 1
menuify()

cookieCount = Number(localStorage.getItem('cookies')) || 0

const cookieMenu = document.createElement('details')

cookieMenu.innerHTML = `
  <summary id="cookieTitle">Cookies ${cookieCount}</summary>
  <img id="cookie" src="users/mods/cookie.webp" onclick="cookieFunction()"></img>

   <style nodraw>
      #cookie {transition: all 0.1s cubic-bezier(.17,1.02,.61,1.31);filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.75));}
      #cookie:hover {scale: 1.1;}
      #cookie:active {scale: 0.9;}
   </style>
`

function cookieFunction() {
   cookieCount += 1
   document.getElementById('cookieTitle').innerText = "Cookies " + cookieCount
   localStorage.setItem('cookies', cookieCount);
}


document.getElementById('settingGrid').appendChild(cookieMenu)

/* END Cookie. */