const container = document.getElementsByClassName("container")[0];
const panel = document.querySelector('.panel');
const sliders = document.querySelector('.sliders');
const color = document.querySelector('.color').value = '#000000';
const eraserColor = document.querySelector('.eraserColor').value = '#ffffff';
const boardColor = document.querySelector('.boardColor').value = '#ffffff'
const brushSize = document.querySelector('.brushSize').value = '1';
const gridSize = document.querySelector('.gridSize').value = '16';
const windowSize = document.querySelector('.windowSize').value = '640px';

const buttonClasses = ['hoverMode', 'selectMode', 'randomMode', 'darken', 'lighten', 'eraserMode', 'toggleGrid' ,'clearMode', 'restAll'];
const buttonText = ['Hover', 'Select', 'Random', 'Darkening', 'Lightening', 'Eraser', 'Grid', 'Clear', 'Rest'];

let data = { 
    color: color, eraserModeState: false, eraserColor: eraserColor, randomColorState: false, randomColor: '#000000',
    boardColor: boardColor, brushSize: brushSize, currentMode: null, currentEvent: '',
    rows: gridSize, cols: gridSize, windowSize: windowSize, gridState: true,
    darkenState: false, lightenState: false, grayValue: 0
};

updateGrid();

console.log("[Created] " + 
    createButtons( buttonClasses, buttonText, panel) + " Buttons"
);

//function.bind allows us to pass an argument to function when used
//as a callback argument to addEventListener().
//function.bind() creates a new reference to the function.
//store the reference to use with removeEventListener() which
//only accepts the same reference that addEventListener() took.
sliders.addEventListener( 'input', useSliderValues);

let hoverModeBind = hoverMode.bind( null);
let selectModeBind = selectMode.bind( null);
let eraserModeBind =  eraserModeToggle.bind( null);

panel.addEventListener( 'click', getMode.bind(
    null, hoverModeBind, selectModeBind, container
)); 

//dbl click to select Mode or click and drag to hover Mode
container.addEventListener( 'dblclick', selectModeBind);
container.addEventListener( 'mousedown', (e) => {
    if ( e.which === 3) {
        normalModeToggle();
        eraserModeToggle();
    }
    container.addEventListener( 'mousemove', hoverModeBind);
    e.preventDefault();
});
container.addEventListener( 'mouseup', (e) => {
    container.removeEventListener( 'mousemove', hoverModeBind);
    if ( e.which === 3) {
        eraserModeToggle();
        normalModeToggle();
    }
    e.preventDefault();
});
// remove the contextmenu
container.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

function getMode( hoverModeBind, selectModeBind, container, event) {

    if (event.target.className === 'hoverMode') {
        container.removeEventListener( data['currentEvent'], data['currentMode']);

        container.addEventListener( 'mousemove', hoverModeBind);

        data['currentEvent'] = 'mousemove';
        data['currentMode'] = hoverModeBind;
        normalModeToggle();
    }
    else if (event.target.className === 'selectMode') {
        container.removeEventListener( data['currentEvent'], data['currentMode']);

        container.addEventListener( 'click', selectModeBind);

        data['currentEvent'] = 'click';
        data['currentMode'] = selectModeBind;
        normalModeToggle();
    }
    else if (event.target.className === 'eraserMode') {
        normalModeToggle();
        eraserModeToggle();
    }
    else if (event.target.className === 'randomMode') {
        randomColorToggle();
        if (data['eraserModeState']) {
            eraserModeToggle();
        }
    }
    else if (event.target.className === 'darken') {
        normalModeToggle();
        data['darkenState'] = true;
        if ( data['grayValue'] > 0) data['grayValue'] = 0;
        data['grayValue'] = data['grayValue'] - 0.10;
    }
    else if (event.target.className === 'lighten') {
        normalModeToggle();
        data['lightenState'] = true;
        if ( data['grayValue'] < 0) data['grayValue'] = 0;
        data['grayValue'] = data['grayValue'] + 0.10;
    }
    else if (event.target.className === 'toggleGrid') {
        toggleBorders();
    }
    else if (event.target.className === 'clearMode') {
        updateGrid();
    }
    else if (event.target.className === 'restAll') {
        restAll();
    }
}

function updateGrid() {
    console.log( '[Removed] ' + 
        removeAllChildern( container));
    console.log( '[Created] ' +
        createGrid( data['rows'], data['cols'], container));
    updateGridBorders();
}

function createGrid( rowSize, colSize, target) {
    let i = 0;
    while ( i < rowSize) {
        const row = document.createElement('div');
        row.classList.add( "row");
        for (let j = 0; j < colSize; ++j) {
            const square = document.createElement('div');
            square.classList.add("square");
            square.style['background-color'] = data['boardColor'];
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
            elements++;
        }
        parent.removeChild( parent.firstChild);
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
    let color = getCurrentColor( event);
    let brushSize = data['brushSize']
    let rows = data['rows'];
    let cols = data['cols'];

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
            square.style['background-color'] = getCurrentColor( event);
            x++;
        }
        y++;
    }
}

function useSliderValues( event) {
    if ( event.target.className === 'color') {
        data['color'] = event.target.value;
    }
    else if ( event.target.className === 'eraserColor') {
        data['eraserColor'] = event.target.value;
    }
    else if ( event.target.className === 'boardColor') {
        data['boardColor'] = event.target.value;
        updateGrid()
    }
    else if ( event.target.className === 'brushSize') {
        data['brushSize'] = event.target.value;
    }
    else if ( event.target.className === 'gridSize') {
        data['rows'] = data['cols'] = event.target.value;
        updateGrid();
    }
    else if ( event.target.className === 'windowSize') {
        data['windowSize'] = event.target.value + 'px';
        updateContainer();
    }
}

function updateContainer() {
    container.style['width'] = data['windowSize'];
    container.style['height'] = data['windowSize'];
    console.log("[changed] " + data['windowSize']);
}

function normalModeToggle() {
    if ( data['eraserModeState']) {
        eraserModeToggle()
    }
    if ( data['randomColorState']) {
        randomColorToggle()
    }
    if ( data['darkenState']) {
        data['darkenState'] = false;
    }
    if ( data['lightenState']) {
        data['lightenState'] = false;
    }
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
}

function updateRandomColor() {
    if ( data['randomColorState']) {
            data['randomColor'] = '#'+Math.floor(Math.random()*16777215).toString(16);
    }
    return data['randomColor'];
}

function getCurrentColor( event) {
    let color = '#000000';
    if ( data['eraserModeState']) {
        color = data['eraserColor'];
    }
    else  if ( data['randomColorState']) {
        updateRandomColor();
        color = data['randomColor'];
    }
    else if (data['darkenState']) {
        color = pSBC( data['grayValue'], event.target.style['background-color']);
    }
    else if ( data['lightenState']) {
        color = pSBC( data['grayValue'], event.target.style['background-color']);
    }
    else {
        color = data['color']
    }
    return color;
}

function toggleBorders() {
    if ( data['gridState']) {
        data['gridState'] = false;
    }
    else {
        data['gridState'] = true;
    }
    updateGridBorders();
}

function updateGridBorders() {
    let boardermode = 'none';
    if ( data['gridState']) {
        boardermode = '2px solid #808080';
    }

    let squares = document.querySelectorAll('.square');
    for ( let i = 0; i < squares.length; ++i) {
        squares[i].style['outline'] = boardermode;
    }
}

function restAll( event) {
    //rest all to default values
    const color = document.querySelector('.color').value = '#000000';
    const eraserColor = document.querySelector('.eraserColor').value = '#ffffff';
    const boardColor = document.querySelector('.boardColor').value = '#ffffff'
    const brushSize = document.querySelector('.brushSize').value = '1';
    const gridSize = document.querySelector('.gridSize').value = '16';
    const windowSize = document.querySelector('.windowSize').value = '640px';

    let default_data = { 
        color: color, eraserModeState: false, eraserColor: eraserColor, randomColorState: false, randomColor: '#000000',
        boardColor: boardColor, brushSize: brushSize, currentMode: null, currentEvent: '',
        rows: gridSize, cols: gridSize, windowSize: windowSize, gridState: true,
        darkenState: false, lightenState: false, grayValue: 0
    };
    data = default_data;

    updateContainer();
    updateGrid();
    normalModeToggle();
    updateGridBorders();
}

//auto-detects and accepts HEX colors or RGB colors
//use: pSBC(0.42, color);   42% lighter
//use: pSBC(-0.4, color);   40% darker
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}