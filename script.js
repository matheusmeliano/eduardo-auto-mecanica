const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

toggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.navigation a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
