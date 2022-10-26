import Maze3d from "./maze3d.js";
import SearchDemo from "./search-demo.js";

const Moves = {
    left: 0,
    right: 1,
    forward: 2,
    backward: 3,
    up: 4,
    down: 5
};

//SearchDemo.run(50, 50, 50);

//const map = new Map();
/*const measureSimple = SimpleMaze3dGenerator.measureAlgorithmTime(30, 30, 30, map);
console.log(measureSimple);

const measureDFS = DFSMaze3dGenerator.measureAlgorithmTime(30, 30, 30, map);
console.log(measureDFS);

const measureKruskal = KruskalMaze3dGenerator.measureAlgorithmTime(30,30,30,map);
console.log(measureKruskal);*/

const resetGameBtn = document.getElementById('resetGameBtn');
const mazeDiv = document.getElementById('maze');
const formHTML = document.getElementById('form');
const nameInputHTML = document.getElementById('name');
const rowsHTML = document.getElementById('rows');
const colsHTML = document.getElementById('cols');
const levelsHTML = document.getElementById('levels');
const nameError = document.querySelector('#name + span.error');
const rowsError = document.querySelector('#rows + span.error')
const colsError = document.querySelector('#cols + span.error');
const levelsError = document.querySelector('#levels + span.error');
const piece = document.createElement('img');
const loadBtn = document.getElementById('loadBtn');
const loadGame = document.getElementById('loadGame');
const loadError = document.querySelector('#loadGame + span.error');
const startPosition = new Array(3);
const currPos = new Array(3);
const finalPosition = new Array(3);

let pieceStartLeft;
let pieceStartTop;
let cellSize;
let rowHeight;
let nCols;
let nRows;
let nLevels;
let game;
let gameMaze;
let gameMap;
let name;


nameInputHTML.addEventListener('input', checkNameValidity);
rowsHTML.addEventListener('input', checkRowValidity);
colsHTML.addEventListener('input', checkColsValidity);
levelsHTML.addEventListener('input', checkLevelsValidity);
loadGame.addEventListener('input', checkLoadValidity);
formHTML.addEventListener('submit', validation);

function validation(e) {
    e.preventDefault();

    const isNameValid = checkNameValidity();
    const isRowValid = checkRowValidity();
    const isColValid = checkColsValidity();
    const isLevelValid = checkLevelsValidity();

    if (isNameValid && isRowValid && isColValid && isLevelValid) {
        startNewGame();
    }
}

function checkLoadValidity() {
    if (loadGame.checkValidity()) {
        loadError.textContent = ''; // Reset the content of the error message
        loadError.className = 'error'; // Reset the visual state of the error message
        return true;
    }
    
    if (loadGame.validity.valueMissing) {
        loadError.textContent = 'You need to enter a name.';
    } else if (loadGame.validity.patternMismatch) {
        loadError.textContent = 'The name can contain only alphabet letters.';
    }
    loadError.className = 'error active';
    return false;
}

function checkNameValidity() {
    if (nameInputHTML.checkValidity()) {
        nameError.textContent = ''; // Reset the content of the error message
        nameError.className = 'error'; // Reset the visual state of the error message
        return true;
    }
    
    if (nameInputHTML.validity.valueMissing) {
        nameError.textContent = 'You need to enter a name.';
    } else if (nameInputHTML.validity.patternMismatch) {
        nameError.textContent = 'The name can contain only alphabet letters.';
    }
    nameError.className = 'error active';
    return false;
}

function checkRowValidity() {
    if (rowsHTML.checkValidity()) {
        rowsError.textContent = ''; // Reset the content of the error message
        rowsError.className = 'error'; // Reset the visual state of the error message
        return true;
    }
    
    if (rowsHTML.validity.valueMissing) {
        rowsError.textContent = 'You need to enter a Number.';
    } else if (rowsHTML.validity.patternMismatch) {
        rowsError.textContent = 'The input can contain only Numbers.';
    }
    rowsError.className = 'error active';
    return false;
}

function checkColsValidity() {
    if (colsHTML.checkValidity()) {
        colsError.textContent = ''; // Reset the content of the error message
        colsError.className = 'error'; // Reset the visual state of the error message
        return true;
    }
    
    if (colsHTML.validity.valueMissing) {
        colsError.textContent = 'You need to enter a Number.';
    } else if (colsHTML.validity.patternMismatch) {
        colsError.textContent = 'The input can contain only Numbers.';
    }
    colsError.className = 'error active';
    return false;
}

function checkLevelsValidity() {
    if (levelsHTML.checkValidity()) {
        levelsError.textContent = ''; // Reset the content of the error message
        levelsError.className = 'error'; // Reset the visual state of the error message
        return true;
    }
    
    if (levelsHTML.validity.valueMissing) {
        levelsError.textContent = 'You need to enter a Number.';
    } else if (levelsHTML.validity.patternMismatch) {
        levelsError.textContent = 'The input can contain only Numbers.';
    }
    levelsError.className = 'error active';
    return false;
}


function loadGameSaved() {
    const loadName = loadGame.value;

    const lvlStart = Number(localStorage.getItem(`${loadName}StartLevel`));
    const rowStart = Number(localStorage.getItem(`${loadName}StartRow`));
    const colStart = Number(localStorage.getItem(`${loadName}StartCol`));

    const lvlFinish = Number(localStorage.getItem(`${loadName}FinishLevel`));
    const rowFinish = Number(localStorage.getItem(`${loadName}FinishRow`));
    const colFinish = Number(localStorage.getItem(`${loadName}FinishCol`));

    console.log(lvlStart, rowStart, colStart);
;    
    game = JSON.parse(localStorage.getItem(loadName));

    const dimensions = game[0];
    nLevels =  dimensions.levels;
    nRows = dimensions.rows;
    nCols = dimensions.cols;

    gameMaze = new Array(nLevels).fill().map(() => new Array(nRows).fill().map(() => new Array(nCols).fill().map(() => Symbol())));
    gameMap = new Map();

    for(let i = 1; i < game.length; i++) {
        gameMaze[game[i].level][game[i].row][game[i].col] = Symbol();
        if (game[i].level === lvlStart && game[i].row === rowStart && game[i].col === colStart) {
            gameMaze[game[i].level][game[i].row][game[i].col] = 'S';
        } else if (game[i].level === lvlFinish && game[i].row === rowFinish && game[i].col === colFinish) {
            gameMaze[game[i].level][game[i].row][game[i].col] = 'G';
        }
        const booleanArr = [game[i].left, game[i].right, game[i].forward, game[i].backward, game[i].up, game[i].down];
        gameMap.set(gameMaze[game[i].level][game[i].row][game[i].col], booleanArr);
    }
    
    displayGame(mazeDiv);
}


function startNewGame() {
    name = nameInputHTML.value;
    nRows = Number(rowsHTML.value);
    nCols = Number(colsHTML.value);
    nLevels = Number(levelsHTML.value);

    game = new Maze3d(nLevels, nRows, nCols);
    game.DFSGenerator();

    rowsHTML.value = '';
    colsHTML.value = '';
    levelsHTML.value = '';
    

    game.gameSave(name);
    loadBtn.addEventListener('click', loadGameSaved);

    gameMaze = game.maze;
    gameMap = game.moves;
    
    displayGame(mazeDiv);
}

function displayGame(elem) {
    elem.innerHTML = '';
    piece.src = 'images/piece.png';
    elem.appendChild(piece);
    mazeDiv.style.display = 'block';

    rowHeight = 100 / nRows;
    cellSize = 100 / nCols;

    for (let i = 0; i < gameMaze.length; i++) {
        const newLevel = document.createElement('div');
        newLevel.classList.add('level');
        
        for (let j = 0; j < gameMaze[0].length; j++) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.style.height = rowHeight + '%';
            
            for (let k = 0; k < gameMaze[0][0].length; k++) {
                const booleanArr = gameMap.get(gameMaze[i][j][k])

                const newCol = document.createElement('div');
                newCol.classList.add('col');
                newCol.style.width = cellSize + '%';

                if (booleanArr[Moves.right]) {
                    newCol.style.borderRight = '2px solid white';
                }
                if (booleanArr[Moves.left]) {
                    newCol.style.borderLeft = '2px solid white';
                }
                if (booleanArr[Moves.forward]) {
                    newCol.style.borderTop = '2px solid white';
                }
                if (booleanArr[Moves.backward]) {
                    newCol.style.borderBottom = '2px solid white';
                }
                if (gameMaze[i][j][k] === 'S') {
                    startPosition[0] = i;
                    startPosition[1] = j;
                    startPosition[2] = k;
                    localStorage.setItem(`${name}StartLevel`, `${i}`);
                    localStorage.setItem(`${name}StartRow`, `${j}`);
                    localStorage.setItem(`${name}StartCol`, `${k}`);
                    newLevel.style.display = 'block';
                    newCol.style.backgroundColor = 'green';
                } else if (gameMaze[i][j][k] === 'G') {
                    finalPosition[0] = i;
                    finalPosition[1] = j;
                    finalPosition[2] = k;
                    localStorage.setItem(`${name}FinishLevel`, `${i}`);
                    localStorage.setItem(`${name}FinishRow`, `${j}`);
                    localStorage.setItem(`${name}FinishCol`, `${k}`);
                    newCol.style.backgroundColor = 'red';
                } else if (booleanArr[Moves.up] && booleanArr[Moves.down]) {
                    newCol.classList.add('upAndDown');
                } else if (booleanArr[Moves.up]) {
                    newCol.classList.add('up');
                } else if (booleanArr[Moves.down]) {
                    newCol.classList.add('down');
                }   
                newRow.appendChild(newCol);
                
            }
            newLevel.appendChild(newRow);
        }
        elem.appendChild(newLevel);
    }

    let pieceMaxWidth = cellSize > rowHeight ? rowHeight / 2 : cellSize / 2;
    pieceMaxWidth += '%';
    pieceStartLeft = cellSize / 64 + cellSize * startPosition[2];
    pieceStartTop = rowHeight / 4 + rowHeight * startPosition[1];
    piece.style.maxWidth = pieceMaxWidth;
    piece.style.left = pieceStartLeft + '%';
    piece.style.top = pieceStartTop + '%';

    currPos[0] = startPosition[0];
    currPos[1] = startPosition[1];
    currPos[2] = startPosition[2];
    
    document.addEventListener('keydown', makeMove); 
    
    resetGameBtn.addEventListener('click', resetGame);
   
}

function resetGame() {
    mazeDiv.children[currPos[0]+1].style.display = 'none';
    mazeDiv.children[startPosition[0]+1].style.display = 'block';

    currPos[0] = startPosition[0];
    currPos[1] = startPosition[1];
    currPos[2] = startPosition[2];
    
    pieceStartLeft = cellSize / 64 + cellSize * startPosition[2];
    pieceStartTop = rowHeight / 4 + rowHeight * startPosition[1];
    piece.style.left = pieceStartLeft + '%';
    piece.style.top = pieceStartTop + '%';
 
}   

function makeMove(e) {
    switch (e.keyCode) {
        case 38:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.forward]) {
                pieceStartTop -= rowHeight;
                piece.style.top = pieceStartTop + '%';
                currPos[1] -= 1;
            }
            break;
        case 39:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.right]) {
                pieceStartLeft += cellSize;
                piece.style.left = pieceStartLeft + '%';
                currPos[2] += 1;
            }
            break;
        case 37:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.left]) {
                pieceStartLeft -= cellSize;
                piece.style.left = pieceStartLeft + '%';
                currPos[2] -= 1;
            }
            break;
        case 40:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.backward]) {
                pieceStartTop += rowHeight;
                piece.style.top = pieceStartTop + '%';
                currPos[1] += 1;
            }
            break;
        case 34:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.up]) {
                currPos[0] += 1;
                mazeDiv.children[currPos[0]].style.display = 'none';
                mazeDiv.children[currPos[0]+1].style.display = 'block';
            }
            break;
        case 33:
            if (gameMap.get(gameMaze[currPos[0]][currPos[1]][currPos[2]])[Moves.down]) {
                mazeDiv.children[currPos[0]+1].style.display = 'none';
                mazeDiv.children[currPos[0]].style.display = 'block';
                currPos[0] -= 1;
            }
            break;
    }
    if (isWin(currPos, finalPosition)) {
        document.removeEventListener('keydown', makeMove);
        location = 'congrats.html';
    }
}

function isWin(currPos, finalPos) {
    for (let i = 0; i < currPos.length; i++) {
        if (currPos[i] !== finalPos[i]) {
            return false;
        }
    }
    return true;
}


