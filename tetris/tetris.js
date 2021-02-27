const SCALE_FACTOR = 30;

let cells = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];

const CONTAINER_WIDTH = cells[0].length;
const CONTAINER_HEIGHT = cells.length;

const blockDefs = [
    { // column
        shape: [[1,1,1,1]],
        background: 'blue'
    },
    { // square
        shape: [[1,1],[1,1]],
        background: 'green'
    },
    { // L
        shape: [[1,1,1],[1,0,0]],
        background:'red'
    },
    { // step
        shape: [[1,1,0],[0,1,1]],
        background:'orange'
    },
    { // arrow?
        shape: [[0,1,0],[1,1,1]],
        background: 'brown'
    }
];

window.onload = () => {
    // pause button
    document.addEventListener('click', event => {
        if (event.target.id === 'pause') clearInterval(interval);
    });

    // listen for arrow key presses (left, right, down)
    document.addEventListener('keydown', event => {
        const key = event.key;
        switch (key) {
            case 'ArrowLeft':
                moveBlock('left');
                break;
            case 'ArrowRight':
                moveBlock('right');
                break;
            case 'ArrowDown':
                moveBlock('down');
                break;
        }
        
    })

    let newYPos = 0;

    renderContainer();

    const blockType = getRandBlockType();

    const initialOffset = getInitialOffset(blockType);

    renderBlock(blockType,initialOffset);

    

    // animate block moving down
    /*const interval = window.setInterval(function() {
        if (newYPos<maxYPos) {
            newYPos = moveBlockDown('block1');
        }
    },100);*/
}

const moveBlock = (direction) => {
        
    // find left-most and right-most positions
    const [leftYPosition, rightYPosition, bottomXPosition, topXPosition] = findEdges();

    //console.log([leftYPosition, rightYPosition, bottomXPosition, topXPosition]);

    if (direction === 'left' || direction === 'right') {
        // move shape
        for (y=0; y<CONTAINER_HEIGHT; y++) {
            if (direction === 'left') {
                for (x=0; x<=CONTAINER_WIDTH-1; x++) {
                    movingLogic(direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition,x,y,x-1,0);
                }
            } else if (direction === 'right') {
                for (x=CONTAINER_WIDTH-1; x>=0; x--) {
                    movingLogic(direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition,x,y,x+1,0);
                }
            } 
        }
    } else if (direction === 'down') {
        for (y=CONTAINER_HEIGHT-1; y>=0; y--) {
            for (x=0; x<=CONTAINER_WIDTH-1; x++) {
                movingLogic(direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition,x,y,0,y+1)
            }
        }
    }
}

const findEdges = () => {
    let leftYPosition = CONTAINER_WIDTH;
    let rightYPosition = 0;
    let bottomXPosition = 0;
    let topXPosition = CONTAINER_HEIGHT;
    for (y=0; y<CONTAINER_HEIGHT; y++) {
        for (x=0; x<CONTAINER_WIDTH; x++) {
            if (cells[y][x] === 1 && x<leftYPosition) leftYPosition=x;
            if (cells[y][x] === 1 && x>rightYPosition) rightYPosition=x;
            if (cells[y][x] === 1 && y>bottomXPosition) bottomXPosition=y;
            if (cells[y][x] === 1 && y<topXPosition) topXPosition=y;
        }
    }
    return [leftYPosition,rightYPosition,bottomXPosition,topXPosition];
}

const movingLogic = (direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition,x,y,xOffset,yOffset) => {

    if (cells[y][x] === 1 && isValidMove(direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition)) {
        
        cells[y][x]=0;

        const oldBackground=getBoxBackground(x,y);

        formatBoxElement(x,y,'transparent');
    
        if (direction === 'left' || direction === 'right') {
            cells[y][xOffset]=1;
            formatBoxElement(xOffset,y,oldBackground);
        }
        if (direction === 'down') {
            cells[yOffset][x]=1;
            formatBoxElement(x,yOffset,oldBackground);
        }
    
    }
}

const getBoxBackground = (x,y) => {
    const box = document.querySelector('[x="' + x + '"][y="' + y + '"]');
    return box.style.background;
}

const formatBoxElement = (x,y,background) => {
    const box = document.querySelector('[x="' + x + '"][y="' + y + '"]');
    box.style.background = background;
}

const isValidMove = (direction,leftYPosition,rightYPosition,bottomXPosition,topXPosition) => {
    if (direction === 'left' && leftYPosition !== 0) return true;
    if (direction === 'right' && rightYPosition !== CONTAINER_WIDTH-1) return true;
    if (direction === 'down' && topXPosition !== CONTAINER_HEIGHT-(bottomXPosition-topXPosition)-1) return true;
    return false;
}


const getInitialOffset = (blockType) => {
    return Math.round((CONTAINER_WIDTH-blockDefs[blockType].shape[0].length)/2);
}

const renderContainer = () => {

    // outer box
    document.getElementById('container').style.height = CONTAINER_HEIGHT*SCALE_FACTOR + 'px';
    document.getElementById('container').style.width = CONTAINER_WIDTH*SCALE_FACTOR + 'px';

    // create array of inner boxes
    for (y=0; y<CONTAINER_HEIGHT; y++) {
        for (x=0; x<CONTAINER_WIDTH; x++) {
            const innerBox=document.createElement("div");
            innerBox.classList = 'box';
            innerBox.style.width=SCALE_FACTOR;
            innerBox.style.height=SCALE_FACTOR;
            innerBox.style.position='absolute';
            innerBox.style.top = y*SCALE_FACTOR;
            innerBox.style.left = x*SCALE_FACTOR;
            innerBox.setAttribute('x',x);
            innerBox.setAttribute('y',y);
            document.getElementById('container').appendChild(innerBox);
        }
    }
}

const getMaxYPos = (blockType) => {
    return CONTAINER_HEIGHT - parseInt(blockDefs[blockType].height*SCALE_FACTOR)
}

const getRandBlockType = () => {
    // # of possible block types (minus 1 for array selection)
    const max = blockDefs.length;
    // get a random value between 0 and # of block types - 1
    return Math.floor(Math.random() * Math.floor(max));
}

const renderBlock = (type,offset) => {

    // get max dimensions of block
    const height = blockDefs[type].shape.length;
    const width = blockDefs[type].shape[0].length;

    // save off background value
    const background=blockDefs[type].background;
    
    // loop through each cell of the shape
    for (let x=0; x<width; x++) {
        for (let y=0; y<height; y++) {
            // allows for center the block initially
            const xPos=x+offset;
            // populate array with shape definition
            cells[y][xPos] = blockDefs[type].shape[y][x];
            // get the HTML element that matches our array position
            const box = document.querySelector('[x="' + xPos + '"][y="' + y + '"]');
            // sets backgroun color for elements that represent element
            if (cells[y][xPos]===1) box.style.background = background;
        }
    }
}

const moveBlockDown = (id) => {
    const el = document.getElementById(id);
    const curYPos = getComputedStyle(el).top;
    const curYPosVal = parseInt(curYPos.slice(0,-2));
    const newYPosVal = curYPosVal + SCALE_FACTOR;
    el.style.top = newYPosVal + 'px';
    return newYPosVal;
}