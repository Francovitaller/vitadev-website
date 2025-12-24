// Toggle menú móvil
const navToggle = document.getElementById("navToggle");
let menuAbierto = false;

navToggle.addEventListener("click", () => {
    menuAbierto = !menuAbierto;

    if (menuAbierto) {
        const mobileNav = document.createElement("div");
        mobileNav.id = "mobileNav";
        mobileNav.style.cssText = `
        position:fixed;
        left:50%;
        transform:translateX(-50%);
        top:86px;
        width:calc(100% - 40px);
        max-width:720px;
        background:rgba(6,6,6,0.65);
        backdrop-filter: blur(8px);
        border-radius:12px;
        padding:12px;
        z-index:39;
        border:1px solid rgba(255,255,255,0.04)
    `;
        mobileNav.innerHTML = `
        <a href="#" style="display:block;padding:12px;color:white;text-decoration:none;">Home</a>
        <a href="#" style="display:block;padding:12px;color:white;text-decoration:none;">Nuestras soluciones</a>
        <a href="#" style="display:block;padding:12px;color:white;text-decoration:none;">Como funciona</a>
        <a href="#" style="display:block;padding:12px;color:white;text-decoration:none;">Blog</a>
    `;
        document.body.appendChild(mobileNav);
        navToggle.textContent = "✕";
    } else {
        const mobileNav = document.getElementById("mobileNav");
        if (mobileNav) mobileNav.remove();
        navToggle.textContent = "☰";
    }
});

// Efecto de scroll en header
const header = document.querySelector("header.nav-glass");

window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
        header.style.transform = "translateX(-50%) scale(0.98)";
        header.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";
    } else {
        header.style.transform = "translateX(-50%) scale(1)";
        header.style.boxShadow = "none";
    }
})