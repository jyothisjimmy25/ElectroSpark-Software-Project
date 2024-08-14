const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isDrawingLine = false;
let startX, startY; // Coordinates for drawing lines
let lineWidth = 2; // Default line width
let lines = []; // Array to store all the lines

// Circles coordinates and properties
const circles = [
    { id: 'circle1', x: 120, y: 600, color: 'black', radius: 5 },
    { id: 'circle2', x: 120, y: 480, color: 'black', radius: 5 },
    { id: 'circle3', x: 80, y: 480, color: 'black', radius: 5 },
    { id: 'circle4', x: 80, y: 330, color: 'black', radius: 5 },
    { id: 'circle5', x: 180, y: 330, color: 'black', radius: 5 },
    { id: 'circle6', x: 120, y: 385, color: 'green', radius: 5 },
    { id: 'circle7', x: 120, y: 100, color: 'green', radius: 5 },
    { id: 'circle8', x: 694, y: 100, color: 'green', radius: 5 },
    { id: 'circle9', x: 694, y: 205, color: 'green', radius: 5 },
    { id: 'circle10', x: 255, y: 395, color: 'yellow', radius: 5 },
    { id: 'circle11', x: 255, y: 475, color: 'yellow', radius: 5 },
    { id: 'circle12', x: 740, y: 475, color: 'yellow', radius: 5 },
    { id: 'circle13', x: 740, y: 292, color: 'yellow', radius: 5 },
    { id: 'circle14', x: 694, y: 292, color: 'indigo', radius: 5 },
    { id: 'circle15', x: 694, y: 425, color: 'indigo', radius: 5 },
    { id: 'circle16', x: 828, y: 425, color: 'indigo', radius: 5 },
    { id: 'circle17', x: 828, y: 235, color: 'indigo', radius: 5 },
    { id: 'circle18', x: 738, y: 205, color: 'maroon', radius: 5 },
    { id: 'circle19', x: 775, y: 205, color: 'maroon', radius: 5 },
    { id: 'circle20', x: 775, y: 285, color: 'maroon', radius: 5 },
    { id: 'circle21', x: 815, y: 285, color: 'maroon', radius: 5 },
    { id: 'circle22', x: 815, y: 535, color: 'maroon', radius: 5 },
    { id: 'circle23', x: 900, y: 535, color: 'maroon', radius: 5 },
    { id: 'circle24', x: 828, y: 214, color: 'red', radius: 5 },
    { id: 'circle25', x: 905, y: 504, color: 'red', radius: 5 },
];

// Draw circles
const drawCircles = () => {
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();

        // Print number near the circle
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(circle.id.split('circle')[1], circle.x - 15, circle.y + 15);
    });
};

// Check if a point is inside a circle
const isPointInsideCircle = (pointX, pointY, circleX, circleY, radius) => {
    const distance = Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2);
    return distance <= radius;
};

// Load and draw images
const images = [
    { src: 'static/images/resistance-box-plug-type-1-5000-ohms-salco-original-imagcrzufryhhxqr.png', x: 1100 - 250, y: 500, width: 350, height: 250 },
    { src: 'static/images/breadbordcircuit.png', x: 500, y: 150, width: 500, height: 200 },
    { src: 'static/images/transformer.jpg', x: 100, y: 300, width: 300, height: 150 },
    { src: 'static/images/plugpoint.jpeg', x: 40, y: 500, width: 200, height: 150 }
];

const loadAndDrawImages = () => {
    images.forEach(image => {
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, image.x, image.y, image.width, image.height);
            drawCircles(); // Draw circles after each image is loaded
            drawLines(); // Draw lines after images
        };
        img.src = image.src;
    });
};

// Event listeners for toolbar buttons
toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        lines = []; // Clear the lines array
        redrawCanvas();
    }

    if (e.target.id === 'delete') {
        if (lines.length > 0) {
            lines.pop(); // Remove the last drawn line
            redrawCanvas();
        }
    }
});

// Event listener for toolbar input changes
toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = parseInt(e.target.value);
    }
});

// Event listener for mouse down on canvas
canvas.addEventListener('mousedown', (e) => {
    // Check if clicked inside a circle
    circles.forEach(circle => {
        if (isPointInsideCircle(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY, circle.x, circle.y, circle.radius)) {
            // Set the start coordinates and flag for drawing line
            startX = circle.x;
            startY = circle.y;
            isDrawingLine = true;
        }
    });
});

// Event listener for mouse up on canvas
canvas.addEventListener('mouseup', e => {
    if (isDrawingLine) {
        isDrawingLine = false;
        const mouseX = e.clientX - canvasOffsetX;
        const mouseY = e.clientY - canvasOffsetY;

        // Check if the mouse is inside any circle
        circles.forEach(circle => {
            if (isPointInsideCircle(mouseX, mouseY, circle.x, circle.y, circle.radius)) {
                // Find the starting circle
                const startCircle = circles.find(c => c.x === startX && c.y === startY);
                // Find the ending circle
                const endCircle = circles.find(c => c.x === circle.x && c.y === circle.y);
                if (startCircle.id === 'circle1' && endCircle.id === 'circle2') {
                    // Valid connection from black to green
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle2' && endCircle.id === 'circle3') {
                    // Valid connection from green to red
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle3' && endCircle.id === 'circle4') {
                    // Valid connection from green to red
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle4' && endCircle.id === 'circle5') {
                    // Valid connection from green to red
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle6' && endCircle.id === 'circle7') {
                    // Valid connection from green to red
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle7' && endCircle.id === 'circle8') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle8' && endCircle.id === 'circle9') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                }  else if (startCircle.id === 'circle10' && endCircle.id === 'circle11') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle11' && endCircle.id === 'circle12') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle12' && endCircle.id === 'circle13') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle14' && endCircle.id === 'circle15') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle15' && endCircle.id === 'circle16') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                }  else if (startCircle.id === 'circle16' && endCircle.id === 'circle17') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle18' && endCircle.id === 'circle19') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle19' && endCircle.id === 'circle20') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle20' && endCircle.id === 'circle21') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle21' && endCircle.id === 'circle22') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else if (startCircle.id === 'circle22' && endCircle.id === 'circle23') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                }
                else if (startCircle.id === 'circle24' && endCircle.id === 'circle25') {
                    // Valid connection from red to orange
                    lines.push({ startX, startY, endX: circle.x, endY: circle.y, width: lineWidth });
                    redrawCanvas();
                    if (isCirclesConnected()) {
                        alert("Your connections are correct.");
                    }
                } else {
                    alert("Invalid connection!");
                } 
            }
        });
    }
});

// Event listener for mouse move on canvas
canvas.addEventListener('mousemove', drawLine);

// Function to check if the circles are connected
const isCirclesConnected = () => {
    const visited = new Array(circles.length).fill(false);
    const queue = [0]; // Start with the first circle
    while (queue.length > 0) {
        const currentCircleIndex = queue.shift();
        visited[currentCircleIndex] = true;
        lines.forEach(line => {
            if (line.startX === circles[currentCircleIndex].x && line.startY === circles[currentCircleIndex].y) {
                const nextCircleIndex = circles.findIndex(circle => circle.x === line.endX && circle.y === line.endY);
                if (nextCircleIndex !== -1 && !visited[nextCircleIndex]) {
                    queue.push(nextCircleIndex);
                }
            }
        });
    }
    return visited.every(val => val === true);
};

// Function to redraw canvas
const redrawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadAndDrawImages(); // Redraw all images and circles
};

// Function to draw all lines
const drawLines = () => {
    lines.forEach(line => {
        ctx.beginPath(); // Begin path once for all lines
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.lineWidth = line.width;
        ctx.stroke();
    });
};

// Function to draw a line
function drawLine(e) {
    if (isDrawingLine) {
        const mouseX = e.clientX - canvasOffsetX;
        const mouseY = e.clientY - canvasOffsetY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(mouseX, mouseY);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

// Initial draw
loadAndDrawImages();
