document.addEventListener('DOMContentLoaded', () => {

    /* ====================== SUA VITRINE (landing) ====================== */
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }
        if (currentScrollY > 50) header.classList.add('scrolled-bg');
        else header.classList.remove('scrolled-bg');
        lastScrollY = currentScrollY;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

});
