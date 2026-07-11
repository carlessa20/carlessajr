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
// HOVER-TO-PLAY PROJECT VIDEOS (Vimeo Player SDK)
// Grouped: all iframes in a .ps-video-row/.ps-video-pair play together
// Individual: single .ps-video blocks play/pause on their own
// Always-on: .ph-bg, .wi-bg, .wc-bg autoplay via URL params (no JS needed)
// ================================

if (document.querySelector('.ps-video-row, .ps-video-pair, .ps-video-trio, .ps-video')) {
  // Native <video> hover-to-play — individual containers
  document.querySelectorAll('.ps-video').forEach(container => {
    // Skip if inside a grouped container — handled below
    if (container.closest('.ps-video-row, .ps-video-pair, .ps-video-trio')) return;
    const vid = container.querySelector('video');
    if (!vid) return;
    container.addEventListener('mouseenter', () => vid.play());
    container.addEventListener('mouseleave', () => vid.pause());
  });

  // Volume toggle buttons (native video)
  document.querySelectorAll('.vol-btn').forEach(btn => {
    const container = btn.closest('.ps-video');
    if (!container || container.querySelector('iframe')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = container.querySelector('video');
      if (!vid) return;
      vid.muted = !vid.muted;
      btn.classList.toggle('unmuted', !vid.muted);
    });
  });

  // Grouped rows — hover fires play on all videos in the group
  document.querySelectorAll('.ps-video-row, .ps-video-pair, .ps-video-trio').forEach(row => {
    const vids = Array.from(row.querySelectorAll('video'));
    if (vids.length) {
      row.addEventListener('mouseenter', () => vids.forEach(v => v.play()));
      row.addEventListener('mouseleave', () => vids.forEach(v => v.pause()));
    }
  });

  // Vimeo SDK for iframe-based players
  if (document.querySelector('.ps-video iframe, .ps-video-row iframe, .ps-video-pair iframe')) {
    const vimeoScript = document.createElement('script');
    vimeoScript.src = 'https://player.vimeo.com/api/player.js';
    vimeoScript.onload = function() {
      const playerMap = new Map(); // iframe → Vimeo.Player

      function getPlayer(iframe) {
        if (!playerMap.has(iframe)) playerMap.set(iframe, new Vimeo.Player(iframe));
        return playerMap.get(iframe);
      }

      // Pause all sub-section iframes on load (background=1 autoplays them)
      document.querySelectorAll('.ps-video iframe, .ps-video-left iframe, .ps-video-sq iframe').forEach(iframe => {
        const player = getPlayer(iframe);
        player.ready().then(() => player.pause());
      });

      // Grouped rows — hover row, all videos play together
      document.querySelectorAll('.ps-video-row, .ps-video-pair').forEach(row => {
        const iframes = Array.from(row.querySelectorAll('iframe'));
        if (!iframes.length) return;
        const players = iframes.map(getPlayer);
        row.addEventListener('mouseenter', () => players.forEach(p => p.play()));
        row.addEventListener('mouseleave', () => players.forEach(p => p.pause()));
      });

      // Single .ps-video containers
      document.querySelectorAll('.ps-video').forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const player = getPlayer(iframe);
        container.addEventListener('mouseenter', () => player.play());
        container.addEventListener('mouseleave', () => player.pause());
      });

      // Volume buttons — works for .ps-video, .ps-video-left, .ps-video-sq
      document.querySelectorAll('.vol-btn').forEach(btn => {
        const container = btn.closest('.ps-video, .ps-video-left, .ps-video-sq');
        if (!container) return;
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const player = getPlayer(iframe);
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          player.getMuted().then(muted => {
            player.setMuted(!muted).then(() => btn.classList.toggle('unmuted', muted));
          });
        });
      });
    };
    document.head.appendChild(vimeoScript);
  }
}

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
