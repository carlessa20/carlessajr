// ================================
// LOADER
// ================================
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => loader.classList.add('loaded'), 500);
  }
});

// ================================
// SCROLL REVEAL
// ================================
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05 });

reveals.forEach(el => revealObserver.observe(el));

// Also immediately reveal anything already in the viewport on load
document.addEventListener('DOMContentLoaded', () => {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});

// ================================
// CUSTOM CURSOR
// ================================
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

if (cursor && cursorDot) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth cursor follow
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, .work-item, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
}

// ================================
// HERO NAME ↔ 603 LOGO SWAP
// Only triggers when hovering the actual text spans
// ================================
const heroName = document.querySelector('.hero-name');
if (heroName) {
  const lines = heroName.querySelectorAll('.hero-name-line');
  lines.forEach(line => {
    line.addEventListener('mouseenter', () => heroName.classList.add('name-hovered'));
    line.addEventListener('mouseleave', (e) => {
      // Only remove if the cursor isn't moving to another line
      if (!e.relatedTarget || !e.relatedTarget.classList.contains('hero-name-line')) {
        heroName.classList.remove('name-hovered');
      }
    });
  });
}

// ================================
// HOVER-TO-PLAY PROJECT VIDEOS
// Grouped: all videos in a .ps-video-row play/pause together
// Individual: single .ps-video blocks play/pause on their own
// Always-on: .ph-bg, .wi-bg, .wc-bg all autoplay continuously
// ================================

// Pause everything except hero, homepage featured, and work card backgrounds
document.querySelectorAll('video').forEach(video => {
  if (video.closest('.ph-bg')) return;
  if (video.closest('.wi-bg')) return;
  if (video.closest('.wc-bg')) return;
  video.removeAttribute('autoplay');
  video.pause();
});

// Grouped rows — hover the whole row, all videos play together
document.querySelectorAll('.ps-video-row, .ps-video-pair').forEach(row => {
  const videos = row.querySelectorAll('video');
  row.addEventListener('mouseenter', () => videos.forEach(v => v.play()));
  row.addEventListener('mouseleave', () => videos.forEach(v => v.pause()));
});

// Single video containers (stacked .ps-video blocks only)
document.querySelectorAll('.ps-video').forEach(container => {
  const video = container.querySelector('video');
  if (!video) return;
  container.addEventListener('mouseenter', () => video.play());
  container.addEventListener('mouseleave', () => video.pause());
});

// ================================
// NAV — scroll state + overlay toggle
// ================================
const navToggle = document.querySelector('.nav-toggle');
const hasHero = document.querySelector('.hero');

// Threshold: hero pages wait until 80% through hero, other pages use 120px
const getThreshold = () => hasHero ? window.innerHeight * 0.8 : 120;

window.addEventListener('scroll', () => {
  // Close menu on any scroll
  document.body.classList.remove('nav-open');

  if (window.scrollY > getThreshold()) {
    document.body.classList.add('nav-scrolled');
  } else {
    document.body.classList.remove('nav-scrolled');
  }
});

// Menu button toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  document.querySelectorAll('.overlay-link').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
    });
  });
}
