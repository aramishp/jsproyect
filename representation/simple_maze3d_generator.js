import Maze3dGenerator from "./maze3d_generator.js";

//This class generate the maze using a simple maze generator.
//Go randomly in levels, or rows or cols, and every time that advance in one direction
//clean the walls between the cells.

class SimpleMaze3dGenerator extends Maze3dGenerator {
    /**
     * This function generate the maze
     * @param {Number} nLevels 
     * @param {Number} nRows 
     * @param {Number} nCols 
     * @param {Number} map 
     * @returns a 3d Array of cells, and set the map with the moves.
     */
    static generate(nLevels, nRows, nCols, map) {
        /**
         * This function return a boolean randomly
         * @returns boolean
         */
        function randomCondition() {
            const condition = Math.floor(Math.random() * 2);
            if (condition >= 1) {
                return true;
            }
            return false;
        }

        //This function return a number between min and max - 1
        function randomNumber(max, min = 0) {
            return Math.floor(Math.random() * max) - min;
        }

        /**
         * This function set the Start 'S', the exit 'G' and clean the path
         * @param {Number} nLevels 
         * @param {Number} nRows 
         * @param {Number} nCols 
         * @param {Array} maze 
         * @param {Map} map 
         */
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

        //Create the maze array
        const arr = new Array(nLevels).fill().map(() => new Array(nRows).fill().map(() => new Array(nCols).fill().map(() => Symbol())));

        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
            up: 4,
            down: 5
        };
        
        //Fill the map with the boolean array for the moves
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


export default SimpleMaze3dGenerator;