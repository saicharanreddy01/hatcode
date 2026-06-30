// ─── HERO ANIMATIONS ─────────────────────────────────────
function animateCounter(el, target, duration) {
    const start = performance.now();
    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

window.addEventListener('load', () => {
    const bar  = document.getElementById('sbar');
    const pct  = document.getElementById('spct');
    const hc   = document.getElementById('hc');

    if (!bar || !pct || !hc) return;

    setTimeout(() => {
        bar.style.width = '76%';
        let p = 0;
        const iv = setInterval(() => {
            p = Math.min(p + 1.8, 76);
            pct.textContent = Math.round(p) + '%';
            if (p >= 76) clearInterval(iv);
        }, 40);
    }, 500);

    setTimeout(() => animateCounter(hc, 85, 1400), 700);
});

// ─── SCROLL FADE-INS ─────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.appear').forEach(el => observer.observe(el));