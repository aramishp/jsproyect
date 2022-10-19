class Maze3d {
    /**
     * A class that represents the entire 3d maze.
     * @param {Number} nLevels 
     * @param {Number} nRows 
     * @param {Nubmer} nCols 
     */

    #nLevels
    #nRows
    #nCols

    /*
     * Represents a 3d array of cells.
     * Is filled later with generators. 
    */
    #maze

    /**
     * Represents a map, that contain the possible moves for every cell.
     * Every symbol key has an array of booleans as a value, indicating the valid moves.
     * This array is ordered as follows: left, right, forward, backward, up, down
     * Filled later with a generator function
     * @type {Map, <Symbol, boolean>}
     */
    #moves

    constructor(nLevels = 3, nRows = 5, nCols = 5) {
        this.#moves = new Map();
        this.#nLevels = nLevels;
        this.#nRows = nRows;
        this.#nCols = nCols;
        this.#maze = KruskalMaze3dGenerator.generate(nLevels, nRows, nCols, this.#moves);
    }

    get moves() {
        return this.#moves;
    }

    get maze() {
        return this.#maze;
    }
    
    toString() {
        let s = '';
        let header = '';
        let footer = '';

        for (let i = 0; i < this.#nCols * 2 + 1; i++) {
            header += '_';
            footer += '¯';
        }

        for (let i = 0; i < this.#nLevels; i++) {
            s += `Level ${i}\n\n` + header + '\n';
            for (let j = 0; j < this.#nRows; j++) {
                let cells = '|';
                let lineSpacing = '|';
                for (let k = 0; k < this.#nCols; k++) {
                    const arr = this.#moves.get(this.#maze[i][j][k])
                    if (this.#maze[i][j][k] === 'S' || this.#maze[i][j][k] === 'G') {
                        cells += this.#maze[i][j][k];
                    } else if (arr[4] && arr[5]) {
                        cells += '↕'
                    } else if (arr[4]) {
                        cells += '↑';
                    } else if (arr[5]) {
                        cells += '↓';
                    } else {
                        cells += ' ';
                    }
                    if (arr[1]) {
                        cells += ' ';
                    } else {
                        cells += '|'
                    }
                    if (arr[3]) {
                        lineSpacing += ' ';
                    } else {
                        lineSpacing += '-';
                    }
                    if (k === this.#nCols - 1) {
                        lineSpacing += '|';
                        break;
                    }
                    lineSpacing += '+';
                }
                s += cells + '\n';
                if (j !== this.#nRows - 1) {
                    s += lineSpacing + '\n';
                }
            }    
            s += footer + '\n';      
        }
        return s;
    }
}

class Maze3dGenerator {
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
            
            function unvisitedNeighbor(currPosition, visited) {
                const currLevel = currPosition.level;
                const currRow = currPosition.row;
                const currCol = currPosition.col;
                let nextDirection;

                if ((currCol + 1) < nCols && !visited.has(maze[currLevel][currRow][currCol+1])) {
                    currPosition.col += 1;
                    nextDirection = Moves.right;
                    const nextBooleanArr = map.get(maze[currLevel][currRow][currCol+1]);
                    nextBooleanArr[Moves.left] = true;
                    return [maze[currLevel][currRow][currCol+1], nextDirection];
                } else if ((currCol - 1) >= 0 && !visited.has(maze[currLevel][currRow][currCol-1])) {
                    currPosition.col -= 1;
                    nextDirection = Moves.left;
                    const nextBooleanArr = map.get(maze[currLevel][currRow][currCol-1]);
                    nextBooleanArr[Moves.right] = true;
                    return [maze[currLevel][currRow][currCol-1], nextDirection];
                } else if ((currRow + 1) < nRows && !visited.has(maze[currLevel][currRow+1][currCol])) {
                    currPosition.row += 1;
                    nextDirection = Moves.backward;
                    const nextBooleanArr = map.get(maze[currLevel][currRow+1][currCol]);
                    nextBooleanArr[Moves.forward] = true;
                    return [maze[currLevel][currRow+1][currCol], nextDirection];
                } else if ((currRow - 1) >= 0 && !visited.has(maze[currLevel][currRow-1][currCol])) {
                    currPosition.row -= 1;
                    nextDirection = Moves.forward;
                    const nextBooleanArr = map.get(maze[currLevel][currRow-1][currCol]);
                    nextBooleanArr[Moves.backward] = true;
                    return [maze[currLevel][currRow-1][currCol], nextDirection];
                } else if ((currLevel + 1) < nLevels && !visited.has(maze[currLevel+1][currRow][currCol])) {
                    currPosition.level += 1;
                    nextDirection = Moves.up;
                    const nextBooleanArr = map.get(maze[currLevel+1][currRow][currCol]);
                    nextBooleanArr[Moves.down] = true;
                    return [maze[currLevel+1][currRow][currCol], nextDirection];
                } else if ((currLevel - 1) >= 0 && !visited.has(maze[currLevel-1][currRow][currCol])) {
                    currPosition.level -= 1;
                    nextDirection = Moves.down;
                    const nextBooleanArr = map.get(maze[currLevel-1][currRow][currCol]);
                    nextBooleanArr[Moves.up] = true;
                    return [maze[currLevel-1][currRow][currCol], nextDirection];
                } 
                return false;
            }
            
            while (stack.size && currentCell !== 'G') {
                const symbolAndDirection = unvisitedNeighbor(currPosition, visited);
                
                if (symbolAndDirection !== false) {
                    const n = symbolAndDirection[0];
                    const booleanArr = map.get(currentCell);
                    booleanArr[symbolAndDirection[1]] = true;
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

                    if (nLevels !== 1) {
                        if (i === 0) {
                            booleanArr[Moves.down] = false;
                        } else if (i === nLevels - 1) {
                            booleanArr[Moves.up] = false;
                        } 
                        if (i > 0) {
                            booleanArr[Moves.down] = map.get(arr[i-1][j][k])[Moves.up];
                        }
                    } else {
                        booleanArr[Moves.down] = false;
                        booleanArr[Moves.up] = false;
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
                        //booleanArr[Moves.left] = map.get(arr[i][j][k-1])[Moves.right];
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

class SimpleMaze3dGenerator extends Maze3dGenerator {
    static generate(nLevels, nRows, nCols, map) {
        function randomCondition() {
            const condition = Math.floor(Math.random() * 2);
            if (condition >= 1) {
                return true;
            }
            return false;
        }

        function randomNumber(max, min = 0) {
            return Math.floor(Math.random() * max) - min;
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

            const directions = ['inLevels', 'inRows', 'inCols'];
            
            while (maze[startLevel][startRow][startCol] !== maze[finishLevel][finishRow][finishCol]) {
                const goOn = randomNumber(directions.length);
                
                if (directions[goOn] === 'inLevels') {
                    if (startLevel > finishLevel) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel-1][startRow][startCol])
                        booleanArr[Moves.down] = true;
                        nextBooleanArr[Moves.up] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel-1][startRow][startCol], nextBooleanArr);
                        startLevel -= 1;
                    } else if (startLevel < finishLevel) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel+1][startRow][startCol])
                        booleanArr[Moves.up] = true;
                        nextBooleanArr[Moves.down] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel+1][startRow][startCol], nextBooleanArr);
                        startLevel += 1;
                    } else {
                        directions.shift();
                    }
                } else if (directions[goOn] === 'inRows') {
                    if (startRow > finishRow) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel][startRow-1][startCol]);
                        booleanArr[Moves.forward] = true;
                        nextBooleanArr[Moves.backward] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel][startRow-1][startCol], nextBooleanArr);
                        startRow -= 1;
                    } else if (startRow < finishRow) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel][startRow+1][startCol]);
                        booleanArr[Moves.backward] = true;
                        nextBooleanArr[Moves.forward] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel][startRow+1][startCol], nextBooleanArr);
                        startRow += 1;
                    } else {
                        if (directions[1] === 'inRows') {
                            directions.splice(1, 1);
                        } else {
                            directions.shift();
                        }
                    }
                } else if (directions[goOn] === 'inCols') {
                    if (startCol > finishCol) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel][startRow][startCol-1]);
                        booleanArr[Moves.left] = true;
                        nextBooleanArr[Moves.right] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel][startRow][startCol-1], nextBooleanArr);
                        startCol -= 1;
                    } else if (startCol < finishCol) {
                        const booleanArr = map.get(maze[startLevel][startRow][startCol]);
                        const nextBooleanArr = map.get(maze[startLevel][startRow][startCol+1]);
                        booleanArr[Moves.right] = true;
                        nextBooleanArr[Moves.left] = true;
                        map.set(maze[startLevel][startRow][startCol], booleanArr);
                        map.set(maze[startLevel][startRow][startCol+1], nextBooleanArr);
                        startCol += 1;
                    } else {
                        directions.pop();
                    }
                }
            }
        }

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

                    if (nLevels !== 1) {
                        if (i === 0) {
                            booleanArr[Moves.down] = false;
                        } else if (i === nLevels - 1) {
                            booleanArr[Moves.up] = false;
                        } 
                        if (i > 0) {
                            booleanArr[Moves.down] = map.get(arr[i-1][j][k])[Moves.up];
                        }
                    } else {
                        booleanArr[Moves.down] = false;
                        booleanArr[Moves.up] = false;
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
                        //booleanArr[Moves.left] = map.get(arr[i][j][k-1])[Moves.right];
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

class KruskalMaze3dGenerator extends Maze3dGenerator {
    static generate(nLevels, nRows, nCols, map) {
        function randomNumber(max, min = 0) {
            return Math.floor(Math.random() * max) - min;
        }

        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
            up: 4,
            down: 5
        };

        const MOVESOPTIONS = Object.keys(Moves).length;

        const arr = new Array(nLevels).fill().map(() => new Array(nRows).fill().map(() => new Array(nCols).fill().map(() => Symbol())));
        const nCells = nLevels * nCols * nRows;

        const containers = new Array(nCells).fill().map(() => new Set());
        let containersCounter = 0;
        
        for (let i = 0; i < nLevels; i++) {
            for (let j = 0; j < nRows; j++) {
                for (let k = 0; k < nCols; k++, containersCounter++) {
                    const booleanArr = new Array(MOVESOPTIONS).fill();

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

                    const id = arr[i][j][k];
                    map.set(id, booleanArr);
                    containers[containersCounter].add(id);
                }                                                                             
            }
        }

        while (containers.length > 1) {
            let i = randomNumber(nLevels);
            let j = randomNumber(nRows);
            let k = randomNumber(nCols);
            let l = randomNumber(MOVESOPTIONS);
            
            while (map.get(arr[i][j][k])[l] !== undefined) {
                if (l < MOVESOPTIONS -1) {
                    l++;
                } else if (k < nCols -1) {
                    l = 0;
                    k++;
                } else if(j < nRows -1) {
                    l = 0;
                    k = 0;
                    j++;
                } else if (i < nLevels - 1) {
                    l = 0;
                    k = 0;
                    j = 0;
                    i++;
                } else {
                    l = 0;
                    k = 0;
                    j = 0;
                    i = 0;
                }
            }

            let found;

            switch (l) {
                case Moves.left:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j][k-1])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j][k-1])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.left] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j][k-1]);
                            nextBooleanArr[Moves.right] = true;
                            map.set(arr[i][j][k-1], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.left] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j][k-1]);
                        nextBooleanArr[Moves.right] = false;
                        map.set(arr[i][j][k-1], nextBooleanArr);
                    }
                    break;
                case Moves.right:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j][k+1])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j][k+1])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.right] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j][k+1]);
                            nextBooleanArr[Moves.left] = true;
                            map.set(arr[i][j][k+1], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.right] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j][k+1]);
                        nextBooleanArr[Moves.left] = false;
                        map.set(arr[i][j][k+1], nextBooleanArr);
                    }
                    break;
                case Moves.forward:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j-1][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j-1][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.forward] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j-1][k]);
                            nextBooleanArr[Moves.backward] = true;
                            map.set(arr[i][j-1][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.forward] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j-1][k]);
                        nextBooleanArr[Moves.backward] = false;
                        map.set(arr[i][j-1][k], nextBooleanArr);
                    }
                    break;
                case Moves.backward:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j+1][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j+1][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.backward] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j+1][k]);
                            nextBooleanArr[Moves.forward] = true;
                            map.set(arr[i][j+1][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.backward] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j+1][k]);
                        nextBooleanArr[Moves.forward] = false;
                        map.set(arr[i][j+1][k], nextBooleanArr);
                    }
                    break;
                case Moves.down:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i-1][j][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i-1][j][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.down] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i-1][j][k]);
                            nextBooleanArr[Moves.up] = true;
                            map.set(arr[i-1][j][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.down] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i-1][j][k]);
                        nextBooleanArr[Moves.up] = false;
                        map.set(arr[i-1][j][k], nextBooleanArr);
                    }
                    break;
                case Moves.up:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i+1][j][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i+1][j][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.up] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i+1][j][k]);
                            nextBooleanArr[Moves.down] = true;
                            map.set(arr[i+1][j][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.up] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i+1][j][k]);
                        nextBooleanArr[Moves.down] = false;
                        map.set(arr[i+1][j][k], nextBooleanArr);
                    }
                    break;
            }         
        }

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
            
        const holdStart = map.get(arr[startLevel][startRow][startCol]);
        const holdEnd = map.get(arr[finishLevel][finishRow][finishCol]);
        map.set('S', holdStart);
        map.set('G', holdEnd);
        map.delete(arr[startLevel][startRow][startCol]);
        map.delete(arr[finishLevel][finishRow][finishCol]);

        arr[startLevel][startRow][startCol] = 'S';
        arr[finishLevel][finishRow][finishCol] = 'G';

        return arr;
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

class Searchable {
    static search() {
        throw new Error('Method search must be implemented');
    }

    constructor() {
        if (this.constructor === Searchable) {
            throw new Error('Abstract Searchable class cannot be instantiated');
        }
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.children = new Array();
    }

    addChildren(value) {
        this.children.push(new Node(value));
        return this;
    }
}

class BreadthFirstSearch extends Searchable {
    static search(game, source = 'S', target = 'G') {
        function BFS(root) {
            const stack = [];
            stack.push(root);
            

            const visited = new Set();

            while(stack.length > 0) {
                const currNode = stack.shift();

                if (currNode.value === target) {
                    return visited.size;
                }
                
                visited.add(currNode.value);
                
                for (let i = 0; i < currNode.children.length; i++) {
                    if (!visited.has(currNode.children[i].value)) {
                        stack.push(currNode.children[i]);
                    }
                }
            }
            return 'false';
        }

        function searchStartNode(problem) {
            for (let i = 0; i < problem.length; i++) {
                for (let j = 0; j < problem[0].length; j++) {
                    for (let k = 0; k < problem[0][0].length; k++) {
                        if (problem[i][j][k] === 'S') {
                            return [i, j, k];
                        }
                    }
                }
            }
        }


        function adapter2D(problem, startPosition, map) {
            const Moves = {
                left: 0,
                right: 1,
                forward: 2,
                backward: 3,
            };

            const NDIRECTIONS = Object.keys(Moves).length;

            const root = new Node(problem[0][startPosition[1]][startPosition[2]]);
            const first = [root, startPosition[1], startPosition[2]];

            const neighborStack = [];
            neighborStack.push(first);

            const visited = new Set();
            
            while(neighborStack.length > 0) {
                
                const next = neighborStack.shift();
                const currNode = next[0];
                
                const currNodeRow = next[1];
                const currNodeCol = next[2];
//left, right, forward, backward, up, down
                if (!visited.has(currNode.value)) {    
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.left]) {
                        currNode.addChildren(problem[0][currNodeRow][currNodeCol-1]);
                        if (!visited.has(problem[0][currNodeRow][currNodeCol-1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol-1]);
                        }
                    }
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.right]) {
                        currNode.addChildren(problem[0][currNodeRow][currNodeCol+1]);
                        if (!visited.has(problem[0][currNodeRow][currNodeCol+1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol+1]);
                        }
                    } 
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.backward]) {
                        currNode.addChildren(problem[0][currNodeRow+1][currNodeCol]);
                        if (!visited.has(problem[0][currNodeRow+1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow+1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[0][currNodeRow][currNodeCol])[Moves.forward]) {
                        currNode.addChildren(problem[0][currNodeRow-1][currNodeCol]);
                        if (!visited.has(problem[0][currNodeRow-1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow-1, currNodeCol]);
                        }
                    } 
                    visited.add(currNode.value);
                } 
            }
            
            return root;            
        } 

        function adapter3D(problem, startPosition, map) {
            const Moves = {
                left: 0,
                right: 1,
                forward: 2,
                backward: 3,
                up: 4,
                down: 5
            };
        
            const NDIRECTIONS = Object.keys(Moves).length;
        
            const root = new Node(problem[startPosition[0]][startPosition[1]][startPosition[2]]);
            const first = [root, startPosition[0] ,startPosition[1], startPosition[2]];
           
            const neighborStack = [];
            neighborStack.push(first);
        
            const visited = new Set();
            
            while(neighborStack.length > 0) {
                const next = neighborStack.shift();
                
                const currNode = next[0];
                const currNodeLevel = next[1]        
                const currNodeRow = next[2];
                const currNodeCol = next[3];
               
        
                if (!visited.has(currNode.value)) {
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.left]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol-1]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol-1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol-1]);
                        }
                    }
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.right]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol+1]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol+1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol+1]);
                        }
                    } 
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.backward]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow+1][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow+1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow+1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.forward]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow-1][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow-1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow-1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.up]) {
                        currNode.addChildren(problem[currNodeLevel+1][currNodeRow][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel+1][currNodeRow][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel+1, currNodeRow, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.down]) {
                        currNode.addChildren(problem[currNodeLevel-1][currNodeRow][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel-1][currNodeRow][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel-1, currNodeRow, currNodeCol]);
                        }
                    } 
        
                    visited.add(currNode.value);
                }
            }
            return root;
        }
        

        const startNode = searchStartNode(game.maze);
        if (game.maze.length === 1) {
            return BFS(adapter2D(game.maze, startNode, game.moves));
        } else if (game.maze.length > 1) {
            return BFS(adapter3D(game.maze, startNode, game.moves));
        }     
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

class DepthFirstSearch {
    static search(game, source = 'S', target = 'G') {
        function DFS(root) {
            const stack = [];
            stack.push(root);
            
            const visited = new Set();
            
            while(stack.length > 0) {
                const currNode = stack.pop();

                if (currNode.value === target) {
                    return visited.size;
                }
                
                visited.add(currNode.value);

                for (let i = 0; i < currNode.children.length; i++) {
                    if (!visited.has(currNode.children[i].value)) {
                        let addToStack = true;
                        for (let j = 0; j < stack.length; j++) {
                            if (stack[j].value === currNode.children[i].value) {
                                addToStack = false;
                                break;
                            }
                        }
                        if (addToStack) {
                            stack.push(currNode.children[i]);
                        }
                    }
                }
            }
            return false;
        }

        

        function searchStartNode(problem) {
            for (let i = 0; i < problem.length; i++) {
                for (let j = 0; j < problem[0].length; j++) {
                    for (let k = 0; k < problem[0][0].length; k++) {
                        if (problem[i][j][k] === 'S') {
                            return [i, j, k];
                        }
                    }
                }
            }
        }


        function adapter2D(problem, startPosition, map) {
            const Moves = {
                left: 0,
                right: 1,
                forward: 2,
                backward: 3,
            };

            const NDIRECTIONS = Object.keys(Moves).length;

            const root = new Node(problem[0][startPosition[1]][startPosition[2]]);
            const first = [root, startPosition[1], startPosition[2]];

            const neighborStack = [];
            neighborStack.push(first);

            const visited = new Set();
            
            while(neighborStack.length > 0) {
                
                const next = neighborStack.shift();
                const currNode = next[0];
                
                const currNodeRow = next[1];
                const currNodeCol = next[2];
//left, right, forward, backward, up, down
                if (!visited.has(currNode.value)) {    
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.left]) {
                        if (!visited.has(problem[0][currNodeRow][currNodeCol-1])) {
                            currNode.addChildren(problem[0][currNodeRow][currNodeCol-1]);
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol-1]);
                        }
                    }
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.right]) {
                        if (!visited.has(problem[0][currNodeRow][currNodeCol+1])) {
                            currNode.addChildren(problem[0][currNodeRow][currNodeCol+1]);
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol+1]);
                        }
                    } 
                    if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.backward]) {
                        if (!visited.has(problem[0][currNodeRow+1][currNodeCol])) {
                            currNode.addChildren(problem[0][currNodeRow+1][currNodeCol]);
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow+1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[0][currNodeRow][currNodeCol])[Moves.forward]) {
                        if (!visited.has(problem[0][currNodeRow-1][currNodeCol])) {
                            currNode.addChildren(problem[0][currNodeRow-1][currNodeCol]);
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow-1, currNodeCol]);
                        }
                    } 
                    visited.add(currNode.value);
                    //console.log(currNode.children);                    
                } 
            }

            
            
            return root;            
        } 

        function adapter3D(problem, startPosition, map) {
            const Moves = {
                left: 0,
                right: 1,
                forward: 2,
                backward: 3,
                up: 4,
                down: 5
            };
        
            const NDIRECTIONS = Object.keys(Moves).length;
        
            const root = new Node(problem[startPosition[0]][startPosition[1]][startPosition[2]]);
            const first = [root, startPosition[0] ,startPosition[1], startPosition[2]];
           
            const neighborStack = [];
            neighborStack.push(first);
        
            const visited = new Set();
            
            while(neighborStack.length > 0) {
                const next = neighborStack.shift();
                
                const currNode = next[0];
                const currNodeLevel = next[1]        
                const currNodeRow = next[2];
                const currNodeCol = next[3];
                
        
                if (!visited.has(currNode.value)) {
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.left]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol-1]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol-1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol-1]);
                        }
                    }
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.right]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol+1]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol+1])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol+1]);
                        }
                    } 
                    if(map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.backward]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow+1][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow+1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow+1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.forward]) {
                        currNode.addChildren(problem[currNodeLevel][currNodeRow-1][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel][currNodeRow-1][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow-1, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.up]) {
                        currNode.addChildren(problem[currNodeLevel+1][currNodeRow][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel+1][currNodeRow][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel+1, currNodeRow, currNodeCol]);
                        }
                    } 
                    if (map.get(problem[currNodeLevel][currNodeRow][currNodeCol])[Moves.down]) {
                        currNode.addChildren(problem[currNodeLevel-1][currNodeRow][currNodeCol]);
                        if (!visited.has(problem[currNodeLevel-1][currNodeRow][currNodeCol])) {
                            neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel-1, currNodeRow, currNodeCol]);
                        }
                    } 
        
                    visited.add(currNode.value);
                }
            }
            return root;
        }
        
        const startNode = searchStartNode(game.maze);
        if (game.maze.length === 1) {
            return DFS(adapter2D(game.maze, startNode, game.moves));
        } else if (game.maze.length > 1) {
            return DFS(adapter3D(game.maze, startNode, game.moves));
        }  
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}



/*const measureSimple = SimpleMaze3dGenerator.measureAlgorithmTime(30, 30, 30, map);
//left, right, forward, backward, up, down
console.log(measureSimple);

const measureDFS = DFSMaze3dGenerator.measureAlgorithmTime(30, 30, 30, map);
console.log(measureDFS);

const measureKruskal = KruskalMaze3dGenerator.measureAlgorithmTime(30,30,30,map);
console.log(measureKruskal);*/

const game = new Maze3d(3,5,5);
console.log(game.toString());

console.log(verify(game.maze, game.moves));
//forward backward right left
console.log(DepthFirstSearch.search(game));

function verify(arr, map) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            for (let k = 0; k < arr[0][0].length; k++) {
                const prews = [];
                const cell = map.get(arr[i][j][k]);
                for (let t = 0; t < 6; t++) {
                    if (cell[t] === undefined) {
                        console.log('AAAAAAAAAAAAAAA');
                    }
                    prews.push(false);
                }
                let left = [...prews];
                let right = [...prews];
                let up = [...prews];
                let down = [...prews];
                let backward = [...prews];
                let forward = [...prews];
                if (i !== 0) {
                    down = map.get(arr[i-1][j][k]);
                }
                if (i !== arr.length-1) {
                    up = map.get(arr[i+1][j][k]);
                }
                if (j !== 0) {
                    forward = map.get(arr[i][j-1][k]);
                }
                if (j !== arr[0].length-1) {
                    backward = map.get(arr[i][j+1][k]);
                }
                if (k !== 0) {
                    left = map.get(arr[i][j][k-1]);
                }
                if (k !== arr[0][0].length-1) {
                    right = map.get(arr[i][j][k+1]);
                }
                if (down[4] !== cell[5] || left[1] !== cell[0] || right[0] !== cell[1] || up[5] !== cell[4] || forward[3] !== cell[2] || backward[2] !== cell[3]) {
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', right[0], '    ', cell[1]);
                    //console.log(right);
                    //console.log(cell);
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', down[4], '    ', cell[5]);
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', left[1], '    ', cell[0]);
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', up[5], '    ', cell[4]);
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', backward[2], '    ', cell[3]);
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   ', forward[3], '    ', cell[2]);
                    console.log(i, j, k);
                    return false;
                }
                
            }
        }
    }
    return true;
}
//left, right, forward, backward, up, down