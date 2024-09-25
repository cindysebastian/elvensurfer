"use strict";
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Failed to get 2D context');
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var player = {
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
var obstacles = [];
var frameCount = 0;
var obstacleFrequency = 120;
function drawPlayer() {
    if (ctx) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}
function createObstacle() {
    var height = Math.random() * 100 + 50;
    var width = 30;
    var x = canvas.width;
    var y = canvas.height - height;
    obstacles.push({ x: x, y: y, width: width, height: height, color: 'red' });
}
function drawObstacles() {
    obstacles.forEach(function (obstacle) {
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
    obstacles.forEach(function (obstacle) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
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
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        jump();
    }
});
gameLoop();
