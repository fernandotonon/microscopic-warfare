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

setInterval(spawnResource, 3000);  // Spawns a resource every 3 seconds

function checkEndGameConditions() {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const canMove = directions.some(dir => {
        const [dx, dy] = dir;
        const nextCell = grid[playerPos.y + dy][playerPos.x + dx];
        return nextCell === ' ' || nextCell === '#';  // Adjust based on your grid's representation
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