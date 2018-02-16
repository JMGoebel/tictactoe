let game = {
  playerToken: '',
  aiToken: '',
  turn: 'x',
  openMoves: [0,1,2,3,4,5,6,7,8],
  grid: [[0,1,2], [3,4,5], [6,7,8]],
};

// Get Elements
let menu = $('#menu');
let choice = $('.pieceChoice');
let whosTurn = $('#whosTurn');
let gameBoard = $('#gameBoard');
let cell = $('.cell');

// Set menu choice event listener
choice.on( 'click', function () {
  reset();
  game.playerToken = this.innerText.toLowerCase();
  game.playerToken === 'x' ? game.aiToken = 'o' : game.aiToken = 'x';
  menu.hide();
  gameBoard.show();

  game.turn === game.aiToken ? changeTurn(true) : null;
});

function reset () {
  game.player =  '';
  game.aiToken = '';
  game.turn = 'x';
  game.openMoves = [0,1,2,3,4,5,6,7,8];
  game.grid = [[0,1,2], [3,4,5], [6,7,8]];

  // clear grid cells
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerHTML = '';
  });

  cell.on('click', e => {
    if ( game.turn === game.playerToken ){
      isLegal(e.target.id) ? markCell(e.target) : null;
      checkWin() ? win(game.playerToken) : changeTurn();
    }
  })

  menu.show();
  gameBoard.hide();
}

function isLegal(position) {
  position = parseInt(position);
  return game.openMoves.indexOf(position) >= 0 ? true : false;
}

function markCell(cell) {
  // remove listener
  $( cell ).off('click')

  // remove from possible moves;
  let thisId = parseInt(cell.id);
  let openMoveIndex = game.openMoves.indexOf(thisId);
  game.openMoves.splice(openMoveIndex, 1);

  // mark on grid
  let position = convertToGrid(thisId);
  game.grid[position[0]][position[1]] = game.turn;

  // Set color of peice
  game.turn === 'x' ? $( cell ).css('color', 'turquoise') : $( cell ).css('color', 'orange');
  let el = $( '<span></span>').text(game.turn);
  $( cell ).append(el);
}

function changeTurn(first) {
  if (!first) {
    game.turn === 'x' ? game.turn = 'o' : game.turn = 'x';
  }
  game.turn === game.aiToken ? aiMove() : null;
  game.turn === game.playerToken ? whosTurn.css('color', 'turquoise') : whosTurn.css('color', 'orange');
  game.turn === game.playerToken ? whosTurn.text('player') : whosTurn.text('AI')
}

function aiMove() {
  setTimeout(function () {
    let move = rand(0, game.openMoves.length -1 );
    let index = game.openMoves[move]
    markCell(cell[index]);
    checkWin() ? win(game.aiToken) : changeTurn();
  }, 1000);
}

function rand(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function checkWin() {
  // check for row win
  for(let y = 0; y < 3; y++){
    if(game.grid[y][0] === game.grid[y][1] &&
       game.grid[y][1] === game.grid[y][2]){
      return true;
    }
  }
  // check for horizontal win
  for(let x = 0; x < 3; x++){
    if(game.grid[0][x] === game.grid[1][x] &&
      game.grid[1][x] === game.grid[2][x]){
        return true;
    }
  }
  // check for diag win
  if(game.grid[0][0] === game.grid[1][1] &&
    game.grid[1][1] === game.grid[2][2]){
      return true;
  } else if(game.grid[0][2] === game.grid[1][1] &&
    game.grid[1][1] === game.grid[2][0]){
      return true;
  }
  return false;
}

function win(token) {
  setTimeout(function () {
    let who = game.playerToken === token ? "You" : "AI";
    who === 'You' ? alert('Congradulations!!!\nYou Won!') : alert('Oh drats!\nYou have been defeated!');
    reset();
  }, 500);

}
