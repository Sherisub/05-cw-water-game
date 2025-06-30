// === charity: water Game Prototype Logic ===

// ----- Global Game State -----
let score = 0;
let targetScore = 20;      // Default
let spawnInterval = 1200;  // Default
let gameTimer = null;
let milestonesShown = [];

// ----- DOM Elements -----
const gameArea  = document.getElementById('gameArea');
const scoreSpan = document.getElementById('score');
const resetBtn  = document.getElementById('resetBtn');
const canvas    = document.getElementById('celebration');
const collectSound = document.getElementById('collectSound');

// ----- Milestone messages -----
const milestoneMessages = [
  { score: 5, message: "Great start!" },
  { score: 10, message: "Halfway there!" },
  { score: 15, message: "Almost done!" }
];

// ----- Utility Functions -----

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function updateScore(delta) {
  score += delta;
  if (score < 0) score = 0;
  scoreSpan.textContent = score;

  // Show milestone messages
  milestoneMessages.forEach(m => {
    if (score >= m.score && !milestonesShown.includes(m.score)) {
      alert(m.message);
      milestonesShown.push(m.score);
    }
  });

  if (score >= targetScore) {
    celebrate();
  }
}

function positionRandomly(el) {
  const gw = gameArea.clientWidth  - el.offsetWidth;
  const gh = gameArea.clientHeight - el.offsetHeight;
  el.style.left = rand(0, gw) + 'px';
  el.style.top  = rand(0, gh) + 'px';
}

function spawnDrop() {
  const drop = document.createElement('img');
  drop.src = 'img/water-can.png';
  drop.className = 'drop';
  positionRandomly(drop);
  drop.addEventListener('click', () => {
    if (collectSound) collectSound.play();
    updateScore(1);
    drop.remove();
  });
  gameArea.appendChild(drop);

  if (Math.random() < 0.35) {
    spawnObstacle();
  }
}

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  obs.style.backgroundImage = 'url("https://cdn.jsdelivr.net/gh/ste-scribble/cloud.svg")';
  positionRandomly(obs);
  obs.addEventListener('click', () => {
    updateScore(-2);
    obs.remove();
  });
  gameArea.appendChild(obs);
}

function celebrate() {
  clearInterval(gameTimer);
  if (window.confetti) {
    canvas.classList.remove('hide');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 }
    });
  } else {
    alert('You saved enough drops! 🎉');
  }
}

function resetGame() {
  clearInterval(gameTimer);
  score = 0;
  milestonesShown = [];
  scoreSpan.textContent = 0;
  gameArea.innerHTML = '';
  canvas.classList.add('hide');
}

// ===== New: Difficulty Mode Handling =====

function startGame(mode = 'normal') {
  resetGame(); // clear everything before starting

  // Apply difficulty settings
  if (mode === 'easy') {
    targetScore = 10;
    spawnInterval = 1500;
  } else if (mode === 'normal') {
    targetScore = 20;
    spawnInterval = 1200;
  } else if (mode === 'hard') {
    targetScore = 30;
    spawnInterval = 800;
  }

  // Start spawning
  gameTimer = setInterval(spawnDrop, spawnInterval);
}

// ===== Initialize =====

document.addEventListener('DOMContentLoaded', () => startGame('normal'));

// Hook up difficulty buttons
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.textContent.toLowerCase(); // 'easy', 'normal', 'hard', or 'reset'
    if (mode === 'reset') {
      resetGame();
      startGame(); // default to normal
    } else {
      startGame(mode);
    }
  });
});
