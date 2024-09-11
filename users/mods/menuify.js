/* START Menuify */

var menuCount = 2

function menuify() {
  document.documentElement.style.setProperty('--menuCount', menuCount);
  document.getElementById('settingGrid').style.gridTemplateColumns = `repeat(var(--menuCount), 1fr)`
}

/* END Menuify */