export function canCastle(piece, fromRow, fromCol, toRow, toCol, board, hasMoved) {
    const rowDiff = fromRow - toRow;
    const colDiff = fromRow - toRow;

    if (rowDiff === 0 && colDiff === 2) {
        if (piece === "wK") {
            if (hasMoved.wk === false) {
                if (hasMoved.wRRight === false) {
                    return true;
                }

                if (hasMoved.wRLeft === false) {
                    return true
                }
            }

            return false
        }

        return false
    }

    return false
}