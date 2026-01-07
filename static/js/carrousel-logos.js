document.addEventListener('DOMContentLoaded', () => {
    console.log('clients slider loaded');

    const slider = document.querySelector('.clients-slider');
    const track = document.querySelector('.clients-track');

    if (!slider || !track) {
        console.warn('Slider elements not found');
        return;
    }

    const items = Array.from(track.children);
    if (items.length === 0) return;

    let position = 0;
    const speed = 0.5;

    // clonar una vez
    items.forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    function move() {
        position -= speed;

        const first = track.children[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const width = first.offsetWidth + gap;

        if (Math.abs(position) >= width) {
            position += width;
            track.appendChild(first);
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(move);
    }

    move();
});

