const surpriseButton = document.querySelector("#surpriseButton");
const replayButton = document.querySelector("#replayButton");
const closeButton = document.querySelector("#closeButton");
const celebration = document.querySelector("#celebration");
const canvas = document.querySelector("#confettiCanvas");
const context = canvas.getContext("2d");
const birthdayArt = document.querySelector("#birthdayArt");
const wishButton = document.querySelector("#wishButton");
const wishButtonText = document.querySelector("#wishButtonText");
const wishGenerator = document.querySelector("#wishGenerator");
const wishText = document.querySelector("#wishText");
const celebrationWish = document.querySelector("#celebrationWish");
const scrollProgress = document.querySelector("#scrollProgress");
const copyButton = document.querySelector("#copyButton");
const copyStatus = document.querySelector("#copyStatus");
const revealTargets = document.querySelectorAll(".wish-section, .reasons-section, .little-things-section, .footer");

const tinyWishes = [
  "May every plan you’re excited about find its way to you.",
  "May you collect golden-hour memories in every season.",
  "May the next chapter feel lighter, louder, and completely yours.",
  "May good news start showing up like it knows your address.",
  "May there always be one more reason to laugh than you expected.",
];

let pieces = [];
let animationFrame;
let lastTrigger = surpriseButton;

document.documentElement.classList.add("js");

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createConfetti() {
  const colors = ["#f7ae87", "#ef806f", "#c4a8dc", "#f8e8d2", "#ffdc80"];
  pieces = Array.from({ length: 125 }, (_, index) => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
    y: window.innerHeight * 0.47 + (Math.random() - 0.5) * 25,
    width: Math.random() * 9 + 4,
    height: Math.random() * 5 + 3,
    color: colors[index % colors.length],
    velocityX: (Math.random() - 0.5) * 13,
    velocityY: Math.random() * -11 - 3,
    gravity: Math.random() * 0.18 + 0.12,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.22,
    opacity: 1,
  }));

  cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces.forEach((piece) => {
    piece.velocityY += piece.gravity;
    piece.x += piece.velocityX;
    piece.y += piece.velocityY;
    piece.rotation += piece.rotationSpeed;
    piece.opacity -= 0.004;

    context.save();
    context.globalAlpha = Math.max(piece.opacity, 0);
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
    context.restore();
  });

  pieces = pieces.filter((piece) => piece.y < window.innerHeight + 30 && piece.opacity > 0);
  if (pieces.length) animationFrame = requestAnimationFrame(animateConfetti);
}

function openCelebration(event) {
  if (event?.currentTarget instanceof HTMLElement) lastTrigger = event.currentTarget;
  celebration.classList.add("is-visible");
  celebration.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  createConfetti();
  closeButton.focus();
}

function closeCelebration() {
  celebration.classList.remove("is-visible");
  celebration.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastTrigger.focus();
}

async function copyWish() {
  const message = `Happy birthday, Sunidhi! ${celebrationWish.textContent}`;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      const helper = document.createElement("textarea");
      helper.value = message;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    copyStatus.textContent = "copied ✦";
  } catch (error) {
    copyStatus.textContent = "select the wish to share it";
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 2400);
}

surpriseButton.addEventListener("click", openCelebration);
replayButton.addEventListener("click", openCelebration);
closeButton.addEventListener("click", closeCelebration);
copyButton.addEventListener("click", copyWish);

function makeWish() {
  if (birthdayArt.classList.contains("is-wished")) return;

  birthdayArt.classList.add("is-wished");
  wishButtonText.textContent = "wish sent ✦";
  celebrationWish.textContent = "Your wish is already on its way — now go enjoy your day.";
  createConfetti();
}

wishButton.addEventListener("click", makeWish);
birthdayArt.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target === birthdayArt) {
    event.preventDefault();
    makeWish();
  }
});

wishGenerator.addEventListener("click", () => {
  const nextWish = tinyWishes[Math.floor(Math.random() * tinyWishes.length)];
  wishText.classList.remove("wish-text-pop");
  void wishText.offsetWidth;
  wishText.textContent = nextWish;
  wishText.classList.add("wish-text-pop");
});

celebration.addEventListener("click", (event) => {
  if (event.target === celebration) closeCelebration();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && celebration.classList.contains("is-visible")) {
    closeCelebration();
  }
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", updateScrollProgress, { passive: true });
resizeCanvas();
updateScrollProgress();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  revealTargets.forEach((target) => target.classList.add("is-in-view"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    birthdayArt.style.setProperty("--tilt-x", `${x * 7}px`);
    birthdayArt.style.setProperty("--tilt-y", `${y * 5}px`);
    birthdayArt.style.setProperty("--rotate-x", `${-y * 5}deg`);
    birthdayArt.style.setProperty("--rotate-y", `${x * 8}deg`);
  });

  birthdayArt.addEventListener("pointerleave", () => {
    birthdayArt.style.setProperty("--tilt-x", "0px");
    birthdayArt.style.setProperty("--tilt-y", "0px");
    birthdayArt.style.setProperty("--rotate-x", "0deg");
    birthdayArt.style.setProperty("--rotate-y", "0deg");
  });
}
