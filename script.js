const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

const closeMenu = () => {
  navigation.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
};

toggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', isOpen);
});

const navigationLinks = document.querySelectorAll('.navigation a:not(.service-button)');

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigationLinks.forEach((navigationLink) => navigationLink.classList.remove('active'));
    link.classList.add('active');
    closeMenu();
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu();
});

const contactModal = document.querySelector('.contact-modal');
const contactClose = document.querySelector('.contact-close');
const serviceButtons = document.querySelectorAll('.service-button');

const closeContactModal = () => {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('contact-open');
};

serviceButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    closeMenu();
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('contact-open');
    contactClose.focus();
  });
});

contactClose.addEventListener('click', closeContactModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal.classList.contains('open')) closeContactModal();
});

const partners = document.querySelector('.partners');

if (partners) {
  const track = partners.querySelector('.partners-track');
  const slides = Array.from(partners.querySelectorAll('.partner-slide'));
  const previous = partners.querySelector('.previous');
  const next = partners.querySelector('.next');
  const cloneCount = Math.min(5, slides.length);
  const copySlide = (slide) => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelector('img').alt = '';
    return copy;
  };
  const leadingCopies = slides.slice(-cloneCount).map(copySlide);
  const trailingCopies = slides.slice(0, cloneCount).map(copySlide);
  track.prepend(...leadingCopies);
  track.append(...trailingCopies);

  let currentSlide = cloneCount;
  let timer;

  const visibleSlides = () => window.innerWidth <= 720 ? 2 : window.innerWidth <= 900 ? 3 : 5;
  const render = () => {
    const visible = visibleSlides();
    track.style.transform = `translateX(-${currentSlide * (100 / visible)}%)`;
  };
  const goTo = (direction) => {
    currentSlide += direction === 'next' ? 1 : -1;
    render();
  };
  const resetLoop = () => {
    if (currentSlide >= slides.length + cloneCount) currentSlide -= slides.length;
    if (currentSlide < cloneCount) currentSlide += slides.length;
    track.style.transition = 'none';
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ''; }));
  };
  const start = () => { timer = window.setInterval(() => goTo('next'), 4000); };
  const restart = () => { window.clearInterval(timer); start(); };

  previous.addEventListener('click', () => { goTo('previous'); restart(); });
  next.addEventListener('click', () => { goTo('next'); restart(); });
  partners.addEventListener('mouseenter', () => window.clearInterval(timer));
  partners.addEventListener('mouseleave', start);
  window.addEventListener('resize', render);
  track.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'transform') resetLoop();
  });
  render();
  start();
}

document.querySelectorAll('.service-group .service-grid').forEach((grid, groupIndex) => {
  const group = grid.closest('.service-group');
  const title = group.querySelector('h3').textContent;
  const cards = Array.from(grid.children);
  const cloneCount = Math.min(3, cards.length);
  const autoDirection = groupIndex === 0 ? 'previous' : 'next';
  const autoDelay = groupIndex === 0 ? 4000 : 6000;
  const carousel = document.createElement('div');
  const viewport = document.createElement('div');
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');
  let currentSlide = cloneCount;
  let timer;
  let initialTimer;
  let resizeFrame;

  carousel.className = 'service-carousel';
  viewport.className = 'service-carousel-viewport';
  previousButton.className = 'partner-control previous';
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', `Serviço anterior em ${title}`);
  previousButton.textContent = '←';
  nextButton.className = 'partner-control next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', `Próximo serviço em ${title}`);
  nextButton.textContent = '→';

  const duplicateCard = (card) => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    return copy;
  };

  grid.prepend(...cards.slice(-cloneCount).map(duplicateCard));
  grid.append(...cards.slice(0, cloneCount).map(duplicateCard));
  grid.replaceWith(carousel);
  viewport.append(grid);
  carousel.append(previousButton, viewport, nextButton);

  const render = () => {
    grid.style.transform = `translateX(-${grid.children[currentSlide].offsetLeft}px)`;
  };
  const scheduleRender = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(render);
  };
  const move = (direction) => {
    currentSlide += direction === 'next' ? 1 : -1;
    render();
  };
  const resetLoop = () => {
    if (currentSlide >= cards.length + cloneCount) currentSlide -= cards.length;
    if (currentSlide < cloneCount) currentSlide += cards.length;
    grid.style.transition = 'none';
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => { grid.style.transition = ''; }));
  };
  const stop = () => {
    window.clearTimeout(initialTimer);
    window.clearInterval(timer);
  };
  const start = () => {
    stop();
    initialTimer = window.setTimeout(() => {
      move(autoDirection);
      timer = window.setInterval(() => move(autoDirection), 4000);
    }, autoDelay);
  };

  previousButton.addEventListener('click', () => { move('previous'); start(); });
  nextButton.addEventListener('click', () => { move('next'); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  grid.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'transform') resetLoop();
  });
  window.addEventListener('resize', scheduleRender);
  new ResizeObserver(scheduleRender).observe(viewport);
  render();
  scheduleRender();
  start();
});

const historyDialog = document.querySelector('.history-dialog');
const historyOpen = document.querySelector('[data-history-open]');
const historyClose = document.querySelector('[data-history-close]');

if (historyDialog && historyOpen && historyClose) {
  historyOpen.addEventListener('click', () => historyDialog.showModal());
  historyClose.addEventListener('click', () => historyDialog.close());
  historyDialog.addEventListener('click', (event) => {
    if (event.target === historyDialog) historyDialog.close();
  });
}
