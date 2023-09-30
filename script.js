const gameArea = document.getElementById('gameArea');

const GAME_WIDTH = 40;  
const GAME_HEIGHT = 20; 

// Initialize the game grid with empty spaces
let grid = Array.from({ length: GAME_HEIGHT }, () => Array(GAME_WIDTH).fill(' '));

const playerPos = { x: Math.floor(GAME_WIDTH / 2), y: Math.floor(GAME_HEIGHT / 2) };
grid[playerPos.y][playerPos.x] = 'P';  // 'P' represents the player bacterium

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            if (playerPos.y > 0) playerPos.y--;
            break;
        case 'ArrowDown':
        case 's':
            if (playerPos.y < GAME_HEIGHT - 1) playerPos.y++;
            break;
        case 'ArrowLeft':
        case 'a':
            if (playerPos.x > 0) playerPos.x--;
            break;
        case 'ArrowRight':
        case 'd':
            if (playerPos.x < GAME_WIDTH - 1) playerPos.x++;
            break;
    }
    
    // Clear previous position
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            if (grid[y][x] === 'P') grid[y][x] = ' ';
        }
    }
    
    // Update player position on the grid
    grid[playerPos.y][playerPos.x] = 'P';
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

function spawnResource() {
    let spawned = false;
    while (!spawned) {
        let x = Math.floor(Math.random() * GAME_WIDTH);
        let y = Math.floor(Math.random() * GAME_HEIGHT);
        
        // Check if the spot is empty
        if (grid[y][x] === ' ') {
            grid[y][x] = '#';  // '#' represents resource
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
