const canvas = document.getElementById("plinkoCanvas");
const ctx = canvas.getContext("2d");
const dropBtn = document.getElementById("dropBtn");
const balanceDisplay = document.getElementById("balance");

let balance = 0;
balanceDisplay.textContent = balance;

const gravity = 0.25;
const ballRadius = 10;

const pegRadius = 6;
const pegRows = 12;
const pegs = [];

const slots = [5, 10, 25, 50, 100, 50, 25, 10, 5]; 
const slotCount = slots.length;
const slotWidth = canvas.width / slotCount;

let ball = null; // ball object while falling

// Generate pegs in triangle pattern
function createPegs() {
  pegs.length = 0;
  const startY = 80;
  const verticalSpacing = 40;
  const horizontalSpacing = slotWidth / 2;

  for (let row = 0; row < pegRows; row++) {
    const y = startY + row * verticalSpacing;
    const cols = row + 1;
    const offsetX = (canvas.width - cols * horizontalSpacing) / 2 + horizontalSpacing / 2;

    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * horizontalSpacing;
      pegs.push({ x, y, radius: pegRadius });
    }
  }
}

// Draw pegs on canvas
function drawPegs() {
  ctx.fillStyle = "#0cf";
  pegs.forEach(peg => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw payout slots at bottom
function drawSlots() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  for (let i = 0; i < slotCount; i++) {
    const x = i * slotWidth;
    ctx.strokeStyle = "#0cf";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, canvas.height - 50, slotWidth, 50);

    ctx.fillStyle = "#0cf";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`$${slots[i]}`, x + slotWidth / 2, canvas.height - 20);
  }
}

// Draw ball
function drawBall() {
  if (!ball) return;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff4136";
  ctx.shadowColor = "#ff4136";
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
}

// Check collision between ball and pegs
function checkCollision() {
  for (const peg of pegs) {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ballRadius + peg.radius) {
      // Simple collision response: push ball horizontally away
      if (dx !== 0) {
        ball.vx = dx > 0 ? Math.abs(ball.vx) : -Math.abs(ball.vx);
      } else {
        ball.vx = (Math.random() - 0.5) * 2;
      }
      ball.vy = -ball.vy * 0.5; // bounce up a bit
    }
  }
}

// Animate the ball falling
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPegs();
  drawSlots();
  drawBall();

  if (ball) {
    ball.vy += gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce left/right walls
    if (ball.x < ballRadius) {
      ball.x = ballRadius;
      ball.vx = -ball.vx * 0.7;
    } else if (ball.x > canvas.width - ballRadius) {
      ball.x = canvas.width - ballRadius;
      ball.vx = -ball.vx * 0.7;
    }

    checkCollision();

    // When ball reaches bottom (slots)
    if (ball.y + ballRadius >= canvas.height - 50) {
      ball.y = canvas.height - 50 - ballRadius;

      // Determine which slot the ball landed in
      const slotIndex = Math.min(
        slotCount - 1,
        Math.floor(ball.x / slotWidth)
      );
      const reward = slots[slotIndex];

      balance += reward;
      balanceDisplay.textContent = balance;

      alert(`Ball landed in slot ${slotIndex + 1} → +$${reward}`);

      ball = null; // Reset ball to allow next drop
      dropBtn.disabled = false;
      return; // stop animation loop
    }
  }

  requestAnimationFrame(animate);
}

// Drop the ball from top center
function dropBall() {
  if (ball) return; // Only one ball at a time
  ball = {
    x: canvas.width / 2,
    y: 20,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
  };
  dropBtn.disabled = true;
  animate();
}

dropBtn.addEventListener("click", dropBall);

createPegs();
drawPegs();
drawSlots();
