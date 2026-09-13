const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const resultsCarousel = document.querySelector('.results-carousel');
if (resultsCarousel) {
  const slides = [...resultsCarousel.querySelectorAll('.result-slide')];
  const dots = [...resultsCarousel.querySelectorAll('.carousel-dot')];
  const previousButton = resultsCarousel.querySelector('.carousel-prev');
  const nextButton = resultsCarousel.querySelector('.carousel-next');
  const resultsViewport = resultsCarousel.querySelector('.results-viewport');
  const resultsTrack = resultsCarousel.querySelector('.results-track');
  let currentSlide = 0;
  let activeDot = 0;
  let touchStartX = 0;
  let autoplayTimer;

  const getVisibleSlides = () => 1;

  const showSlide = (slideIndex, dotIndex = null) => {
    const visibleSlides = getVisibleSlides();
    const lastSlide = Math.max(0, slides.length - visibleSlides);
    const requestedSlide = (slideIndex + slides.length) % slides.length;
    currentSlide = requestedSlide > lastSlide ? 0 : requestedSlide;
    activeDot = dotIndex === null
      ? currentSlide
      : Math.min(Math.max(dotIndex, 0), slides.length - 1);
    resultsTrack.style.transform = `translateX(-${currentSlide * (100 / visibleSlides)}%)`;
    slides.forEach((slide, index) => {
      slide.hidden = false;
      const isVisible = index >= currentSlide && index < currentSlide + visibleSlides;
      slide.setAttribute('aria-hidden', String(!isVisible));
    });
    dots.forEach((dot, index) => {
      const isActive = index === activeDot;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const stopAutoplay = () => clearInterval(autoplayTimer);
  const startAutoplay = () => {
    stopAutoplay();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplayTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
  };

  previousButton.addEventListener('click', () => {
    const lastSlide = Math.max(0, slides.length - getVisibleSlides());
    showSlide(currentSlide === 0 ? lastSlide : currentSlide - 1);
    startAutoplay();
  });
  nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoplay();
  });
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(Math.min(index, slides.length - getVisibleSlides()), index);
    startAutoplay();
  }));
  resultsCarousel.addEventListener('mouseenter', stopAutoplay);
  resultsCarousel.addEventListener('mouseleave', startAutoplay);
  resultsCarousel.addEventListener('focusin', stopAutoplay);
  resultsCarousel.addEventListener('focusout', (event) => {
    if (!resultsCarousel.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  resultsViewport.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });
  resultsViewport.addEventListener('touchend', (event) => {
    const touchDistance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(touchDistance) < 45) return;
    showSlide(currentSlide + (touchDistance < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });
  window.addEventListener('resize', () => showSlide(currentSlide));
  showSlide(currentSlide);
  startAutoplay();
}

