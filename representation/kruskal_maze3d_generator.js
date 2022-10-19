class KruskalMaze3dGenerator extends Maze3dGenerator {
    static generate(nLevels, nRows, nCols, map) {
        function randomNumber(max, min = 0) {
            return Math.floor(Math.random() * max) - min;
        }

        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
            up: 4,
            down: 5
        };

        const MOVESOPTIONS = Object.keys(Moves).length;

        const arr = new Array(nLevels).fill().map(() => new Array(nRows).fill().map(() => new Array(nCols).fill().map(() => Symbol())));
        const nCells = nLevels * nCols * nRows;

        const containers = new Array(nCells).fill().map(() => new Set());
        let containersCounter = 0;
        
        for (let i = 0; i < nLevels; i++) {
            for (let j = 0; j < nRows; j++) {
                for (let k = 0; k < nCols; k++, containersCounter++) {
                    const booleanArr = new Array(MOVESOPTIONS).fill();

                    if (i === 0) {
                        booleanArr[Moves.down] = false;
                    } else if (i === nLevels - 1) {
                        booleanArr[Moves.up] = false;
                    } 
                    if (i > 0) {
                        booleanArr[Moves.down] = map.get(arr[i-1][j][k])[Moves.up];
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
                    }

                    const id = arr[i][j][k];
                    map.set(id, booleanArr);
                    containers[containersCounter].add(id);
                }                                                                             
            }
        }

        while (containers.length > 1) {
            let i = randomNumber(nLevels);
            let j = randomNumber(nRows);
            let k = randomNumber(nCols);
            let l = randomNumber(MOVESOPTIONS);
            
            while (map.get(arr[i][j][k])[l] !== undefined) {
                if (l < MOVESOPTIONS -1) {
                    l++;
                } else if (k < nCols -1) {
                    l = 0;
                    k++;
                } else if(j < nRows -1) {
                    l = 0;
                    k = 0;
                    j++;
                } else if (i < nLevels - 1) {
                    l = 0;
                    k = 0;
                    j = 0;
                    i++;
                } else {
                    l = 0;
                    k = 0;
                    j = 0;
                    i = 0;
                }
            }

            let found;

            switch (l) {
                case Moves.left:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j][k-1])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j][k-1])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.left] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j][k-1]);
                            nextBooleanArr[Moves.right] = true;
                            map.set(arr[i][j][k-1], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.left] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j][k-1]);
                        nextBooleanArr[Moves.right] = false;
                        map.set(arr[i][j][k-1], nextBooleanArr);
                    }
                    break;
                case Moves.right:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j][k+1])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j][k+1])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.right] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j][k+1]);
                            nextBooleanArr[Moves.left] = true;
                            map.set(arr[i][j][k+1], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.right] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j][k+1]);
                        nextBooleanArr[Moves.left] = false;
                        map.set(arr[i][j][k+1], nextBooleanArr);
                    }
                    break;
                case Moves.forward:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j-1][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j-1][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.forward] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j-1][k]);
                            nextBooleanArr[Moves.backward] = true;
                            map.set(arr[i][j-1][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.forward] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j-1][k]);
                        nextBooleanArr[Moves.backward] = false;
                        map.set(arr[i][j-1][k], nextBooleanArr);
                    }
                    break;
                case Moves.backward:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i][j+1][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i][j+1][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.backward] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i][j+1][k]);
                            nextBooleanArr[Moves.forward] = true;
                            map.set(arr[i][j+1][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.backward] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i][j+1][k]);
                        nextBooleanArr[Moves.forward] = false;
                        map.set(arr[i][j+1][k], nextBooleanArr);
                    }
                    break;
                case Moves.down:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i-1][j][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i-1][j][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.down] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i-1][j][k]);
                            nextBooleanArr[Moves.up] = true;
                            map.set(arr[i-1][j][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.down] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i-1][j][k]);
                        nextBooleanArr[Moves.up] = false;
                        map.set(arr[i-1][j][k], nextBooleanArr);
                    }
                    break;
                case Moves.up:
                    found = false;
                    for (let u = 0; u < containers.length; u++) {
                        if (containers[u].has(arr[i][j][k]) && !containers[u].has(arr[i+1][j][k])) {
                            let v;
                            for (v = 0; v < containers.length; v++) {
                                if (containers[v].has(arr[i+1][j][k])) {
                                    break;
                                }
                            }
                            
                            containers[u] = new Set([...containers[u], ...containers[v]]);
                            containers.splice(v,1);

                            const booleanArr = map.get(arr[i][j][k]);
                            booleanArr[Moves.up] = true;
                            map.set(arr[i][j][k], booleanArr);
                            const nextBooleanArr = map.get(arr[i+1][j][k]);
                            nextBooleanArr[Moves.down] = true;
                            map.set(arr[i+1][j][k], nextBooleanArr);
                            
                            found = true;

                            break;
                        }                       
                    }
                    if (!found) {
                        const booleanArr = map.get(arr[i][j][k]);
                        booleanArr[Moves.up] = false;
                        map.set(arr[i][j][k], booleanArr);
                        const nextBooleanArr = map.get(arr[i+1][j][k]);
                        nextBooleanArr[Moves.down] = false;
                        map.set(arr[i+1][j][k], nextBooleanArr);
                    }
                    break;
            }         
        }

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
            
        const holdStart = map.get(arr[startLevel][startRow][startCol]);
        const holdEnd = map.get(arr[finishLevel][finishRow][finishCol]);
        map.set('S', holdStart);
        map.set('G', holdEnd);
        map.delete(arr[startLevel][startRow][startCol]);
        map.delete(arr[finishLevel][finishRow][finishCol]);

        arr[startLevel][startRow][startCol] = 'S';
        arr[finishLevel][finishRow][finishCol] = 'G';

        return arr;
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}