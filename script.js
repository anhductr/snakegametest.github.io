const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); //tell canvas that you're gonna draw 2d
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
const SpeacilCountDown = document.querySelector("#timeSpeacil");

let condition_speacil = false;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let speacilX;
let speacilY;
let score = 0;
let speacilCount = 4;
let myInterval;
let intervalCondtion = true;
let snake = [
    {x:unitSize, y:0},
    {x:0, y:0}
];
let theGameRun;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    makeFood();
    nextTick();
}

function nextTick(){
    if(running){
        theGameRun = setTimeout (() => {
        clearBoard();
        drawSpeacil();
        drawFood();
        moveSnake();
        drawSnake();
        checkGame();
        nextTick();
        }, 400);
    }
    else{
        gameOver();
    }
}

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0 , 0, gameWidth, gameHeight);
};

function makeFood(){
    function randomFood(min, max){
        return Math.floor((Math.random() * (max - unitSize) + min)/unitSize)*unitSize; 
    }
    foodX = randomFood(0, gameWidth);
    foodY = randomFood(0, gameHeight);
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function makeSpeacil(){
    function randomFood(min, max){
        return Math.floor((Math.random() * (max - unitSize) + min)/unitSize)*unitSize; 
    }
    speacilX = randomFood(0, gameWidth);
    speacilY = randomFood(0, gameHeight);
}

function drawSpeacil(){
    ctx.fillStyle = "blue";
    ctx.fillRect(speacilX, speacilY, unitSize*2, unitSize*2);
}

function clearSpeacil(){
    ctx.fillStyle = boardBackground;
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
}

function changeDirection(){
    let keyBoard = event.keyCode;
    const arrowLeft = 37;
    const arrowUp = 38;
    const arrowRight = 39;
    const arrowDown = 40;

    const changedLeft = (xVelocity == -unitSize);  
    const changedRight = (xVelocity == unitSize); 
    const changedUp = (yVelocity == -unitSize); 
    const changedDown = (yVelocity == unitSize); 

    switch(true) {
        case(keyBoard == arrowLeft && !changedRight): 
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyBoard == arrowRight && !changedLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyBoard == arrowUp && !changedDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyBoard == arrowDown && !changedUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function moveSnake(){
    const snakeHead = {
        x: snake[0].x + xVelocity, y: snake[0].y + yVelocity}
    snake.unshift(snakeHead);
    
    const num = Math.floor((Math.random() * 40) + 1);
    
    if(num == 5 && condition_speacil == false){
        makeSpeacil();
        drawSpeacil();
        condition_speacil = true;
    }

    if(num == 5 && condition_speacil == true && intervalCondtion == true){
        myInterval = setInterval(() => {
            SpeacilCountDown.innerHTML = "Món đặc biệt sẽ hết trong " + speacilCount + "s";
            speacilCount -= 1;
        }, 900);
        intervalCondtion = false;
    }
    
    if(speacilCount < 0){
        speacilX = -100;
        speacilY = -100;
        condition_speacil = false;
        speacilCount = 4;
        clearSpeacil();
        clearInterval(myInterval);
        SpeacilCountDown.innerHTML = "";
        intervalCondtion = true;
    }

    if((snakeHead.x == speacilX && snakeHead.y == speacilY) || (snakeHead.x == (speacilX + unitSize) && snakeHead.y == (speacilY + unitSize))){
        score += 2;
        scoreText.textContent = score;
        speacilX = -100;
        speacilY = -100;
        snake.push(
            {x: snake[1] - unitSize, y: snake[1] - unitSize},
            {x: snake[1] - unitSize*2, y: snake[1] - unitSize*2}
        );
        clearSpeacil();
        speacilCount = 4;
        condition_speacil = false;
        clearInterval(myInterval);
        intervalCondtion = true;
        SpeacilCountDown.innerHTML = "";
    }
    
    if(snakeHead.x == foodX && snakeHead.y == foodY){
        score += 1;
        scoreText.textContent = score;
        makeFood();
    }
    else{
        snake.pop();
    }
}

function checkGame(){
    if(snake[0].x == -unitSize || snake[0].y == -unitSize || snake[0].x >= gameWidth || snake[0].y >= gameHeight){
        running = false;
        clearInterval(myInterval);
    }
    for(let i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            running = false;
            clearInterval(myInterval);
        }
    }
}

function gameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GÀ QUÁ Tống Minh Quân!", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame(){
    condition_speacil = false;
    xVelocity = unitSize;
    yVelocity = 0;
    foodX = -100;
    foodY = -100;
    speacilX = -100; 
    speacilY = -100;
    score = 0;
    speacilCount = 4;
    intervalCondtion = true;
    snake = [
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    scoreText.innerHTML = "0";
    SpeacilCountDown.innerHTML = "";
    clearTimeout(theGameRun);
    clearInterval(myInterval);
    gameStart();
}