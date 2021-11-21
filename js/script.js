//create a 16 by 16 grid using div elements

const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const rows = 16;
const cols = 16;

const buttonClasses = ['hoverMode', 'selectMode', 'eraserMode'];
const buttonText = ['Hover Mode', 'Select Mode', 'Eraser Mode'];

let color = 'blue';
let eraserColor = 'white';
let brushSize = 4;
let currentMode = null;
let currentEvent = '';


console.log( "[Created] " + 
    createGrid( rows, cols, container) + " Squares");
console.log("[Created] " + 
    createButtons( buttonClasses, buttonText, panel) + " Buttons");

//function.bind allows us to pass an argument to function when used
//as a callback argument to addEventListener().
//function.bind() creates a new reference to the function.
//store the reference to use with removeEventListener() which
//only accepts the same reference that addEventListener() took.
let hoverModeBind = hoverMode.bind( null, color);
let selectModeBind = selectMode.bind( null, color, brushSize, rows, cols);
let eraserModeBind = selectMode.bind( null, eraserColor, brushSize, rows, cols);

container.addEventListener( 'mousemove', hoverModeBind);
currentEvent = 'mousemove';
currentMode = hoverModeBind;

panel.addEventListener( 'click', getMode.bind(
    null, hoverModeBind, selectModeBind, eraserModeBind, color, container)); 

function getMode( hoverModeBind, selectModeBind, eraserModeBind, color, container, event) {
    console.log(event.target.className + ':1');
    if (event.target.className === 'hoverMode') {
        console.log(currentEvent + ":2");
        container.removeEventListener( currentEvent, currentMode);
        container.addEventListener( 'mousemove', hoverModeBind);
        currentEvent = 'mousemove';
        currentMode = hoverModeBind;
    }
    else if (event.target.className === 'selectMode') {
        console.log(currentEvent + ":3");
        container.removeEventListener( currentEvent, currentMode);
        container.addEventListener( 'click', selectModeBind);
        currentEvent = 'click';
        currentMode = selectModeBind;
    }
    else if (event.target.className === 'eraserMode') {
        console.log(currentEvent + ":4");
        container.removeEventListener( currentEvent, currentMode);
        container.addEventListener( 'click', eraserModeBind);
        currentEvent = 'click';
        currentMode = eraserModeBind;
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

function createButtons( classes, text, target) {
    for (let i = 0; i < classes.length; ++i) {
        const button = document.createElement('button');
        button.textContent = text[i]
        button.classList.add(classes[i]);
        target.appendChild(button);
    }
    return classes.length;
}

function hoverMode( color, event) {
    console.log('hover mode');
    event.target.style['background-color'] = color;
}

function selectMode( color, brushSize, rows, cols, event) {
    console.log('selct mode');
    if ( brushSize === 0) {
        event.target.style['background-color'] = color;
    }
    else {
        //get the coordinates of the current target square
        let col = Array.prototype.indexOf.call(
            event.target.parentNode.childNodes, event.target);
        let row = Array.prototype.indexOf.call(
            event.target.parentNode.parentNode.childNodes, event.target.parentNode);

        //calculate the area of effect to perfurme the action
        //make sure nothing goes out of bounds
        const row_start = row - Math.trunc( brushSize / 2);
        let row_end = row + Math.trunc( brushSize / 2);
        row_end = ( row_end >= rows) ? rows - 1 : row_end; //>= because we start from zero

        const col_start = col - Math.trunc( brushSize / 2);
        let col_end = col + Math.trunc( brushSize / 2);
        col_end = ( col_end >= cols) ? cols - 1 : col_end;
        console.log(row);
        console.log(col);

        //start traversing according to the calculatd bounds
        let y = ( row_start < 0) ? 0: row_start;    //prevent going offbounds
        while ( y <= row_end) {
            let rowNode = event.target.parentNode.parentNode.childNodes.item(y);
            console.log(rowNode);

            let x = ( col_start < 0) ? 0: col_start;
            while ( x <= col_end) {
                let square = rowNode.childNodes.item(x);
                console.log(square);
                square.style['background-color'] = color;
                x++;
            }
            y++;
        }
    }
}