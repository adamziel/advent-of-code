const input = `... input here ... `.split("\n");
const walls = input.map(line => line.split(',').map(Number));
const gridSize = 71;

type Grid = boolean[][];

type Point = { col: number, row: number };
const start: Point = { col: 0, row: 0 };
const end: Point = { col: gridSize - 1, row: gridSize - 1 };

type AStarNode = {
    point: Point,
    from?: AStarNode,
    costSoFar: number,
    heuristicsCost: number,
};

function heuristicsCost(fromPoint: Point): number {
    return (end.col - fromPoint.col) + (end.row - fromPoint.row);
}

function totalCost(aStarNode: AStarNode) {
    return aStarNode.costSoFar + aStarNode.heuristicsCost;
}

const deltas: Point[] = [
    { col: -1, row:  0 },
    { col:  0, row: -1 },
    { col:  1, row:  0 },
    { col:  0, row:  1 },
];

/**
 * A* implementation to find the shortest path from start to end
 * without roaming the grid for too long.
 * 
 * @param grid the grid to search
 * @returns the cost of the path from start to end
 */
function aStar(grid: Grid) {
    // Memoize the visited nodes to avoid re-visiting them
    const visitedNodes: (AStarNode|undefined)[][] = [];
    for (let x = 0; x < gridSize; x++){
        const row: (AStarNode|undefined)[] = [];
        for (let y = 0; y < gridSize; y++){
            row.push(undefined);
        }
        visitedNodes.push(row);
    }

    // Initialize the queue with the start node
    const queue: AStarNode[] = [
        {
            point: start,
            costSoFar: 0,
            heuristicsCost: heuristicsCost(start)
        }
    ];
    visitedNodes[0][0] = queue[0];

    while (queue.length) {
        // Find the node with the lowest cost so far + heuristics cost
        let lowestCostIndex = 0;
        for (let i = 1; i < queue.length; i++) {
            if (
                queue[i].costSoFar + queue[i].heuristicsCost < 
                queue[lowestCostIndex].costSoFar + queue[lowestCostIndex].heuristicsCost 
            ) {
                lowestCostIndex = i;
            }
        }

        // Pop the node with the lowest cost so far + heuristics cost
        const current = queue.splice(lowestCostIndex, 1)[0];

        // Explore the neighbors
        for (const delta of deltas) {
            const candidatePoint = {
                col: current.point.col + delta.col,
                row: current.point.row + delta.row,
            };
            // Skip anything that isn't a path
            if (grid[candidatePoint.row]?.[candidatePoint.col] !== true) {
                continue;
            }

            // If we've reached the end, return the cost
            if (
                candidatePoint.col === end.col &&
                candidatePoint.row === end.row
            ) {
                return current.costSoFar + 1;
            }
            
            const aStarCandidate: AStarNode = {
                point: candidatePoint,
                from: current,
                costSoFar: current.costSoFar + 1,
                heuristicsCost: heuristicsCost(candidatePoint),
            }
            const cheapestVisit = visitedNodes[candidatePoint.row][candidatePoint.col];

            // Skip if we've already visited this node with a cheaper path
            if (
                cheapestVisit &&
                totalCost(cheapestVisit) <= totalCost(aStarCandidate)
            ) {
                continue;
            }

            // Mark the node as visited
            visitedNodes[candidatePoint.row][candidatePoint.col] = aStarCandidate;

            queue.push(aStarCandidate);
        }
    }

    return false;
}

function createGrid(walls: number[][]) {
    const grid: Grid = [];
    for (let x = 0; x < gridSize; x++){
        const row: boolean[] = [];
        for (let y = 0; y < gridSize; y++){
            row.push(true);
        }
        grid.push(row);
    }

    for (const [col, row] of walls) {
        grid[row][col] = false;
    }
    return grid;
}

function printGrid(grid: Grid) {
    for (const row of grid) {
        process.stdout.write("\n");
        for (const canGo of row) {
            process.stdout.write(canGo ? '•' : 'x');
        }
    }
    process.stdout.write("\n");
}

// Run binary search to find the first wall that blocks the path
let left = 0;
let right = walls.length - 1;
while (left < right) {
    const mid = Math.floor((left + right) / 2);

    const halfGrid = createGrid(walls.slice(0, mid + 1));
    if (false === aStar(halfGrid)) {
        right = mid;
    } else {
        left = mid + 1;
    }

    if (left === right) {
        const [nextCol, nextRow] = walls[left];
        console.log('the first wall that blocks the path is at', [nextCol, nextRow]);
        break;
    }
}
