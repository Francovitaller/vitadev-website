document.addEventListener("DOMContentLoaded", () => {

    const banner = document.getElementById("cookieBanner");
    if (!banner) return;

    const acceptBtn = document.getElementById("acceptCookies");
    const rejectBtn = document.getElementById("rejectCookies");

    const consent = localStorage.getItem("cookie_consent");

    // Si no hay decisión previa → mostrar banner
    if (!consent) {
        banner.classList.remove("hidden");
    }

    // Si ya aceptó antes → cargar Analytics
    if (consent === "accepted") {
        loadAnalytics();
    }

    // Aceptar cookies
    acceptBtn?.addEventListener("click", () => {
        localStorage.setItem("cookie_consent", "accepted");
        banner.classList.add("hidden");
        loadAnalytics();
    });

    // Rechazar cookies
    rejectBtn?.addEventListener("click", () => {
        localStorage.setItem("cookie_consent", "rejected");
        banner.classList.add("hidden");
    });
});

// Carga diferida de Google Analytics
function loadAnalytics() {
    if (window.gaLoaded) return; // evita duplicados
    window.gaLoaded = true;

    // Script externo
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=G-W0NCQP2PJD";
    document.head.appendChild(s1);

    // Configuración
    const s2 = document.createElement("script");
    s2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W0NCQP2PJD', { anonymize_ip: true });
    `;
    document.head.appendChild(s2);
}
