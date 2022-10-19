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
        this.#maze = SimpleMaze3dGenerator.generate(nLevels, nRows, nCols, this.#moves);
    }

    get moves() {
        return this.#moves;
    }

    get maze() {
        return this.#maze;
    }
    
    toString() {
        let header = '';
        let footer = '';

        for (let i = 0; i < this.#nCols * 2 + 1; i++) {
            header += '_';
            footer += '¯';
        }

        for (let i = 0; i < this.#nLevels; i++) {
            console.log(`Level ${i}\n\n` + header);
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
                console.log(cells);
                if (j !== this.#nRows - 1) {
                    console.log(lineSpacing);
                }
            }    
            console.log(footer + '\n');      
        }
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

const game = new Maze3d(1,4,4);
console.log(game.toString());