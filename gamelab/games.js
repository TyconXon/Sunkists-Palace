games = {
    'sunkistSavior' : {
        'id' : 'sunkistSavior',
        'name' : 'Sunkist Savior',
        'banner' : '../images/2Sunkist.png',
        'font' : 'Bound' 
    },
    'game2' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game3' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game4' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game5' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game6' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game7' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game8' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game9' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game10' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game11' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    },
    'game12' : {
        'id' : '',
        'name' : 'No Game',
        'banner' : '',
        'font' : '' 
    }
    // GAME COUNT IS CAPPED AT 12
    // DO NOT ADD ANY PAST THIS POINT UNTIL THIS LIMITATION IS REVISED
}






Object.values(games).forEach((game, index) => {
    if (index < 12) {
    setTimeout(() => {
        render(game);
    }, (index + 1) * 125);
    }
});

function render(game) {    
    var newGame = document.createElement("div");
    newGame.classList.add("gameContainer");
    newGame.style.background = `url(${game.banner}) center`
    newGame.style.backgroundSize = `cover`
    newGame.innerHTML = `
        <a href="gamepages/${game.id}/game.html">
            <p style="font-family: ${game.font}">${game.name}</p>
        </a>
        `;


    newGame.id = game.id
    document.querySelector('games').appendChild(newGame);
}