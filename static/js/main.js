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
        <a href="/#inicio" style="display:block;padding:12px;color:white;text-decoration:none;">Inicio</a>
        <a href="/#soluciones" style="display:block;padding:12px;color:white;text-decoration:none;">Nuestras soluciones</a>
        <a href="/#contacto" style="display:block;padding:12px;color:white;text-decoration:none;">Contacto</a>
        <a href="/portfolio" style="display:block;padding:12px;color:white;text-decoration:none;">Portfolio</a>
        <a href="/servicios" style="display:block;padding:12px;color:white;text-decoration:none;">Servicios</a>
        <a href="/aboutus" style="display:block;padding:12px;color:white;text-decoration:none;">Sobre Nosotros</a>
    `;
        document.body.appendChild(mobileNav);
        navToggle.textContent = "✕";
    } else {
        const mobileNav = document.getElementById("mobileNav");
        if (mobileNav) mobileNav.remove();
        navToggle.textContent = "☰";
    }
});

// Efecto de scroll en header navegación

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

// no tocar de aquí hacia abajo 

const container = document.getElementById('container');
const illuminatedItem = document.querySelector('.illuminated-item');
const flashlight = document.querySelector('.flashlight');
const blurFilter = document.querySelector('#blur-filter feGaussianBlur');

if (container && illuminatedItem && flashlight && blurFilter) {
    const filterIntensity = 100;
    const lightRadius = 500;
    const flashlightOffset = lightRadius / 2;

    blurFilter.setAttribute('stdDeviation', filterIntensity);
    flashlight.style.width = flashlight.style.height = `${lightRadius}px`;

    const followMouseFlashlight = ({ clientX, clientY }) => {
        const { left, top } = illuminatedItem.getBoundingClientRect();
        flashlight.style.left = `${clientX - left - flashlightOffset}px`;
        flashlight.style.top = `${clientY - top - flashlightOffset}px`;
    };

    container.addEventListener('mousemove', followMouseFlashlight);
}
// hasta aca

//whatsapp

const whatsapp = document.querySelector('.whatsapp-float');

let position = 0;
let direction = 1;
const speed = 0.7;
const limit = 10;

function floatAnimation() {
    position += speed * direction;

    if (position >= limit || position <= -limit) {
        direction *= -1;
    }

    whatsapp.style.transform = `translateY(${position}px)`;
    requestAnimationFrame(floatAnimation);
}

floatAnimation();
//fin whatsapp

