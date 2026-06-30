
export function isValid(piece, fromRow, fromCol, toRow, toCol, board, lastMove, hasMoved, checkAttack) {
    const pieceName = piece[1];

    //PAWN RN

    if (pieceName === "P") {
        return pawnMove(piece, fromRow, fromCol, toRow, toCol, board, lastMove)
    }

    if (pieceName === "N") {
        return knightMove(piece, fromRow, fromCol, toRow, toCol, board)
    }


    if (pieceName === "B") {
        return bishopMove(piece, fromRow, fromCol, toRow, toCol, board)
    }


    if (pieceName === "R") {
        return rookMove(piece, fromRow, fromCol, toRow, toCol, board)
    }

    if (pieceName === "Q") {
        return queenMove(piece, fromRow, fromCol, toRow, toCol, board)
    }

    if (pieceName === "K") {
        return kingMove(piece, fromRow, fromCol, toRow, toCol, board, hasMoved, checkAttack)
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
        if (toCol === fromCol && toRow === fromRow + 1 && board[toRow][toCol] === "") {
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

    return {
        valid: false,
        enPassant: false
    }
}



function knightMove(piece, fromRow, fromCol, toRow, toCol, board) {

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);


    if (
        !((rowDiff === 2 && colDiff === 1) ||
            (rowDiff === 1 && colDiff === 2))
    ) return {
        valid: false
    }

    const target = board[toRow][toCol];

    if (target === "" || target[0] !== piece[0]) {
        return { valid: true }
    }


    return { valid: false }
}



function bishopMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
        return { valid: false }
    }

    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);


    //LOOPING TO CHECK EVERY GRID BETWEEN THEM 
    let r = fromRow + rowStep;
    let c = fromCol + colStep;


    while (r !== toRow && c !== toCol) {
        if (board[r][c] !== "") {
            return { valid: false }
        }

        r += rowStep;
        c += colStep;
    }


    const target = board[toRow][toCol]

    if (target === "" || target[0] !== piece[0]) {
        return { valid: true }
    }


    return { valid: false }
}



function rookMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if (fromRow !== toRow && fromCol !== toCol) {
        return { valid: false }
    }

    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);



    //LOOPING TO CHECK EVERY GRID 

    let r = fromRow + rowStep;
    let c = fromCol + colStep;


    while (c !== toCol || r !== toRow) {
        if (board[r][c] !== "") {
            return { valid: false }
        }

        r += rowStep;
        c += colStep
    };


    const target = board[toRow][toCol]

    if (target === "" || target[0] !== piece[0]) {
        return { valid: true }
    }

    return { valid: false }
}



function queenMove(piece, fromRow, fromCol, toRow, toCol, board) {
    const rook = rookMove(piece, fromRow, fromCol, toRow, toCol, board)
    if (rook.valid) {
        return rook
    }

    return bishopMove(piece, fromRow, fromCol, toRow, toCol, board)
}



function kingMove(piece, fromRow, fromCol, toRow, toCol, board, hasMoved, checkAttack) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (!checkAttack) {
        if
            (piece === "wK" &&
            hasMoved.wK === false) {
            if (hasMoved.wRRight === false &&
                fromCol === 4 &&
                toCol === 6 &&
                board[7][5] === ""
                && board[7][6] === ""
                && board[7][7] === "wR"
            ) {
                return {
                    valid: true,
                    castle: true
                }
            };

            if (hasMoved.wRLeft === false &&
                fromCol === 4 &&
                toCol === 2 &&
                board[7][3] === "" &&
                board[7][2] === "" &&
                board[7][1] === "" &&
                board[7][0] === "wR" 
            ) {
                return {
                    valid: true,
                    castle: true
                }
            };

        }

        if
            (piece === "bK" &&
            hasMoved.bK === false) {
            if (hasMoved.bRRight === false &&
                fromCol === 4 &&
                toCol === 6 &&
                board[0][5] === "" &&
                board[0][6] === "" &&
                board[0][7] === "bR" 
            ) {
                return {
                    valid: true,
                    castle: true
                }
            };

            if (hasMoved.bRLeft === false &&
                fromCol === 4 &&
                toCol === 2 &&
                board[0][3] === "" &&
                board[0][2] === "" &&
                board[0][1] === "" &&
                board[0][0] === "bR" 
            ) {
                return {
                    valid: true,
                    castle: true
                }
            };

        }
    }


    if (rowDiff > 1 || colDiff > 1) {
        return {
            valid: false,
            castle: false
        }
    }


    const target = board[toRow][toCol]

    if (target === "" || target[0] !== piece[0]) {
        return {
            valid: true,
            castle: false
        }
    }

    return {
        valid: false,
        castle: false
    }
}