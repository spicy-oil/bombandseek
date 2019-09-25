//bomb, pike, bow, axe, sword, d, trap
//7, 2, 3, 2, 2, 1, 1 (distribution)
const pieceID = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
const pieceStrength = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5];
const one = 1
const zero = 0
const teamColors = ['coral', 'lightblue']
//Board is
//  0  1  2  3  4  5
//  6  7  8  9 10 11
// 12 13 14 15 16 17
// 18 19 20 21 22 23
// 24 25 26 27 28 29
// 30 31 32 33 34 35
// so for every position the adjacent positions are:
const adjPositions = [
                        [1, 6],         [0, 2, 7],          [1, 3, 8],          [2, 4, 9],          [3, 5, 10],         [4, 11],
                        [0, 7, 12],     [1, 6, 8, 13],      [2, 7, 9, 14],      [3, 8, 10, 15],     [4, 9, 11, 16],     [5, 10, 17],
                        [6, 13, 18],    [7, 12, 14, 19],    [8, 13, 15, 20],    [9, 14, 16, 21],    [10, 15, 17, 22],   [11, 16, 23],
                        [12, 19, 24],   [13, 18, 20, 25],   [14, 19, 21, 26],   [15, 20, 22, 27],   [16, 21, 23, 28],   [17, 22, 29],
                        [18, 25, 30],   [19, 24, 26, 31],   [20, 25, 27, 32],   [21, 26, 28, 33],   [22, 27, 29, 34],   [23, 28, 35],
                        [24, 31],       [25, 30, 32],       [26, 31, 33],       [27, 32, 34],       [28, 33, 35],       [29, 34]
                    ]

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
    this.board = new Board();
    const dragonHP = 2;
    this.dragon1HP = dragonHP;
    this.dragon2HP = dragonHP;
    const player1 = new Player(this.board);
    const player2 = new Player(this.board);
    let turn = 0;

    this.start = function () {
        var initialBoard = shuffle(pieceID);
        for (i = 0; i < 36; i++) {
            //note: CURRENTLY USING TEXT OF THE DIV TO PLACE & IDENTIFY PIECES
            let pieceID = initialBoard[i];
            let square = this.board.positions[i];
            square.innerText = pieceStrength[pieceID].toString(); //Display the pieceID of each piece at the beginning
            square.dataset.pieceid = pieceID.toString() //Changing attribute of the "square" html element to be the shuffled pieces
            square.dataset.team = CheckTeam(pieceID).toString();
            square.dataset.position = i.toString();
        }
        this.board.turnCounter.innerText = 'Turn number: 1';
        this.board.playerTurn.innerText = 'Player 1';
        this.board.playerHP.innerText = this.HPString();

        this.takeTurn();
    }

    this.HPString = function () {
        return 'Player 1 HP: ' + this.dragon1HP.toString() + ' \nPlayer 2 HP: ' + this.dragon2HP.toString();
    }

    this.takeTurn = function() {
        if (turn > 0) {
            if (turn % 2 == 0) {
                console.log("Player 1's turn!");
                this.board.playerTurn.innerText = "Player 1's turn";
                this.board.playerTurn.style.color = teamColors[player1.team];
                player1.takeTurn();
            } else {
                console.log("Player 2's turn!");
                this.board.playerTurn.innerText = "Player 2's turn";
                this.board.playerTurn.style.color = teamColors[player2.team]
                player2.takeTurn();
            }
        }
        else {
            console.log("Player 1's turn!");
            this.board.playerTurn.innerText = "Player 1's turn";
            player1.takeTurn();
        }
    }
    this.finishTurn = function () {
        turn++;
        this.board.turnCounter.innerText = 'Turn number: ' + turn.toString();

        console.log(`Turns passed: ${turn}`);
        this.takeTurn();
    }

    this.getTurn = function () {
        return turn;
    }

    this.setTeam = function (t1, t2) {
        this.player1Team = t1;
        this.player2Team = t2;
        player1.setTeam(t1);
        player2.setTeam(t2)
    }

    this.getPlayer1Team = function () {
        return player1.getTeam();
    }

    this.getPlayer2Team = function () {
        return player2.getTeam();
    }

    this.whoseTurn = function() {
        if (bombAndSeekGame.getTurn() % 2 == 0) { //Player 1's turn
            return 1
        } else {
            return 2
        } //[-1, player1's team, player2's team]
        
    }
}


function Board() {
    this.positions = Array.from(document.querySelectorAll('.col'));
    this.turnCounter = document.querySelectorAll('.turn_counter')[0];
    this.playerTurn = document.querySelectorAll('.player_turn')[0];
    this.playerHP = document.querySelectorAll('.player_HP')[0];
    this.bombsRemaining = document.querySelectorAll('.bombs_remaining')[0];

    //console.log(this.positions);
}


function Player(board) {
    let selectedPiece = 0;
    let targetPiece = 0;
    this.team = 0;

    this.getTeam = function () {
        return this.team;
    }

    this.setTeam = function (t) {
        this.team = t

    }

    this.takeTurn = function () {
        board.positions.forEach(el => el.addEventListener('click', selectPiece));
    }

    function selectPiece(event) {
        //event.target.innerText = 'X';
        selectedPiece = event.target;
        selectedPiece.dataset.selected = one.toString();
        //event.currentTarget.dataset.selected = zero.toString();

        board.positions.forEach(el => el.removeEventListener('click', selectPiece));
        if (checkValidSelection() == 1) {
            //Once piece is selected, wait for another click to determine the action/result.
            console.log('Valid piece selected!')
            board.positions.forEach(el => el.addEventListener('click', handleTarget));
        } else {
            selectedPiece.dataset.selected = zero.toString(); //from here the piece doesn't need to be selected in html
            console.log('Invalid selection, try again.');
            reselectPiece();
        }

    }

    function checkValidSelection() { //Can't select opponent's pieces or empty squares.
        if (bombAndSeekGame.getTurn() == 0) { //if first turn
            return 1;
        } else {
            if (parseInt(selectedPiece.dataset.empty) == 1) { //if empty
                return 0;
            } else {
                if (parseInt(selectedPiece.dataset.hidden) == 1) { //if hidden
                    return 1;
                } else {
                    temp = [-1, bombAndSeekGame.player1Team, bombAndSeekGame.player2Team]
                    if (parseInt(selectedPiece.dataset.team) == temp[bombAndSeekGame.whoseTurn()]) { //if own piece
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        }
    }

    function reselectPiece() { //This might be annoying in terms of interface as one would have to "click" the targetpiece again everytime a non-viable move is commanded.            
        //console.log('Invalid move, try again.');
        targetPiece = 0; //discard target piece
        board.positions.forEach(el => el.addEventListener('click', selectPiece)); //basically goes back to this.takeTurn by selecting initial piece
    }

    function handleTarget(event) {
        selectedPiece.dataset.selected = zero.toString(); //from here the piece doesn't need to be selected in html
        targetPiece = event.target;

        //These are the possible actions/results.
        //!!!!!!!!!-----ESSENTIALLY THE RULESET OF THE GAME-----!!!!!!!!!
        //1. If piece is hidden.
        if (parseInt(targetPiece.dataset.hidden) == 1) {
            // Reveal it.
            if (targetPiece == selectedPiece) {
                targetPiece.dataset.hidden = zero.toString();
                console.log('Piece revealed!')
                if (bombAndSeekGame.getTurn() == 0) { //if turn 1, set team
                    let t1 = targetPiece.dataset.team;
                    let temp = [1, 0]; //Opposite team for player2
                    bombAndSeekGame.setTeam(t1, temp[t1]);
                }
                board.positions.forEach(el => el.removeEventListener('click', handleTarget));
                bombAndSeekGame.finishTurn(); //remember u need this to finish turn!!!
            } else { console.log('The target is hidden, invalid move! Please reselect.'); reselectPiece(); }// Go back to selection.

        } else {
            if (targetPiece == selectedPiece) {
                console.log('The target is your selection. Please reselect.');
                reselectPiece();
            } else {

                //2. Check if target square is adjacent.
                let i = parseInt(selectedPiece.dataset.position);
                console.log(`selected piece position ${i}`);
                let j = parseInt(targetPiece.dataset.position);
                console.log(`targeted piece position ${j}`);
                if (adjPositions[i].includes(j)) {
                    //3. Check if target square is actually move-able to.
                    console.log('Adjacent square targeted!')
                    if (parseInt(targetPiece.dataset.empty) == 1) { //If empty, move.
                        movePieces(selectedPiece, targetPiece, 0);
                    } else {
                        temp = [-1, bombAndSeekGame.player1Team, bombAndSeekGame.player2Team]
                        if (temp[bombAndSeekGame.whoseTurn()] != targetPiece.dataset.team) { //If not targeted team, compare strength
                            let selectedPieceStrength = pieceStrength[parseInt(selectedPiece.dataset.pieceid)];
                            let targetPieceStrength = pieceStrength[parseInt(targetPiece.dataset.pieceid)];

                            //Compare strength
                            if (selectedPieceStrength == 0) { //If selected Bomb
                                if (targetPieceStrength == 5) {
                                    movePieces(selectedPiece, targetPiece, 1);
                                } else { console.log('Selected piece too weak! Please reselect.'); reselectPiece(); }
                            } else if (selectedPieceStrength == 5) {
                                if (targetPieceStrength == 0) {
                                    console.log('Dragon targeting bomb is invalid');
                                    reselectPiece();
                                }
                            } else { //If bomb not selected
                                if (selectedPieceStrength > targetPieceStrength) {
                                    movePieces(selectedPiece, targetPiece, 0);
                                } else { console.log('Selected piece too weak! Please reselect.'); reselectPiece(); }
                            }


                        } else { console.log('Targeted piece is your own! Please reselect.'); reselectPiece(); } //If target is team, re-select.

                    }
                } else { console.log('Targeted piece too far away! Please reselect.'); reselectPiece(); } //If target square is not adjacent, go back to selection.


            }

        }
    }

    function movePieces(s, t, scenario) { //scenario = 1 is when bomb moves to drag

        if (scenario == 1) {
            if (bombAndSeekGame.getTurn() % 2 == 0) { //Player 1's turn
                console.log('Player 1 damages Player 2');
                bombAndSeekGame.dragon2HP -= 1;
                if (bombAndSeekGame.dragon2HP == 0) {
                    console.log('Player 1 WINS!!!')
                }

            } else { // Player 2's turn
            console.log('Player 2 damages Player 1');
                bombAndSeekGame.dragon1HP -= 1;
                if (bombAndSeekGame.dragon1HP == 0) {
                    console.log('Player 2 WINS!!!')
                }
                
            }
        bombAndSeekGame.board.playerHP.innerText = bombAndSeekGame.HPString();
        } else {
            t.dataset.empty = zero.toString();
            t.dataset.pieceid = s.dataset.pieceid;
            t.dataset.team = s.dataset.team;
            t.dataset.selected = zero.toString();
            t.innerText = s.innerText;

        }
        s.dataset.empty = one.toString(); //every movement will leave behind an empty square
        notTeam = 2; // property of empty
        s.dataset.team = notTeam.toString();
        s.innerText = ' ';
        board.positions.forEach(el => el.removeEventListener('click', handleTarget));
        bombAndSeekGame.finishTurn(); //remember u need this to finish turn!!!
    }

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
