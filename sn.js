// define html element
const game_board=document.querySelector("#game-board");
const instructionText=document.querySelector("#instruction-text");
const score=document.querySelector("#score");
const highscoreText=document.querySelector("#highscore");

//define game variables
let gridSize=20;
let snake=[{x:10,y:10}];
let food=generateFood();
let direction='up';
let gameInterval;
let gameSpeedDelay=400;
let gameStarted=false;
let highScore=0;

//draw game map,snake ,food
const draw=()=>{
    game_board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake
const drawSnake=()=>{
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment)
        game_board.appendChild(snakeElement);
    });
}

//create a snake or food cube/div
const createGameElement=((tag,className)=>{
    const element=document.createElement(tag);
    element.className=className;
    return element;
})

//set ythe of the snake or the food
const setPosition=(element,position)=>{
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//testing draw function
//draw();


//draw food function
function drawFood(){
    if(gameStarted){
    const foodElement=createGameElement('div','food');
    setPosition(foodElement,food);
    game_board.appendChild(foodElement);
    }

}

//generate food
function generateFood(){
    const x =Math.floor(Math.random()*gridSize)+1;
    const y =Math.floor(Math.random()*gridSize)+1;
    return { x ,y };
}

//moving the snake
function move(){
    const head={...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
                head.y++;
                break;
        case 'left':
                    head.x--;
                    break;
    
        case 'right':
                        head.x++;
                        break;
    }

    snake.unshift(head);
   // snake.pop();

   if(head.x==food.x && head.y==food.y){
      food=generateFood();
      increaseSpeed();
      clearInterval(gameInterval); //clear past interval
      gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
      },gameSpeedDelay);
   }else{
    snake.pop();
   }
}

//test moving
/*
setInterval(()=>{
    move(); //move first
    draw(); //then draw again new position
},200)
*/

//start game function
function startGame(){
    gameStarted=true;  //keep track of a running game
    instructionText.style.display='none';
    gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}


//key press event  listen
function handleKeyPress(event){
    if((!gameStarted && event.code==='space') ||(!gameStarted && event.key===' ')){
        
         startGame();
    } else{
        switch(event.key){
            case 'ArrowUp':
                direction='up';
                break;
            
            case 'ArrowDown':
                    direction='down';
                    break;
            case 'ArrowLeft':
                        direction='left';
                        break;    
            case 'ArrowRight':
                            direction='right';
                            break;

        }
    }
} 

document.addEventListener("keydown",handleKeyPress)

function increaseSpeed(){
    //console.log(gameSpeedDelay);

    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
    
}

function checkCollision(){
    const head=snake[0];

    if(head.x <1 || head.x>gridSize ||head.y<1 || head.y>gridSize){
        resetGame();
    }

    for(let i=1;i<snake.length;i++){
        if(head.x===snake[i].x && head.y===snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    snake=[{x:10,y:10}];
    food=generateFood();
    direction="right";
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    const currentScore=snake.length -1;
    score.textContent=currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted =false;
    instructionText.style.display="block";

}

function updateHighScore(){
    const currentScore=snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highscoreText.textContent=highScore.toString().padStart(3,"0");
    }
    highscoreText.style.display="block"
}