const gameArea = document.getElementById('gameArea');

const GAME_WIDTH = 40;  
const GAME_HEIGHT = 20; 

// Initialize the game grid with empty spaces
let grid = Array.from({ length: GAME_HEIGHT }, () => Array(GAME_WIDTH).fill(' '));

const playerPos = { x: Math.floor(GAME_WIDTH / 2), y: Math.floor(GAME_HEIGHT / 2) };
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
    
    // Check if the new position is within the petri dish boundary
    if (isWithinCircle(newX, newY)) {
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
            if (char === 'P') {  // Let's assume 'P' represents player bacteria
                display += '<span class="bacteria-player">P</span>';
            } else if (char === 'R') {  // 'R' represents rival bacteria
                display += '<span class="bacteria-rival">R</span>';
            } else if (char === '#') {  // '#' represents resources
                display += '<span class="resource">#</span>';
            } else {
                display += char;
            }
        }
        display += '\n';
    }
    gameArea.innerHTML = display;
}

const CENTER_X = Math.floor(GAME_WIDTH / 2);
const CENTER_Y = Math.floor(GAME_HEIGHT / 2);
const RADIUS_SQUARED = Math.pow(Math.min(GAME_WIDTH, GAME_HEIGHT) / 2, 2);
const MAX_RESOURCES = 10;  // Adjust as needed

function isWithinCircle(x, y) {
    return Math.pow(x - CENTER_X, 2) + Math.pow(y - CENTER_Y, 2) <= RADIUS_SQUARED;
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

function gameLoop() {
    setInterval(spawnResource, 5000);  // Spawns a resource every 5 seconds

    // Update game state
    // ...

    // Draw game state
    drawGame();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
