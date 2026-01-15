window.addEventListener('scroll', function() {
    const header = document.querySelector('header.nav-glass');
    const whiteSection = document.querySelector('.process'); // Tu sección de fondo blanco

    if (!header || !whiteSection) return;

    // Obtenemos las coordenadas
    const headerRect = header.getBoundingClientRect();
    const sectionRect = whiteSection.getBoundingClientRect();
    
    // Punto de activación: Mitad del header
    const triggerPoint = headerRect.height / 2;

    // LÓGICA:
    // Si la parte superior de la sección blanca está por ARRIBA del punto medio del header...
    // Y la parte inferior de la sección blanca todavía está por DEBAJO...
    // Significa que estamos DENTRO de la sección blanca.
    if (sectionRect.top <= triggerPoint && sectionRect.bottom >= triggerPoint) {
        header.classList.add('invert-colors');
    } else {
        header.classList.remove('invert-colors');
    }
});