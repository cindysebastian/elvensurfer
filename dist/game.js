"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var gameCanvas = document.getElementById('gameCanvas');
var gameCtx = gameCanvas.getContext('2d');
var hudCanvas = document.getElementById('webcamCanvas');
var hudCtx = hudCanvas.getContext('2d');
if (!gameCtx || !hudCtx) {
    throw new Error('Failed to get 2D context');
}
// Function to resize the game canvas based on the bottom stripe height
function resizeCanvases() {
    var bottomStripe = document.getElementById('HUD'); // Get the bottom stripe element
    var bottomStripeHeight = bottomStripe.getBoundingClientRect().height; // Get its height
    gameCanvas.width = window.innerWidth; // Set the game canvas width to match the window width
    gameCanvas.height = window.innerHeight - bottomStripeHeight; // Set the game canvas height dynamically
    hudCanvas.width = window.innerWidth; // Set the HUD canvas width to match the window width
    hudCanvas.height = bottomStripeHeight; // Set the HUD canvas height
}
// Initial canvas setup
resizeCanvases();
// Add event listener for resizing
window.addEventListener('resize', resizeCanvases);
// Define the lanes
var laneWidth = gameCanvas.width / 3; // Divide the canvas into 3 equal lanes
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
    y: gameCanvas.height,
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
    if (gameCtx) {
        if (playerSpriteLoaded) {
            gameCtx.drawImage(playerSprite, playerX, player.y, player.width, player.height);
        }
        else {
            // Draw the player rectangle as a backup
            gameCtx.fillStyle = player.color;
            gameCtx.fillRect(playerX, player.y, player.width, player.height);
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
        if (gameCtx) {
            if (obstacleSpriteLoaded) {
                gameCtx.drawImage(obstacleSprite, obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            else {
                // Draw the obstacle rectangle as a backup
                gameCtx.fillStyle = 'red';
                gameCtx.fillRect(obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            obstacle.y += 5; // Move the obstacle down
            // Check if the obstacle is below the bottom of the canvas
            if (obstacle.y > gameCanvas.height) {
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
    if (player.y + player.height > gameCanvas.height) {
        player.y = gameCanvas.height - player.height;
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
    player.y = gameCanvas.height - player.height;
    player.dy = 0;
    player.laneIndex = 1; // Reset to the middle lane
    obstacles = [];
    frameCount = 0;
    score = 0; // Reset score
}
// Draw score
function drawScore() {
    var scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Score: ' + score; // Update the score text dynamically
}
// Capture movement from the webcam feed
function captureMovement(video, canvas, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var width, height, imageData;
        return __generator(this, function (_a) {
            width = canvas.width;
            height = canvas.height;
            if (width <= 0 || height <= 0) {
                console.error('Invalid canvas dimensions');
                return [2 /*return*/];
            }
            try {
                ctx.drawImage(video, 0, 0, width, height);
                imageData = ctx.getImageData(0, 0, width, height);
                // Process imageData for movement detection
                // Implement movement logic based on image processing here
            }
            catch (error) {
                console.error('Error during captureMovement:', error);
            }
            return [2 /*return*/];
        });
    });
}
// Take a snapshot and update the HUD canvas
function updateSnapshot(video) {
    var width = hudCanvas.width;
    var height = hudCanvas.height;
    if (hudCtx) {
        // Resize canvas to the webcam dimensions if needed
        hudCtx.drawImage(video, 0, 0, width, height);
    }
}
// Set up the webcam feed
function setupWebcam() {
    return __awaiter(this, void 0, void 0, function () {
        var stream, video_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true })];
                case 1:
                    stream = _a.sent();
                    video_1 = document.getElementById('webcam');
                    video_1.srcObject = stream;
                    video_1.onloadedmetadata = function () {
                        var canvas = document.getElementById('webcamCanvas');
                        var ctx = canvas.getContext('2d');
                        if (ctx) {
                            // Set canvas to match video dimensions
                            canvas.width = video_1.videoWidth;
                            canvas.height = video_1.videoHeight;
                            // Capture and update snapshot every 5 seconds
                            setInterval(function () { return updateSnapshot(video_1); }, 5000);
                        }
                    };
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Webcam setup error:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Game loop
function gameLoop() {
    if (gameCtx) {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawPlayer();
        handlePlayerMovement();
        detectCollision();
        frameCount++;
        if (frameCount % obstacleFrequency === 0) {
            createObstacle();
        }
        drawObstacles();
    }
    drawScore(); // Draw the score on HUD canvas
    requestAnimationFrame(gameLoop);
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
// Start the game loop and webcam setup
gameLoop();
setupWebcam();
