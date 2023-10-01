let stalemateCounter = 0;
let lastResourceCounter = 0;
function checkStalemate() {
    if (lastResourceCounter === getResourceCount()) {
        stalemateCounter++;
        if (stalemateCounter >= 60) {
            endGame('Stalemate!');
        }
    } else {
        stalemateCounter = 0;  // Reset the counter if there's any activity
    }
}
setInterval(checkStalemate, 1000);  // Spawns a resource every 1 second

while (getResourceCount() < MAX_RESOURCES) {
    spawnResource();
}

function drawGame() {
    let display = '';
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            const char = grid[y][x];
            if (char === 'P') {  // Active player bacterium
                if (canProduceBacterium(resourcesCollected)) {
                    display += '<div class="bacteria bacteria-active-player can-produce"></div>';
                } else {
                    display += '<div class="bacteria bacteria-active-player"></div>';
                }
            } else if (char === 'p') {  // Created player bacterium
                display += '<div class="bacteria bacteria-created-player"></div>';
            } else if (char === 'R') {  // Active rival bacterium
                if (canProduceBacterium(rivalResourcesCollected)) {
                    display += '<div class="bacteria bacteria-active-rival can-produce"></div>';
                } else {
                    display += '<div class="bacteria bacteria-active-rival"></div>';
                }
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

setInterval(spawnResource, 2000);  // Spawns a resource every 2 seconds
setInterval(checkDominance, 200);  // Spawns a resource every 200 ms
function checkDominance() {
    let playerCells = 0;
    let rivalCells = 0;

    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            if (['P', 'p'].includes(grid[y][x])) playerCells++;
            if (['R', 'r'].includes(grid[y][x])) rivalCells++;
        }
    }

    const totalCells = GAME_WIDTH * GAME_HEIGHT;
    if (playerCells / totalCells >= 0.5) {
        endGame('Player Dominates!');
    } else if (rivalCells / totalCells >= 0.5) {
        endGame('Rival Dominates!');
    }
}

function endGame(message) {
    // Stop game loop, intervals, or any ongoing game activity
    // Display the end game message to the player
    alert(message);
    location.reload();
}


// Load the audio files
let bgMusic = new Audio('smooth_background_music.wav');
let moveSFX = new Audio('move_sfx.mp3');
let consumeSFX = new Audio('consume_sfx.mp3');
let reproduceSFX = new Audio('reproduce_sfx.mp3');

// Play background music
//bgMusic.loop = true; // So that it plays continuously
bgMusic.volume = 0.5; // Reduce volume if it's too loud
//bgMusic.play();

function gameLoop() {
    

    // Update game state
    // ...

    // Draw game state
    drawGame();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
