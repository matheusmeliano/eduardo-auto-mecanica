const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const closeMenuButton = document.querySelector('.menu-close');

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

closeMenuButton.addEventListener('click', closeMenu);

const navigationLinks = document.querySelectorAll('.navigation a:not(.service-button)');

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigationLinks.forEach((navigationLink) => navigationLink.classList.remove('active'));
    link.classList.add('active');
    closeMenu();
  });
});

document.querySelector('.service-button').addEventListener('click', closeMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu();
});

const partners = document.querySelector('.partners');

if (partners) {
  const track = partners.querySelector('.partners-track');
  const slides = Array.from(partners.querySelectorAll('.partner-slide'));
  const previous = partners.querySelector('.previous');
  const next = partners.querySelector('.next');
  let currentSlide = 0;
  let timer;

  const visibleSlides = () => window.innerWidth <= 420 ? 1 : window.innerWidth <= 720 ? 2 : window.innerWidth <= 900 ? 3 : 5;
  const render = () => {
    const visible = visibleSlides();
    const lastSlide = Math.max(0, slides.length - visible);
    currentSlide = Math.min(currentSlide, lastSlide);
    track.style.transform = `translateX(-${currentSlide * (100 / visible)}%)`;
  };
  const goTo = (direction) => {
    const lastSlide = Math.max(0, slides.length - visibleSlides());
    currentSlide = direction === 'next' ? (currentSlide >= lastSlide ? 0 : currentSlide + 1) : (currentSlide <= 0 ? lastSlide : currentSlide - 1);
    render();
  };
  const start = () => { timer = window.setInterval(() => goTo('next'), 4000); };
  const restart = () => { window.clearInterval(timer); start(); };

  previous.addEventListener('click', () => { goTo('previous'); restart(); });
  next.addEventListener('click', () => { goTo('next'); restart(); });
  partners.addEventListener('mouseenter', () => window.clearInterval(timer));
  partners.addEventListener('mouseleave', start);
  window.addEventListener('resize', render);
  render();
  start();
}

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
