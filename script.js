/* LERP */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* SMOOTH SCROLL */
const sc = document.getElementById("sc");
let ty = 0,
  cy = 0;
const ease = 0.088;
window.addEventListener(
  "scroll",
  () => {
    ty = window.scrollY;
    prog();
    navScroll();
    parallax();
  },
  { passive: true },
);
(function loop() {
  cy = lerp(cy, ty, ease);
  if (Math.abs(ty - cy) < 0.05) cy = ty;
  sc.style.transform = `translate3d(0,${-cy}px,0)`;
  requestAnimationFrame(loop);
})();
document.body.style.minHeight = sc.scrollHeight + "px";
window.addEventListener("resize", () => {
  document.body.style.minHeight = sc.scrollHeight + "px";
});

/* PROGRESS */
const pb = document.getElementById("prog");
function prog() {
  const mx = document.body.scrollHeight - window.innerHeight;
  pb.style.width = (window.scrollY / mx) * 100 + "%";
}

/* NAV */
const mn = document.getElementById("mn");
function navScroll() {
  mn.classList.toggle("sc", window.scrollY > 80);
}

/* CURSOR */
const cd = document.getElementById("cd"),
  cr = document.getElementById("cr");
let mx = -100,
  my = -100,
  rx = -100,
  ry = -100;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cd.style.left = mx + "px";
  cd.style.top = my + "px";
});
(function rl() {
  rx = lerp(rx, mx, 0.1);
  ry = lerp(ry, my, 0.1);
  cr.style.left = rx + "px";
  cr.style.top = ry + "px";
  requestAnimationFrame(rl);
})();
document.querySelectorAll("a,button,.mc,.scard").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cd.classList.add("ex");
    cr.classList.add("ex");
  });
  el.addEventListener("mouseleave", () => {
    cd.classList.remove("ex");
    cr.classList.remove("ex");
  });
});

/* PARALLAX */
const pw0 = document.getElementById("pw0"),
  pw1 = document.getElementById("pw1"),
  pw2 = document.getElementById("pw2");
function parallax() {
  const sy = window.scrollY;
  if (pw0) pw0.style.transform = `translateX(-50%) translateY(${sy * -0.06}px)`;
  if (pw1) pw1.style.transform = `translateY(${sy * -0.14}px)`;
  if (pw2) pw2.style.transform = `translateY(${sy * 0.09}px)`;
}

/* INTERSECTION OBSERVER */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("iv");
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
);
document
  .querySelectorAll(".rv,.rvl,.rvr,.scard,.stitle,.mline")
  .forEach((el) => obs.observe(el));

/* MEMBER CARDS */
const members = [
  { id: "A1", name: "Anggota Satu", role: "Kepala Dadakan" },
  { id: "A2", name: "Anggota Dua", role: "Pilar Spontan" },
  { id: "A3", name: "Anggota Tiga", role: "Chaos Curator" },
  { id: "A4", name: "Anggota Empat", role: "Vibe Architect" },
  { id: "A5", name: "Anggota Lima", role: "Plan Destroyer" },
  { id: "A6", name: "Anggota Enam", role: "Wild Card" },
  { id: "A7", name: "Anggota Tujuh", role: "Chief of Chaos" },
  { id: "A8", name: "Anggota Delapan", role: "The Connector" },
];
const mg = document.getElementById("mg");
const mobs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const i = parseInt(e.target.dataset.i);
        setTimeout(() => e.target.classList.add("iv"), i * 80);
      }
    });
  },
  { threshold: 0.05 },
);
members.forEach((m, i) => {
  const c = document.createElement("div");
  c.className = "mc";
  c.dataset.i = i;
  c.innerHTML = `<div class="mbg"></div><div class="minit">${m.id}</div><span class="midx">${String(i + 1).padStart(2, "0")}</span><div class="minfo"><span class="mname">${m.name}</span><span class="mrole">${m.role}</span></div>`;
  mg.appendChild(c);
  mobs.observe(c);
  c.addEventListener("mouseenter", () => {
    cd.classList.add("ex");
    cr.classList.add("ex");
  });
  c.addEventListener("mouseleave", () => {
    cd.classList.remove("ex");
    cr.classList.remove("ex");
  });
});

/* ═══ MOTION GRAPH CANVAS ═══ */
(function () {
  const cv = document.getElementById("gc"),
    ctx = cv.getContext("2d");
  let W,
    H,
    t = 0,
    sv = 0,
    lsy = 0,
    mx2 = 0,
    my2 = 0;
  function rsz() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  window.addEventListener("resize", rsz);
  rsz();
  window.addEventListener(
    "scroll",
    () => {
      const sy = window.scrollY;
      sv += Math.abs(sy - lsy) * 0.7;
      lsy = sy;
    },
    { passive: true },
  );
  document.addEventListener("mousemove", (e) => {
    mx2 = e.clientX;
    my2 = e.clientY;
  });

  const lines = [
    { y: 0.18, amp: 26, freq: 0.0075, spd: 0.55, ph: 0, tk: 0.55, al: 0.18 },
    { y: 0.32, amp: 16, freq: 0.011, spd: 0.38, ph: 1.2, tk: 0.38, al: 0.09 },
    { y: 0.5, amp: 38, freq: 0.006, spd: 0.75, ph: 2.4, tk: 0.75, al: 0.2 },
    { y: 0.66, amp: 20, freq: 0.009, spd: 0.48, ph: 3.6, tk: 0.48, al: 0.11 },
    { y: 0.82, amp: 30, freq: 0.007, spd: 0.65, ph: 4.8, tk: 0.65, al: 0.15 },
    { y: 0.1, amp: 12, freq: 0.014, spd: 0.28, ph: 0.6, tk: 0.28, al: 0.06 },
    { y: 0.92, amp: 18, freq: 0.0085, spd: 0.52, ph: 5.4, tk: 0.42, al: 0.08 },
  ];

  function drawL(l, t, sv) {
    const by = H * l.y,
      ta = l.amp + sv * 1.6;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const w =
        Math.sin(x * l.freq + t * l.spd + l.ph) * ta * 0.7 +
        Math.sin(x * l.freq * 2.2 + t * l.spd * 1.3 + l.ph * 1.3) * ta * 0.2 +
        Math.sin(x * l.freq * 0.5 + t * l.spd * 0.6) * ta * 0.1;
      const dx = x - mx2,
        dy = by + w - my2,
        dist = Math.sqrt(dx * dx + dy * dy);
      const push = dist < 180 ? ((180 - dist) / 180) * 22 : 0;
      const y = by + w + (dy < 0 ? push : -push) * 0.28;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "rgba(239,239,239,0)");
    g.addColorStop(0.08, `rgba(239,239,239,${l.al})`);
    g.addColorStop(0.5, `rgba(239,239,239,${l.al * 1.7})`);
    g.addColorStop(0.92, `rgba(239,239,239,${l.al})`);
    g.addColorStop(1, "rgba(239,239,239,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = l.tk * (1 + sv * 0.025);
    ctx.stroke();
  }

  (function anim() {
    ctx.clearRect(0, 0, W, H);
    t += 0.011;
    sv *= 0.93;
    lines.forEach((l) => drawL(l, t, sv));
    requestAnimationFrame(anim);
  })();
})();

/* ═══ INK BLOB CANVAS ═══ */
(function () {
  const cv = document.getElementById("ic"),
    ctx = cv.getContext("2d");
  let W,
    H,
    t = 0,
    mx3 = 0,
    my3 = 0;
  function rsz() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  window.addEventListener("resize", rsz);
  rsz();
  document.addEventListener("mousemove", (e) => {
    mx3 = e.clientX;
    my3 = e.clientY;
  });
  const blobs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 190 + Math.random() * 170,
    ph: Math.random() * Math.PI * 2,
    sp: 0.002 + Math.random() * 0.003,
  }));
  (function anim() {
    ctx.clearRect(0, 0, W, H);
    t++;
    blobs.forEach((b, i) => {
      b.x += b.vx + Math.sin(t * 0.0014 + i * 1.3) * 0.45;
      b.y += b.vy + Math.cos(t * 0.0019 + i * 0.9) * 0.38;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;
      const dx = mx3 - b.x,
        dy = my3 - b.y,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d < 500) {
        b.x += dx * 0.00022;
        b.y += dy * 0.00022;
      }
      const wb = Math.sin(t * b.sp + b.ph) * 38,
        r = b.r + wb;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      g.addColorStop(0, "rgba(239,239,239,0.04)");
      g.addColorStop(0.4, "rgba(239,239,239,0.013)");
      g.addColorStop(1, "rgba(239,239,239,0)");
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(anim);
  })();
})();

/* SMOOTH ANCHOR NAV */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute("href"));
    if (t) {
      const top = t.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});
