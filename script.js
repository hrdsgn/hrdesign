document.getElementById('year').textContent = new Date().getFullYear();

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [
          { opacity: 0, transform: 'translateY(30px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 700,
          easing: 'cubic-bezier(.2,.7,.2,1)',
          fill: 'both'
        }
      );
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate], .service-list>div, .steps>div').forEach(el => io.observe(el));

const carousel = document.querySelector('.carousel');
const slides = Array.from(document.querySelectorAll('.project-slide'));
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let active = 2;
let autoplay;
let startX = 0;
let endX = 0;

function wrapIndex(index) {
  const total = slides.length;
  return (index + total) % total;
}

function paintCarousel() {
  slides.forEach((slide, index) => {
    const raw = index - active;
    const distance = Math.abs(raw);
    let offset = raw;

    if (raw > slides.length / 2) offset = raw - slides.length;
    if (raw < -slides.length / 2) offset = raw + slides.length;

    const abs = Math.abs(offset);
    const translateX = offset * 190;
    const rotateY = offset * -28;
    const scale = abs === 0 ? 1 : abs === 1 ? 0.86 : abs === 2 ? 0.72 : 0.58;
    const opacity = abs > 3 ? 0 : abs === 3 ? 0.18 : abs === 2 ? 0.42 : abs === 1 ? 0.82 : 1;
    const zIndex = 20 - abs;
    const blur = abs === 0 ? 0 : abs === 1 ? 0.8 : abs === 2 ? 1.8 : 3;

    slide.style.transform = `translate3d(calc(-50% + ${translateX}px), -50%, ${-abs * 110}px) rotateY(${rotateY}deg) scale(${scale})`;
    slide.style.opacity = opacity;
    slide.style.zIndex = zIndex;
    slide.style.filter = `blur(${blur}px)`;
    slide.classList.toggle('is-active', abs === 0);
  });
}

function goTo(index) {
  active = wrapIndex(index);
  paintCarousel();
}

function next() { goTo(active + 1); }
function prev() { goTo(active - 1); }

nextBtn?.addEventListener('click', next);
prevBtn?.addEventListener('click', prev);

slides.forEach((slide, index) => {
  slide.addEventListener('click', () => {
    if (index === active) {
      window.open('https://behance.net/portfoliohrdsgn', '_blank', 'noopener');
    } else {
      goTo(index);
    }
  });
});

function startAutoplay() {
  stopAutoplay();
  autoplay = setInterval(next, 4500);
}

function stopAutoplay() {
  if (autoplay) clearInterval(autoplay);
}

carousel?.addEventListener('mouseenter', stopAutoplay);
carousel?.addEventListener('mouseleave', startAutoplay);
carousel?.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].clientX;
  stopAutoplay();
}, { passive: true });
carousel?.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  const delta = endX - startX;
  if (Math.abs(delta) > 40) {
    if (delta < 0) next();
    else prev();
  }
  startAutoplay();
}, { passive: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

window.addEventListener('resize', paintCarousel);

paintCarousel();
startAutoplay();
