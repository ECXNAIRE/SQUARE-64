
export function isValid(piece, fromRow, fromCol, toRow, toCol, board, lastMove) {
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

    if(pieceName === "K") {
        return kingMove(piece, fromRow, fromCol, toRow, toCol, board)
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
        valid: false,
        enPassant: false
    }

    const target = board[toRow][toCol];

    if (target === "" || target[0] !== piece[0]) {
        return {
            valid: true,
            enPassant: false
        }
    }


    return {
        valid: false,
        enPassant: false
    }
}



function bishopMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
        return {
            valid: false,
            enPassant: false
        }
    }

    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);


    //LOOPING TO CHECK EVERY GRID BETWEEN THEM 
    let r = fromRow + rowStep;
    let c = fromCol + colStep;


    while (r !== toRow && c !== toCol) {
        if (board[r][c] !== "") {
            return {
                valid: false,
                enPassant: false
            };
        }

        r += rowStep;
        c += colStep;
    }


    const target = board[toRow][toCol]

    if (target === "" || target[0] !== piece[0]) {
        return {
            valid: true,
            enPassant: false
        };
    }


    return {
        valid: false,
        enPassant: false
    };
}



function rookMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if ( fromRow !== toRow && fromCol !== toCol) {
        return {
            valid: false,
            enPassant: false
        }
    }

    const rowStep = Math.sign(toRow - fromRow) ;
    const colStep = Math.sign(toCol - fromCol) ;



    //LOOPING TO CHECK EVERY GRID 

    let r = fromRow+ rowStep;
    let c = fromCol + colStep;


    while (c !== toCol || r !== toRow) {
        if (board[r][c] !== "") {
            return {
                valid: false,
                enPassant: false
            }
        }

        r += rowStep;
        c += colStep
    };


    const target = board[toRow][toCol]

    if(target === "" || target[0] !== piece[0]) {
        return {
            valid: true,
            enPassant: false
        }
    }

    return {
        valid: false,
        enPassant: false
    }
}



function queenMove( piece, fromRow, fromCol, toRow, toCol, board) {
    const rook = rookMove(piece, fromRow, fromCol, toRow, toCol, board) 
    if(rook.valid) {
        return rook
    }

    return bishopMove(piece, fromRow, fromCol, toRow, toCol, board)
}



function kingMove(piece, fromRow, fromCol, toRow, toCol, board) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol- fromCol);


    if (rowDiff > 1 || colDiff > 1) {
        return {
            valid: false,
            enPassant : false
        }
    }


    const target = board[toRow][toCol] 

    if (target === "" || target[0] !== piece[0]){
        return {
            valid: true,
            enPassant: false
        }
    }

    return {
        valid: false,
        enPassant:false
    }
}