const playerWalkableTypes = [' ', '#', 'p'];

const playerPos = { x: Math.floor(GAME_WIDTH / 2), y: Math.floor(GAME_HEIGHT / 2)};
grid[playerPos.y][playerPos.x] = 'P';  // 'P' represents the player bacterium
let resourcesCollected = 0;

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

    if (event.key === ' ' && canProduceBacterium(resourcesCollected)) {
        produceBacterium();
        reproduceSFX.play();
    }

    if(newX < 0) newX = 0;
    if(newX >= GAME_WIDTH) newX = GAME_WIDTH - 1;
    if(newY < 0) newY = 0;
    if(newY >= GAME_HEIGHT) newY = GAME_HEIGHT - 1;

    if (!canMove(playerPos.x, playerPos.y, playerWalkableTypes)) {
        // Player can't move, rival wins
        endGame('Rival Wins!');
        return;
    }

    // Check if the new position is within the petri dish boundary
    if (isWithinCircle(newX, newY)) {
        const targetCell = grid[newY][newX];
        if (targetCell === 'R' || targetCell === 'r' || isBacteriumSurrounded(newX, newY)) {
            // Player is trying to move to a cell occupied by a rival or a surrounded bacterium, so block the movement
            return;
        }

        // Consuming a resource
        if (grid[newY][newX] === '#') {
            score += 10;  // Increase the score. Adjust the value as needed.
            document.getElementById('scoreDisplay').innerText = "Score: " + score;
            resourcesCollected++;
            document.getElementById('resourcesDisplay').innerText = "Resources: " + resourcesCollected;
            consumeSFX.play();
        } else {
            moveSFX.play();
        }

        // Swap positions
        grid[playerPos.y][playerPos.x] = grid[newY][newX] === 'p' ? 'p' : ' ';  // Clear the previous position

        // Update player position on the grid
        playerPos.x = newX;
        playerPos.y = newY;
        grid[playerPos.y][playerPos.x] = 'P';
    }
});
