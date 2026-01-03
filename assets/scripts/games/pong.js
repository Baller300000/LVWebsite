const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 4,
    speedY: 4
};

const paddleWidth = 10;
const paddleHeight = 80;
const leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, speed: 0 };
const rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, speed: 4 };

let leftScore = 0;
let rightScore = 0;

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") leftPaddle.speed = -6;
    if (e.key === "ArrowDown") leftPaddle.speed = 6;
});
document.addEventListener("keyup", e => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") leftPaddle.speed = 0;
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, size = "30px") {
    ctx.fillStyle = color;
    ctx.font = `${size} monospace`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = 4;
}

function update() {
    leftPaddle.y += leftPaddle.speed;
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - paddleHeight), 0);

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    if (ball.x - ball.radius < leftPaddle.x + paddleWidth &&
        ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) {
        ball.speedX = -ball.speedX;
    }

    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight) {
        ball.speedX = -ball.speedX;
    }

    if (rightPaddle.y + paddleHeight / 2 < ball.y) {
        rightPaddle.y += rightPaddle.speed;
    } else {
        rightPaddle.y -= rightPaddle.speed;
    }
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - paddleHeight), 0);

    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    }
}

function draw() {

    drawRect(0, 0, canvas.width, canvas.height, "black");

    drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "white");
    drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "white");

    drawCircle(ball.x, ball.y, ball.radius, "white");

    drawText(leftScore, canvas.width / 4, 50, "white");
    drawText(rightScore, 3 * canvas.width / 4, 50, "white");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();