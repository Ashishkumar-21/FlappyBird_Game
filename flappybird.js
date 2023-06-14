
//board
let board;
let boardWidth = 640;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;  // rratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/4;
let birdY = boardHeight/2;
let birdImg;

let bird ={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray=[];
let pipeWidth = 64;  //rration = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving speed(left)
let velocityY = 0; //bird jump speed
let gravity = 0.4 ;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardHeight;
    context = board.getContext("2d"); // used for drawing on the board

    //draw the bird
    context.fillStyle = "green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load the image
    birdImg = new Image();
    birdImg.src="./Images/flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src="./Images/toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src="./Images/bottompipe.png";

    requestAnimationFrame(update);

    setInterval(placePipes,1500); //calls every 1.5 second and it will add new pipe to our array

    document.addEventListener("keydown",moveBird);

}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY , 0) //apply gravity to current bird.y, limit to top of canvas
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y > board.height){
        gameOver=true;
    }

    //pipes
    for(let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height)

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+=1/2;
            highScore = Math.max(highScore,score);
            pipe.passed = true;
        }

        if(dedectCollision(bird,pipe)){
            gameOver=true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift() //remove first pipe from 
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText("HighScore - ",5,45);
    context.fillText(highScore,250,45);
    context.fillText("Score - ",5,90);
    context.fillText(score,160,90);

    if(gameOver){
        context.fillText("GAME OVER",5,135);
    }
}

function placePipes(){

    if(gameOver){
        return
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let opeingSpace = board.height/4;

    let toppipe={
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(toppipe);

    let bottomPipe ={
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + opeingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);

}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp"  || e.code == "KeyX"){
        //jump
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            // highScore = Math.max(highScore,score);
            score = 0;
            gameOver = false;
        }
    }
}

function dedectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}