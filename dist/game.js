"use strict";
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Failed to get 2D context');
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Define the lanes
var laneWidth = canvas.width / 3; // Divide the canvas into 3 equal lanes
var lanes = [
    laneWidth * 0.5,
    laneWidth * 1.5,
    laneWidth * 2.5 // Center of the third lane
];
// Load Sprites
var playerSprite = new Image();
playerSprite.src = '../assets/legolas.png'; // Replace with the path to your player sprite
var obstacleSprite = new Image();
obstacleSprite.src = '../assets/orc.png'; // Replace with the path to your obstacle sprite
// Fallback flags
var playerSpriteLoaded = false;
var obstacleSpriteLoaded = false;
// Player settings
var player = {
    laneIndex: 1,
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
var obstacles = [];
var frameCount = 0;
var obstacleFrequency = 120;
// Score counter
var score = 0;
// Draw player
function drawPlayer() {
    var playerX = lanes[player.laneIndex] - player.width / 2; // Calculate X based on the current lane
    if (ctx) {
        if (playerSpriteLoaded) {
            ctx.drawImage(playerSprite, playerX, player.y, player.width, player.height);
        }
        else {
            // Draw the player rectangle as a backup
            ctx.fillStyle = player.color;
            ctx.fillRect(playerX, player.y, player.width, player.height);
        }
    }
}
// Create obstacle
function createObstacle() {
    var width = 30;
    var height = 30;
    var laneIndex = Math.floor(Math.random() * 3); // Random lane (0, 1, or 2)
    var x = lanes[laneIndex] - width / 2; // Place obstacle in the center of the selected lane
    var y = 0 - height; // Start above the screen
    obstacles.push({ x: x, y: y, width: width, height: height, laneIndex: laneIndex });
}
// Draw obstacles
function drawObstacles() {
    obstacles.forEach(function (obstacle) {
        var obstacleX = obstacle.x;
        var obstacleY = obstacle.y;
        if (ctx) {
            if (obstacleSpriteLoaded) {
                ctx.drawImage(obstacleSprite, obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            else {
                // Draw the obstacle rectangle as a backup
                ctx.fillStyle = 'red';
                ctx.fillRect(obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            obstacle.y += 5; // Move the obstacle down
            // Check if the obstacle is below the bottom of the canvas
            if (obstacle.y > canvas.height) {
                obstacles.shift(); // Remove the obstacle
                score++; // Increment score when passing an obstacle
            }
        }
    });
}
// Handle player movement
function handlePlayerMovement() {
    player.y += player.dy;
    player.dy += player.gravity;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.dy = 0;
    }
}
// Jump function
function jump() {
    if (!player.isJumping) {
        player.dy = player.jumpStrength;
        player.isJumping = true;
    }
}
// Move player left
function moveLeft() {
    if (player.laneIndex > 0) {
        player.laneIndex--; // Move to the left lane
    }
}
// Move player right
function moveRight() {
    if (player.laneIndex < 2) {
        player.laneIndex++; // Move to the right lane
    }
}
// Detect collision
function detectCollision() {
    var playerX = lanes[player.laneIndex] - player.width / 2;
    obstacles.forEach(function (obstacle) {
        // Only detect collision when the player is NOT jumping
        if (!player.isJumping) {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                alert("Game Over! Final Score: " + score);
                resetGame();
            }
        }
    });
}
// Reset game
function resetGame() {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.laneIndex = 1; // Reset to the middle lane
    obstacles = [];
    frameCount = 0;
    score = 0; // Reset score
}
// Draw score
function drawScore() {
    if (ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 20); // Display score in the top-left corner
    }
}
// Game loop
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
        drawScore(); // Draw the score
        requestAnimationFrame(gameLoop);
    }
}
// Add event listener for lane switching and jumping
window.addEventListener('keydown', function (e) {
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
playerSprite.onload = function () {
    playerSpriteLoaded = true;
};
playerSprite.onerror = function () {
    console.error('Failed to load player sprite. Using backup rectangle.');
};
obstacleSprite.onload = function () {
    obstacleSpriteLoaded = true;
};
obstacleSprite.onerror = function () {
    console.error('Failed to load obstacle sprite. Using backup rectangle.');
};
// Start the game loop
gameLoop();
