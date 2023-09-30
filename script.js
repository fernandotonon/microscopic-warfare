const gameArea = document.getElementById('gameArea');

const GAME_WIDTH = 40;  
const GAME_HEIGHT = 40; 
const CENTER_X = Math.floor(GAME_WIDTH / 2);
const CENTER_Y = Math.floor(GAME_HEIGHT / 2);
const RADIUS = Math.floor(Math.min(GAME_WIDTH, GAME_HEIGHT) / 2);
const RADIUS_SQUARED = Math.pow(RADIUS, 2);
const MAX_RESOURCES = 10; 
let score = 0;
const RESOURCES_FOR_PRODUCTION = 5;  // Adjust as needed
let resourcesCollected = 0;

// Check if the player has enough resources to produce
function canProduceBacterium() {
    return resourcesCollected >= RESOURCES_FOR_PRODUCTION;
}

function isBacteriumSurrounded(x, y) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return directions.every(dir => {
        const [dx, dy] = dir;
        const nextCell = grid[y + dy][x + dx];
        return nextCell !== ' ' && nextCell !== '#';  // Adjust based on your grid's representation
    });
}

// Initialize the game grid with empty spaces
let grid = Array.from({ length: GAME_HEIGHT }, () => Array(GAME_WIDTH).fill(' '));

const playerPos = { x: Math.floor(GAME_WIDTH / 2), y: Math.floor(GAME_HEIGHT / 2)};
grid[playerPos.y][playerPos.x] = 'P';  // 'P' represents the player bacterium

document.addEventListener('keydown', function(event) {
    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            newY--;
            break;
        case 'ArrowDown':
        case 's':
            newY++;
            break;
        case 'ArrowLeft':
        case 'a':
            newX--;
            break;
        case 'ArrowRight':
        case 'd':
            newX++;
            break;
    }

    if(newX < 0) newX = 0;
    if(newX >= GAME_WIDTH) newX = GAME_WIDTH - 1;
    if(newY < 0) newY = 0;
    if(newY >= GAME_HEIGHT) newY = GAME_HEIGHT - 1;

    // Check if the new position is within the petri dish boundary
    if (isWithinCircle(newX, newY)) {
        const targetCell = grid[newY][newX];
        if (targetCell === 'R' || isBacteriumSurrounded(newX, newY)) {
            // Player is trying to move to a cell occupied by a rival or a surrounded bacterium, so block the movement
            return;
        }

        // Consuming a resource
        if (grid[newY][newX] === '#') {
            score += 10;  // Increase the score. Adjust the value as needed.
            document.getElementById('scoreDisplay').innerText = "Score: " + score;
            resourcesCollected++;
        }

        // Clear previous position
        grid[playerPos.y][playerPos.x] = ' ';

        // Update player position on the grid
        playerPos.x = newX;
        playerPos.y = newY;
        grid[playerPos.y][playerPos.x] = 'P';
    }
});


function drawGame() {
    let display = '';
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            const char = grid[y][x];
            if (char === 'P') {  // Active player bacterium
                if (canProduceBacterium()) {
                    display += '<div class="bacteria bacteria-active-player can-produce"></div>';
                } else {
                    display += '<div class="bacteria bacteria-active-player"></div>';
                }
            } else if (char === 'p') {  // Created player bacterium
                display += '<div class="bacteria bacteria-created-player"></div>';
            } else if (char === 'R') {  // Active rival bacterium
                display += '<div class="bacteria bacteria-active-rival"></div>';
            } else if (char === 'r') {  // Created rival bacterium
                display += '<div class="bacteria bacteria-created-rival"></div>';
            } else if (char === '#') {
                display += '<div class="resource"></div>';
            } else {
                if(isWithinCircle(x, y))
                display += '<div class="empty"></div>';  // An empty space
            }
        }
        display += '<br/>';  // Move to the next line
    }
    gameArea.innerHTML = display;
}

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

setInterval(spawnResource, 5000);  // Spawns a resource every 5 seconds

function checkEndGameConditions() {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const canMove = directions.some(dir => {
        const [dx, dy] = dir;
        const nextCell = grid[playerPos.y + dy][playerPos.x + dx];
        return nextCell === '.' || nextCell === '#';  // Adjust based on your grid's representation
    });

    if (!canMove) {
        // End game with a loss for the player
    }

    // Check the number of bacteria for each player to determine the winner
    // ... 
}

function gameLoop() {
    

    // Update game state
    // ...

    // Draw game state
    drawGame();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
