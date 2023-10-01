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
        
        if (grid[y] && grid[y][x] && (grid[y][x] === ' ' || grid[y][x] === '#' || grid[y][x] === 'r')) {
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
