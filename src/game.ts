const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Failed to get 2D context');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: 'blue',
    dy: 0,
    gravity: 0.5,
    jumpStrength: -20,
    isJumping: false,
};

let obstacles: any[] = [];
let frameCount = 0;
const obstacleFrequency = 120;

function drawPlayer() {
    if (ctx) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function createObstacle() {
    const height = Math.random() * 100 + 50;
    const width = 30;
    const x = canvas.width;
    const y = canvas.height - height;

    obstacles.push({ x, y, width, height, color: 'red' });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (ctx) {

            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            obstacle.x -= 5;

            // Remove obstacles off screen
            if (obstacle.x + obstacle.width < 0) {
                obstacles.shift();
            }
        }
    });
}

function handlePlayerMovement() {
    player.y += player.dy;
    player.dy += player.gravity;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.dy = 0;
    }
}

function jump() {
    if (!player.isJumping) {
        player.dy = player.jumpStrength;
        player.isJumping = true;
    }
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            alert("Game Over!");
            resetGame();
        }
    });
}

function resetGame() {
    player.y = canvas.height - player.height;
    player.dy = 0;
    obstacles = [];
    frameCount = 0;
}

function gameLoop() {
    if (ctx) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        handlePlayerMovement();
        detectCollision();

        frameCount++;
        if (frameCount % obstacleFrequency === 0) {
            createObstacle();
        }
        drawObstacles();

        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

gameLoop();
