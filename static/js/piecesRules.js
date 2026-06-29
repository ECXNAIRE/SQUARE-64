
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

                if (fromRow === 6 && toRow === 4 && fromCol == toCol && board[toRow][toCol] === "" && board[5][toCol] === "") {
                    return true
                }

                if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow - 1) {
                    const target = board[toRow][toCol];

                    if (target !== "" && target[0] !== "w") {
                        return true
                    }
                }
            }

            if (piece === "bP") {
                if ((toCol === !null && toCol === fromCol + 1 && toCol === fromCol -1) || toCol === fromCol && toRow === fromRow + 1 && board[toRow][toCol] === "") {
                    return true
                }

                if (fromRow === 1 && toRow === 3 && fromCol == toCol && board[toRow][toCol] === "" && board[2][toCol] === "") {
                    return true
                }

                if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow +1) {
                    const target = board[toRow][toCol] 

                    if (target !== "" && target[0] !=="b") {
                        return true
                    }
                    
                }
            }

            return false
        }