let rivalPos = { x: 30, y: 30 };
grid[rivalPos.y][rivalPos.x] = 'R';  // 'R' represents the rival bacterium

function findClosestResource(x, y) {
    let minDistance = Infinity;
    let closestResource = null;
    
    for (let i = 0; i < GAME_HEIGHT; i++) {
        for (let j = 0; j < GAME_WIDTH; j++) {
            if (grid[i][j] === '#') {
                const distance = Math.abs(x - j) + Math.abs(y - i);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestResource = {x: j, y: i};
                }
            }
        }
    }
    
    return closestResource;
}

function moveRival() {
    let rivalPos = { x: 30, y: 30 };
    for (let i = 0; i < GAME_HEIGHT; i++) {
        for (let j = 0; j < GAME_WIDTH; j++) {
            if (grid[i][j] === 'R') {
                rivalPos = { x: j, y: i };
                break;
            }
        }
    }
    const nearestResource = findClosestResource(rivalPos.x,rivalPos.y);  // Implement this function to find the nearest resource to the rival
    if(!nearestResource) return;  // No resource found, so don't move

    const start = new Node(rivalPos.x, rivalPos.y);
    const goal = new Node(nearestResource.x, nearestResource.y);

    const path = aStar(start, goal);
    if (path.length > 1) {
        const nextMove = path[1];
        // Move the rival to nextMove.x, nextMove.y and update the grid accordingly
        grid[rivalPos.y][rivalPos.x] = grid[nextMove.y][nextMove.x] === 'r' ? 'r' : ' ';  // Swap or clear the previous position
        grid[nextMove.y][nextMove.x] = 'R';
    }
}

setInterval(moveRival, 300);  // Moves rival every 0.3 seconds
