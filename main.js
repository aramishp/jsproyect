import Maze3d from "./maze3d.js";

const Moves = {
    left: 0,
    right: 1,
    forward: 2,
    backward: 3,
    up: 4,
    down: 5
};

const newGameBtn = document.getElementById('newGameBtn');
const mazeDiv = document.getElementById('maze');

newGameBtn.addEventListener('click', startNewGame);

function startNewGame() {
    const nRows = document.getElementById('rows');
    const nCols = document.getElementById('cols');
    const nLevels = document.getElementById('levels');

    const game = new Maze3d(Number(nLevels.value), Number(nRows.value), Number(nCols.value));
    
    displayGame(game, mazeDiv);
}

function displayGame(game, elem) {
    const gameMaze = game.maze;
    const gameMap = game.moves;

    const rowHeight = 100 / (gameMaze[0].length);
    const cellSize = 100 / (gameMaze[0][0].length);
    
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
                
                const newSep = document.createElement('div');
                newSep.classList.add('colSep');
                newSep.style.backgroundColor = 'black';

                newRow.appendChild(newCol);
                if (k < gameMaze[0][0].length - 1) {
                    newRow.appendChild(newSep);
                }
                
            }
            newLevel.appendChild(newRow);
        }
        elem.appendChild(newLevel);
    }
}
