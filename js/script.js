//create a 16 by 16 grid using div elements

const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const sliders = document.querySelector('.sliders');
const color = document.querySelector('.color').value = '#000000';
const eraserColor = document.querySelector('.eraserColor').value = '#ffffff';
const brushSize = document.querySelector('.brushSize').value = '1';
const gridSize = document.querySelector('.gridSize').value = '16';

const buttonClasses = ['hoverMode', 'selectMode', 'eraserMode'];
const buttonText = ['Hover Mode', 'Select Mode', 'Eraser Mode'];

let data = { color: color, eraserColor: eraserColor,
    brushSize: brushSize, currentMode: null, currentEvent: '',
    rows: gridSize, cols: gridSize};
let rows = data['rows'];
let cols = data['cols'];


console.log( "[Created] " + 
    createGrid( data['rows'], data['cols'], container) + " Squares");
console.log("[Created] " + 
    createButtons( buttonClasses, buttonText, panel) + " Buttons");

//function.bind allows us to pass an argument to function when used
//as a callback argument to addEventListener().
//function.bind() creates a new reference to the function.
//store the reference to use with removeEventListener() which
//only accepts the same reference that addEventListener() took.
sliders.addEventListener( 'input', changeSliderValues);

let hoverModeBind = hoverMode.bind( null);
let selectModeBind = selectMode.bind( null, false);
let eraserModeBind = selectMode.bind( null, true);

// container.addEventListener( 'mousemove', hoverModeBind);
// currentEvent = 'mousemove';
// currentMode = hoverModeBind;

panel.addEventListener( 'click', getMode.bind(
    null, hoverModeBind, selectModeBind, eraserModeBind, container)); 


function getMode( hoverModeBind, selectModeBind, eraserModeBind, container, event) {
    console.log(event.target.className + ':1');

    if (event.target.className === 'hoverMode') {
        console.log(data['currentEvent'] + ":2");
        container.removeEventListener( data['currentEvent'], data['currentMode']);

        container.addEventListener( 'mousemove', hoverModeBind);

        data['currentEvent'] = 'mousemove';
        data['currentMode'] = hoverModeBind;
    }
    else if (event.target.className === 'selectMode') {
        console.log(data['currentEvent'] + ":3");
        container.removeEventListener( data['currentEvent'], data['currentMode']);

        container.addEventListener( 'click', selectModeBind);

        data['currentEvent'] = 'click';
        data['currentMode'] = selectModeBind;
    }
    else if (event.target.className === 'eraserMode') {
        console.log(data['currentEvent'] + ":4");
        container.removeEventListener( data['currentEvent'], data['currentMode']);

        container.addEventListener( 'click', eraserModeBind);

        data['currentEvent'] = 'click';
        data['currentMode'] = eraserModeBind;
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

function removeGrid( ) {
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

function hoverMode( event) {
    console.log('hover mode');
    event.target.style['background-color'] = data['color'];
}

function selectMode( isEraserMode, event) {
    let color = isEraserMode ? data['eraserColor'] : data['color'];
    let brushSize = data['brushSize']
    let rows = data['rows'];
    let cols = data['cols'];

    console.log('selct mode' + brushSize + color);
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

    //start traversing according to the calculatd bounds
    let y = ( row_start < 0) ? 0: row_start;    //prevent going offbounds
    while ( y <= row_end) {
        let rowNode = event.target.parentNode.parentNode.childNodes.item(y);

        let x = ( col_start < 0) ? 0: col_start;
        while ( x <= col_end) {
            let square = rowNode.childNodes.item(x);
            square.style['background-color'] = color;
            x++;
        }
        y++;
    }
}

function changeSliderValues( event) {
    if ( event.target.className === 'color') {
        console.log(data['color'] = event.target.value);
    }
    else if ( event.target.className === 'brushSize') {
        console.log(data['brushSize'] = event.target.value);
    }
    else if ( event.target.className === 'gridSize') {
        console.log(data['rows'] = data['cols'] = event.target.value);
    }
}