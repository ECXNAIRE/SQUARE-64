import { isValid } from './piecesRules.js'


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

let isValidMove = true;
let lastMove = null;

const canvas = document.getElementById("chessBoardCanvas");
const ctx = canvas.getContext("2d");

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
    drawPieces();
    drawCoordinates();
}

function drawSquares() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {

            const isLight = (row + column) % 2 == 0;
            ctx.fillStyle = isLight ? "#d6fabf" : "#55a700";

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

            if (row === selectedRow && column === selectedCol) {
                ctx.fillStyle = "#b3fa67";

                ctx.fillRect(
                    offset + displayColumn * squareSize,
                    offset + displayRow * squareSize,
                    squareSize,
                    squareSize
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
let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;


canvas.addEventListener("click", (event) => {

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

                drawBoard();
                return
            }

            isValidMove = isValid(selectedPiece, selectedRow, selectedCol, row, column, board, lastMove)


            if (!isValidMove.valid) {
                drawBoard();
                return;
            }

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
            if (isValidMove.enPassant) {
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


            board[row][column] = selectedPiece;
            board[selectedRow][selectedCol] = "";


            //EN-PASSANT MOVE STORE
            lastMove = {
                piece: selectedPiece,
                fromRow: selectedRow,
                fromCol: selectedCol,
                toRow: row,
                toCol: column
            };

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
    }

    drawBoard();
});