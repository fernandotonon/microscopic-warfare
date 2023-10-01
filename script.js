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
let rivalPos = { x: 30, y: 30 };
grid[playerPos.y][playerPos.x] = 'P';  // 'P' represents the player bacterium
grid[rivalPos.y][rivalPos.x] = 'R';  // 'R' represents the rival bacterium

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

function moveRivalTowardResource(rivalX, rivalY, resourceX, resourceY) {
    if (resourceX < rivalX) {
        return {x: rivalX - 1, y: rivalY};
    } else if (resourceX > rivalX) {
        return {x: rivalX + 1, y: rivalY};
    } else if (resourceY < rivalY) {
        return {x: rivalX, y: rivalY - 1};
    } else if (resourceY > rivalY) {
        return {x: rivalX, y: rivalY + 1};
    }
}

class Node {
    constructor(x, y, g = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.g = g;  // cost from start node to this node
        this.h = h;  // heuristic: estimated cost from this node to goal node
        this.f = g + h;  // total cost
        this.parent = null;
    }
}

// Returns a list of neighboring nodes
function getNeighbors(node) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighbors = [];
    
    for (let [dx, dy] of directions) {
        const x = node.x + dx;
        const y = node.y + dy;
        
        if (grid[y] && grid[y][x] && (grid[y][x] === ' ' || grid[y][x] === '#')) {
            neighbors.push(new Node(x, y));
        }
    }
    
    return neighbors;
}

// Heuristic function: Manhattan distance
function heuristic(node, goal) {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
}

function aStar(start, goal) {
    const openList = [];
    const closedList = [];
    
    openList.push(start);
    
    while (openList.length > 0) {
        // Find node with lowest f in openList
        openList.sort((a, b) => a.f - b.f);
        const current = openList.shift();
        
        if (current.x === goal.x && current.y === goal.y) {
            // Goal reached
            let path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            return path.reverse();
        }
        
        closedList.push(current);
        
        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (closedList.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                continue;
            }
            
            neighbor.g = current.g + 1;
            neighbor.h = heuristic(neighbor, goal);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
            
            if (!openList.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                openList.push(neighbor);
            }
        }
    }
    
    // Return an empty array if no path is found
    return [];
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
    console.log("path", path);
    if (path.length > 1) {
        const nextMove = path[1];
        // Move the rival to nextMove.x, nextMove.y and update the grid accordingly
        grid[rivalPos.y][rivalPos.x] = grid[nextMove.y][nextMove.x] === 'r' ? 'r' : ' ';  // Swap or clear the previous position
        grid[nextMove.y][nextMove.x] = 'R';
    }
}

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

    if (event.key === ' ' && canProduceBacterium()) {
        produceBacterium();
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
            document.getElementById('resourcesDisplay').innerText = "Resources: " + resourcesCollected;
        }

        // Swap positions
        grid[playerPos.y][playerPos.x] = grid[newY][newX] === 'p' ? 'p' : ' ';  // Clear the previous position

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

setInterval(spawnResource, 3000);  // Spawns a resource every 3 seconds
setInterval(moveRival, 300);  // Moves rival every 0.3 seconds

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
