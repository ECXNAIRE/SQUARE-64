export let animation = null

export async function animateMove(piece, fromRow, fromCol, toRow, toCol, drawBoard) {
    return new Promise(resolve => {


        const duration = 200;
        const start = performance.now();

        animation = {
            piece,
            fromRow, 
            fromCol, 
            toRow, 
            toCol
        };

        function frame(time) {
            let progress = (time - start) / duration;

            if(progress > 1) 
                progress = 1


            animation.progress = progress

            drawBoard();

            if(progress < 1) {
                requestAnimationFrame(frame)
            } else {
                animation = null;
                resolve()
            }
        }

        requestAnimationFrame(frame);
    });
}



export function drawAnimation(ctx, pieces, squareSize, offset, boardOrientaion) {
    if(!animation) return;

    let fromRow = animation.fromRow;
    let fromCol = animation.fromCol;
    let toRow = animation.toRow;
    let toCol = animation.toCol;


    if(boardOrientaion === "black") {
        fromRow = 7 - fromRow;
        fromCol = 7 - fromCol;
        toRow = 7 - toRow;
        toCol = 7 - toCol
    }



    const startX = offset + fromCol * squareSize;
    const startY = offset + fromRow * squareSize;


    const endX = offset + toCol * squareSize;
    const endY = offset + toRow * squareSize;



    const x = startX + (endX - startX) * animation.progress;
    const y = startY + (endY - startY) * animation.progress


    ctx.drawImage(
        pieces[animation.piece],
        x, 
        y, 
        squareSize, 
        squareSize
    );
}