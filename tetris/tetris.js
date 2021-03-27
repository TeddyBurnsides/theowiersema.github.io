const SCALE_FACTOR = 30; // for HTML element styling purposes

let cells = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,4,0,0,2,2,1,0,0,1],
    [4,4,0,0,2,2,1,0,0,1],
    [4,5,0,0,4,4,1,2,2,1],
    [5,5,5,4,4,0,1,2,2,1],
];

// build 10x10 array with zeros
let ACTIVE_CELLS = Array.from(Array(10), () => new Array(10).fill(0))

const CONTAINER_WIDTH = cells[0].length;
const CONTAINER_HEIGHT = cells.length;

const blockDefs2 = [
    { // column
        shape: [[1,1,1,1]]
    },
    { // square
        shape: [[2,2],[2,2]]
    },
    { // L
        shape: [[3,3,3],[3,0,0]]
    },
    { // step
        shape: [[4,4,0],[0,4,4]]
    },
    { // arrow?
        shape: [[0,5,0],[5,5,5]]
    }
];

const blockDefs = [
    { // column
        shape: [
            [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
            [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],
            [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]],
            [[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]]
        ]
    },
    { // square
        shape: [
            [[2,2],[2,2]],
            [[2,2],[2,2]],
            [[2,2],[2,2]],
            [[2,2],[2,2]]
        ]
    },
    { // L
        shape: [
            [[3,3,3],[3,0,0],[0,0,0]],
            [[3,0,0],[3,0,0],[3,3,0]]
            [[0,0,0],[3,0,0],[3,3,3]],
            [[0,0,3],[0,0,3],[0,3,3]]
        ]
    },
    { // step
        shape: [
            [[4,4,0],[0,4,4],[0,0,0]],
            [[0,4,0],[4,4,0],[4,0,0]],
            [[0,0,0],[4,4,0],[0,4,4]],
            [[0,4,0],[0,4,4],[0,0,4]]
        ]
    },
    { // arrow?
        shape: [
            [[0,5,0],[5,5,5],[0,0,0]],
            [[5,0,0],[5,5,0],[5,0,0]],
            [[0,0,0],[5,5,5],[0,5,0]],
            [[0,0,5],[0,5,5],[0,0,5]]
        ]
    }
];

// define movement for consistency
const MOVEMENT = {
    left: 'left',
    right: 'right',
    down: 'down'
}

let CURRENT_BLOCK_TYPE; // 0,1,2,3,4
let CURRENT_BLOCK_ROTATION=0; //0,1,2,3

window.onload = () => {

    // pause button
    document.querySelector('#pause').addEventListener('click', pauseGame);

    // listen for arrow key presses (left, right, down)
    document.addEventListener('keydown', e => {
        const key = e.key;
        if (key === 'ArrowLeft') attemptToMoveBlock(MOVEMENT.left);
        if (key === 'ArrowRight') attemptToMoveBlock(MOVEMENT.right);
        if (key === 'ArrowDown') attemptToMoveBlock(MOVEMENT.down);
        if (key === 'ArrowUp') attemptToRotateBlock();    
    });

    
    renderContainer(); // initialize container

    CURRENT_BLOCK_TYPE = getRandBlockType();

    const x = getInitialOffset();

    renderActiveShape(x,0); // build initial block
 
}

const attemptToRotateBlock = () => {

    const nextRotationPosition = getNextRotation();
    
    const rotatedShape = blockDefs[CURRENT_BLOCK_TYPE].shape[nextRotationPosition];

    const position = getCurrentPosition();

    console.log(position);

    // is rotation valid, and if so return [x,y] coordinates as output variable
    if (isValidRotation(nextRotationPosition,position)) {
        console.log(position)
    }
}

// 
const isValidRotation = (rotationPos,currentPos) => {

    currentPos[0]=currentPos[0]+1;

    return true;
}

// define shape array position (cycles from 0 to 3)
const getNextRotation = () => {
    if (CURRENT_BLOCK_ROTATION<3) return CURRENT_BLOCK_ROTATION+1;
    return 0;
}

const pauseGame = () => {

    clearInterval();
}


const attemptToMoveBlock = (direction) => {
        
    if (isValidMove(direction)) {

        // get current coordinates of top left cell of shape
        const [x, y] = getCurrentPosition();

        // get number of blocks to move for each direction 
        const [xOffset, yOffset] = getOffsets(direction);

        const [newX, newY] = [x+xOffset, y+yOffset];

        console.log('Valid Move: Current Position is x=' + newX + ' y=' + newY);

        // render block on screen
        renderActiveShape(newX,newY)
    }

}

const getCurrentPosition = () => {

    // get top left coordinate of current block
    const edges = findEdgesOfActiveBlock()

    return [edges.leftYPosition,edges.topXPosition];
}

const renderActiveShape = (xOffset,yOffset) => {

    // clear last render of active shape
    for (let x=0; x<CONTAINER_WIDTH; x++) {
        for (let y=0; y<CONTAINER_HEIGHT; y++) {
            if (ACTIVE_CELLS[y][x] > 0) changeActiveCell(x,y,0);
        }
    }
    
    // get max dimensions of block
    const height = blockDefs[CURRENT_BLOCK_TYPE].shape[CURRENT_BLOCK_ROTATION].length;
    const width = blockDefs[CURRENT_BLOCK_TYPE].shape[CURRENT_BLOCK_ROTATION][0].length;
    
    // loop through each cell of the shape
    for (let x=0; x<width; x++) {
        for (let y=0; y<height; y++) {
            // only do things for define shape positions
            if (blockDefs[CURRENT_BLOCK_TYPE].shape[CURRENT_BLOCK_ROTATION][y][x] > 0) {
                const backgroundColor=blockDefs[CURRENT_BLOCK_TYPE].shape[CURRENT_BLOCK_ROTATION][y][x];   
                changeActiveCell(x+xOffset,y+yOffset,backgroundColor);
            }
        }
    }

}

const isValidMove = (direction) => {

    const edges = findEdgesOfActiveBlock();

    // is outside bounds of container
    if (!insideContainer(direction,edges)) {
        console.log('Invalid Move: Not inside container');
        return false;
    }

    // overlaps existing block
    if (overlapsBlock(direction)) {
        console.log('Invalid Move: Overlaps existing block');
        return false;
    }

    return true;
}

const overlapsBlock = (direction='') => {

    let xOffset=0;
    let yOffset=0;
    if (direction==='left') xOffset=-1;
    if (direction==='right') xOffset=1;
    if (direction==='down') yOffset=1;

    for (y=CONTAINER_HEIGHT-1; y>=0; y--) {
        for (x=0; x<=CONTAINER_WIDTH-1; x++) {
            // overlap between current active block position, and future background block position
            if (ACTIVE_CELLS[y][x] > 0 && cells[y+yOffset][x+xOffset] > 0) return true;
        }
    }
    return false;
}

const findEdgesOfActiveBlock = (direction) => {

    // find current edges
    let leftYPosition = CONTAINER_WIDTH;
    let rightYPosition = 0;
    let bottomXPosition = 0;
    let topXPosition = CONTAINER_HEIGHT;
    for (y=0; y<CONTAINER_HEIGHT; y++) {
        for (x=0; x<CONTAINER_WIDTH; x++) {
            if (ACTIVE_CELLS[y][x] > 0 && x<leftYPosition) leftYPosition=x;
            if (ACTIVE_CELLS[y][x] > 0 && x>rightYPosition) rightYPosition=x;
            if (ACTIVE_CELLS[y][x] > 0 && y>bottomXPosition) bottomXPosition=y;
            if (ACTIVE_CELLS[y][x] > 0 && y<topXPosition) topXPosition=y;
        }
    }

    // make adjustments for movement (if provided)
    if (direction === MOVEMENT.left) {
        leftYPosition=leftYPosition-1;
        rightYPosition=rightYPosition-1;
    }
    if (direction === MOVEMENT.right) {
        leftYPosition=leftYPosition+1;
        rightYPosition=rightYPosition+1;
    }
    if (direction === MOVEMENT.down) {
        bottomXPosition=bottomXPosition+1;
        topXPosition=topXPosition+1;
    }

    return {leftYPosition,rightYPosition,bottomXPosition,topXPosition};
}

const getOffsets = (direction) => {
    let xOffset=0;
    let yOffset=0;
    if (direction === MOVEMENT.left) xOffset=-1;
    if (direction === MOVEMENT.right) xOffset=1;
    if (direction === MOVEMENT.down) yOffset=1;
    
    return [xOffset, yOffset];
}

const changeActiveCell = (x,y,backgroundValue) => {
    // only set cells inside container
    if (y >=0 && x >= 0 && y < CONTAINER_HEIGHT && x < CONTAINER_WIDTH) {
        ACTIVE_CELLS[y][x]=backgroundValue;
        setCellBackground(x,y,backgroundValue);
    }
}

const setCellBackground = (x,y,background) => {
    const box = document.querySelector('[x="' + x + '"][y="' + y + '"]');
    box.style.background = backgroundColor(background);
}

const insideContainer = (direction,edges) => {
    if (direction === 'left' && edges.leftYPosition !== 0) return true;
    if (direction === 'right' && edges.rightYPosition !== CONTAINER_WIDTH-1) return true;
    if (direction === 'down' && edges.topXPosition !== CONTAINER_HEIGHT-(edges.bottomXPosition-edges.topXPosition)-1) return true;
    return false;
}

const getInitialOffset = () => {
    return Math.round((CONTAINER_WIDTH-blockDefs[CURRENT_BLOCK_TYPE].shape[CURRENT_BLOCK_ROTATION][0].length)/2);
}

const renderContainer = () => {

    // outer box
    const container=document.getElementById('container');

    container.style.height = CONTAINER_HEIGHT*SCALE_FACTOR + 'px';
    container.style.width = CONTAINER_WIDTH*SCALE_FACTOR + 'px';

    // create array of inner boxes
    for (y=0; y<CONTAINER_HEIGHT; y++) {
        for (x=0; x<CONTAINER_WIDTH; x++) {
            const innerBox=document.createElement("div");
            innerBox.style.width=SCALE_FACTOR;
            innerBox.style.height=SCALE_FACTOR;
            innerBox.style.position='absolute';
            innerBox.style.top = y*SCALE_FACTOR;
            innerBox.style.left = x*SCALE_FACTOR;
            innerBox.setAttribute('x',x);
            innerBox.setAttribute('y',y);
            innerBox.style.background = backgroundColor(cells[y][x]);
            innerBox.classList = 'active';
            container.appendChild(innerBox);
        }
    }
}

const getRandBlockType = () => {
    // # of possible block types (minus 1 for array selection)
    const max = blockDefs.length;
    // get a random value between 0 and # of block types - 1
    return Math.floor(Math.random() * Math.floor(max));
}

const backgroundColor = (val) => {
    if (val===1) return '#4f92ce'; // blue
    if (val===2) return '#209b75'; // green
    if (val===3) return '#ffd46b'; // yellow
    if (val===4) return '#5848cf'; // purple
    if (val===5) return '#ff6262'; // red
    return 'transparent';
}