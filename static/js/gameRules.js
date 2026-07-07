import { isValid } from "./piecesRules.js";


export function findKing(board, color) {

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

    console.log("KING NOT FOUND");
    console.log(color);
    console.table(board);

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

        if(hasMoved.wK || hasMoved.wRRight) return false

        if(board[7][5] !== "" || board[7][6] !== "") return false

        if (
            isSquareAttacked(7, 4, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 5, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 6, "w", board, lastMove, hasMoved)
        ) {
            return false;
        }
        return true;
    }

    if (piece === "wK" && toCol === 2) {

        if(hasMoved.wK || hasMoved.wRleft) return false

        if(
            board[7][1] !== "" ||
            board[7][2] !== "" ||
            board[7][3] !== ""
        ) {
            return false
        }

        if (
            isSquareAttacked(7, 4, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 3, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 2, "w", board, lastMove, hasMoved) ||
            isSquareAttacked(7, 1, "w", board, lastMove, hasMoved)
        ) {
            return false;
        }
        return true;
    }

    if (piece === "bK" && toCol === 6) {

        if(hasMoved.bK || hasMoved.bRRight) return false

        if(board[0][5] !== "" || board[0][6] !== "") return false

        if (
            isSquareAttacked(0, 4, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 5, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 6, "b", board, lastMove, hasMoved)
        ) {
            return false;
        }
        return true;
    }


    if (piece === "bK" && toCol === 2) {

        if(hasMoved.bK || hasMoved.bRLeft) return false


        if(board[0][1] !== "" ||
            board[0][2] !== "" ||
            board[0][3] !== ""
        )

        if (
            isSquareAttacked(0, 4, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 3, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 2, "b", board, lastMove, hasMoved) ||
            isSquareAttacked(0, 1, "b", board, lastMove, hasMoved)
        ) {
            return false;
        }
        return true;
    }

    return false;
}




export function needsPromotion(board, row, col) {
    const piece = board[row][col]

    if (piece === "wP" && row === 0) {
        return true
    }


    if (piece === "bP" && row === 7) {
        return true
    }
}


export function pawnPromotion(board, row, column, pieceType) {
    const color = board[row][column][0];

    board[row][column] = color + pieceType;
}




export function checkLegalMoves(row, column, board, selectedPiece, hasMoved, lastMove) {
    const legalMoves = []
    for (let rowCheck = 0; rowCheck < 8; rowCheck++) {
        for (let columnCheck = 0; columnCheck < 8; columnCheck++) {
            const moveValid = isValid(selectedPiece, row, column, rowCheck, columnCheck, board, lastMove, hasMoved, true)

            if (moveValid.valid) {
                const notKingInCheck = moveLeavesKingSafe(board, row, column, rowCheck, columnCheck, lastMove, hasMoved)

                if (notKingInCheck) {
                    legalMoves.push({
                        row: rowCheck,
                        col: columnCheck,
                        piece: board[rowCheck][columnCheck],
                    })
                }
            }
        }

        console.log(legalMoves);
    }


    if (selectedPiece === "wK") {

        if (canCastle(selectedPiece, 6, board, lastMove, hasMoved)) {
            legalMoves.push({
                row: 7,
                col: 6,
                piece: "",
                castle: true
            });
        }

        if (canCastle(selectedPiece, 2, board, lastMove, hasMoved)) {
            legalMoves.push({
                row: 7,
                col: 2,
                piece: "",
                castle: true
            });
        }
    }

    if (selectedPiece === "bK") {

        if (canCastle(selectedPiece, 6, board, lastMove, hasMoved)) {
            legalMoves.push({
                row: 0,
                col: 6,
                piece: "",
                castle: true
            });
        }

        if (canCastle(selectedPiece, 2, board, lastMove, hasMoved)) {
            legalMoves.push({
                row: 0,
                col: 2,
                piece: "",
                castle: true
            });
        }
    }

    return legalMoves
}



function moveLeavesKingSafe(board, fromRow, fromCol, toRow, toCol, lastMove, hasMoved) {
    const captured = board[toRow][toCol]

    const piece = board[fromRow][fromCol]

    board[fromRow][fromCol] = ""
    board[toRow][toCol] = piece

    const color = piece[0]
    const safe = !isKingInCheck(board, color, lastMove, hasMoved, true)


    board[fromRow][fromCol] = piece;
    board[toRow][toCol] = captured;

    return safe
}


export function legalMoveCheckmate(board, color, hasMoved, lastMove) {
    if (isKingInCheck(board, color, lastMove, hasMoved, true)) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] !== "" && board[row][col][0] === color) {
                    for (let rowCheck = 0; rowCheck < 8; rowCheck++) {
                        for (let colCheck = 0; colCheck < 8; colCheck++) {
                            const piece = board[row][col]
                            const legalMove = isValid(piece, row, col, rowCheck, colCheck, board, lastMove, hasMoved, false)

                            if (!legalMove.valid) continue

                            const isKingSafe = moveLeavesKingSafe(board, row, col, rowCheck, colCheck, lastMove, hasMoved)

                            if (legalMove.valid && isKingSafe) {
                                return false
                            }
                        }
                    }
                }
            }
        }
    }


    return true
}


export function legalMoveStalemate(board, color, hasMoved, lastMove) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] !== "" && board[row][col][0] === color) {
                for (let checkRow = 0; checkRow < 8; checkRow++) {
                    for (let checkCol = 0; checkCol < 8; checkCol++) {
                        const piece = board[row][col]

                        const legalMove = isValid(piece, row, col, checkRow, checkCol, board, lastMove, hasMoved, false)

                        if (!legalMove.valid) {
                            continue
                        }

                        const isKingSafe = moveLeavesKingSafe(board, row, col, checkRow, checkCol, lastMove, hasMoved)

                        if (isKingSafe) {
                            return false
                        }
                    }
                }
            }
        }
    }

    return true
}


export function doCastle(piece, toCol, board) {
    if (piece === "wK" && toCol === 6) {
        board[7][5] = board[7][7]
        board[7][7] = ""
    }

    if (piece === "wK" && toCol === 2) {
        board[7][3] = board[7][0]
        board[7][0] = ""
    }

    if (piece === "bK" && toCol === 6) {
        board[0][5] = board[0][7]
        board[0][7] = ""
    }

    if (piece === "bK" && toCol === 2) {
        board[0][3] = board[0][0]
        board[0][0] = ""
    }
}