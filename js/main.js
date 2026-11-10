document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuButton = header.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');
  const desktop = window.matchMedia('(min-width: 992px)');

  const isMenuOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

  function setMenuOpen(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  menuButton.addEventListener('click', () => setMenuOpen(!isMenuOpen()));

  nav.addEventListener('click', (event) => {
    if (isMenuOpen() && event.target.closest('a')) setMenuOpen(false);
  });

  header.addEventListener('focusout', (event) => {
    if (isMenuOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (isMenuOpen() && !header.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  desktop.addEventListener('change', () => setMenuOpen(false));

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === '#' + entry.target.id);
      });
    }
  }, { rootMargin: '-72px 0px -45% 0px' });

  navLinks.forEach((link) => {
    sectionObserver.observe(document.getElementById(link.hash.slice(1)));
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      const wasOpen = item.classList.contains('active');

      faqItems.forEach((other) => {
        const open = other === item && !wasOpen;
        other.classList.toggle('active', open);
        other.querySelector('.faq-question').setAttribute('aria-expanded', String(open));
      });
    });
  });
});
