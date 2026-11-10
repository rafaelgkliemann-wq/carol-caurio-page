document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuButton = header.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');
  const desktop = window.matchMedia('(min-width: 992px)');

  // --- 1. Header transparente no topo e faixa visível ao rolar ---
  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

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

  // --- 2. Destaque do link ativo no menu ---
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === '#' + entry.target.id);
      });
    }
  }, { rootMargin: '-76px 0px -45% 0px' });

  navLinks.forEach((link) => {
    const targetSection = document.getElementById(link.hash.slice(1));
    if (targetSection) sectionObserver.observe(targetSection);
  });

  // --- 3. Movimento Fade-in (Reveal) ao rolar a página ---
  const revealGroups = [
    '.hero-content > *',
    '.sintomas-box',
    '.sobre-image',
    '.sobre-content > *',
    '.section-header-center > *',
    '.proc-featured-card',
    '.proc-card',
    '.areas-header > *',
    '.areas-list li',
    '.atuacao-content > *',
    '.atuacao-slideshow',
    '.como-funciona-intro > *',
    '.gmb-header-card',
    '.gmb-review-card',
    '.faq-header > *',
    '.faq-item',
    '.contato-content > *',
    '.contato-visual-col > *'
  ];

  const revealElements = document.querySelectorAll(revealGroups.join(', '));
  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    const delayMod = index % 3;
    if (delayMod === 1) el.classList.add('reveal-delay-1');
    if (delayMod === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- 4. Alternância suave de fotos da Dra. Carol (Slideshow) ---
  const slideshow = document.getElementById('atuacaoSlideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('img');
    if (slides.length > 1) {
      let currentSlide = 0;
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 3800);
    }
  }

  // --- 5. Destaque progressivo dos passos da consulta ---
  const passoItems = document.querySelectorAll('.passo-item');
  if (passoItems.length > 0) {
    const passoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '0px 0px -10% 0px'
    });

    passoItems.forEach((item) => passoObserver.observe(item));
  }

  // --- 6. Accordion de Dúvidas Frequentes (FAQ) ---
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
