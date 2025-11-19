// Navegación móvil
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mainNav.classList.remove('open');
    }));
  }

  // Aparición de tarjetas
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
