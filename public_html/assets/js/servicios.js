document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.nav-glass');
    const heroSection = document.querySelector('.services'); // Tu sección inicial

    if (header && heroSection) {
        const options = {
            rootMargin: "-80px 0px 0px 0px" // Se activa un poco antes de salir del todo
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si NO está intersectando (el usuario bajó y pasó el Hero)
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }, options);

        observer.observe(heroSection);
    }


    // --- 2. LÓGICA DE LA CALCULADORA DE PRECIOS ---
    const checkboxes = document.querySelectorAll('.service input');
    const totalPriceEl = document.getElementById('totalPrice');

    if (checkboxes.length > 0 && totalPriceEl) {

        function formatPrice(value) {
            return `$${value.toLocaleString('es-AR')}`;
        }

        function updateTotal() {
            let total = 0;
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    total += Number(cb.dataset.price);
                }
            });
            totalPriceEl.textContent = formatPrice(total);
        }

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateTotal);
        });

        // Calcular el total inicial al cargar la página
        updateTotal();
    }
}); // Cierre del DOMContentLoaded