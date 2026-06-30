import { isValid } from "./piecesRules";


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
