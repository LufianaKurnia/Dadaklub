// ─── LENIS-STYLE SMOOTH SCROLL ───
let scrollY = 0,
  targetY = 0,
  currentY = 0;
const ease = 0.072;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

window.addEventListener(
  "scroll",
  () => {
    targetY = window.scrollY;
  },
  { passive: true },
);

function smoothScroll() {
  currentY = lerp(currentY, targetY, ease);
  scrollY = currentY;
  requestAnimationFrame(smoothScroll);
}
smoothScroll();

// ─── CUSTOM CURSOR ───
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});

(function animRing() {
  rx = lerp(rx, mx, 0.12);
  ry = lerp(ry, my, 0.12);
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animRing);
})();

document
  .querySelectorAll("a, button, .member-card, .stat-item")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("hovering");
      ring.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("hovering");
      ring.classList.remove("hovering");
    });
  });

// ─── PROGRESS BAR ───
const progressBar = document.getElementById("progress-bar");
window.addEventListener(
  "scroll",
  () => {
    const s = window.scrollY;
    const h = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (s / h) * 100 + "%";
  },
  { passive: true },
);

// ─── NAV SCROLL STATE ───
const nav = document.getElementById("main-nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .stat-item, .member-card, .section-title",
);
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in-view");
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObs.observe(el));

// ─── PARALLAX WORDS ───
const pw1 = document.getElementById("pw1");
const pw2 = document.getElementById("pw2");
window.addEventListener(
  "scroll",
  () => {
    const sy = window.scrollY;
    if (pw1)
      pw1.style.transform = `translateY(${sy * -0.12}px) translateX(${sy * 0.05}px)`;
    if (pw2)
      pw2.style.transform = `translateY(${sy * 0.08}px) translateX(${sy * -0.04}px)`;
  },
  { passive: true },
);

// ─── FLUID METABALL CANVAS ───
(function () {
  const canvas = document.getElementById("fluid-canvas");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Metaball blobs
  const blobs = [];
  const NUM_BLOBS = 6;
  for (let i = 0; i < NUM_BLOBS; i++) {
    blobs.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 180 + Math.random() * 160,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.004,
    });
  }

  let mouseX = W / 2,
    mouseY = H / 2;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function drawBlob(b, t) {
    const wobble = Math.sin(t * b.speed + b.phase) * 30;
    const r = b.r + wobble;
    const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grd.addColorStop(0, "rgba(255,255,255,0.055)");
    grd.addColorStop(0.4, "rgba(255,255,255,0.02)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  let t = 0;
  function animFluid() {
    ctx.clearRect(0, 0, W, H);
    t++;
    blobs.forEach((b, i) => {
      // Drift
      b.x += b.vx + Math.sin(t * 0.002 + i) * 0.3;
      b.y += b.vy + Math.cos(t * 0.003 + i) * 0.3;
      // Bounce
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;
      // Mouse attraction (very subtle)
      const dx = mouseX - b.x,
        dy = mouseY - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 400) {
        b.x += dx * 0.0003;
        b.y += dy * 0.0003;
      }
      drawBlob(b, t);
    });
    requestAnimationFrame(animFluid);
  }
  animFluid();
})();

// ─── PARTICLE / DROPLET CANVAS (scroll-reactive) ───
(function () {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Droplets
  const drops = [];
  const NUM = 80;
  for (let i = 0; i < NUM; i++) {
    drops.push(spawnDrop());
  }
  function spawnDrop() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vy: 0.3 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      r: 1 + Math.random() * 2.5,
      alpha: 0.1 + Math.random() * 0.35,
      trail: [],
      maxTrail: 6 + Math.floor(Math.random() * 8),
    };
  }

  let scrollVel = 0,
    lastSY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const sy = window.scrollY;
      scrollVel = Math.min(Math.abs(sy - lastSY), 30);
      lastSY = sy;
    },
    { passive: true },
  );

  function animDrops() {
    ctx.clearRect(0, 0, W, H);
    const speedMult = 1 + scrollVel * 0.18;
    scrollVel *= 0.9;

    drops.forEach((d) => {
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > d.maxTrail) d.trail.shift();

      d.y += d.vy * speedMult;
      d.x += d.vx;

      // Draw trail
      if (d.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(d.trail[0].x, d.trail[0].y);
        for (let j = 1; j < d.trail.length; j++) {
          ctx.lineTo(d.trail[j].x, d.trail[j].y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${d.alpha * 0.3 * (d.trail.length / d.maxTrail)})`;
        ctx.lineWidth = d.r * 0.5;
        ctx.stroke();
      }

      // Draw droplet
      const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2);
      grd.addColorStop(0, `rgba(255,255,255,${d.alpha})`);
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Reset when out
      if (d.y > H + 10) {
        d.y = -10;
        d.x = Math.random() * W;
        d.trail = [];
        d.vy = 0.3 + Math.random() * 0.6;
        d.alpha = 0.1 + Math.random() * 0.35;
        d.r = 1 + Math.random() * 2.5;
      }
    });
    requestAnimationFrame(animDrops);
  }
  animDrops();

  // Splash on click
  document.addEventListener("click", (e) => {
    for (let i = 0; i < 8; i++) {
      const splash = spawnDrop();
      splash.x = e.clientX + (Math.random() - 0.5) * 40;
      splash.y = e.clientY + (Math.random() - 0.5) * 20;
      splash.vy = -2 - Math.random() * 3;
      splash.vx = (Math.random() - 0.5) * 4;
      splash.alpha = 0.5 + Math.random() * 0.4;
      splash.r = 1.5 + Math.random() * 3;
      drops.push(splash);
      if (drops.length > NUM + 30) drops.shift();
    }
  });
})();

// ─── SMOOTH NAV SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
