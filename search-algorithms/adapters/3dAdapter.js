import Node from "./../node.js";

//This class converts a 3d Array in a node tree.

class Adapter3D {
    static adapt(problem, startPosition, map) {
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

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default Adapter3D;