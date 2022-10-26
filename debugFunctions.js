function verify(arr, map) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            for (let k = 0; k < arr[0][0].length; k++) {
                const cell = map.get(arr[i][j][k]);

                for (let t = 0; t < 6; t++) {
                    if (cell[t] === undefined) {
                        return false;
                    }
                }

                if (i !== 0) {
                    down = map.get(arr[i-1][j][k]);
                }
                if (i !== arr.length-1) {
                    up = map.get(arr[i+1][j][k]);
                }
                if (j !== 0) {
                    forward = map.get(arr[i][j-1][k]);
                }
                if (j !== arr[0].length-1) {
                    backward = map.get(arr[i][j+1][k]);
                }
                if (k !== 0) {
                    left = map.get(arr[i][j][k-1]);
                }
                if (k !== arr[0][0].length-1) {
                    right = map.get(arr[i][j][k+1]);
                }
                if (down[4] !== cell[5] || left[1] !== cell[0] || right[0] !== cell[1] || up[5] !== cell[4] || forward[3] !== cell[2] || backward[2] !== cell[3]) {
                   return false;
                }
                
            }
        }
    }
    return true;
}