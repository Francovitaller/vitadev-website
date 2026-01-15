const track = document.querySelector('.carousel__track');
const slides = Array.from(document.querySelectorAll('.carousel__slide'));
const prevBtn = document.querySelector('.carousel__control.prev');
const nextBtn = document.querySelector('.carousel__control.next');
const indicatorsContainer = document.querySelector('.carousel__indicators');

let currentIndex = 0;
let autoPlayInterval;

/* Crear indicadores */
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(dot);
});

const indicators = Array.from(indicatorsContainer.children);

function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
    resetAutoplay();
}

function nextSlide() {
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

function startAutoplay() {
    autoPlayInterval = setInterval(nextSlide, 6000);
}

function resetAutoplay() {
    clearInterval(autoPlayInterval);
    startAutoplay();
}

/* Eventos */
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

/* Init */
updateCarousel();
startAutoplay();
