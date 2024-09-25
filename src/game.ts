const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Failed to get 2D context');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the lanes
const laneWidth = canvas.width / 3; // Divide the canvas into 3 equal lanes
const lanes = [
    laneWidth * 0.5,  // Center of the first lane
    laneWidth * 1.5,  // Center of the second lane
    laneWidth * 2.5   // Center of the third lane
];

// Use relative paths correctly
const playerSprite = new Image();
playerSprite.src = '../assets/legolas.png';

const obstacleSprite = new Image();
obstacleSprite.src = '../assets/orc.png';

// Fallback flags
let playerSpriteLoaded = false;
let obstacleSpriteLoaded = false;

// Player settings
let player = {
    laneIndex: 1,  // Start in the middle lane
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: 'blue',
    dy: 0,
    gravity: 1.5,
    jumpStrength: -20,
    isJumping: false,
};

// Obstacles settings
let obstacles: any[] = [];
let frameCount = 0;
const obstacleFrequency = 120;

function drawPlayer() {
    const playerX = lanes[player.laneIndex] - player.width / 2;  // Calculate X based on the current lane
    if (ctx) {
        if (playerSpriteLoaded) {
            ctx.drawImage(playerSprite, playerX, player.y, player.width, player.height);
        } else {
            // Draw the player rectangle as a backup
            ctx.fillStyle = player.color;
            ctx.fillRect(playerX, player.y, player.width, player.height);
        }
    }
}

function createObstacle() {
    const width = 30;
    const height = 30;
    const laneIndex = Math.floor(Math.random() * 3);  // Random lane (0, 1, or 2)
    const x = lanes[laneIndex] - width / 2;  // Place obstacle in the center of the selected lane
    const y = 0 - height;  // Start above the screen

    obstacles.push({ x, y, width, height, laneIndex });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        const obstacleX = obstacle.x;
        const obstacleY = obstacle.y;
        if (ctx) {
            if (obstacleSpriteLoaded) {
                ctx.drawImage(obstacleSprite, obstacleX, obstacleY, obstacle.width, obstacle.height);
            } else {
                // Draw the obstacle rectangle as a backup
                ctx.fillStyle = 'red';
                ctx.fillRect(obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            obstacle.y += 5;  // Move the obstacle down

            // Remove obstacles that fall off the bottom of the screen
            if (obstacle.y > canvas.height) {
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

function moveLeft() {
    if (player.laneIndex > 0) {
        player.laneIndex--;  // Move to the left lane
    }
}

function moveRight() {
    if (player.laneIndex < 2) {
        player.laneIndex++;  // Move to the right lane
    }
}

function detectCollision() {
    const playerX = lanes[player.laneIndex] - player.width / 2;

    obstacles.forEach(obstacle => {
        // Only detect collision when the player is NOT jumping
        if (!player.isJumping) {
            if (
                playerX < obstacle.x + obstacle.width &&
                playerX + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                alert("Game Over!");
                resetGame();
            }
        }
    });
}

function resetGame() {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.laneIndex = 1;  // Reset to the middle lane
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

// Add event listener for lane switching and jumping
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        moveLeft();
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        moveRight();
    }
});

// Start the game once the sprites are loaded
playerSprite.onload = () => {
    playerSpriteLoaded = true;
};

playerSprite.onerror = () => {
    console.error('Failed to load player sprite. Using backup rectangle.');
};

obstacleSprite.onload = () => {
    obstacleSpriteLoaded = true;
};

obstacleSprite.onerror = () => {
    console.error('Failed to load obstacle sprite. Using backup rectangle.');
};

// Start the game loop
gameLoop();
