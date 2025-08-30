//Mandelbrot canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Bifurcation plot canvas
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

//vars for bifurcation plot
let numIterations = 50;
let r_min = 2.5;
let r_max = 4;
let r_step = .002;
let transient = 50;
let iterations = 100;

//canvas dimensions
const org_width = "500";
const org_height = "500";

//vars for Mandelbrot scaling
let width = 500;
let height = 500;
let scaleFactor = 1/125;
const zoomFactor = 1/2;
let originR = 0;
let originI = 0;

//colors for Mandelbrot set
const colors = [
    "rgb(41, 55, 178)",
    "rgb(42, 81, 209)",
    "rgb(64, 148, 232)",
    "rgb(80, 196, 238)",
    "rgb(86, 230, 246)",
    "rgb(79, 246, 229)",
    "rgb(255, 255, 255)"
]

//MAIN
window.addEventListener('load', (event) => {
    for (let x = 0; x< width; x++){
        for (let y = 0; y< height; y++){
            plotInSet(x, y);
        }
    }

    plotBifurcationData(r_min, r_max, r_step, transient, iterations);
});


//zoom Mandelbrot on click --> fix centering
canvas.addEventListener("click", (event) => {
    //get position of mouse, offset for position of mouse on canvas not on screen
    const x = event.offsetX;
    const y = event.offsetY;

    //after click, clear screen 
    ctx.clearRect(0, 0, width, height);

    width *= zoomFactor;
    height *= zoomFactor;

    scaleFactor *= zoomFactor;

    const [a, b] = screenToWorld(x, y);

    originI = a;
    originR = b;
    //scaleFactor *= zoomFactor;

    for (let j = 0; j< org_width; j++){
        for (let k = 0; k< org_height; k++){
            plotInSet(j, k);
        }
    }

}
)

//reset image on double click
canvas.addEventListener("dblclick", (event) => {
    ctx.clearRect(0, 0, width, height);

    scaleFactor = 1/125;
    originI = 0;
    originR = 0;

    for (let j = 0; j< org_width; j++){
        for (let k = 0; k< org_height; k++){
            plotInSet(j, k);
        }
    }
    
})
//display the coordinates of the mouse position
canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const [cr, ci] = screenToWorld(x, y);
    label.textContent = `Position in set on R/I: r = ${cr.toFixed(3)}, i = ${ci.toFixed(3)}\r\nPosition on canvas: x = ${x}, y = ${y}`;
    label.style.whiteSpace = 'pre';
});
//plot point on Mandelbrot set
function plotPoint(x, y, radius=5){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fill();
}


function plotLine(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

//plot 
function plotInSet(x, y){
    //console.log("x", x, "y", y);
    const [cr, ci] = screenToWorld(x, y);
    //console.log("r", cr, "i", ci);
    label.textContent = `Position in set on R/I: r = ${cr.toFixed(3)}, i = ${ci.toFixed(3)}\r\nPosition on canvas: x = ${x}, y = ${y}`;
    label.style.whiteSpace = 'pre';
    
    let zr = 0;
    let zi = 0;
    for (let k =0; k<100; k++){
        const _zr = (zr*zr) - (zi*zi)+cr;
        const _zi = 2*zr*zi + ci;
        zr = _zr;
        zi = _zi;
        const dist = Math.sqrt(zr*zr + zi*zi);
        if (dist > 2){
            const color = colors[k%colors.length];
            ctx.fillStyle = color;
            plotPoint(x, y, 1);
            return;
        }
    }
    ctx.fillStyle = "black";
    plotPoint(x, y, 1);
}

//Scale Mandelbrot set functions
const xScale = 1/125;
const yScale = 1/500;


function screenToWorld(x, y){
    const r = originR+(x - org_width/2)*scaleFactor;
    const i = originI-(y - org_height/2)*scaleFactor;
    return [r, i];
}

function worldToScreen(r, i){
    const x = ((r-originR)/scaleFactor)+org_width/2;
    const y = -(i-originI)/scaleFactor +org_height/2;
    return [x, y];
}

//BIFURCATION FUNCTIONS
function logisticMap(x, r){
  return r*x*(1-x);
}

function plotBifurcationData(rMin, rMax, rStep, numIterations, numPointsToPlot) {
  ctx2.fillStyle = "black";
  for (let r = rMin; r <= rMax; r += rStep) {
    let x = Math.random(0, 1); // Initial random x value
    // Discard transient iterations
    for (let i = 0; i < numIterations; i++) {
      x = logisticMap(x, r);
    }
    // plot subsequent points
    for (let i = 0; i < numPointsToPlot; i++) {
      x = logisticMap(x, r);
      screenPoint = worldToScreen2(r, x)
      plotPoint2(screenPoint[0], screenPoint[1], radius = 0.9);
    }
  }
}

function plotPoint2(x, y, radius=5){
    ctx2.beginPath();
    ctx2.arc(x, y, radius, 0, Math.PI*2);
    ctx2.fill();
}

function worldToScreen2(r, new_x){
    x = r*(1000/3) - (2500/3);
    y = 500 - (new_x*500);
    return [x, y];
}

function screenToWorld2(x, y){
    r = (x + (2500/3))*(3/1000)
    x = -(y - 500)/500
}
