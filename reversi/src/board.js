// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = new Array(8);
  for (let i = 0; i < 8; i++) grid[i] = new Array(8);
  
  grid[3][3] = new Piece('white');
  grid[4][4] = new Piece('white');
  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black');
  
  return grid; 
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (x < 0 || x > 8) return false;
  if (y < 0 || y > 8) return false;

  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)){
    throw new Error('Not valid pos!');
  } 
  else{
    return this.grid[parseInt(pos[0])][parseInt(pos[1])];
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos)
  return piece && (piece.color === color);
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {

  return (this.getPiece(pos)) ? true : false;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){

  if (!piecesToFlip){
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos);
  };

  let dirx = dir[0];
  let diry = dir[1];
  let x = pos[0];
  let y = pos[1];
  let newPosition = [x + dirx, y + diry];

  if (!this.isValidPos(newPosition)){
    return [];
  } else if (!this.isOccupied(newPosition)){
    return [];
  } else if (this.isMine(newPosition, color)){
    return piecesToFlip.length === 0  ? [] : piecesToFlip;
  } else {
    return this._positionsToFlip(newPosition, color, dir, piecesToFlip)
  };
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  let dir = [];
  for (let i = 0; i < Board.DIRS.length; i++){
    let newPosition = [Board.DIRS[i][0] + pos[0], Board.DIRS[i][1] + pos[1]];
    if (this.isValidPos(newPosition) && !this.isMine(newPosition) && this.isOccupied(newPosition)){
      dir.push(Board.DIRS[i]);
    }; 
  };
  for (let j = 0; j < dir.length; j++){
    let arr = this._positionsToFlip(pos, color, dir[j], []);
    if (arr.length > 1) return true;
  };
  return false;
}; 

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)){
    throw new Error('Invalid move!');
  } else{
    this.grid[pos[0]][pos[1]] = new Piece(color);
    for (let i of Board.DIRS){
      let arr = this._positionsToFlip(pos, color, i, []);
      if (arr.length > 1){
        for (let j of arr){
          let x = j[0];
          let y = j[1];
          let flipme = [x, y];
          if (!this.isMine(flipme, color)) this.grid[x][y].flip();
        };
      };
    };
  };
}; 

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function(color){
//   let moves = [];
//   for (let i = 0; i < 8; i++){
//     for (let j = 0; j < 8; j++){
//       let pos = [i, j];
//       if (this.validMove(pos, color)){
//         moves.push(pos);
//       }
//     }
//   }
//   return moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let i of this.grid){
    console.log(i);
  };
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE