//bomb, pike, bow, axe, sword, d, trap
//7, 2, 3, 2, 2, 1, 1 (distribution)
const pieceID = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
const pieceStrength = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6];

const bombAndSeekGame = new BombAndSeekGame();
bombAndSeekGame.start();

function CheckTeam(pieceID) {
    if (pieceID < 18) {
        return 0;
    } else {
        return 1;
    }
}

function BombAndSeekGame() {
	const board = new Board();
	const player1 = new Player1();
	const player2 = new Player2();
	let turn = 0;

	this.start = function () {
	    var initialBoard = shuffle(pieceID);
	    for (i = 0; i < 36; i++) {
	        //note: CURRENTLY USING TEXT OF THE DIV TO PLACE & IDENTIFY PIECES
	        let piece = initialBoard[i];
	        let square = board.positions[i];
	        square.innerText = piece.toString();
            if (piece < 18) {
                square.style.backgroundColor = 'lightblue';
            } else {
                square.style.backgroundColor = 'lightyellow';
            }
            
	    }
	}
}


function Board() {
	this.positions = Array.from(document.querySelectorAll('.col'));
	//console.log(this.positions);
}


function Player1() {
}


function Player2() {
}


function Piece() {

}


//Stuff I copied from ppl
function shuffle(array) {
    //This shuffles the input array using the Knuth Shuffle
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
