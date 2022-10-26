import SimpleMaze3dGenerator from "./representation/simple_maze3d_generator.js";
import DFSMaze3dGenerator from "./representation/dfs_maze3d_generator.js";
import KruskalMaze3dGenerator from "./representation/kruskal_maze3d_generator.js";

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
        this.#maze;
    }

    //Ways to generate the maze
    simpleGenerator() {
        this.#maze = SimpleMaze3dGenerator.generate(this.#nLevels, this.#nRows, this.#nCols, this.#moves);
    }

    DFSGenerator() {
        this.#maze = DFSMaze3dGenerator.generate(this.#nLevels, this.#nRows, this.#nCols, this.#moves);
    }

    KruskalGenerator() {
        this.#maze = KruskalMaze3dGenerator.generate(this.#nLevels, this.#nRows, this.#nCols, this.#moves);
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

    //First save the number of levels, rows and cols, then each cell with the boolean array.
    gameSave(name) {
        const arr = new Array();
        arr.push({ levels: this.#nLevels, rows: this.#nRows, cols: this.#nCols });

        for (let i = 0; i < this.#nLevels; i++) {
            for (let j = 0; j < this.#nRows; j++) {
                for (let k = 0; k < this.#nCols; k++) {
                    const booleanArr = this.#moves.get(this.#maze[i][j][k]);
                    arr.push({ level: i, row: j, col: k, left: booleanArr[0], right: booleanArr[1],
                    forward: booleanArr[2], backward: booleanArr[3], up: booleanArr[4], down: booleanArr[5] });
                }
            }
        }
        localStorage.setItem(name, JSON.stringify(arr));
    }
}

export default Maze3d;