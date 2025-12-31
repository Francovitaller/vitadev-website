// Selección del formulario y elementos del botón
const form = document.querySelector(".contact-form");
const submitBtn = form.querySelector(".submit-button");
const spinner = submitBtn.querySelector(".spinner");
const arrow = submitBtn.querySelector(".arrow-icon");
const recaptchaError = document.getElementById("recaptcha-error");

// Escuchar el submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Limpiamos error previo del reCAPTCHA
    if (recaptchaError) recaptchaError.textContent = "";

    // Obtener token del reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();

    // No bloqueamos con alert, el backend validará también
    // pero podemos mostrar el mensaje inmediatamente si no se completó
    if (!recaptchaResponse && recaptchaError) {
        recaptchaError.textContent = "Por favor, completa el reCAPTCHA";
    }

    // Mostrar spinner y ocultar flecha
    spinner.classList.remove("hidden");
    arrow.style.display = "none";
    submitBtn.disabled = true;

    // Crear objeto de datos
    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        number: document.getElementById("number").value.trim(),
        servicio: document.getElementById("servicio").value,
        message: document.getElementById("message").value.trim(),
        recaptcha: recaptchaResponse // enviamos el token al backend
    };

    enviarFormulario(data);
});

// Función para enviar datos al servidor
async function enviarFormulario(data) {
    try {
        const response = await fetch("/contacto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        let res = {};
        try {
            res = await response.json();
            console.log("Respuesta del servidor:", res);
        } catch (err) {
            console.error("Error parseando JSON:", err);
        }

        // Ocultar spinner y mostrar flecha siempre que termine
        spinner.classList.add("hidden");
        arrow.style.display = "inline";
        submitBtn.disabled = false;

        // ------------------------------
        // Verificar éxito según Flask
        if (response.ok && res.success) {
            mostrarExito();   // Mostrar modal de éxito
            form.reset();     // Limpiar campos
            grecaptcha.reset(); // Resetear reCAPTCHA
            if (recaptchaError) recaptchaError.textContent = "";
        } else if (res.field) {
            // Mostrar burbuja de error para el campo correspondiente
            const inputConError = document.getElementById(res.field);
            if (inputConError) {
                inputConError.setCustomValidity(res.error);
                inputConError.reportValidity();
                inputConError.addEventListener("input", () => inputConError.setCustomValidity(""));
            }

            // Mostrar error del reCAPTCHA si corresponde
            if (res.field === "recaptcha" && recaptchaError) {
                recaptchaError.textContent = res.error;
            }
        } else {
            // Error genérico
            if (recaptchaError && res.error.includes("reCAPTCHA")) {
                recaptchaError.textContent = res.error;
            } else {
                alert(res.error || "Error al enviar el formulario");
            }
        }

    } catch (error) {
        // Error de conexión u otros
        spinner.classList.add("hidden");
        arrow.style.display = "inline";
        submitBtn.disabled = false;
        console.error("Fetch error:", error);
        alert("Error de conexión con el servidor");
    }
}

// Función para mostrar modal de éxito
function mostrarExito() {
    const modal = document.getElementById("modal-exito");
    if (!modal) return;

    modal.classList.remove("hidden");

    // Se cierra solo a los 3 segundos
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 3000);
}
