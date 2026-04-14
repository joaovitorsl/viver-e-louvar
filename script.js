const EVENT_DATE = new Date("2026-10-24T19:00:00-03:00");

const FUNDING = {
  goal: 120000,
  raised: 68450,
};

const money = new Intl.NumberFormat("pt-BR");

function updateCountdown() {
  const now = new Date();
  const distance = EVENT_DATE - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    const countdown = document.getElementById("countdown");
    countdown.innerHTML = "<div class='time-box' style='grid-column: 1 / -1;'><span>Chegou o grande dia!</span><small>Hoje é a gravação</small></div>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function updateFundingProgress() {
  const percent = Math.min((FUNDING.raised / FUNDING.goal) * 100, 100);

  document.getElementById("goalAmount").textContent = money.format(FUNDING.goal);
  document.getElementById("raisedAmount").textContent = money.format(FUNDING.raised);
  document.getElementById("progressBar").style.width = `${percent.toFixed(2)}%`;
  document.getElementById("progressText").textContent = `${percent.toFixed(1)}% da meta alcançada`;
}

function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

updateCountdown();
updateFundingProgress();
setupRevealOnScroll();
setInterval(updateCountdown, 1000);
