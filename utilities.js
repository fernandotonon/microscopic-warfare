const gameArea = document.getElementById('gameArea');

const GAME_WIDTH = 40;  
const GAME_HEIGHT = 40; 
const CENTER_X = Math.floor(GAME_WIDTH / 2);
const CENTER_Y = Math.floor(GAME_HEIGHT / 2);
const RADIUS = Math.floor(Math.min(GAME_WIDTH, GAME_HEIGHT) / 2);
const RADIUS_SQUARED = Math.pow(RADIUS, 2);
const MAX_RESOURCES = 20; 
let score = 0;
const RESOURCES_FOR_PRODUCTION = 3;  // Adjust as needed
// Initialize the game grid with empty spaces
let grid = Array.from({ length: GAME_HEIGHT }, () => Array(GAME_WIDTH).fill(' '));

function isWithinCircle(x, y) {
    return Math.pow(x - CENTER_X, 2) + Math.pow(y - CENTER_Y, 2) <= RADIUS_SQUARED-1;
}

function getResourceCount() {
    let count = 0;
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            if (grid[y][x] === '#') count++;
        }
    }
    return count;
}

function spawnResource() {
    if (getResourceCount() >= MAX_RESOURCES) return;  // Don't spawn if max resources reached
    
    let spawned = false;
    while (!spawned) {
        let x = Math.floor(Math.random() * GAME_WIDTH);
        let y = Math.floor(Math.random() * GAME_HEIGHT);
        
        if (grid[y][x] === ' ' && isWithinCircle(x, y)) {
            grid[y][x] = '#';
            spawned = true;
        }
    }
}

// Check if the player or rival has enough resources to produce
function canProduceBacterium(resources) {
    return resources >= RESOURCES_FOR_PRODUCTION;
}

function canMove(x, y, walkableTypes) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return directions.some(dir => {
        const [dx, dy] = dir;
        const nextX = x + dx;
        const nextY = y + dy;
        if (nextY >= 0 && 
            nextY < grid.length &&
            nextX >= 0 &&
            nextX < grid[nextY].length &&
            grid[nextY] && 
            grid[nextY][nextX] && 
            walkableTypes.includes(grid[nextY][nextX]) && 
            isWithinCircle(nextX, nextY)) {
            return true;
        }
        return false;
    });
}


function isBacteriumSurrounded(x, y) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return directions.every(dir => {
        const [dx, dy] = dir;
        const nextCell = grid[y + dy][x + dx];
        return nextCell !== ' ' && nextCell !== '#';  // Adjust based on your grid's representation
    });
}

function produceBacterium() {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let dir of directions) {
        const [dx, dy] = dir;
        const x = playerPos.x + dx;
        const y = playerPos.y + dy;
        if (grid[y] && grid[y][x] === ' ' && isWithinCircle(x, y)) {
            grid[y][x] = 'p';  // Place a new player bacterium
            resourcesCollected -= RESOURCES_FOR_PRODUCTION;  // Deduct the resources
            document.getElementById('resourcesDisplay').innerText = "Resources: " + resourcesCollected;
            return;  // Exit after placing one bacterium
        }
    }
}

function saveBestScore(score) {
    // Fetch the stored best score. If it doesn't exist, default to 0.
    const bestScore = parseInt(localStorage.getItem('bestScore') || "0", 10);

    // If the new score is higher than the best score, update it.
    if (score > bestScore) {
        localStorage.setItem('bestScore', score.toString());
    }
}

