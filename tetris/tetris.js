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

    const maxYPos = getMaxYPos(blockType);

    // animate block moving down
    /*const interval = window.setInterval(function() {
        if (newYPos<maxYPos) {
            newYPos = moveBlockDown('block1');
        }
    },100);*/
}

const moveBlock = (direction) => {
    if (direction === 'left' || direction === 'right') {
        

        // determine max number of left positions shape can move
        let leftPos = CONTAINER_WIDTH;
        let rightPos = 0;
        for (y=0; y<CONTAINER_HEIGHT; y++) {
            for (x=0; x<CONTAINER_WIDTH; x++) {
                if (cells[y][x] === 1 && x<leftPos) leftPos=x;
                if (cells[y][x] === 1 && x>rightPos) rightPos=x;
            }
        }
      
        // move shape
        if (direction === 'left') {
            for (y=0; y<CONTAINER_HEIGHT; y++) {
                for (x=0; x<CONTAINER_WIDTH; x++) {
                    movingLogic(direction,leftPos,rightPos,x,y,x-1);
                }
            }
        } else if (direction === 'right') {
            for (y=0; y<CONTAINER_HEIGHT; y++) {
                for (x=CONTAINER_WIDTH-1; x>=0; x--) {
                    movingLogic(direction,leftPos,rightPos,x,y,x+1);
                }
            } 
        }
        
    }
}

const movingLogic = (direction,leftPos,rightPos,x,y,xOffset) => {
    if (cells[y][x] === 1 && ((direction === 'left' && leftPos !== 0) || (direction === 'right' && rightPos !== CONTAINER_WIDTH-1))) {
        cells[y][x]=0;
        const oldBox = document.querySelector('[x="' + x + '"][y="' + y + '"]');
        
        const oldBackground=oldBox.style.background;
        oldBox.style.background = 'transparent';
    
        
        cells[y][xOffset]=1;
        //
        const newBox = document.querySelector('[x="' + xOffset + '"][y="' + y + '"]');
        // sets backgroun color for elements that represent element
        newBox.style.background = oldBackground;
    }
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