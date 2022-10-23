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

export default Maze3dGenerator; 