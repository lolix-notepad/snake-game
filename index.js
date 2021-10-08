/* DOM elements */

const  btnEnd             =  document.getElementById('btn-end');
const  btnRestart         =  document.getElementById('btn-restart-game');
const  btnStart           =  document.getElementById('btn-start');
const  canvas             =  document.querySelectorAll('.canvas')[0];
const  coverGameOver      =  document.getElementById('cover-game-over');
const  displayGameOver    =  document.getElementById('display-game-over');
const  displayScore       =  document.getElementById('display-score');
const  food               =  document.getElementById('food');
const  snake              =  document.querySelectorAll('.tail')[0];
const  startPage          =  document.getElementById('start-page');
const  viewSnake          =  document.getElementById('snake-view');
const  wrapperRestartBtn  =  document.getElementById('wrapper-btn-restart-game');

/* Global Variables */

let direction = 'right',
    isPlaying = false,
    isSnakeAlive,
    frameRate = 200,
    tail = [],
    gameExecution,
    grid,
    score = 0;

/* Functions */

const limit = (minimum, maximum) => { 
    return { minimum, maximum }
}

const isOutOfArea = (pos, limitX, limitY) => {
    if (pos.x < limitX.minimum ||
        pos.x > limitX.maximum ||
        pos.y < limitY.minimum ||
        pos.y > limitY.maximum
    ) {
        return true;
    };

    return false;
}

const endGame = () => {
    isSnakeAlive = false;
    isPlaying = false;
    score = 0;
    displayGameOver.style.display = 'block';
    displayGameOver.textContent = 'Game over!';
    coverGameOver.style.display = 'block';
    wrapperRestartBtn.style.display = 'flex';
}

const moveSnake = (x, y) => {
    const limitX = limit(0, canvas.clientWidth - snake.clientWidth);
    const limitY = limit(0, canvas.clientHeight - snake.clientWidth);

    let newPos = {
        x: snake.offsetLeft + x,
        y: snake.offsetTop + y,
    };

    if (isOutOfArea(newPos, limitX, limitY))
        return endGame();

    for (let i = 0; i < tail.length; i++) {
        if (newPos.x === tail[i].offsetLeft &&
            newPos.y === tail[i].offsetTop)
            return endGame();
    }

    let previousPos = {
        x: snake.offsetLeft,
        y: snake.offsetTop,
    };

    snake.style.left = `${newPos.x}px`;
    snake.style.top = `${newPos.y}px`;

    for (let i = 0; i < tail.length; i++) {
        const currentPos = {
            x: tail[i].offsetLeft,
            y: tail[i].offsetTop
        };

        tail[i].style.left = `${previousPos.x}px`;
        tail[i].style.top = `${previousPos.y}px`;

        previousPos = currentPos;
    }
}

const startGame = () => {
    if (!isSnakeAlive) return;

    const speedSnake = snake.clientWidth;

    if (snake.offsetLeft === food.offsetLeft &&
        snake.offsetTop === food.offsetTop) {
        generateFood();
        ++score;
        displayScore.textContent = `Score: ${score}`;
        const newTail = document.createElement('div');
        newTail.classList.add('tail');
        canvas.appendChild(newTail);
        tail.push(newTail);
    }

    switch (direction) {
        case 'right':
            moveSnake(speedSnake, 0);
            break;
        case 'down':
            moveSnake(0, speedSnake);
            break;
        case 'left':
            moveSnake(-speedSnake, 0);
            break;
        case 'up':
            moveSnake(0, -speedSnake);
            break;
    }

    gameExecution = setTimeout(startGame, frameRate);
}

const resetVariables = () => {
    snake.style.left = '0px';
    snake.style.top = '0px';

    for (tailElement of tail)
        canvas.removeChild(tailElement);
    tail = [];

    score = 0;
    displayScore.textContent = 'Score: 0';
    displayGameOver.style.display = 'none';
    coverGameOver.style.display = 'none';
    wrapperRestartBtn.style.display = 'none';
}

const generateFood = () => {
    const width =  canvas.clientWidth - snake.clientWidth;
    const height = canvas.clientHeight - snake.clientWidth;

    const gridX = Math.round(width / snake.clientWidth);
    const gridY = Math.round(height / snake.clientWidth);

    generatedPosX = Math.round(Math.random() * gridX) * snake.clientWidth;
    generatedPosY = Math.round(Math.random() * gridY) * snake.clientWidth;

    if (generatedPosX === snake.offsetLeft &&
        generatedPosY === snake.offsetTop)
        return generateFood();

    for (tailElement of tail) {
        if (generatedPosX === tailElement.offsetLeft &&
            generatedPosY === tailElement.offsetTop)
            return generateFood();
    }

    food.style.left = `${generatedPosX}px`;
    food.style.top = `${generatedPosY}px`;
}

/* Handlers */

const handlerStart = () => {
    direction = "right";
    isPlaying = true;
    isSnakeAlive = true;
    startPage.style.display = 'none';
    viewSnake.style.display = 'flex';
    displayScore.textContent = 'Score: 0';
    generateFood();
    startGame();
}

const handlerEnd = () => {
    clearTimeout(gameExecution);
    isPlaying = false;
    isSnakeAlive = false;
    resetVariables();
    viewSnake.style.display = 'none';
    startPage.style.display = 'flex';
}

const handlerRestart = () => {
    resetVariables();
    handlerStart();
}

const handlerDirection = (keyName) => {
    switch (keyName) {
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

const handlerHotkeys = (keyName) => {
    if (keyName === 'Space' && !isPlaying) {
        handlerStart();
    }
}

const handlerKeydown = (event) => {
    const keyName = event.code;

    // Dispatcher
    if (isPlaying) {
        handlerDirection(keyName);
    }

    handlerHotkeys(keyName);
}

/* Events */

document.addEventListener('keydown', handlerKeydown)
btnStart.addEventListener('click', handlerStart);
btnEnd.addEventListener('click', handlerEnd);
btnRestart.addEventListener('click', handlerRestart);
