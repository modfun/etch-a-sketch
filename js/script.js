//create a 16 by 16 grid using div elements

const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const rows = 16;
const cols = 16;

const buttonClasses = ['hoverMode', 'selectMode', 'eraserMode'];
const buttonText = ['Hover Mode', 'Select Mode', 'Eraser Mode'];

let color = 'blue';
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
let selectModeBind = selectMode.bind( null, color);
let eraserModeBind = selectMode.bind( null, 'white');

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

function selectMode( color, event) {
    console.log('selct mode');
    event.target.style['background-color'] = color;
}