// ----------------------------
// STARFIELD
// ----------------------------
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
  const count = Math.floor((canvas.width * canvas.height) / 9500);
  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.002
    });
  }
}

function maybeCreateShootingStar() {
  if (Math.random() < 0.005) {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.7,
      y: Math.random() * canvas.height * 0.35,
      len: Math.random() * 140 + 60,
      speed: Math.random() * 13 + 8,
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
    ctx.strokeStyle = `rgba(181, 221, 255, ${1 - progress})`;
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

// ----------------------------
// REVEAL ON SCROLL
// ----------------------------
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// ----------------------------
// PARALLAX LEGGERO SULL'IMMAGINE
// ----------------------------
const storyImage = document.querySelector(".story-image");

window.addEventListener("scroll", () => {
  if (!storyImage) return;
  const y = window.scrollY * 0.06;
  storyImage.style.transform = `scale(1.03) translateY(${y}px)`;
});
