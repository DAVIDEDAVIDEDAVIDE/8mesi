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
  const count = Math.floor((canvas.width * canvas.height) / 8500);
  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.018 + 0.002
    });
  }
}

function maybeCreateShootingStar() {
  if (Math.random() < 0.0055) {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.7,
      y: Math.random() * canvas.height * 0.35,
      len: Math.random() * 150 + 70,
      speed: Math.random() * 14 + 8,
      life: 0,
      maxLife: 30
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
    ctx.fillStyle = `rgba(255, 244, 224, ${star.alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  maybeCreateShootingStar();

  shootingStars = shootingStars.filter((s) => s.life < s.maxLife);

  for (const s of shootingStars) {
    const progress = s.life / s.maxLife;
    const x2 = s.x + s.len * progress;
    const y2 = s.y + s.len * 0.34 * progress;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 210, 150, ${1 - progress})`;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    s.life += 1;
    s.x += s.speed;
    s.y += s.speed * 0.34;
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
// PARALLAX LEGGERO IMMAGINE ALIENO
// ----------------------------
const alienImage = document.querySelector(".alien-image");

window.addEventListener("scroll", () => {
  if (!alienImage) return;

  const rect = alienImage.getBoundingClientRect();
  const visible = rect.top < window.innerHeight && rect.bottom > 0;

  if (visible) {
    const y = window.scrollY * 0.035;
    alienImage.style.transform = `scale(1.035) translateY(${y}px)`;
  }
});


// ----------------------------
// GALLERIA FULLSCREEN
// ----------------------------
const openGalleryBtn = document.getElementById("openGallery");
const closeGalleryBtn = document.getElementById("closeGallery");
const galleryModal = document.getElementById("galleryModal");
const galleryBackdrop = document.getElementById("galleryBackdrop");
const gallerySlider = document.getElementById("gallerySlider");
const gallerySlides = Array.from(document.querySelectorAll(".gallery-slide"));
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const slideCounter = document.getElementById("slideCounter");
const galleryProgress = document.getElementById("galleryProgress");

let currentSlide = 0;

function openGallery() {
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    goToSlide(0);
  }, 80);
}

function closeGallery() {
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function goToSlide(index) {
  if (!gallerySlides.length) return;

  currentSlide = Math.max(0, Math.min(index, gallerySlides.length - 1));

  const slideWidth = gallerySlider.clientWidth;
  gallerySlider.scrollTo({
    left: slideWidth * currentSlide,
    behavior: "smooth"
  });

  updateGalleryUi();
}

function updateGalleryUi() {
  const total = gallerySlides.length;
  slideCounter.textContent = `${currentSlide + 1} / ${total}`;

  const progress = ((currentSlide + 1) / total) * 100;
  galleryProgress.style.width = `${progress}%`;

  prevSlideBtn.disabled = currentSlide === 0;
  nextSlideBtn.disabled = currentSlide === total - 1;

  prevSlideBtn.style.opacity = currentSlide === 0 ? "0.45" : "1";
  nextSlideBtn.style.opacity = currentSlide === total - 1 ? "0.45" : "1";
}

function updateSlideFromScroll() {
  const slideWidth = gallerySlider.clientWidth;
  if (!slideWidth) return;

  const index = Math.round(gallerySlider.scrollLeft / slideWidth);

  if (index !== currentSlide) {
    currentSlide = Math.max(0, Math.min(index, gallerySlides.length - 1));
    updateGalleryUi();
  }
}

openGalleryBtn.addEventListener("click", openGallery);
closeGalleryBtn.addEventListener("click", closeGallery);
galleryBackdrop.addEventListener("click", closeGallery);

prevSlideBtn.addEventListener("click", () => {
  goToSlide(currentSlide - 1);
});

nextSlideBtn.addEventListener("click", () => {
  goToSlide(currentSlide + 1);
});

gallerySlider.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateSlideFromScroll);
});

window.addEventListener("keydown", (event) => {
  if (!galleryModal.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeGallery();
  }

  if (event.key === "ArrowRight") {
    goToSlide(currentSlide + 1);
  }

  if (event.key === "ArrowLeft") {
    goToSlide(currentSlide - 1);
  }
});

window.addEventListener("resize", () => {
  if (galleryModal.classList.contains("open")) {
    goToSlide(currentSlide);
  }
});

updateGalleryUi();
