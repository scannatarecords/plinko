const canvas = document.getElementById("plinkoCanvas");
const ctx = canvas.getContext("2d");

let balance = 0;
document.getElementById("balance").innerText = balance;

const slots = [10, 20, 50, 100, 50, 20, 10];
const slotWidth = canvas.width / slots.length;

function dropBall() {
  let x = canvas.width / 2;
  let y = 0;
  let dx = (Math.random() - 0.5) * 4;
  let dy = 2;

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlots();

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    x += dx;
    y += dy;

    if (y >= canvas.height - 10) {
      clearInterval(interval);
      const slotIndex = Math.floor(x / slotWidth);
      const reward = slots[slotIndex] || 0;
      balance += reward;
      document.getElementById("balance").innerText = balance;
      alert(`Ball landed in slot ${slotIndex + 1} → +$${reward}`);
    }
  }, 16);
}

function drawSlots() {
  for (let i = 0; i < slots.length; i++) {
    ctx.fillStyle = "#ddd";
    ctx.fillRect(i * slotWidth, canvas.height - 30, slotWidth, 30);
    ctx.fillStyle = "#000";
    ctx.fillText(`$${slots[i]}`, i * slotWidth + 10, canvas.height - 10);
  }
}
