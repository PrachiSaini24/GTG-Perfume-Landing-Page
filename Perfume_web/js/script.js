// Hamburger toggle for tablet & mobile
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".gtg-nav");
  const burger = document.querySelector(".gtg-burger");

  if (!nav || !burger) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Optional: close menu when clicking a nav item
  const menuItems = document.querySelectorAll(".gtg-menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
});




// ====== GALLERY LOGIC ======
const mainImg = document.getElementById('gtg-main-img');
const prevBtn = document.querySelector('.gtg-arrow-left');
const nextBtn = document.querySelector('.gtg-arrow-right');
const dots = document.querySelectorAll('.gtg-dot');
const thumbs = document.querySelectorAll('.gtg-thumbs img');

// update with your real image paths (same order as thumbs)
const galleryImages = [
  'assets/images/original.jpg',
  'assets/images/main img2.jpg',
  'assets/images/main img3.jpg',
  'assets/images/main img4.jpg',
  'assets/images/perfume4.jpg',
  'assets/images/main img2.jpg',
  'assets/images/main img3.jpg',
  'assets/images/main img4.jpg',
  
];

let currentIndex = 0;

function updateGallery(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  mainImg.src = galleryImages[currentIndex];

  dots.forEach((dot, i) =>
    dot.classList.toggle('active', i === currentIndex % dots.length)
  );
  thumbs.forEach((thumb, i) =>
    thumb.classList.toggle('active', i === currentIndex)
  );
}

if (prevBtn && nextBtn && mainImg) {
  prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const idx = Number(dot.dataset.index);
    updateGallery(idx);
  });
});

thumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const idx = Number(thumb.dataset.index);
    updateGallery(idx);
  });
});



// ====== RADIO + ADD TO CART LOGIC ======
const addToCartLink = document.getElementById('gtg-add-to-cart');
const fragranceRadios = document.querySelectorAll('input[name="fragrance"]');
const purchaseRadios = document.querySelectorAll('input[name="purchase"]');

function getSelectedValue(nodeList) {
  const checked = Array.from(nodeList).find((r) => r.checked);
  return checked ? checked.value : null;
}

// 9 combinations -> 9 dummy links
function buildCartUrl(fragrance, purchase) {
  // example: /cart?frag=rose&plan=double-subscription
  return `https://example.com/cart?frag=${fragrance}&plan=${purchase}`;
}

function updateAddToCart() {
  const frag = getSelectedValue(fragranceRadios);
  const plan = getSelectedValue(purchaseRadios);

  if (!frag || !plan) return;

  const url = buildCartUrl(frag, plan);
  addToCartLink.href = url;
}

fragranceRadios.forEach((radio) =>
  radio.addEventListener('change', updateAddToCart)
);
purchaseRadios.forEach((radio) =>
  radio.addEventListener('change', () => {
    handleExpandables();
    updateAddToCart();
  })
);

// ====== EXPANDABLE SINGLE / DOUBLE ======
const expandSingle = document.querySelector('.gtg-expand-single');
const expandDouble = document.querySelector('.gtg-expand-double');
const doubleBar = document.querySelector('.gtg-double-bar');

function handleExpandables() {
  const plan = getSelectedValue(purchaseRadios);
  if (!plan) return;

  if (plan === 'single-subscription') {
    expandSingle.classList.add('active');
    expandDouble.classList.remove('active');
  } else if (plan === 'double-subscription') {
    expandSingle.classList.remove('active');
    expandDouble.classList.add('active');
  } else {
    // single one-time purchase etc. if you add it later
    expandSingle.classList.remove('active');
    expandDouble.classList.remove('active');
  }
}

// clicking the double subscription bar also selects that radio
if (doubleBar) {
  doubleBar.addEventListener('click', () => {
    const doubleRadio = document.getElementById('purchase-double');
    if (doubleRadio) {
      doubleRadio.checked = true;
      handleExpandables();
      updateAddToCart();
    }
  });
}

// initial state
updateGallery(0);
handleExpandables();
updateAddToCart();



// ====== OUR COLLECTION ACCORDION ======
const accButtons = document.querySelectorAll('.gtg-acc-item');

accButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    const iconSpan = btn.querySelector('.gtg-acc-icon');
    const panel = btn.nextElementSibling;

    // close all
    accButtons.forEach((b) => {
      b.classList.remove('active');
      const p = b.nextElementSibling;
      const i = b.querySelector('.gtg-acc-icon');
      if (p && p.classList.contains('gtg-acc-panel')) {
        p.classList.remove('open');
      }
      if (i) i.textContent = '+';
    });

    // open clicked (if it was closed)
    if (!isActive && panel && panel.classList.contains('gtg-acc-panel')) {
      btn.classList.add('active');
      panel.classList.add('open');
      if (iconSpan) iconSpan.textContent = '−';
    }
  });
});


// ===== COUNT UP ON SCROLL =====

const statNumbers = document.querySelectorAll('.gtg-stat-number');

function animateCount(el) {
  const target = +el.dataset.target;
  let current = 0;
  const speed = 25; // smaller = faster

  const counter = setInterval(() => {
    current++;
    el.textContent = `${current}%`;

    if (current >= target) {
      el.textContent = `${target}%`;
      clearInterval(counter);
    }
  }, speed);
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNumbers.forEach((num) => animateCount(num));
        obs.disconnect(); // run once only
      }
    });
  },
  {
    threshold: 0.4,
  }
);

observer.observe(document.querySelector('.gtg-stats'));

