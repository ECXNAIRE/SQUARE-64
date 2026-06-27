const canvas = document.getElementById("chessBoardCanvas");
const ctx = canvas.getContext("2d");

const boardSize = 640;
const squareSize = boardSize / 8;
const offset = 30;

let boardOrientation = "black";

let board = []


if (boardOrientation === "white") {
    board = [
        ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
    ];
} else {
    board = [
        ["wR", "wN", "wB", "wK", "wQ", "wB", "wN", "wR"],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        ["bR", "bN", "bB", "bK", "bQ", "bB", "bN", "bR"]
    ]
}


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

            let displayRow = row;
            let displayColumn = column;

            const isLight = (displayRow + displayColumn) % 2 == 0;

            ctx.fillStyle = isLight ? "#d6fabf" : "#55a700";

            ctx.fillRect(
                offset + column * squareSize,
                offset + row * squareSize,
                squareSize,
                squareSize
            );

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
            drawBoard(); // ONLY draw when everything is ready
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
                ctx.drawImage(
                    pieces[piece],
                    offset + column * squareSize,
                    offset + row * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }
}