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

class BreadthFirstSearch {
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
                console.log(visited);
                console.log(stack);
                for (let i = 0; i < currNode.children.length; i++) {
                    if (!visited.has(currNode.children[i].value)) {
                        stack.push(currNode.children[i]);
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
                console.log(currNodeLevel, currNodeRow, currNodeCol);
        
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