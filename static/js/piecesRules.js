
export function isValid(piece, fromRow, fromCol, toRow, toCol, board, lastMove) {
    const pieceName = piece[1];

    //PAWN RN

    if (pieceName === "P") {
        return pawnMove(piece, fromRow, fromCol, toRow, toCol, board, lastMove)
    }

    if (pieceName === "N") {
        return knightMove(piece, fromRow, fromCol, toRow, toCol, board)
    }

    return {
        valid: false,
        enPassant: false
    }

}

function pawnMove(piece, fromRow, fromCol, toRow, toCol, board, lastMove) {





    if (piece === "wP") {
        if (toCol === fromCol && toRow === fromRow - 1 && board[toRow][toCol] === "") {
            return {
                valid: true,
                enPassant: false
            }
        }

        if (fromRow === 6 && toRow === 4 && fromCol == toCol && board[toRow][toCol] === "" && board[5][toCol] === "") {
            return {
                valid: true,
                enPassant: false
            }
        }

        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow - 1) {
            const target = board[toRow][toCol];

            if (target !== "" && target[0] !== "w") {
                return {
                    valid: true,
                    enPassant: false
                }
            }
        }

        if (
            fromRow === 3 &&
            Math.abs(toCol - fromCol) === 1 &&
            toRow - fromRow === -1 &&
            board[toRow][toCol] === "" &&
            lastMove &&
            lastMove.piece == "bP" &&
            lastMove.toRow === 3 &&
            lastMove.fromRow === 1 &&
            lastMove.toCol === toCol
        ) {
            return {
                valid: true,
                enPassant: true
            }
        }

    }

    if (piece === "bP") {
        if ((toCol === !null && toCol === fromCol + 1 && toCol === fromCol - 1) || toCol === fromCol && toRow === fromRow + 1 && board[toRow][toCol] === "") {
            return {
                valid: true,
                enPassant: false
            }
        }

        if (fromRow === 1 && toRow === 3 && fromCol == toCol && board[toRow][toCol] === "" && board[2][toCol] === "") {
            return {
                valid: true,
                enPassant: false
            }
        }

        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + 1) {
            const target = board[toRow][toCol]

            if (target !== "" && target[0] !== "b") {
                return {
                    valid: true,
                    enPassant: false
                }
            }

        }

        if (
            fromRow === 4 &&
            Math.abs(toCol - fromCol) === 1 &&
            toRow - fromRow === 1 &&
            board[toRow][toCol] === "" &&
            lastMove &&
            lastMove.piece == "wP" &&
            lastMove.toRow === 4 &&
            lastMove.fromRow === 6 &&
            lastMove.toCol === toCol
        ) {
            return {
                valid: true,
                enPassant: true
            }
        }
    }

    return  {
        valid: false,
        enPassant:false
    }
}



function knightMove(piece, fromRow, fromCol, toRow, toCol, board) {

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);


    if (
        !((rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2))
    ) return {
        valid: false,
        enPassant: false
    }

    const target = board[toRow][toCol];

    if(target === "") {
        return {
            valid:true,
            enPassant:false
        }
    }

    if( target === "" || target[0] !== piece[0]) {
        return {
            valid: true,
            enPassant: false
        }
    }


    return {
        valid:false,
        enPassant: false
    }
}