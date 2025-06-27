const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');

const slingX = 150;
const slingY = canvas.height - 100;

let bird = {
  x: slingX,
  y: slingY,
  radius: 12,
  isDragging: false,
  vx: 0,
  vy: 0,
  launched: false
};

let gravity = 0.5;
let trail = [];
let score = 0;

const target = {
  width: 40,
  height: 40,
  x: canvas.width - 100,
  y: canvas.height - 80,
  dx: -2
};

const birdImg = new Image();
const pigImg = new Image();
const slingImg = new Image();

let imagesLoaded = 0;

function imageReady() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    draw();
  }
}

birdImg.onload = imageReady;
pigImg.onload = imageReady;
slingImg.onload = imageReady;

birdImg.src = './Images/angry-birds.png';
pigImg.src = './Images/game.png';
slingImg.src = './Images/slingshot.png';

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const dist = Math.hypot(mx - bird.x, my - bird.y);
  if (dist < bird.radius + 10 && !bird.launched) {
    bird.isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (bird.isDragging) {
    const rect = canvas.getBoundingClientRect();
    bird.x = e.clientX - rect.left;
    bird.y = e.clientY - rect.top;
  }
});

canvas.addEventListener('mouseup', () => {
  if (bird.isDragging) {
    bird.isDragging = false;
    bird.launched = true;

    const dx = slingX - bird.x;
    const dy = slingY - bird.y;

    bird.vx = dx * 0.2;
    bird.vy = dy * 0.2;
  }
});

function resetBird() {
  bird.x = slingX;
  bird.y = slingY;
  bird.vx = 0;
  bird.vy = 0;
  bird.launched = false;
  trail = [];
}

function showBoomMessage() {
  const boom = document.createElement('div');
  boom.className = 'boom-text';
  boom.textContent = '💥 BOOM!';
  document.body.appendChild(boom);
  setTimeout(() => boom.remove(), 1000);
}

function drawTarget() {
  ctx.drawImage(pigImg, target.x, target.y, target.width, target.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

  target.x += target.dx;
  if (target.x < canvas.width - 200 || target.x > canvas.width - 40) {
    target.dx *= -1;
  }
  drawTarget();

  ctx.drawImage(slingImg, slingX - 25, canvas.height - 140, 50, 100);

  if (bird.launched) {
    bird.vy += gravity;
    bird.x += bird.vx;
    bird.y += bird.vy;
    trail.push({ x: bird.x, y: bird.y });
    if (trail.length > 100) trail.shift();
  }

  ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
  for (let dot of trail) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!bird.launched) {
    ctx.beginPath();
    ctx.moveTo(slingX, slingY);
    ctx.lineTo(bird.x, bird.y);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.drawImage(birdImg, bird.x - 20, bird.y - 20, 40, 40);

  if (
    bird.x + bird.radius >= target.x &&
    bird.x - bird.radius <= target.x + target.width &&
    bird.y + bird.radius >= target.y &&
    bird.y - bird.radius <= target.y + target.height
  ) {
    message.textContent = "";
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    showBoomMessage();
    resetBird();
  }

  if (bird.y > canvas.height || bird.x > canvas.width || bird.x < 0) {
    message.textContent = "😔 Missed! Try again.";
    resetBird();
  }

  requestAnimationFrame(draw);
}
