/*global console*/
/*
  Written By: Jason M. Goebel
  Questions/Comments: goebel.jason@gmail.com

  NOTE: I chose to not use jQuery on this project to get a better understanding of pure JavaScript.
*/

/* --- HELPER FUNCTIONS --- */
function el(element) {
  if(element[0] === '#') {                            // is it an id?
    return document.getElementById(element.slice(1));
  } else if (element[0] === '.') {                    // is it a class?
    return document.getElementsByClassName(element.slice(1));
  } else {                                            // '... and nothing else matters' ~ Metallica
    return errorDisplay("el(element)", "Invalid value for 'element'.  Use '#' to get an ID or '.' to get a class");
  }
}

function errorDisplay (func, msg) {
  console.error("FUNCTION: " + func + '\nMESSAGE: ' + msg);
}

// Decided to extentend the DOM. Good Idea?
Element.prototype.evnt = function(type, callback){
  this.addEventListener(type, callback);
}

HTMLCollection.prototype.evnt = function(type, callback){
  for(let x = 0; x < this.length; x++){
    this[x].addEventListener(type, callback);
  }
}

Element.prototype.removeEvnt = function(type, callback){
  this.removeEventListener(type, callback);
}

HTMLCollection.prototype.removeEvnt = function(type, callback){
  for(let x = 0; x < this.length; x++){
    this[x].removeEventListener(type, callback);
  }
}

function rand(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// -END- helper functions

var whosTurn = 'X';

/* --- Main Menu --- */
var menu = el('#menu'),
    choice = el('.pieceChoice'),
    whosTurn = el('#whosTurn');

choice.evnt('click',gameStart);
// -END- Main Menu


/* --- Game Start --- */
var gameBoard = el('#gameBoard'),
    cell = el('.cell');

function gameStart () {
  // assign players piece
  gameData.player = this.textContent.toLowerCase();


  // clear the menu screen and display the game screen
  menu.style.display = 'none';
  gameBoard.style.display = 'block';

  setTurn();
}
// -END- Game Start


function setTurn () {

  if (gameData.turn === 'x'){
    whosTurn.style.color = 'turquoise';
  } else {
    whosTurn.style.color = 'orange';
  }

  // add eventlistener to cell if it is the players turn else remove it.
  if (gameData.turn === gameData.player ) {
    cell.evnt('click', addMark);
    whosTurn.textContent = "player"
  } else {
    cell.removeEvnt('click', addMark);
    //call computer 'ai'
    whosTurn.textContent = "AI"
    setTimeout(computerTurn, 1000);
  }
}

function computerTurn() {
  // place randomly for first two moves
  let placed = false;

  if(gameData.moveCount <= 2){
    // test if cell is empty
    while(!placed){
      let rnd = rand(0,8);
      if(cell[rnd].textContent === ''){
        cell.evnt('click', addMark);
        placed = true;
        cell[rnd].click();
      }
    }
  } else {
    // get a bit smarter.
    // step 1: Search for options and put them in an array
    let options = [];
    let pos = [];
    for(let x = 0; x <= 8; x++){
      pos = convertToGrid(x);
      if(gameData.grid[pos[0]][pos[1]] !== 'x' && gameData.grid[pos[0]][pos[1]] !== 'o'){
        options.push(x);
      }
    }
    console.log(options);
    // step 2: test to find a win
    console.log('STEP 2');
    for(let x = 0; x < options.length; x++){
      pos = convertToGrid(options[x]);
      gameData.grid[pos[0]][pos[1]] = gameData.turn;

      let win = checkWin();
      console.log(win);
      if(win === true){
        console.log("Winning move found");
        cell.evnt('click', addMark);
        cell[options[x]].click();
        cell.removeEvnt('click', addMark);
        break;
      } else {
        gameData.grid[pos[0]][pos[1]] = options[x];
      }
    }
    // step 3: test to find a block
    console.log('STEP 3');
    var opTurn;
    if(gameData.turn === 'x'){
      opTurn = '0';
    } else {
      opTurn = 'x';
    }
    for(let x = 0; x < options.length; x++){
      pos = convertToGrid(options[x]);
      gameData.grid[pos[0]][pos[1]] = opTurn;

      let win = checkWin();
      console.log(win);
      if(win === true){
        console.log("blocking move found");
        console.log('test');
        cell.evnt('click', addMark);
        cell[options[x]].click();
        cell.removeEvnt('click', addMark);
        break;
      } else {
        gameData.grid[pos[0]][pos[1]] = options[x];
      }
      // step 4: Make a random move (perhaps optimised move)
      console.log('STEP 4');
      rnd = rand(0,options.length);
      cell.evnt('click', addMark);
      cell[options[rnd]].click();
    }
  }
}

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

function convertToGrid(num){
  var a,b;
  if(num < 3){
    a = 0;
  } else if(num < 6) {
    a = 1;
  } else {
    a = 2;
  }
  b = num - (a*3);
  return([a, b]);
}

function addMark() {

  if(this.textContent !== ''){
    return;
  } else {
     // increment game turn
    gameData.moveCount += 1;

    let gridPos = convertToGrid(this.id);
    gameData.grid[gridPos[0]][gridPos[1]] = gameData.turn;

    if (gameData.turn === 'x'){
      this.style.color = 'turquoise';
    } else {
      this.style.color = 'orange';
    }

    this.innerHTML = "<span>" + gameData.turn + "</span>"

    if (gameData.turn === 'x'){
      gameData.turn = 'o';
    } else {
      gameData.turn = 'x';
    }

    checkWin();
    setTurn();
  }
}

function checkWin() {
  // check for row win
  for(let y = 0; y < 3; y++){
    if(gameData.grid[y][0] === gameData.grid[y][1] &&
       gameData.grid[y][1] === gameData.grid[y][2]){
      console.log(gameData.grid[y][0] + " Wins!")
      return true;
    }
  }
  // check for horizontal win
  for(let x = 0; x < 3; x++){
    if(gameData.grid[0][x] === gameData.grid[1][x] &&
       gameData.grid[1][x] === gameData.grid[2][x]){
      console.log(gameData.grid[0][x] + " Wins!")
      return true;
    }
  }
  // check for diag win
  if(gameData.grid[0][0] === gameData.grid[1][1] &&
       gameData.grid[1][1] === gameData.grid[2][2]){
      console.log(gameData.grid[1][1] + " Wins!")
      return true;
  } else if(gameData.grid[0][2] === gameData.grid[1][1] &&
       gameData.grid[1][1] === gameData.grid[2][0]){
      console.log(gameData.grid[1][1] + " Wins!")
      return true;
  }
  return false;
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