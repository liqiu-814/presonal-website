/* ===== 个人网站动态主页 ===== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasGsap = () => typeof window.gsap !== 'undefined';
document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion.matches);

// ===== 加载与入场 =====
let entranceStarted = false;

function revealWithoutGsap() {
  document.querySelectorAll('.hero-kicker, .hero-name, .hero-sub, .doodle, .scroll-hint')
    .forEach(element => {
      element.style.opacity = '1';
      element.style.transform = '';
    });
}

function startEntrance() {
  if (entranceStarted) return;
  entranceStarted = true;
  if (!hasGsap() || prefersReducedMotion.matches) {
    revealWithoutGsap();
    return;
  }
  window.gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-kicker', { opacity: 1, duration: .5, y: 0 })
    .to('.hero-name', { opacity: 1, duration: .6 }, '-=0.2')
    .to('.hero-sub', { opacity: 1, duration: .5 }, '-=0.3')
    .to('.doodle', { opacity: 1, duration: .8, stagger: .12 }, '-=0.5')
    .to('.scroll-hint', { opacity: 1, duration: .4 }, '-=0.3');
}

function dismissPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader || preloader.classList.contains('hide')) return;
  preloader.classList.add('hide');
  preloader.setAttribute('aria-hidden', 'true');
  startEntrance();
}

const preloaderFallback = window.setTimeout(dismissPreloader, 2500);
window.addEventListener('load', () => {
  window.clearTimeout(preloaderFallback);
  window.setTimeout(dismissPreloader, prefersReducedMotion.matches ? 0 : 650);
}, { once: true });

if (document.readyState === 'complete') {
  window.clearTimeout(preloaderFallback);
  window.setTimeout(dismissPreloader, prefersReducedMotion.matches ? 0 : 650);
}

// ===== 指针、粒子和视差 =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const canvas = document.getElementById('particleCanvas');
const context = canvas?.getContext('2d');
const heroLayer = document.querySelector('.hero-layer');
const heroTitle = document.getElementById('heroTitle');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let parallaxX = 0;
let parallaxY = 0;
let targetX = 0;
let targetY = 0;
let animationFrame = 0;
let particles = [];

class Particle {
  constructor(initial = false) {
    this.reset();
    if (initial) this.y = Math.random() * window.innerHeight;
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = window.innerHeight + 20;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * .5 + .2);
    this.speedX = (Math.random() - .5) * .3;
    this.opacity = Math.random() * .5 + .1;
    this.hue = Math.random() * 40 + 20;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < 100) {
      const force = (100 - distance) / 100;
      this.x += (dx / distance) * force * 2;
      this.y += (dy / distance) * force * 2;
    }
    if (this.y < -20 || this.x < -20 || this.x > window.innerWidth + 20) this.reset();
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = `hsla(${this.hue}, 80%, 85%, ${this.opacity})`;
    context.fill();
  }
}

function resizeCanvas() {
  if (!canvas || !context) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * scale);
  canvas.height = Math.round(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: window.innerWidth < 768 ? 25 : 50 }, () => new Particle(true));
}

function runAnimationFrame() {
  if (document.hidden || prefersReducedMotion.matches) {
    animationFrame = 0;
    return;
  }
  ringX += (mouseX - ringX) * .18;
  ringY += (mouseY - ringY) * .18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  if (context && canvas) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
  }
  parallaxX += (targetX - parallaxX) * .05;
  parallaxY += (targetY - parallaxY) * .05;
  if (heroLayer) heroLayer.style.transform = `translate(${parallaxX * 12}px, ${parallaxY * 12}px) scale(1.05)`;
  if (heroTitle) heroTitle.style.transform = `translate(calc(-50% + ${parallaxX * -8}px), ${parallaxY * -8}px)`;
  animationFrame = window.requestAnimationFrame(runAnimationFrame);
}

function syncAnimations() {
  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion.matches);
  if (prefersReducedMotion.matches) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    context?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (heroLayer) heroLayer.style.transform = '';
    if (heroTitle) heroTitle.style.transform = 'translateX(-50%)';
    revealWithoutGsap();
  } else if (!document.hidden && !animationFrame) {
    animationFrame = window.requestAnimationFrame(runAnimationFrame);
  }
}

document.addEventListener('mousemove', event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  targetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  targetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});
document.addEventListener('visibilitychange', syncAnimations);
prefersReducedMotion.addEventListener?.('change', syncAnimations);
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
syncAnimations();

document.querySelectorAll('button, a').forEach(element => {
  element.addEventListener('mouseenter', () => cursorRing?.classList.add('active'));
  element.addEventListener('mouseleave', () => cursorRing?.classList.remove('active'));
});

// ===== 气泡交互 =====
document.querySelectorAll('.bubble').forEach(bubble => {
  bubble.addEventListener('mousemove', event => {
    if (prefersReducedMotion.matches) return;
    const rect = bubble.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .25;
    const y = (event.clientY - rect.top - rect.height / 2) * .25;
    bubble.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
  });
  bubble.addEventListener('mouseleave', () => { bubble.style.transform = ''; });
  bubble.addEventListener('click', event => {
    if (prefersReducedMotion.matches) return;
    const ripple = document.createElement('span');
    const rect = bubble.getBoundingClientRect();
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    bubble.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  });
});

// ===== 背景音乐 =====
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
let audioInitialized = false;
let audioPlaying = false;
if (bgMusic) bgMusic.volume = 0;

function animateVolume(volume, duration, onComplete) {
  if (!bgMusic) return;
  if (hasGsap() && !prefersReducedMotion.matches) {
    window.gsap.to(bgMusic, { volume, duration, ease: 'power2.inOut', onComplete });
  } else {
    bgMusic.volume = volume;
    onComplete?.();
  }
}

function playBgm() {
  if (!bgMusic) return;
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    audioPlaying = true;
    audioToggle?.classList.add('playing');
    animateVolume(.4, 2);
  }).catch(() => { audioPlaying = false; });
}

function pauseBgm() {
  if (!bgMusic) return;
  animateVolume(0, .8, () => {
    bgMusic.pause();
    audioPlaying = false;
  });
  audioToggle?.classList.remove('playing');
}

function initializeAudio(event) {
  if (audioInitialized || event?.target === audioToggle) return;
  audioInitialized = true;
  audioToggle?.classList.add('show');
  playBgm();
}

['click', 'touchstart', 'keydown'].forEach(type => {
  document.addEventListener(type, initializeAudio, { passive: type === 'touchstart' });
});

audioToggle?.addEventListener('click', event => {
  event.stopPropagation();
  audioInitialized = true;
  audioToggle.classList.add('show');
  audioPlaying ? pauseBgm() : playBgm();
});

// ===== 面板交互与键盘焦点 =====
const bubbles = document.querySelectorAll('.bubble');
const panels = document.querySelectorAll('.panel');
const home = document.getElementById('home');
const doorOverlay = document.getElementById('doorOverlay');
let activePanel = null;
let returnFocus = null;

function setHomeInert(inert) {
  home?.classList.toggle('is-inert', inert);
  if (home) {
    home.inert = inert;
    home.setAttribute('aria-hidden', String(inert));
  }
  if (audioToggle) audioToggle.inert = inert;
}

function closePanels({ restoreFocus = true } = {}) {
  panels.forEach(panel => {
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden', 'true');
    panel.scrollTo({ top: 0, behavior: 'auto' });
    panel.querySelectorAll('[data-reveal]').forEach(element => element.classList.remove('revealed'));
  });
  activePanel = null;
  setHomeInert(false);
  if (restoreFocus && returnFocus instanceof HTMLElement) returnFocus.focus();
  returnFocus = null;
}

function openPanel(panelId, trigger) {
  closePanels({ restoreFocus: false });
  const panel = document.getElementById(panelId);
  if (!panel) return;
  returnFocus = trigger;
  activePanel = panel;
  setHomeInert(true);
  panel.classList.add('show');
  panel.setAttribute('aria-hidden', 'false');
  panel.querySelector('.close')?.focus();
  window.setTimeout(() => {
    panel.querySelectorAll('[data-reveal]').forEach((element, index) => {
      window.setTimeout(() => element.classList.add('revealed'), prefersReducedMotion.matches ? 0 : index * 120);
    });
  }, prefersReducedMotion.matches ? 0 : 300);
}

function trapPanelFocus(event) {
  if (event.key !== 'Tab' || !activePanel) return;
  const focusable = [...activePanel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.disabled && element.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

bubbles.forEach(bubble => {
  bubble.addEventListener('click', () => {
    if (bubble.dataset.panel === 'about') {
      doorOverlay?.classList.add('active');
      window.setTimeout(() => { window.location.href = 'about-template/index.html?v=4'; }, prefersReducedMotion.matches ? 0 : 1000);
      return;
    }
    openPanel(bubble.dataset.panel, bubble);
  });
});

document.querySelectorAll('.panel .close').forEach(button => {
  button.addEventListener('click', () => closePanels());
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activePanel) closePanels();
  trapPanelFocus(event);
});

// ===== 可选 GSAP 增强 =====
if (hasGsap() && typeof window.ScrollTrigger !== 'undefined' && !prefersReducedMotion.matches) {
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.to('.cloud-one', { xPercent: -30, scrollTrigger: { trigger: '.journey-scroll', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  window.gsap.to('.cloud-two', { xPercent: 20, scrollTrigger: { trigger: '.journey-scroll', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  window.gsap.to('.cloud-three', { xPercent: -15, scrollTrigger: { trigger: '.journey-scroll', start: 'top top', end: 'bottom bottom', scrub: 1 } });
}

document.querySelectorAll('.doodle path, .doodle circle').forEach(element => {
  if (!element.getTotalLength || !hasGsap() || prefersReducedMotion.matches) return;
  const length = element.getTotalLength();
  element.style.strokeDasharray = length;
  element.style.strokeDashoffset = length;
  window.gsap.to(element, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', delay: .8 });
});
