// Definbe HTML elements
const board = document.getElementById('game-board');
const scoreText = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const instructionText = document.getElementById('instruction-text');
const logo = document.querySelector(".snakes-logo");


// Define game variables
let gridSize = 20;
let snake = [{x:10, y:10}];
let food = genrateFood();

let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Load high score from local storage
let highScore = localStorage.getItem("snakeHighScore")
    ? Number(localStorage.getItem("snakeHighScore"))
    : 0;

highScoreText.textContent = highScore.toString().padStart(3, '0');

//  Draw game map, snake, food.

function draw(){
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake(){
    snake.forEach((segment, index) => {
        const snakeElement = createGameElement('div', 'snake')

         if (index === 0) {
            snakeElement.classList.add('snake-head');
            snakeElement.textContent = "👹";
        }

        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)
    })
}

// Create a snake or food cube/div
function  createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set position of snake  or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}





// Draw food 

function drawFood() {
    if (gameStarted){
        const foodElement  = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement)
    }
    
}

function genrateFood(){
    
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}


//Moving the snake

function move() {
    const head = { ...snake[0] };
    switch (direction){
        case 'right':
            head.x++;
            break;

         case 'up':
            head.y--;
            break;
         case 'left':
            head.x--;
            break;
         case 'down':
            head.y++;
            break;

        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;

} 
    snake.unshift(head);
    // snake.pop();
    if (head.x === food.x && head.y === food.y){
        food = genrateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            draw();
            checkCollision();
        }, gameSpeedDelay)
    }else {
        snake.pop();
    }
}

//Test moving
// setInterval(() => {
//     move(); //Move first
//     draw(); //The draw the new position
// }, 200)

//Start game function
function startGame(){
    gameStarted = true; // Keep track of a running game.
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        draw();
        checkCollision();

    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event){
    if(!gameStarted && event.code === 'Space' || 
    (!gameStarted && event.key === ' ')
    ){
        startGame();
    }else {
        switch (event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if (gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

// Check collision with walls or self
function checkCollision(){
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = genrateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    
    
}

function updateScore(){
    const currentScore = snake.length -1;
    scoreText.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    board.innerHTML = "";
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore ){
        highScore = currentScore;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
}