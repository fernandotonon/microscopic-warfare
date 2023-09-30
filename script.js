const gameArea = document.getElementById('gameArea');

const GAME_WIDTH = 40;  
const GAME_HEIGHT = 20; 

// Initialize the game grid with empty spaces
let grid = Array.from({ length: GAME_HEIGHT }, () => Array(GAME_WIDTH).fill(' '));

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

function gameLoop() {
    // Update game state
    // ...

    // Draw game state
    drawGame();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
