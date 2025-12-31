const FLUID_CONFIG = {
    color: '#2D6AFF',
    cursorSize: 80,
    fadeAlpha: 0.1,
    blur: 50,
    mouseForce: 1,
    resolution: window.devicePixelRatio || 1
};

const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let prevX = null;
let prevY = null;

const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0
};

function resize() {
    width = canvas.width = window.innerWidth * FLUID_CONFIG.resolution;
    height = canvas.height = window.innerHeight * FLUID_CONFIG.resolution;
    ctx.scale(FLUID_CONFIG.resolution, FLUID_CONFIG.resolution);
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', e => {
    pointer.vx = e.clientX - pointer.x;
    pointer.vy = e.clientY - pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

function draw() {
    // fade negro (rastros)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(0,0,0,${FLUID_CONFIG.fadeAlpha})`;
    ctx.fillRect(0, 0, width, height);

    if (prevX !== null) {
        ctx.save();
        ctx.filter = `blur(${FLUID_CONFIG.blur}px)`;
        ctx.globalCompositeOperation = 'lighter';

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.lineWidth = FLUID_CONFIG.cursorSize;
        ctx.strokeStyle = FLUID_CONFIG.color;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.restore();
    }

    prevX = pointer.x;
    prevY = pointer.y;

    requestAnimationFrame(draw);
}

draw();
