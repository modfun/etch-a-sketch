//create a 16 by 16 grid using div elements

const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const sliders = document.querySelector('.sliders');
const color = document.querySelector('.color').value = '#000000';
const eraserColor = document.querySelector('.eraserColor').value = '#ffffff';
const boardColor = document.querySelector('.boardColor').value = '#ffffff'
const brushSize = document.querySelector('.brushSize').value = '1';
const gridSize = document.querySelector('.gridSize').value = '16';
const windowSize = document.querySelector('.windowSize').value = '640px';

const buttonClasses = ['hoverMode', 'selectMode', 'randomMode', 'darken', 'lighten', 'toggleGrid', 'eraserMode' ,'clearMode'];
const buttonText = ['Hover', 'Select', 'Random', 'Darkening', 'Lightening', 'Grid', 'Eraser', 'Clear'];

let data = { 
    color: color, eraserModeState: false, eraserColor: eraserColor, randomColorState: false, randomColor: '#000000',
    brushSize: brushSize, currentMode: null, currentEvent: '',
    rows: gridSize, cols: gridSize, windowSize: windowSize
};

updateGrid();

console.log("[Created] " + 
    createButtons( buttonClasses, buttonText, panel) + " Buttons");

//function.bind allows us to pass an argument to function when used
//as a callback argument to addEventListener().
//function.bind() creates a new reference to the function.
//store the reference to use with removeEventListener() which
//only accepts the same reference that addEventListener() took.
sliders.addEventListener( 'input', useSliderValues);

let hoverModeBind = hoverMode.bind( null);
let selectModeBind = selectMode.bind( null);

panel.addEventListener( 'click', getMode.bind(
    null, hoverModeBind, selectModeBind, container)); 

function getMode( hoverModeBind, selectModeBind, container, event) {
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
        eraserModeToggle();
        if (data['randomColorState']) {
            randomColorToggle();
        }
    }
    else if (event.target.className === 'randomMode') {
        console.log( data['currentEvent'] + ":5");
        randomColorToggle();
        if (data['eraserModeState']) {
            eraserModeToggle();
        }
    }
}

function updateGrid() {
    console.log( '[Removed] ' + 
        removeAllChildern( container));
    console.log( '[Created] ' +
        createGrid( data['rows'], data['cols'], container));
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

function removeAllChildern( parent) {
    let elements = 0;
    while ( parent.firstChild) {
        while ( parent.firstChild.firstChild) {
            parent.firstChild.removeChild( parent.firstChild.firstChild);
            //removes a square as long there's a square
            elements++;
        }
        parent.removeChild( parent.firstChild);
        //removes a row as long there's a row
        elements++;
    }
    return elements;
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
    selectMode( event);
}

function selectMode( event) {
    let color = getCurrentColor();
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
            square.style['background-color'] = getCurrentColor();
            x++;
        }
        y++;
    }
}

function useSliderValues( event) {
    if ( event.target.className === 'color') {
        console.log(data['color'] = event.target.value);
    }
    else if ( event.target.className === 'eraserColor') {
        console.log(data['eraserColor'] = event.target.value);
    }
    else if ( event.target.className === 'brushSize') {
        console.log(data['brushSize'] = event.target.value);
    }
    else if ( event.target.className === 'gridSize') {
        console.log(data['rows'] = data['cols'] = event.target.value);
        updateGrid();
    }
    else if ( event.target.className === 'windowSize') {
        console.log(data['windowSize'] = event.target.value + 'px');
        updateContainer();
    }
}

function updateContainer() {
    container.style['width'] = data['windowSize'];
    container.style['height'] = data['windowSize'];
    console.log("[changed] " + data['windowSize']);
}

function eraserModeToggle() {
    if ( data['eraserModeState']) {
        data['eraserModeState'] = false;
    }
    else {
        data['eraserModeState'] = true;
    }
}

function randomColorToggle() {
    if ( data['randomColorState']) {
        data['randomColorState'] = false;
    }
    else {
        data['randomColorState'] = true;
    }
    console.log( '[set random] ' + data['randomColorState'] + ' ' + data['randomColor']);
}

function updateRandomColor() {
    if ( data['randomColorState']) {
            data['randomColor'] = '#'+Math.floor(Math.random()*16777215).toString(16);
    }
    return data['randomColor'];
}

function getCurrentColor() {
    let color = '#000000';
    if ( data['eraserModeState']) {
        color = data['eraserColor'];
    }
    else  if ( data['randomColorState']) {
        updateRandomColor();
        color = data['randomColor'];
    }
    else {
        color = data['color']
    }
    return color;
}