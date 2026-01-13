const FLUID_CONFIG = {
    color: '#2D6AFF',
    cursorSize: 20,
    fadeAlpha: 0.1,
    blur: 20,
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


// h1 movimiento

document.addEventListener('DOMContentLoaded', () => {
    const words = [
        'a medida',
        'profesional',
        'moderno',
        'escalable',
        'de alto impacto'
    ];

    const textEl = document.getElementById('rotating-text');
    if (!textEl) return; // Si no existe el elemento en esta sección, salir

    const changeDelay = 3200;      // tiempo total entre palabras
    const transitionTime = 650;    // debe coincidir con SCSS
    const letterDelay = 40;        // stagger entre letras (ms)

    let index = 0;
    let isAnimating = false;

    function createWord(word) {
        textEl.innerHTML = '';

        const fragment = document.createDocumentFragment();

        [...word].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * letterDelay}ms`;
            fragment.appendChild(span);
        });

        textEl.appendChild(fragment);
    }

    function showWord() {
        textEl.classList.remove('is-hidden');
        textEl.classList.add('is-visible');
    }

    function hideWord() {
        textEl.classList.remove('is-visible');
        textEl.classList.add('is-hidden');
    }

    function nextWord() {
        if (isAnimating) return;
        isAnimating = true;

        hideWord();

        setTimeout(() => {
            createWord(words[index]);
            index = (index + 1) % words.length;
            // Forzar reflow para reiniciar animación
            // eslint-disable-next-line no-unused-expressions
            void textEl.offsetWidth;

            showWord();
            isAnimating = false;
        }, transitionTime);
    }

    // INIT
    createWord(words[index]);
    showWord();
    index++;

    // LOOP CONTROLADO
    setInterval(nextWord, changeDelay);
});
