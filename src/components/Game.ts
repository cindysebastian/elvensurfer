import { Player } from './player.js';
import { GameController } from './GameController.js';

export class Game {
    gameCanvas: HTMLCanvasElement;
    gameCtx: CanvasRenderingContext2D;
    webcamCanvas: HTMLCanvasElement;
    hudCtx: CanvasRenderingContext2D;
    player: Player;
    obstacles: { x: number; y: number; width: number; height: number; laneIndex: number; }[];
    frameCount: number;
    score: number;
    laneWidth: number;
    lanes: number[];
    isGameOver: boolean; // Add game state property
    gameController: GameController; // Add a reference to GameController
    countdown: number; // Countdown variable
    countdownInterval: NodeJS.Timeout | null; // Timer for the countdown
    gameStarted: boolean; // To track if the game has started

    constructor(gameCanvas: HTMLCanvasElement, webcamCanvas: HTMLCanvasElement, gameController: GameController) {
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d')!;
        this.webcamCanvas = webcamCanvas;
        this.hudCtx = webcamCanvas.getContext('2d')!;
        this.gameCanvas.width = window.innerWidth; // Set the width to the window's inner width
        this.gameCanvas.height = window.innerHeight * 0.75; // Set height to 75% of the window's inner height
        console.log(this.gameCanvas.width);
        console.log(this.gameCanvas.height);

        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
        this.laneWidth = this.gameCanvas.width / 3;
        this.lanes = [
            this.laneWidth * 0.5,
            this.laneWidth * 1.5,
            this.laneWidth * 2.5
        ];
        this.isGameOver = false; // Initialize game state
        this.gameController = gameController; // Set the GameController instance
        this.countdown = 3; // Initialize countdown
        this.countdownInterval = null; // No countdown interval set
        this.gameStarted = false; // Game has not started
    }

    createObstacle() {
        const testWidth = this.gameCanvas.width * 0.1;
        const testHeight = this.gameCanvas.height * 0.1;

        let width: number;
        let height: number;

        if (testHeight < testWidth) {
            width = testWidth;
            height = width;
        } else {
            height = testHeight;
            width = height;
        }

        const laneIndex = Math.floor(Math.random() * 3);
        const x = this.lanes[laneIndex] - width / 2;
        const y = -height;
        this.obstacles.push({ x, y, width, height, laneIndex });
    }

    drawPlayer(playerSprite: HTMLImageElement, playerSpriteLoaded: boolean) {
        const playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        if (playerSpriteLoaded) {
            this.gameCtx.drawImage(playerSprite, playerX, this.player.y, this.player.width, this.player.height);
        } else {
            this.gameCtx.fillStyle = this.player.color;
            this.gameCtx.fillRect(playerX, this.player.y, this.player.width, this.player.height);
        }
    }

    drawObstacles(obstacleSprite: HTMLImageElement, obstacleSpriteLoaded: boolean) {
        const obstacleSpeed = 8; // Speed of the obstacles
    
        this.obstacles.forEach(obstacle => {
            if (obstacleSpriteLoaded) {
                this.gameCtx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else {
                this.gameCtx.fillStyle = 'red';
                this.gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
    
            obstacle.y += obstacleSpeed; // Move obstacles down
    
            if (obstacle.y > this.gameCanvas.height) {
                this.obstacles.shift();
                this.score++;
            }
        });
    }

    detectCollision() {
        if (this.isGameOver) return; // Prevent collision detection if game is over
        const playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        this.obstacles.forEach(obstacle => {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y) {
                this.isGameOver = true; // Set game state to over
                alert("Game Over! Final Score: " + this.score);
                this.resetGame();
            }
        });
    }

    drawScore() {
        const scoreElement = document.getElementById('score')!;
        scoreElement.textContent = 'Score: ' + this.score;
    }

    resetGame() {
        this.isGameOver = false; // Reset game state
        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame(); // Call reset on GameController
    }

    startCountdown() {
        if (!this.gameStarted) {
            this.countdownInterval = setInterval(() => {
                if (this.countdown > 0) {
                    console.log(`Countdown: ${this.countdown}`); // Display the countdown in the console
                    this.countdown--;
                } else {
                    clearInterval(this.countdownInterval!);
                    this.gameStarted = true; // Mark game as started
                    this.start(); // Start the game (you may need to implement this method)
                }
            }, 1000);
        }
    }

    start() {
        // Implement any logic you need to initiate the game loop here
        this.isGameOver = false; // Ensure the game is not over
        this.frameCount = 0; // Reset frame count
        this.score = 0; // Reset score
        this.obstacles = []; // Clear existing obstacles
        // Any other initial setup for starting the game can be done here
    }
}
