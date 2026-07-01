import { isValid } from "./piecesRules.js";


function findKing(board, color) {

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === color + "K") {
                return {
                    rowKing: row,
                    colKing: col
                }
            }
        }
    }

}



export function isKingInCheck(board, color, lastMove, hasMoved) {
    const { rowKing, colKing } = findKing(board, color)


    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col]

            if (piece !== "" && piece[0] !== color) {
                const check = isValid(piece, row, col, rowKing, colKing, board, lastMove, hasMoved, true);

                if (check.valid) {
                    return true
                }
            }
        }
    }


    return false
}



function isSquareAttacked(checkRow, checkCol, color, board, lastMove, hasMoved) {

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            if (piece !== "" && piece[0] !== color) {
                const check = isValid(piece, row, col, checkRow, checkCol, board, lastMove, hasMoved, true)

                if (check.valid) {
                    return true
                }
            }
        }
    }

    return false
}


export function canCastle(piece, toCol, board, lastMove, hasMoved) {

    if (piece === "wK" && toCol === 6) {

        if (
            isSquareAttacked(7, 4, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 5, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 6, "w", board, lastMove, hasMoved)
        ) {
            return false;
        }

        board[7][5] = board[7][7];
        board[7][7] = "";

        return true;
    }

    if (piece === "wK" && toCol === 2) {

        if (
            isSquareAttacked(7, 4, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 3, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 2, "w", board, lastMove, hasMoved)
        ) {
            return false;
        }

        board[7][3] = board[7][0];
        board[7][0] = "";

        return true;
    }

    if (piece === "bK" && toCol === 6) {

        if (
            isSquareAttacked(0, 4, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 5, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 6, "b", board, lastMove, hasMoved)
        ) {
            return false;
        }

        board[0][5] = board[0][7];
        board[0][7] = "";

        return true;
    }


    if (piece === "bK" && toCol === 2) {

        if (
            isSquareAttacked(0, 4, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 3, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 2, "b", board, lastMove, hasMoved)
        ) {
            return false;
        }

        board[0][3] = board[0][0];
        board[0][0] = "";

        return true;
    }

    return false;
}




export function needsPromotion(board, row, col) {
    const piece = board[row][col]

    if(piece === "wP" && row === 0) {
        return true
    }


    if(piece === "bP" && row === 7) {
        return true
    }
}


export function pawnPromotion(board, row, column, pieceType) {
    const color = board[row][column][0];

    board[row][column] = color + pieceType;
}

