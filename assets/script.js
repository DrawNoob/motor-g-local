// Burger -----------------------------------------------------------------------------------------------------------------------
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeBtn = document.getElementById('closeBtn');

burgerBtn.addEventListener('click', () => {
  mobileMenu.style.right = '0';
  document.body.classList.add('overflow-hidden');
});

closeBtn.addEventListener('click', () => {
  mobileMenu.style.right = '-100%';
  document.body.classList.remove('overflow-hidden');
});
// ------------------------------------------------------------------------------------------------------------------------------

// Lang Popup -------------------------------------------------------------------------------------------------------------------
document.querySelectorAll('.language-selector').forEach((selector) => {
  const langBtn = selector.querySelector('.lang-btn');
  const langMenu = selector.querySelector('.lang-menu');

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // щоб не закривалось одразу
    langMenu.classList.toggle('hidden');
  });

  // Клік поза блоком — закриває меню
  document.addEventListener('click', function (e) {
    if (!selector.contains(e.target)) {
      langMenu.classList.add('hidden');
    }
  });
});

// Discount Popup -------------------------------------------------------------------------------------------------------------------
document.querySelectorAll('.discount-block').forEach((selector) => {
  const discountBtn = selector.querySelector('.discount-btn');
  const discountMenu = selector.querySelector('.discount-menu');
  let hideTimeout;

  const showMenu = () => {
    clearTimeout(hideTimeout);
    discountMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      discountMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      discountMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    });
  };

  const hideMenu = () => {
    discountMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    discountMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    hideTimeout = setTimeout(() => {
      discountMenu.classList.add('hidden');
    }, 400);
  };

  const isMobile = () => window.innerWidth < 768;

  if (isMobile()) {
    discountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (discountMenu.classList.contains('hidden')) {
        showMenu();
      } else {
        hideMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        hideMenu();
      }
    });
  } else {
    selector.addEventListener('mouseenter', showMenu);
    selector.addEventListener('mouseleave', hideMenu);
  }
});
