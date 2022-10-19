export class Maze3dGenerator {
    /**
     * Abstract class that has two metods:
     * 1 - generate: generate an instance of 3d maze. This method is not implemented in this class.
     * 2 - measureAlgorithmTime: measure the times that take the generate function. 
     *     This method is identical to all the maze generating algorithms, so is implemented here. 
     * @param {Number} nLevels 
     * @param {Number} nRows 
     * @param {Nubmer} nCols 
     */ 

    static generate(nLevels, nRows, nCols, map) {
        throw new Error('Method generator must be implemented');
    }

    static measureAlgorithmTime(nLevels, nRows, nCols, map) {
        function formatString(result) {
            let s = '';

            if (result >= 60000) {
                s += `${Math.floor(result / 60000)} minutes, `;
                result = result % 60000;
            }
            if (result >= 1000) {
                s += `${Math.floor(result / 1000)} seconds, `;
                result = result % 1000;
            }
            s += `${result} ms.`;

            return s;
        }

        const start = new Date();
        
        this.generate(nLevels, nRows, nCols, map);
            
        const end = new Date();
        const result = end - start;
        const s = formatString(result);
        
        return `The function generate in ${this.name} took ` + s;   
    }

    constructor() {
        if (this.constructor === Maze3dGenerator) {
            throw new Error('Abstract Maze3dGenerator class cannot be instantiated');
        }
    }
}

class DFSMaze3dGenerator extends Maze3dGenerator {
    static generate(nLevels, nRows, nCols, map) {
        function randomCondition() {
            const condition = Math.floor(Math.random() * 2);
            if (condition >= 1) {
                return true;
            }
            return false;
        }

        function setStartFinish(nLevels, nRows, nCols, maze, map) {
            //left, right, forward, backward, up, down
                     
            let startLevel;
            let finishLevel;
            let startRow;
            let finishRow;
            let startCol;
            let finishCol;
            
            do {
                startLevel = Math.floor(Math.random() * nLevels);
                finishLevel = Math.floor(Math.random() * nLevels);
            
                startRow = Math.floor(Math.random() * nRows);
                finishRow = Math.floor(Math.random() * nRows);
            
                startCol = Math.floor(Math.random() * nCols);
                finishCol = Math.floor(Math.random() * nCols);
            } while (startCol === finishCol && startRow === finishRow && startCol === finishCol);
            
            const holdStart = map.get(maze[startLevel][startRow][startCol]);
            const holdEnd = map.get(maze[finishLevel][finishRow][finishCol]);
            map.set('S', holdStart);
            map.set('G', holdEnd);
            map.delete(maze[startLevel][startRow][startCol]);
            map.delete(maze[finishLevel][finishRow][finishCol]);

            maze[startLevel][startRow][startCol] = 'S';
            maze[finishLevel][finishRow][finishCol] = 'G';
            
            /* DFS */

            const stack = new Map();
            const visited = new Set();

            let currentCell = maze[startLevel][startRow][startCol];

            stack.set(currentCell, {level: startLevel, row: startRow, col: startCol});
            visited.add(currentCell);

            let currPosition = stack.get(currentCell);
            
            function unvisitedNeighbor(currentCell, currPosition, visited) {
                const currLevel = currPosition.level;
                const currRow = currPosition.row;
                const currCol = currPosition.col;
                let nextDirection = next;

                if ((currCol + 1) < nCols && !visited.has(maze[currLevel][currRow][currCol+1])) {
                    currPosition.col += 1;
                    nextDirection = Moves.right;
                    const nextBooleanArr = map.get(maze[currLevel][currRow][currCol+1]);
                    nextBooleanArr[Moves.left] = true;
                    return maze[currLevel][currRow][currCol+1];
                } else if ((currCol - 1) >= 0 && !visited.has(maze[currLevel][currRow][currCol-1])) {
                    currPosition.col -= 1;
                    nextDirection = Moves.left;
                    const nextBooleanArr = map.get(maze[currLevel][currRow][currCol-1]);
                    nextBooleanArr[Moves.right] = true;
                    return maze[currLevel][currRow][currCol-1];
                } else if ((currRow + 1) < nRows && !visited.has(maze[currLevel][currRow+1][currCol])) {
                    currPosition.row += 1;
                    nextDirection = Moves.forward;
                    const nextBooleanArr = map.get(maze[currLevel][currRow+1][currCol]);
                    nextBooleanArr[Moves.backward] = true;
                    return maze[currLevel][currRow+1][currCol];
                } else if ((currRow - 1) >= 0 && !visited.has(maze[currLevel][currRow-1][currCol])) {
                    currPosition.row -= 1;
                    nextDirection = Moves.backward;
                    const nextBooleanArr = map.get(maze[currLevel][currRow-1][currCol]);
                    nextBooleanArr[Moves.forward] = true;
                    return maze[currLevel][currRow-1][currCol];
                } else if ((currLevel + 1) < nLevels && !visited.has(maze[currLevel+1][currRow][currCol])) {
                    currPosition.level += 1;
                    nextDirection = Moves.up;
                    const nextBooleanArr = map.get(maze[currLevel+1][currRow][currCol]);
                    nextBooleanArr[Moves.down] = true;
                    return maze[currLevel+1][currRow][currCol];
                } else if ((currLevel - 1) >= 0 && !visited.has(maze[currLevel-1][currRow][currCol])) {
                    currPosition.level -= 1;
                    nextDirection = Moves.down;
                    const nextBooleanArr = map.get(maze[currLevel-1][currRow][currCol]);
                    nextBooleanArr[Moves.up] = true;
                    return maze[currLevel-1][currRow][currCol];
                } 
                return false;
            }
            let next;
            while (stack.size && currentCell !== 'G') {
                
                const n = unvisitedNeighbor(currentCell, currPosition, visited);
                if (n !== false) {
                    const booleanArr = map.get(currentCell);
                    booleanArr[next] = true;
                    visited.add(n);
                    stack.set(n, currPosition);
                    currentCell = n;
                    
                } else {
                    for (let j of stack.keys()) {
                        currentCell = j;
                        currPosition = stack.get(j);
                        stack.delete(j);
                        break;
                    }
                }
            }
        }

        /* FINISH DFS */

        const arr = new Array(nLevels).fill().map(() => new Array(nRows).fill().map(() => new Array(nCols).fill().map(() => Symbol())));

        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
            up: 4,
            down: 5
        };
        
        for (let i = 0; i < nLevels; i++) {
            for (let j = 0; j < nRows; j++) {
                for (let k = 0; k < nCols; k++) {
                    const booleanArr = new Array(6);

                    if (i === 0) {
                        booleanArr[Moves.down] = false;
                    } else if (i === nLevels - 1) {
                        booleanArr[Moves.up] = false;
                    } 
                    if (i > 0) {
                        booleanArr[Moves.down] = map.get(arr[i-1][j][k])[Moves.up];
                    }

                    if(j === 0) {
                        booleanArr[Moves.forward] = false;
                    } else if (j === nRows -1) {
                        booleanArr[Moves.backward] = false;
                    } 
                    if (j > 0) {
                        booleanArr[Moves.forward] = map.get(arr[i][j-1][k])[Moves.backward];
                    }

                    if (k === 0) {
                        booleanArr[Moves.left] = false;
                    } else if (k === nCols -1) {
                        booleanArr[Moves.right] = false;
                    } 
                    if (k > 0) {
                        booleanArr[Moves.left] = map.get(arr[i][j][k-1])[Moves.right];
                    }

                    for (let l = 0; l < booleanArr.length; l++) {
                        if (booleanArr[l] === undefined) {
                            booleanArr[l] = randomCondition();
                        }
                    }

                    const id = arr[i][j][k];
                    map.set(id, booleanArr);
                }
            }
        }
        setStartFinish(nLevels, nRows, nCols, arr, map);
        
        return arr;
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}