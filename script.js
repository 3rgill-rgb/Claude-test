/* ============================================
   NAV — scroll behaviour & mobile menu
   ============================================ */
const nav      = document.getElementById('nav');
const menuBtn  = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Sticky nav tint on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu toggle
menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});

// Close menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================
   SCROLL-REVEAL via IntersectionObserver
   ============================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ============================================
   ACTIVE NAV LINK highlight on scroll
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--neutral-900)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================
   PROJECT CARDS — subtle parallax on hover
   ============================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-6px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.08s linear, box-shadow 0.32s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ============================================
   SKILL PILLS — add reveal-stagger class
   ============================================ */
const skillsContainer = document.querySelector('.about__skills');
if (skillsContainer) {
  skillsContainer.classList.add('reveal-stagger');
  observer.observe(skillsContainer);
}

/* ============================================
   STATS — count-up animation
   ============================================ */
function animateCount(el, target, suffix, duration = 1200) {
  const start = performance.now();
  const isInfinity = target === '∞';

  if (isInfinity) { el.textContent = '∞'; return; }

  const numTarget = parseInt(target, 10);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * numTarget) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat__number').forEach(numEl => {
      const raw = numEl.textContent.trim();
      const suffix = raw.replace(/[0-9∞]/g, '');
      animateCount(numEl, raw.replace(/\D/g, '') || '∞', suffix);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ============================================
   SMOOTH anchor scrolling with nav offset
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================
   Add reveal classes to sections on load
   ============================================ */
document.querySelectorAll('.section-header, .about__text, .about__image-wrap, .contact__inner').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

document.querySelectorAll('.project-card').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
