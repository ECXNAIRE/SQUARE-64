
export function isValid(piece, fromRow, fromCol, toRow, toCol, board) {
    const pieceName = piece[1];

    //PAWN RN

    if (pieceName === "P") {
        return pawnMove(piece, fromRow, fromCol, toRow, toCol, board)
    }

    return false

}

function pawnMove(piece, fromRow, fromCol, toRow, toCol, board) {

            if (piece === "wP") {
                if (toCol === fromCol && toRow === fromRow - 1 && board[toRow][toCol] === "") {
                    return true
                }
            }

            if (piece === "bP") {
                if (toCol === fromCol && toRow === fromRow + 1 && board[toRow][toCol] === "") {
                    return true
                }
            }

            return false
        }