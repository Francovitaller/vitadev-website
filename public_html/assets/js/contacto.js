// Inicializar comportamiento cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-form');
    if (!form) return; // Si la página no tiene el formulario, no hacer nada

    const submitBtn = form.querySelector('.submit-button');
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;
    const arrow = submitBtn ? submitBtn.querySelector('.arrow-icon') : null;
    const recaptchaError = document.getElementById('recaptcha-error');

    // Escuchar el submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (recaptchaError) recaptchaError.textContent = '';

        const recaptchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : 'test'; // fallback para pruebas
        if (!recaptchaResponse && recaptchaError) {
            recaptchaError.textContent = 'Por favor, completa el reCAPTCHA';
        }

        if (spinner) spinner.classList.remove('hidden');
        if (arrow) arrow.style.display = 'none';
        if (submitBtn) submitBtn.disabled = true;

        const data = {
            name: document.getElementById('name')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            number: document.getElementById('number')?.value.trim() || '',
            servicio: document.getElementById('servicio')?.value || '',
            message: document.getElementById('message')?.value.trim() || '',
            recaptcha: recaptchaResponse
        };

        // Depuración: mostrar los datos que se van a enviar
        console.log("Datos enviados al servidor:", data);

        enviarFormulario(data);
    });

    // Enviar datos al servidor
    async function enviarFormulario(data) {
        try {
            const response = await fetch('/contacto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Depuración: mostrar lo que responde el servidor
            const text = await response.text();
            console.log("Respuesta cruda del servidor:", text);

            let res = {};
            try {
                res = JSON.parse(text);
            } catch (err) {
                console.error('Error parseando JSON:', err);
                alert('Error en la respuesta del servidor. Revisa la consola.');
            }

            if (spinner) spinner.classList.add('hidden');
            if (arrow) arrow.style.display = 'inline';
            if (submitBtn) submitBtn.disabled = false;

            if (response.ok && res.success) {
                mostrarExito();
                form.reset();
                if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                if (recaptchaError) recaptchaError.textContent = '';
            } else if (res.field) {
                const inputConError = document.getElementById(res.field);
                if (inputConError) {
                    inputConError.setCustomValidity(res.error);
                    inputConError.reportValidity();
                    inputConError.addEventListener('input', () => inputConError.setCustomValidity(''));
                }
                if (res.field === 'recaptcha' && recaptchaError) recaptchaError.textContent = res.error;
            } else {
                if (recaptchaError && res.error && res.error.includes && res.error.includes('reCAPTCHA')) {
                    recaptchaError.textContent = res.error;
                } else {
                    alert(res.error || 'Error al enviar el formulario');
                }
            }

        } catch (error) {
            if (spinner) spinner.classList.add('hidden');
            if (arrow) arrow.style.display = 'inline';
            if (submitBtn) submitBtn.disabled = false;
            console.error('Fetch error:', error);
            alert('Error de conexión con el servidor');
        }
    }

    function mostrarExito() {
        const modal = document.getElementById('modal-exito');
        if (!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('hidden'), 3000);
    }
});
