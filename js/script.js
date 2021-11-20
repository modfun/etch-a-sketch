//create a 16 by 16 grid using div elements

const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const rows = 16;
const cols = 16;
let currentMode = null;
let currentEvent = '';


console.log( "[Created] " + createGrid( rows, cols, container) + " Node");
document.body.appendChild( container);

color = 'blue';
container.addEventListener( 'mousemove', hoverMode.bind(null, color));
currentEvent = 'mousemove';
currentMode = hoverMode;

panel.addEventListener( 'click', getMode.bind(null, color, container)); 

function getMode( color, container, event) {
    if (event.target.className === 'hoverMode') {
        container.removeEventListener( currentEvent, currentMode);
        hoverMode( color, event);
    }
    else if (event.target.className === 'selectMode') {
        container.removeEventListener( currentEvent, currentMode);
        selectMode( color, event);
    }
}

function createGrid( rowSize, colSize, target) {
    let i = 0;
    while ( i < rowSize) {
        const row = document.createElement('div');
        row.classList.add( "row");
        for (let j = 0; j < colSize; ++j) {
            const square = document.createElement('div');
            square.classList.add("square");
            row.appendChild( square);
        }
        target.appendChild( row);
        ++i;
    }
    return rowSize*colSize;
}

function hoverMode( color, event) {
    console.log(event.target);
    event.target.style['background-color'] = color;
}

function clearGrid() {
}

function selectMode( event, color) {
    hoverMode( color, event);
}