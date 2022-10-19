class Node {
    /** @type {Map<object, Node>} */
    #adjacencyList
    #value
  
    constructor(value) {
      this.#value = value;
      this.#adjacencyList = new Map();
    }
  
    get value() {
      return this.#value;
    }
  
    addAdjacent(node, weight) {
      this.#adjacencyList.set(node.value, [node, weight]);
    }
  
    removeAdjacent(node) {
      if (this.#adjacencyList.has(node.value)) {
        this.#adjacencyList.delete(node.value);
      }
    }
  
    get neighbors() {
      return [...this.#adjacencyList.keys()];
    }
  
    get neighborNodes() {
      return [...this.#adjacencyList.values()].map(v => v[0]);
    }
  
    getEdgeWeight(neighbor) {
      if (this.#adjacencyList.has(neighbor.value)) {
        return this.#adjacencyList.get(neighbor.value)[1];
      }
      return Infinity;
    }
}

class PriorityQueue {
    #heap
    #comparator
    #top
  
    constructor(comparator = (a, b) => a > b) {
      this.#heap = [];
      this.#comparator = comparator;
      this.#top = 0;
    }
  
    size() {
      return this.#heap.length;
    }
  
    isEmpty() {
      return this.size() == 0;
    }
  
    peek() {
      return this.#heap[this.#top];
    }
  
    push(...values) {
      values.forEach(value => {
        this.#heap.push(value);
        this.#heapifyUp(this.size() - 1);
      });
      return this.size();
    }
  
    pop() {
      const poppedValue = this.peek();
      const bottom = this.size() - 1;
      if (bottom > this.#top) {
        this.#swap(this.#top, bottom);
      }
      this.#heap.pop();
      this.#heapifyDown();
      return poppedValue;
    }
  
    remove(value) {
      const index = this.#heap.indexOf(value);
      if (index != -1) {
        this.#removeAt(index);
      }
    }
  
    #parent(childIndex) {    
      return Math.floor((childIndex - 1) / 2);
    }
  
    #left(parentIndex) {
      return (parentIndex * 2) + 1;   
    }
  
    #right(parentIndex) {
      return (parentIndex * 2) + 2;
    }
  
    #greater(i, j) {
      return this.#comparator(this.#heap[i], this.#heap[j]);
    }
  
    #swap(i, j) {
      [this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
    }
  
    #heapifyUp(index) {   
      while (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#swap(index, this.#parent(index));
        index = this.#parent(index);
      }
    }
  
    #heapifyDown() {
      let index = this.#top;
  
      while (
        (this.#left(index) < this.size() && this.#greater(this.#left(index), index)) ||
        (this.#right(index) < this.size() && this.#greater(this.#right(index), index))
      ) {
        let maxChild = (this.#right(index) < this.size() && this.#greater(this.#right(index), this.#left(index))) ? 
          this.#right(index) : this.#left(index);
        this.#swap(index, maxChild);
        index = maxChild;
      }
    }
  
    #removeAt(index) {
      // Remove the last element and place it at the removed index
      this.#heap[index] = this.#heap.pop();
  
      if (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#heapifyUp(index);
      } else {
        this.#heapifyDown(index);
      }    
    }
  }

class AStarSearch extends Searchable {
    static search(game, source = 'S', target = 'G') {
        function ASearch(root, successor, goalTest, heuristic) {
            const initialNode = root;

            const priorQueue = new PriorityQueue();
            priorQueue.push(root);

            const explored = new Set();

        }

        function goalTest(node) {
            if (node.value = 'G') {
                return true;
            }
            return false;
        }

        function successor(node) {
            return [...node.children];
        }

        function searchNode(problem, value) {
            for (let i = 0; i < problem.length; i++) {
                for (let j = 0; j < problem[0].length; j++) {
                    for (let k = 0; k < problem[0][0].length; k++) {
                        if (problem[i][j][k] === value) {
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
        
        function _heuristic(problem, goalPos) {
            const saverProblem = problem;
            const saveFinalNode = finalNode;

            return function heuristic(node) {
                const nodePosition = searchNode(problem, node.value);
    
                const xDiference = nodePosition[0] > goalPos[0] ? nodePosition[0] - goalPos[0] : goalPos[0] - nodePosition[0];
                const yDiference = nodePosition[1] > goalPos[1] ? nodePosition[1] - goalPos[1] : goalPos[1] - nodePosition[1];
                const zDiference = nodePosition[2] > goalPos[2] ? nodePosition[2] - goalPos[2] : goalPos[2] - nodePosition[2];
    
                const maxDistance = problem.length * problem[0].length * problem[0][0].length;
    
                return maxDistance - xDiference - yDiference - zDiference;
            }
        }

        const startNode = searchNode(game.maze, 'S');
        const finalNode = searchNode(game.maze, 'G');
        const useHeuristic = _heuristic(game.maze, finalNode);
        //root, successor, goalTest, heuristic
        if (game.maze.length === 1) {
            return ASearch(adapter2D(game.maze, startNode, game.moves), successor, goalTest, useHeuristic);
        } else if (game.maze.length > 1) {
            return ASearch(adapter3D(game.maze, startNode, game.moves), successor, goalTest, useHeuristic);
        }     
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}