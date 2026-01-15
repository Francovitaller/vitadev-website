

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".faq-item");

    if (!items.length) return;

    // abrir el primer ítem por defecto
    openItem(items[0]);

    items.forEach(item => {
        const btn = item.querySelector(".faq-question");

        btn.addEventListener("click", () => {
            if (item.classList.contains("active")) return;

            items.forEach(closeItem);
            openItem(item);
        });
    });
    
    // funciones para abrir/cerrar ítems
    
    function openItem(item) {
        const answer = item.querySelector(".faq-answer");
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
    }

    function closeItem(item) {
        const answer = item.querySelector(".faq-answer");
        item.classList.remove("active");
        answer.style.maxHeight = null;
    }
});

