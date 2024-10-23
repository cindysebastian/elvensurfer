// main game file (e.g., game.ts)
import { PlayerController } from './components/player.js';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const gameCtx = gameCanvas.getContext('2d');

const hudCanvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;
const hudCtx = hudCanvas.getContext('2d');

if (!gameCtx || !hudCtx) {
    throw new Error('Failed to get 2D context');
}

// Function to resize the game canvas based on the bottom stripe height
function resizeCanvases() {
    const bottomStripe = document.getElementById('HUD') as HTMLDivElement; // Get the bottom stripe element
    const bottomStripeHeight = bottomStripe.getBoundingClientRect().height; // Get its height
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
const laneWidth = gameCanvas.width / 3; // Divide the canvas into 3 equal lanes
const lanes = [
    laneWidth * 0.5,  // Center of the first lane
    laneWidth * 1.5,  // Center of the second lane
    laneWidth * 2.5   // Center of the third lane
];

// Load Sprites
const playerSprite = new Image();
playerSprite.src = '../assets/legolas.png'; // Replace with the path to your player sprite

const obstacleSprite = new Image();
obstacleSprite.src = '../assets/orc.png'; // Replace with the path to your obstacle sprite

// Fallback flags
let playerSpriteLoaded = false;
let obstacleSpriteLoaded = false;

// Instantiate PlayerController
const playerController = new PlayerController(lanes);

// Obstacles settings
let obstacles: { x: number; y: number; width: number; height: number; laneIndex: number; }[] = [];
let frameCount = 0;
const obstacleFrequency = 120;

// Score counter
let score = 0;

// Draw player
function drawPlayer() {
    if(gameCtx){
    playerController.draw(gameCtx, playerSpriteLoaded ? playerSprite : null, playerSpriteLoaded);
    }
}

// Create obstacle
function createObstacle() {
    const width = 30;
    const height = 30;
    const laneIndex = Math.floor(Math.random() * 3);  // Random lane (0, 1, or 2)
    const x = lanes[laneIndex] - width / 2;  // Place obstacle in the center of the selected lane
    const y = 0 - height;  // Start above the screen

    obstacles.push({ x, y, width, height, laneIndex });
}

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        const obstacleX = obstacle.x;
        const obstacleY = obstacle.y;
        if (gameCtx) {
            if (obstacleSpriteLoaded) {
                gameCtx.drawImage(obstacleSprite, obstacleX, obstacleY, obstacle.width, obstacle.height);
            } else {
                // Draw the obstacle rectangle as a backup
                gameCtx.fillStyle = 'red';
                gameCtx.fillRect(obstacleX, obstacleY, obstacle.width, obstacle.height);
            }
            obstacle.y += 5;  // Move the obstacle down

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
    playerController.handleMovement();
}

// Jump function
function jump() {
    playerController.jump();
}

// Move player left
function moveLeft() {
    playerController.moveLeft();
}

// Move player right
function moveRight() {
    playerController.moveRight();
}

// Detect collision
function detectCollision() {
    const player = playerController.getPlayer();
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
                alert("Game Over! Final Score: " + score);
                resetGame();
            }
        }
    });
}

// Reset game
function resetGame() {
    playerController.reset();
    obstacles = [];
    frameCount = 0;
    score = 0; // Reset score
}

// Draw score
function drawScore() {
    const scoreElement = document.getElementById('score')!;
    scoreElement.textContent = 'Score: ' + score; // Update the score text dynamically
}

// Capture movement from the webcam feed
async function captureMovement(video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const width = canvas.width;
    const height = canvas.height;

    if (width <= 0 || height <= 0) {
        console.error('Invalid canvas dimensions');
        return;
    }

    try {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);

        // Process imageData for movement detection
        // Implement movement logic based on image processing here

    } catch (error) {
        console.error('Error during captureMovement:', error);
    }
}

// Take a snapshot and update the HUD canvas
function updateSnapshot(video: HTMLVideoElement) {
    const width = hudCanvas.width;
    const height = hudCanvas.height;

    if (hudCtx) {
        // Resize canvas to the webcam dimensions if needed
        hudCtx.drawImage(video, 0, 0, width, height);
    }
}

// Set up the webcam feed
async function setupWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam') as HTMLVideoElement;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            const canvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas to match video dimensions
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Capture and update snapshot in the here specified interval
                setInterval(() => updateSnapshot(video), 1000);
            }
        };
    } catch (error) {
        console.error('Webcam setup error:', error);
    }
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

// Add event listener for lane switching and jumping via Keyboard
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

// Start the game loop and webcam setup
gameLoop();
setupWebcam();
