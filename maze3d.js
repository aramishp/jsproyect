module.exports = class Maze3d {
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

