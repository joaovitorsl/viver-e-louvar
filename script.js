/* ─────────────────────────────────────────────────────────
   Viver e Louvar · 15 Anos — script.js
   ───────────────────────────────────────────────────────── */

const EVENT_DATE = new Date("2026-10-24T19:00:00-03:00");

const FUNDING = {
  goal: 120000,
  raised: 68450,
};

const money = new Intl.NumberFormat("pt-BR");

/* ── 1. CURSOR ──────────────────────────────────────────── */
(function initCursor() {
  const ring = document.getElementById("cursor");
  const dot  = document.getElementById("cursorDot");
  if (!ring || !dot) return;

  let rx = 0, ry = 0;   // ring position (lerp)
  let dx = 0, dy = 0;   // dot position  (instant)

  document.addEventListener("mousemove", (e) => {
    dx = e.clientX;
    dy = e.clientY;
  });

  (function loop() {
    rx += (dx - rx) * 0.14;
    ry += (dy - ry) * 0.14;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    dot.style.left  = dx + "px";
    dot.style.top   = dy + "px";
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.style.transform = "translate(-50%,-50%) scale(1.6)");
    el.addEventListener("mouseleave", () => ring.style.transform = "translate(-50%,-50%) scale(1)");
  });
})();

/* ── 2. CANVAS PARTÍCULAS ───────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.4 + 0.05,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 88 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,160,23,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener("resize", () => { resize(); });
})();

/* ── 3. NAV SCROLLED ────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
})();

/* ── 4. HEADLINE REVEAL ─────────────────────────────────── */
(function initHeroReveal() {
  const lines = document.querySelectorAll(".line-text");
  // Dispara logo no primeiro frame para garantir a animação
  requestAnimationFrame(() => {
    lines.forEach((line) => line.classList.add("visible"));
  });

  const fades = document.querySelectorAll(".hero .reveal-fade");
  setTimeout(() => {
    fades.forEach((el) => el.classList.add("visible"));
  }, 600);
})();

/* ── 5. INTERSECTION OBSERVER (seções) ───────────────────── */
(function initReveal() {
  const els = document.querySelectorAll(".reveal-up, main .reveal-fade");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => observer.observe(el));
})();

/* ── 6. COUNTDOWN ───────────────────────────────────────── */
function updateCountdown() {
  const dist = EVENT_DATE - Date.now();

  if (dist <= 0) {
    document.getElementById("countdown").innerHTML =
      "<div class='time-box' style='min-width:auto'><span style='font-size:clamp(1.4rem,3vw,2.2rem)'>Chegou o grande dia!</span></div>";
    return;
  }

  const d = Math.floor(dist / 86400000);
  const h = Math.floor((dist / 3600000) % 24);
  const m = Math.floor((dist / 60000) % 60);
  const s = Math.floor((dist / 1000) % 60);

  document.getElementById("days").textContent    = String(d).padStart(2, "0");
  document.getElementById("hours").textContent   = String(h).padStart(2, "0");
  document.getElementById("minutes").textContent = String(m).padStart(2, "0");
  document.getElementById("seconds").textContent = String(s).padStart(2, "0");
}

/* ── 7. FUNDING PROGRESS ────────────────────────────────── */
function initFunding() {
  const pct = Math.min((FUNDING.raised / FUNDING.goal) * 100, 100);

  document.getElementById("goalAmount").textContent   = "R$ " + money.format(FUNDING.goal);
  document.getElementById("raisedAmount").textContent = "R$ " + money.format(FUNDING.raised);
  document.getElementById("progressText").textContent = pct.toFixed(1) + "% da meta alcançada";

  // animação: dispara após um pequeno delay para a transição CSS funcionar
  setTimeout(() => {
    document.getElementById("progressBar").style.width = pct.toFixed(2) + "%";
  }, 400);
}

/* ── INIT ───────────────────────────────────────────────── */
updateCountdown();
initFunding();
setInterval(updateCountdown, 1000);

