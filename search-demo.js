import Maze3d from "./maze3d.js";
import DepthFirstSearch from "./search-algorithms/depth-first-search.js";   
import BreadthFirstSearch from "./search-algorithms/breadth-first-search.js";
import AStarSearch from "./search-algorithms/A*-search.js";

class SearchDemo {
    static run(nLevels, nRows, nCols) {
        const newGame = new Maze3d(nLevels, nRows, nCols);
        newGame.DFSGenerator();

        console.log(BreadthFirstSearch.search(newGame));
        console.log(DepthFirstSearch.search(newGame));
        //console.log(AStarSearch.search(newGame));
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default SearchDemo;