/*global console*/


// Main Menu Buttons
var xButtonMenu = document.getElementById('xs');
var yButtonMenu = document.getElementById('ys');

var gameData = {
  moveCount: 0,
  turn: "x",
  grid: [[0,1,2],
         [3,4,5],
         [6,7,8]],
  state: 'menu',
  winningPosition: "",
  player: ''
};

function checkWin() {
  // check for row win
  for(let y = 0; y < 3; y++){
    if(gameData.grid[y][0] === gameData.grid[y][1] &&
       gameData.grid[y][1] === gameData.grid[y][2]){
      console.log(gameData.grid[y][0] + " Wins!")
    }
  }
  // check for horizontal win
  for(let x = 0; x < 3; x++){
    if(gameData.grid[0][x] === gameData.grid[1][x] &&
       gameData.grid[1][x] === gameData.grid[2][x]){
      console.log(gameData.grid[0][x] + " Wins!")
    }
  }
  // check for diag win
  if(gameData.grid[0][0] === gameData.grid[1][1] &&
       gameData.grid[1][1] === gameData.grid[2][2]){
      console.log(gameData.grid[1][1] + " Wins!")
  } else if(gameData.grid[0][2] === gameData.grid[1][1] &&
       gameData.grid[1][1] === gameData.grid[2][0]){
      console.log(gameData.grid[1][1] + " Wins!")
  }
}

function init() {
  gameData.moveCount = 0;
  gameData.turn = 'x';
  gameData.grid = [[0,1,2],
                   [3,4,5],
                   [6,7,8]];
  gameData.state = 'menu';
  winningPosition = '';
  gameData.player = 'x';
}

// Menu Visual random bouncy/color characters
var menuTitle = document.getElementById('menuTitle');
var tempTitle = "";
for(let x in menuTitle.textContent){
  var rnd =  Math.floor(Math.random() * (2 - 0 +  1));
  var rndBounce =  Math.floor(Math.random() * (11 - 5) + 5) / 10;
  if(rnd === 0){
    tempTitle += "<span style='color: orange; animation-duration: " + rndBounce + "s'>" + menuTitle.textContent[x] + "</span>";
  } else if (rnd === 1) {
    tempTitle += "<span style='color: silver; animation-duration: " + rndBounce + "s'>" + menuTitle.textContent[x] + "</span>";
  } else {
    tempTitle += "<span style='color: turquoise; animation-duration: " + rndBounce + "s'>" + menuTitle.textContent[x] + "</span>";
  }
}
menuTitle.innerHTML = tempTitle;




init();



