import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";

class BreadthFirstSearch extends Searchable {
    //The BFS algorithm
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

        //This function search the start node.
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
        
        const startNode = searchStartNode(game.maze);
        if (game.maze.length === 1) {
            return BFS(Adapter2D.adapt(game.maze, startNode, game.moves));
        } else if (game.maze.length > 1) {
            return BFS(Adapter3D.adapt(game.maze, startNode, game.moves));
        }     
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default BreadthFirstSearch;