import { isValid } from './piecesRules.js'
import { findKing, isKingInCheck, canCastle, pawnPromotion, needsPromotion, checkLegalMoves, legalMoveCheckmate, legalMoveStalemate, doCastle } from './gameRules.js';

const canvas = document.getElementById("chessBoardCanvas");
const ctx = canvas.getContext("2d");
const gameTime = localStorage.getItem("gameTime")
const whiteTimer = document.getElementById("timeWhite")
const blackTimer = document.getElementById("timeBlack")
const promotionMenu = document.getElementById("promotionMenu");
const promoteQ = document.getElementById("promoteQ");
const promoteR = document.getElementById("promoteR");
const promoteB = document.getElementById("promoteB");
const promoteN = document.getElementById("promoteN");
const movesList = document.getElementById("movesList");
let moveHistory = []

console.log(gameTime)

let gameOver = false


let promotionRow;
let promotionCol;

let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;
let legalMoves = []


let timer = null;
let whiteMove = false
let blackMove = false

let whiteTime = Number(localStorage.getItem("gameTime"))
let blackTime = Number(localStorage.getItem("gameTime"))


function renderMoves () {
    movesList.innerHTML = ""

    moveHistory.forEach((move, index) => {
        const row=document.createElement("div");
        row.className = "moveRow";

        row.innerHTML = `
        <div class="moveNumber">${index+1}.</div>
        <div class="whiteMove">${move.white ?? ""}</div>
        <div class="blackMove">${move.black ?? ""}</div>`;


        movesList.appendChild(row);

    });
}

function formatTime(seconds) {
    if (seconds === Infinity) {
        return "∞";
    }

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateTimers() {
    whiteTimer.textContent = formatTime(whiteTime)
    blackTimer.textContent = formatTime(blackTime)
}

function startWhiteTimer() {
    if (whiteTime === Infinity) return;
    clearInterval(timer);

    timer = setInterval(() => {
        if (whiteTime > 0) {
            whiteTime--;
            updateTimers()
        }

        if (whiteTime === 0) {
            clearInterval(timer);

            //WILL ADD HERE TIME WIN FOR NOW CHECKMATE
            showGameResult("timeout", currentTurn)
        }
    }, 1000)
}

function startBlackTimer() {
    if (blackTime === Infinity) return;
    clearInterval(timer);

    timer = setInterval(() => {
        if (blackTime > 0) {
            blackTime--;
            updateTimers()
        }

        if (blackTime === 0) {
            clearInterval(timer);

            //WILL ADD HERE TIME WIN FOR NOW CHECKMATE
            showGameResult("timeout", currentTurn)
        }
    }, 1000)
}

updateTimers()


function squareName(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return files[col] + (8 - row)
}

function showGameResult(text, color) {

    gameOver = true;
    clearInterval(timer);
    const gameResultImg = document.getElementById("gameResultImg");
    const gameResult = document.getElementById("gameResult")

    if (text === "checkmate") {
        if (color === "w") {
            gameResultImg.src = "../static/img/whiteMate.png";
        } else {
            gameResultImg.src = "../static/img/blackMate.png";
        }
    } else if(text === "stalemate"){
        gameResultImg.src= "../static/img/legalMoveStalemate.png";
    } else if(text === "timeout") {
        if(currentTurn === "w") {
            gameResultImg.src = "../static/img/blackTimeOut.png"
        } else {
            gameResultImg.src = "../static/img/whiteTimeOut.png"
        }
    }

    gameResult.classList.remove("hidden");


    setTimeout(() => {
        document.addEventListener("click", () => {
            location.reload();
        }, { once: true });
    }, 200)
}


function showPromotionMenu(row, column, color) {

    promotionRow = row;
    promotionCol = column;


    let displayRow = row;
    let displayCol = column;

    if (boardOrientation === "black") {
        displayRow = 7 - row;
        displayCol = 7 - column;
    }

    promoteQ.src = `../static/assets/${color}Q.svg`;
    promoteR.src = `../static/assets/${color}R.svg`;
    promoteB.src = `../static/assets/${color}B.svg`;
    promoteN.src = `../static/assets/${color}N.svg`;


    const rect = canvas.getBoundingClientRect();
    const parentRect = canvas.parentElement.getBoundingClientRect();

    promotionMenu.style.left = `${rect.left - parentRect.left + offset + displayCol * squareSize}px`;
    promotionMenu.style.top = `${rect.top - parentRect.top + displayRow * squareSize}px`;

    promotionMenu.style.display = "flex";
}


async function choosePromotion(piece) {

    pawnPromotion(board, promotionRow, promotionCol, piece);

    promotionMenu.style.display = "none";

    lastMove = {
        piece: selectedPiece,
        fromRow: selectedRow,
        fromCol: selectedCol,
        toRow: promotionRow,
        toCol: promotionCol
    };

    let enemyColor;
    if (currentTurn === "w") {
        enemyColor = "b"
    } else {
        enemyColor = "w"
    }


    if (
        legalMoveCheckmate(board, enemyColor, hasMoved, lastMove) &&
        isKingInCheck(board, enemyColor, lastMove, hasMoved)
    ) {
        if (currentTurn === "w") {
            showGameResult("checkmate", currentTurn);
        } else {
            showGameResult("checkmate", currentTurn);
        }
    }
    else if (legalMoveStalemate(board, enemyColor, hasMoved, lastMove, true) &&
        !isKingInCheck(board, enemyColor, lastMove, hasMoved)
    ) {
        showGameResult("stalemate", currentTurn);
    }

    updateCaptureCounts();

    drawBoard();



    await sleep(500);



    if (currentTurn === "w") {
        currentTurn = "b";
        boardOrientation = "black";
    } else {
        currentTurn = "w";
        boardOrientation = "white";
    }

    selectedPiece = null;
    selectedRow = -1;
    selectedCol = -1;
    legalMoves = []

    drawBoard();
}


promoteQ.onclick = () => choosePromotion("Q");
promoteR.onclick = () => choosePromotion("R");
promoteB.onclick = () => choosePromotion("B");
promoteN.onclick = () => choosePromotion("N");


const captureCounts = {
    whites: {
        P: 0,
        R: 0,
        B: 0,
        Q: 0,
        N: 0
    },
    blacks: {
        P: 0,
        R: 0,
        B: 0,
        Q: 0,
        N: 0
    }
}

const hasMoved = {
    wK: false,
    bK: false,
    wRLeft: false,
    wRRight: false,
    bRLeft: false,
    bRRight: false
}


let isValidMove = true;
let lastMove = null;




const boardSize = 640;
const squareSize = boardSize / 8;
const offset = 30;

let currentTurn = "w";

let boardOrientation = "white";

let board = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
];



const pieces = {};





canvas.width = 700;
canvas.height = 700;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawSquares();
    drawLegalMoves();
    drawPieces();
    drawCoordinates();
    updateCaptureCounts();
}

function drawSquares() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {

            const isLight = (row + column) % 2 == 0;
            ctx.fillStyle = isLight ? "#EBECD0" : "#739552";

            let displayRow = row;
            let displayColumn = column;

            if (boardOrientation === "black") {
                displayRow = 7 - row;
                displayColumn = 7 - column;
            }

            ctx.fillRect(
                offset + displayColumn * squareSize,
                offset + displayRow * squareSize,
                squareSize,
                squareSize
            );

            if (isKingInCheck(board, currentTurn, lastMove, hasMoved)) {
                const king = findKing(board, currentTurn)

                if (row === king.rowKing && column === king.colKing) {
                    ctx.fillStyle = "#ff5c5c";
                    ctx.strokeStyle = "white"
                    ctx.lineWidth = 3

                    ctx.fillRect(
                        offset + displayColumn * squareSize,
                        offset + displayRow * squareSize,
                        squareSize,
                        squareSize
                    );

                    ctx.strokeRect(
                        offset + displayColumn * squareSize + 1.5,
                        offset + displayRow * squareSize + 1.5,
                        squareSize - 3,
                        squareSize - 3
                    );
                }
            }

            if (row === selectedRow && column === selectedCol) {
                ctx.fillStyle = "#B8D97A";
                ctx.strokeStyle = "white"
                ctx.lineWidth = 3

                ctx.fillRect(
                    offset + displayColumn * squareSize,
                    offset + displayRow * squareSize,
                    squareSize,
                    squareSize
                );

                ctx.strokeRect(
                    offset + displayColumn * squareSize + 1.5,
                    offset + displayRow * squareSize + 1.5,
                    squareSize - 3,
                    squareSize - 3
                );
            }
        }
    }
}

function drawCoordinates() {
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let files = ["h", "g", "f", "e", "d", "c", "b", "a"];
    let ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

    if (boardOrientation === "white") {
        files.reverse();
        ranks.reverse();
    }

    for (let i = 0; i < 8; i++) {
        ctx.fillText(
            files[i],
            offset + i * squareSize + squareSize / 2,
            offset + boardSize + 15
        );
    }

    for (let n = 0; n < 8; n++) {
        ctx.fillText(
            ranks[n],
            15,
            offset + n * squareSize + squareSize / 2
        );
    }
}


//PIECES FUNCTION
let loadedCount = 0;
const totalPieces = 12;

function loadPiece(name, path) {
    const img = new Image();

    img.onload = () => {
        loadedCount++;
        if (loadedCount === totalPieces) {
            drawBoard();
        }
    };

    img.src = path;
    pieces[name] = img;
}

loadPiece("wR", "../static/assets/wR.svg");
loadPiece("wQ", "../static/assets/wQ.svg");
loadPiece("wP", "../static/assets/wP.svg");
loadPiece("wN", "../static/assets/wN.svg");
loadPiece("wK", "../static/assets/wK.svg");
loadPiece("wB", "../static/assets/wB.svg");
loadPiece("bR", "../static/assets/bR.svg");
loadPiece("bQ", "../static/assets/bQ.svg");
loadPiece("bP", "../static/assets/bP.svg");
loadPiece("bN", "../static/assets/bN.svg");
loadPiece("bK", "../static/assets/bK.svg");
loadPiece("bB", "../static/assets/bB.svg");

function drawPieces() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            let piece = board[row][column];

            if (piece !== "" && pieces[piece]) {

                let displayRow = row;
                let displayColumn = column;

                if (boardOrientation === "black") {
                    displayRow = 7 - row;
                    displayColumn = 7 - column;
                }
                ctx.drawImage(
                    pieces[piece],
                    offset + displayColumn * squareSize,
                    offset + displayRow * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }
}



//MOVE THE PIECES
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


canvas.addEventListener("click", async (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let column = Math.floor((x - offset) / squareSize);
    let row = Math.floor((y - offset) / squareSize);

    if (boardOrientation === "black") {
        row = 7 - row;
        column = 7 - column;
    }

    if (
        row < 0 || row > 7 ||
        column < 0 || column > 7
    ) return;
    if (selectedPiece === null) {

        if (board[row][column] === "") return;


        //PREVENT SELECTING THE OTHER COLOR 
        if (board[row][column][0] !== currentTurn) {
            return
        }

        selectedPiece = board[row][column];
        selectedRow = row;
        selectedCol = column;


        legalMoves = checkLegalMoves(row, column, board, selectedPiece, hasMoved, lastMove)

        console.log(legalMoves)

    }

    else {

        if (row == selectedRow && column == selectedCol) {
            return
        } else {
            const clickedPiece = board[row][column];

            //CHECKING THE FIRST LETTER
            if (clickedPiece !== "" && clickedPiece[0] === currentTurn) {
                selectedPiece = clickedPiece;
                selectedRow = row;
                selectedCol = column;

                legalMoves = checkLegalMoves(row, column, board, selectedPiece, hasMoved, lastMove)

                drawBoard();
                return
            }

            isValidMove = isValid(selectedPiece, selectedRow, selectedCol, row, column, board, lastMove, hasMoved, false)


            if (!isValidMove.valid) {
                drawBoard();
                return;
            }



            //this was for the capture counter
            const target = board[row][column];
            if (target !== "") {
                const color = target[0];
                const capturedPiece = target[1];

                if (color === "w") {
                    captureCounts.whites[capturedPiece]++;
                } else {
                    captureCounts.blacks[capturedPiece]++;
                }
            }



            //CHECKING ENPASSANT HERE
            if (board[selectedRow][selectedCol][1] === "P" && isValidMove.enPassant) {
                const capturedPawnRow = lastMove.toRow;
                const capturedPawnCol = lastMove.toCol;

                board[capturedPawnRow][capturedPawnCol] = "";

                const capturedPieceColor = lastMove.piece[0]
                if (capturedPieceColor === 'w') {
                    captureCounts.whites.P++;
                } else {
                    captureCounts.blacks.P++;
                }
            }

            // CHECKING CALSTLE MOVE
            if (board[selectedRow][selectedCol][1] === "K" && isValidMove.castle) {
                if (!canCastle(selectedPiece, column, board, lastMove, hasMoved)) {
                    drawBoard();
                    return;
                }
            }

            console.log(canCastle(selectedPiece, column, board, lastMove, hasMoved))


            board[row][column] = selectedPiece;
            board[selectedRow][selectedCol] = "";

            if (isValidMove.castle) {
                doCastle(selectedPiece, column, board)
            }

            const capturedPiece = target;
            let capturedPieceType = null;
            if (capturedPiece !== "") {
                capturedPieceType = capturedPiece[1];
            }
            if (isKingInCheck(board, currentTurn, lastMove, hasMoved)) {
                board[selectedRow][selectedCol] = selectedPiece;
                board[row][column] = capturedPiece;

                if (capturedPieceType !== null) {
                    if (currentTurn === "w") {
                        captureCounts.blacks[capturedPieceType]--;
                    } else {
                        captureCounts.whites[capturedPieceType]--;
                    }
                }


                if (isValidMove.enPassant) {
                    board[lastMove.toRow][lastMove.toCol] = lastMove.piece

                    if (lastMove.piece[0] === "w") {
                        captureCounts.whites.P--;
                    } else {
                        captureCounts.blacks.P--;
                    }
                }
                drawBoard();
                return
            }


            let enemyColor;
            if (currentTurn === "w") {
                enemyColor = "b"
            } else {
                enemyColor = "w"
            }



            //UPDATING HASMOVED 
            if (selectedPiece === "wK") hasMoved.wK = true;
            if (selectedPiece === "bK") hasMoved.bK = true;
            if (selectedPiece === "wR") {
                if (selectedCol === 0) hasMoved.wRLeft = true;
                if (selectedCol === 7) hasMoved.wRRight = true;
            }
            if (selectedPiece === "bR") {
                if (selectedCol === 0) hasMoved.bRLeft = true;
                if (selectedCol === 7) hasMoved.bRRight = true;
            }


            //PAWN PROMOTION COMES HERE

            if (needsPromotion(board, row, column)) {
                showPromotionMenu(row, column, currentTurn)

                drawBoard();
                return;

            }




            //EN-PASSANT MOVE STORE
            lastMove = {
                piece: selectedPiece,
                fromRow: selectedRow,
                fromCol: selectedCol,
                toRow: row,
                toCol: column
            };


            if (
                legalMoveCheckmate(board, enemyColor, hasMoved, lastMove) &&
                isKingInCheck(board, enemyColor, lastMove, hasMoved)
            ) {
                if (currentTurn === "w") {
                    showGameResult("checkmate", currentTurn);
                } else {
                    showGameResult("checkmate", currentTurn);
                }
            }
            else if (legalMoveStalemate(board, enemyColor, hasMoved, lastMove, true) &&
                !isKingInCheck(board, enemyColor, lastMove, hasMoved)
            ) {
                showGameResult("stalemate", currentTurn);
            }

            updateCaptureCounts();

            drawBoard();
            await sleep(500);

            const moveText = selectedPiece[1] + squareName(row, column)

            if(currentTurn === "w") {
                moveHistory.push({
                    white:moveText,
                    black: ""
                })
            } else {
                moveHistory[moveHistory.length - 1].black = moveText
            }

            renderMoves()

            if (whiteTime !== Infinity) {
                if (currentTurn === "w") {
                    if (!whiteMove) {
                        whiteMove = true
                    } else {
                        startBlackTimer()
                    }
                } else {
                    if (!blackMove) {
                        blackMove = true
                        startWhiteTimer()
                    } else {
                        startWhiteTimer()
                    }
                }

            }

            if (currentTurn === "w") {
                currentTurn = "b";
                boardOrientation = "black";
            } else {
                currentTurn = "w";
                boardOrientation = "white";
            }


        }

        selectedPiece = null;
        selectedRow = -1;
        selectedCol = -1;
        legalMoves = []
    }

    drawBoard();
});


//CAPTURE COUNTS UPDATE
function updateCaptureCounts() {
    for (const piece in captureCounts.whites) {
        document.getElementById("w" + piece).textContent = captureCounts.whites[piece];

        document.getElementById("b" + piece).textContent = captureCounts.blacks[piece];
    }
}


function drawLegalMoves() {
    for (const move of legalMoves) {
        let displayRow = move.row;
        let displayCol = move.col;

        if (boardOrientation === "black") {
            displayRow = 7 - move.row;
            displayCol = 7 - move.col
        }

        const x = offset + displayCol * squareSize
        const y = offset + displayRow * squareSize

        if (move.castle) {
            ctx.fillStyle = "#FFD700";

            ctx.beginPath();
            ctx.arc(
                x + squareSize / 2,
                y + squareSize / 2,
                10,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
        else if (move.piece !== "") {
            ctx.fillStyle = "#d97a7a";
            ctx.strokeStyle = "white"
            ctx.lineWidth = 3

            ctx.fillRect(
                offset + displayCol * squareSize,
                offset + displayRow * squareSize,
                squareSize,
                squareSize
            );

            ctx.strokeRect(
                offset + displayCol * squareSize + 1.5,
                offset + displayRow * squareSize + 1.5,
                squareSize - 3,
                squareSize - 3
            );
        } else {
            ctx.fillStyle = "rgba(0,0,0,0.28)";
            ctx.beginPath();
            ctx.arc(
                x + squareSize / 2,
                y + squareSize / 2,
                9,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}

