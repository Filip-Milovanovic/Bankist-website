'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navLinksContainer = document.querySelector('.nav__links');
const allNavLinks = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const tabContainer = document.querySelector('.operations__tab-container');
const allTabs = document.querySelectorAll('.operations__tab');
const allTabContents = document.querySelectorAll('.operations__content');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderRight = document.querySelector('.slider__btn--right');
const sliderLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scroll
btnScrollTo.addEventListener('click', function () {
  // const section1coords = section1.getBoundingClientRect();
  // const scrollY = window.scrollY;
  // console.log(section1coords.top);
  // console.log(scrollY);
  // window.scrollTo({
  //   top: section1coords.top + scrollY,
  //   left: 0,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Nav scroll
navLinksContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.getAttribute('href') === '#' ||
    !e.target.classList.contains('nav__link')
  )
    return;

  document
    .querySelector(`${e.target.getAttribute('href')}`)
    .scrollIntoView({ behavior: 'smooth' });
});

//Navigation effect
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    console.log(e.target);

    sibilings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation

const navHeight = nav.getBoundingClientRect().height;

const observerNav = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);
observerNav.observe(header);

//Operations - tabbed component

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked.classList.contains('operations__tab')) return;

  //Put up active one
  allTabs.forEach(function (tab, i) {
    tab.classList.remove('operations__tab--active');
    allTabContents[i].classList.remove('operations__content--active');
  });
  clicked.classList.add('operations__tab--active');
  //Display content of active
  const activeContentIndex = clicked.dataset.tab;
  allTabContents[activeContentIndex - 1].classList.add(
    'operations__content--active'
  );
});

//Slider

//FUNCTIONS
const getSlide = function (num) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${(i - num) * 100}%)`;
  });
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (num) {
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');

    document
      .querySelector(`.dots__dot[data-slide="${num}"]`)
      .classList.add('dots__dot--active');
  });
};

const getNextSlide = function () {
  if (currentSlide === 2) currentSlide = 0;
  else currentSlide++;

  getSlide(currentSlide);
};

const getPrevSlide = function () {
  if (currentSlide === 0) currentSlide = 2;
  else currentSlide--;

  getSlide(currentSlide);
};

createDots();
getSlide(0);
activateDot(0);
let currentSlide = 0;

//Event listeners

sliderRight.addEventListener('click', function (e) {
  getNextSlide();
  activateDot(currentSlide);
});

sliderLeft.addEventListener('click', function () {
  getPrevSlide();
  activateDot(currentSlide);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') getNextSlide();
  else if (e.key === 'ArrowLeft') getPrevSlide();
  activateDot(currentSlide);
});

//Revealing items on scroll

const revealItems = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealItems, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy image loading
const images = document.querySelectorAll('img[data-src]');

const lazyImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

images.forEach(img => imageObserver.observe(img));
