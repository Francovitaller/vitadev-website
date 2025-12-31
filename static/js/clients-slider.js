//clients slider animation

document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");
    const rejectBtn = document.getElementById("rejectCookies");

    if (!banner || !acceptBtn || !rejectBtn) return;

    if (localStorage.getItem("cookiesConsent")) {
        banner.classList.add("hidden");
        return;
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesConsent", "accepted");
        banner.classList.add("hidden");
    });

    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesConsent", "rejected");
        banner.classList.add("hidden");
    });
});
