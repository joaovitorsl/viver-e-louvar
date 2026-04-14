/* ─────────────────────────────────────────────────────────
   Viver e Louvar · 15 Anos — script.js
   ───────────────────────────────────────────────────────── */

const EVENT_DATE = new Date("2026-10-24T19:00:00-03:00");

const FUNDING = {
  goal: 13000,
  raised: 1000,
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

/* ── 8. PIX QR CODE ─────────────────────────────────────── */
(function initPix() {
  const el = document.getElementById("pixQR");
  if (!el || typeof QRCode === "undefined") return;

  const PIX_KEY = "viverelouvar@gmail.com";

  new QRCode(el, {
    text: PIX_KEY,
    width: 168,
    height: 168,
    colorDark: "#1a1410",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });

  /* botão copiar */
  const btn  = document.getElementById("pixCopy");
  const txt  = document.getElementById("pixCopyText");
  if (!btn) return;
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      btn.classList.add("copied");
      txt.textContent = "Copiado!";
      setTimeout(() => { btn.classList.remove("copied"); txt.textContent = "Copiar"; }, 2200);
    });
  });
})();

/* ── 9. MAPA DE ASSENTOS ────────────────────────────────── */
(function initSeatMap() {
  const container = document.getElementById("mapaSeats");
  const infoEl    = document.getElementById("mapaInfo");
  const btn       = document.getElementById("mapaBtn");
  if (!container) return;

  /* ── configuração das fileiras ──────────────────────────
     Paid (150 lugares): A–I
     Gratuito (180 lugares): J–Q
     Total: 330
  ────────────────────────────────────────────────────── */
  const ROWS = [
    { id:"A", l:5,  r:5,  type:"honra"       },
    { id:"B", l:6,  r:6,  type:"honra"       },
    { id:"C", l:7,  r:7,  type:"incentivador"},
    { id:"D", l:8,  r:8,  type:"incentivador"},
    { id:"E", l:9,  r:9,  type:"incentivador"},
    { id:"F", l:9,  r:9,  type:"apoiador"    },
    { id:"G", l:10, r:10, type:"apoiador"    },
    { id:"H", l:10, r:10, type:"apoiador"    },
    { id:"I", l:11, r:11, type:"apoiador"    },
    "divisor",
    { id:"J", l:11, r:11, type:"gratuito"    },
    { id:"K", l:11, r:11, type:"gratuito"    },
    { id:"L", l:11, r:11, type:"gratuito"    },
    { id:"M", l:11, r:11, type:"gratuito"    },
    { id:"N", l:11, r:11, type:"gratuito"    },
    { id:"O", l:12, r:12, type:"gratuito"    },
    { id:"P", l:12, r:12, type:"gratuito"    },
    { id:"Q", l:11, r:11, type:"gratuito"    },
  ];

  const PRECO  = { honra: null, incentivador: 50, apoiador: 20, gratuito: 0 };
  const ROTULO = { honra: "Cadeira de Honra · Patrocinador", incentivador: "Incentivador · R$ 50",
                   apoiador: "Apoiador · R$ 20", gratuito: "Gratuito" };

  /* marcação aleatória de ocupados (realismo para a apresentação) */
  const ocupados = new Set();
  ROWS.forEach(row => {
    if (row === "divisor") return;
    const total = row.l + row.r;
    const taxa  = row.type === "gratuito" ? 0.08 : 0.15;
    for (let i = 0; i < total; i++) {
      if (Math.random() < taxa) ocupados.add(`${row.id}-${i}`);
    }
  });

  const selecionados = new Map(); // id → type

  /* ── tooltip ──────────────────────────────────────────── */
  const tip = document.createElement("div");
  tip.className = "seat-tooltip";
  document.body.appendChild(tip);

  function showTip(e, text) {
    tip.textContent = text;
    tip.classList.add("visible");
    moveTip(e);
  }
  function moveTip(e) {
    tip.style.left = (e.clientX + 12) + "px";
    tip.style.top  = (e.clientY - 28) + "px";
  }
  function hideTip() { tip.classList.remove("visible"); }

  /* ── geração do mapa ──────────────────────────────────── */
  ROWS.forEach(row => {
    if (row === "divisor") {
      const div = document.createElement("div");
      div.className = "mapa-divisor";
      div.innerHTML = `<div class="mapa-divisor-line"></div>
        <span class="mapa-divisor-label">⬇ Acesso Gratuito</span>
        <div class="mapa-divisor-line"></div>`;
      container.appendChild(div);
      return;
    }

    const rowEl = document.createElement("div");
    rowEl.className = "seat-row";

    const mkLbl = () => { const s = document.createElement("span"); s.className = "row-lbl"; s.textContent = row.id; return s; };
    const mkAisle = () => { const d = document.createElement("div"); d.className = "seat-aisle"; return d; };

    rowEl.appendChild(mkLbl());

    /* assentos lado esquerdo (numerados de dentro para fora) */
    for (let i = row.l; i >= 1; i--) {
      rowEl.appendChild(makeSeat(row, `${row.id}-${row.l - i}`, i, "Esq"));
    }

    rowEl.appendChild(mkAisle());

    /* assentos lado direito */
    for (let i = 1; i <= row.r; i++) {
      rowEl.appendChild(makeSeat(row, `${row.id}-${row.l + i - 1}`, i, "Dir"));
    }

    rowEl.appendChild(mkLbl());
    container.appendChild(rowEl);
  });

  function makeSeat(row, uid, num, lado) {
    const el = document.createElement("div");
    el.className = `seat ${row.type}`;
    el.dataset.uid  = uid;
    el.dataset.type = row.type;

    if (ocupados.has(uid)) {
      el.classList.add("ocupado");
      el.addEventListener("mouseenter", e => showTip(e, "Ocupado"));
      el.addEventListener("mousemove",  moveTip);
      el.addEventListener("mouseleave", hideTip);
    } else {
      const labelTip = `Fileira ${row.id} · ${lado} ${num} · ${ROTULO[row.type]}`;
      el.addEventListener("mouseenter", e => showTip(e, labelTip));
      el.addEventListener("mousemove",  moveTip);
      el.addEventListener("mouseleave", hideTip);
      el.addEventListener("click", () => toggleSeat(el, uid, row.type));
    }
    return el;
  }

  function toggleSeat(el, uid, type) {
    if (selecionados.has(uid)) {
      selecionados.delete(uid);
      el.classList.remove("selected");
    } else {
      selecionados.set(uid, type);
      el.classList.add("selected");
    }
    renderInfo();
  }

  function renderInfo() {
    if (selecionados.size === 0) {
      infoEl.textContent = "Selecione uma cadeira para começar.";
      btn.style.display = "none";
      return;
    }

    const counts = { honra:0, incentivador:0, apoiador:0, gratuito:0 };
    let total = 0;
    selecionados.forEach(type => {
      counts[type]++;
      if (PRECO[type]) total += PRECO[type];
    });

    const partes = [];
    if (counts.honra)       partes.push(`${counts.honra}× Honra`);
    if (counts.incentivador) partes.push(`${counts.incentivador}× Incentivador`);
    if (counts.apoiador)    partes.push(`${counts.apoiador}× Apoiador`);
    if (counts.gratuito)    partes.push(`${counts.gratuito}× Gratuito`);

    const n = selecionados.size;
    infoEl.textContent = `${n} cadeira${n > 1 ? "s" : ""} · ${partes.join(", ")}${total > 0 ? ` · Total: R$ ${total}` : " · Gratuito"}`;
    btn.style.display = "inline-block";
  }
})();

