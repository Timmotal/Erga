document.addEventListener('DOMContentLoaded', () => { 
    
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d"); // the canvas context
// mini -grid
const cvsMini = document.getElementById("miniGrid");
const ctxMini = cvsMini.getContext("2d"); // the mini canvas context
const ROWmini = 4;
const COLmini = COLUMNmini = 4;

const scoreElement = document.getElementById('score');

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE"; //color of an empty space

// start and pause button
const btn = document.getElementById('btn')


 
//-----------------------------------------------------------------

// draw a  square to main board
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

        ctx.strokeStyle = "BLACK";
        ctx.strokeRect(x*SQ, y*SQ, SQ, SQ); 
    }

    // draw a  square to mini board
    function drawMiniSquare(x, y, color) {
        ctxMini.fillStyle = color;
        ctxMini.fillRect(x*SQ, y*SQ, SQ, SQ);

        ctxMini.strokeStyle = "BLACK";
        ctxMini.strokeRect(x*SQ, y*SQ, SQ, SQ); 
    }

    function clearMiniBoard() {
        ctxMini.clearRect(0, 0, SQ*COLmini, SQ*ROWmini);
    }

    //  drawMiniSquare(4, 4, VACANT) // x is the margin-left and y is the margin-top

    // create the Main Board 
    let board = []
    for(let r = 0; r < ROW; r++) {
        board[r] = [];
        for(let c = 0; c < COL; c++) {
            board[r] [c] =  VACANT;
        }
    }

// draw the board
function drawBoard() {
    for(let r = 0; r < ROW; r++) {
        for(let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r] [c]);
        }
    }
}


// mini grid canvas
// draw the mini board
// function drawMiniBoard() {
//     const nextTetromino = nextPiece.tetromino[0];
//     for(let rm = 0; rm < nextTetromino.length; rm++) {
//         for(let cm = 0; cm < nextTetromino[rm].length; cm++) {
//             if (nextTetromino[rm][cm]) {
//                 drawMiniSquare(cm, rm, nextPiece.colour);
//             }
//         }
//     }
// }


//the pieces and their colours

const PIECES = [  
    [Z,"red"],
    [S,"green"], 
    [T,"yellow"],  // there is a bug with this tetromino
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// nextRandom to show in Mini Grid
function nextRandomPiece() {
    //  here i want to generate the next Tetromino and then pass it to the randomPiece()   
}

// generate random pieces

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) // from array 0 to  array 6
    return new Piece( PIECES[r][0], PIECES[r][1]); // question is how are we giving colours to the terotrominoes?
}

// The Object Piece

class Piece {
    constructor(tetromino, colour) {
        this.tetromino = tetromino;
        this.colour = colour;

        this.tetrominoN = 0; // we start from the first pattern
        this.activeTetromino = this.tetromino[this.tetrominoN]; //this is like saying: Z[0], 
        //                     (this.tetromino) 

        // we need to control the pieces
        this.x = 0;
        this.y = 0; 
    }


    // fill function
    fill(colour) {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if( this.activeTetromino[r] [c]) { //
                    drawSquare(this.x + c, this.y + r, colour)
                }
            }
        }
    }

// draw mini square grid
    fillMini() {
        clearMiniBoard();
        const tetromino = this.tetromino[0]; // [[0, 1, 0], [1, 1, 1], [0, 0, 0]]
        for(let rm = 0; rm < tetromino.length; rm++) {
            for(let cm = 0; cm < tetromino[rm].length; cm++) {
                if (tetromino[rm][cm]) {
                    drawMiniSquare(cm, rm, this.colour);
                }
            }
        }
    } 
// 


// DRAW A PIECE TO THE BOARD
//  draw() {
//     for( r = 0; r < this.activeTetromino.length; r++) {
//         for( c = 0; c < this.activeTetromino.length; c++) {
//             // we draw only occupied squares
//             if( this.activeTetromino[r] [c]) {
//                 drawSquare(this.x + c, this.y + r, this.colour)
//             }
//         }
//     }
// }

// we refactored all of the above from line 100 to this
// DRAW A PIECE TO THE BOARD
    draw() {
        this.fill(this.colour); 
        // this.fillMini(this.colour); // took you long enough
    }
// end 

// p.draw();


// undraw a piece
//  unDraw() {
//     for( r = 0; r < this.activeTetromino.length; r++) {
//         for( c = 0; c < this.activeTetromino.length; c++) {
//             // we draw only occupied squares
//             if( this.activeTetromino[r] [c]) {
//                 drawSquare(this.x + c, this.y + r, VACANT)
//             }
//         }
//     }
// }
// we refactored all of the above from line 122 to this
// undraw a piece
    unDraw() {
        this.fill(VACANT);
    //    this.fillMini(VACANT);
    }


// MOVE DOWN THE PIECE
    moveDown() {
        if(!this.collision(0, 1, this.activeTetromino)) { 
        this.unDraw();
        this.y++;
        this.draw();
        }else {
            // we lock the piece and generate a new piece 
            this.lock(); // this is where the magic happens when there is a collison, lock the colours to the squares, no more undrawing
            p = nextPiece;
            nextPiece = randomPiece();
            nextPiece.fillMini();
        }
        
    }

// MOVE TO THE RIGHT THE PIECE
    moveRight() {
        if(!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

// MOVE TO THE LEFT THE PIECE
    moveLeft() {
        if(!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }


// MOVE THE PIECE TO ROTATE
    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]; // this makes it rotate from 0 - 3
        let kick = 0; 

        if(this.collision(0, 0, nextPattern)) {
            if(this.x > COL/2) { 
                // it's the right wall
                kick = -1; // we need to move the piece to the left
            }else{
                //it's the left wall
                kick = 2; // we need to move the piece to the right
            } // i added 2 , its not even doing  that bad
        }
            
        if(!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0 + 1) % 4 => 1
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

    lock() {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                // we skip the vacant squares
                if( !this.activeTetromino[r] [c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if(this.y + r < 0) { // 
                    alert("Game Over");
                    // stop request animation frame
                    gameOver = true;
                    document.removeEventListener("keydown", CONTROL);
                    break; // break from the loop
                }
                // we lock the piece
                // once there is a collision it looks this colour to the current item in the array
                board[this.y+r][this.x+c] = this.colour;
            }
        }
        //  remove full rows
        for(let r = 0; r < ROW; r++) {
            let isRowFull = true; // is the ROW in existence
            for(let c = 0; c < COL; c++) {
                isRowFull = isRowFull && (board[r][c] != VACANT); // here we are checking each column of a row, one by one
            }
            // this is the one checking if the ROW is FUll and then we eliminate if the ROW is full
            if( isRowFull) { 
                for( y = r; y > 0; y--) {//MY QUESTION, why does "y" be grater than 1 when a full row is simply equal to index 0
                    for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c]; // this assigns the row below to a ROW above, actually we are assigning a full column, this makes it aapear as though we are moving it downwards and when this get to the first collumns of the first ROW, what will happen? check line 173 for your answer 
                    }
                }
                // the top row board[0][...] has no row above it
            for(let c = 0; c < COL; c++) {
                board[0][c] = VACANT; // so we create it again
            }
            // increment the score
            score += 10;
            }
        }
        // update the board
        drawBoard();
        
        // update the score
        scoreElement.innerHTML = score
    }

// collision function
    collision(x, y, piece) {
        for(let r = 0; r < piece.length; r++) {
            for(let c = 0; c < piece.length; c++) {
                // if the square is empty, we skip it i.e if square is not occupied
                if(!piece[r][c]) {
                    continue;
                }
                //  coordinates of the piece after movement
                let newX = this.x +  c + x;
                let newY = this.y +  r + y;

                // conditions
                // if all these coditions are true return true
                // true will impy that a boundary has been breached
                if(newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                if(newY < 0){ // the game would crash, because of the initial position we set to "-2 " we have to bypass it
                    continue;
                }
                // check if there is a locked piece already in place
                if ( board[newY][newX] != VACANT ) {
                    return true;
                }
                
            }
        }
    }
}

let score = 0
// lock function
let nextPiece = randomPiece();
let p = randomPiece();

drawBoard();
nextPiece.fillMini();
// drawMiniBoard();

// CONTROL THE PIECE
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if(event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    }
    if(event.keyCode == 38) {
        p.rotate();
    } 
    if(event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    }
    else if(event.keyCode == 40) {
        p.moveDown();
    }
}

// drop the piece every 1 sec
let dropStart = Date.now();

function drop() {
    let now = Date.now(); 
    let delta = now - dropStart;
    let gameOver = false; 
    if(delta > 1000) {
        p.moveDown();
        dropStart = Date.now(); 
    }
    if( !gameOver) {
        requestAnimationFrame(drop);
    } 
}

drop();





}); // end of DOMContentLoaded
