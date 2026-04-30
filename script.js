// -----------------------------
// STARFIELD BACKGROUND
// -----------------------------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
}

function createStars() {
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.7 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.002
    });
  }
}

function maybeCreateShootingStar() {
  if (Math.random() < 0.006) {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.4,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 14 + 8,
      life: 0,
      maxLife: 28
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0.15) {
      star.speed *= -1;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  maybeCreateShootingStar();

  shootingStars = shootingStars.filter((s) => s.life < s.maxLife);

  for (const s of shootingStars) {
    const progress = s.life / s.maxLife;
    const x2 = s.x + s.len * progress;
    const y2 = s.y + s.len * 0.35 * progress;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(180,220,255,${1 - progress})`;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    s.life += 1;
    s.x += s.speed;
    s.y += s.speed * 0.35;
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();

// -----------------------------
// JOURNEY STEP INTERACTION
// -----------------------------
const steps = document.querySelectorAll(".step");
const alienShip = document.getElementById("alienShip");
const journeyTitle = document.getElementById("journeyTitle");
const journeyText = document.getElementById("journeyText");
const progressFill = document.getElementById("progressFill");

function setJourneyState(step) {
  steps.forEach((s) => s.classList.remove("active"));
  step.classList.add("active");

  const progress = Number(step.dataset.progress || 0);
  const title = step.dataset.title || "";
  const text = step.dataset.text || "";

  journeyTitle.textContent = title;
  journeyText.textContent = text;
  progressFill.style.width = `${progress}%`;

  const maxDistance = 255; // distanza massima della navicella
  const x = (progress / 100) * maxDistance;
  const y = Math.sin(progress / 12) * 10;

  alienShip.style.transform = `translate(${x}px, ${y}px)`;
}

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setJourneyState(entry.target);
      }
    });
  },
  {
    threshold: 0.55
  }
);

steps.forEach((step) => stepObserver.observe(step));

if (steps.length > 0) {
  setJourneyState(steps[0]);
}

// -----------------------------
// REVEAL ON SCROLL
// -----------------------------
const revealTargets = document.querySelectorAll(
  ".content-card, .memory-card, .journey-header, .step, .section-head"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// -----------------------------
// LIVE MESSAGE ROTATION
// -----------------------------
const liveMessage = document.getElementById("liveMessage");

const liveMessages = [
  "In questo esatto momento, da qualche punto remoto del cosmo, l’alieno osserva la Terra e vede noi due come un piccolo frammento di luce.",
  "Forse per lui siamo solo due persone lontane. Ma abbastanza luminose da essere notate persino nello spazio.",
  "Mentre questa pagina esiste, anche questo istante entra a far parte della nostra luce nel tempo.",
  "Lui ci guarda da lontano. Io invece ti guardo da qui. E ti sceglierei comunque."
];

let currentMessage = 0;

setInterval(() => {
  if (!liveMessage) return;
  currentMessage = (currentMessage + 1) % liveMessages.length;
  liveMessage.style.opacity = "0";

  setTimeout(() => {
    liveMessage.textContent = liveMessages[currentMessage];
    liveMessage.style.opacity = "1";
  }, 250);
}, 4200);
