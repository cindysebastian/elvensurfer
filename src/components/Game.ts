import { Player } from './player.js';
import { GameController } from './GameController.js';
import { WebcamController } from './Webcam/WebcamController.js';

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
    webcamController: WebcamController;
    gameStarted: boolean; // To track if the game has started
    startPromptElement: HTMLElement;
    isActive: boolean;
    gameOverElement: HTMLElement;
    HUD: HTMLElement;

    constructor(gameCanvas: HTMLCanvasElement, webcamCanvas: HTMLCanvasElement, gameController: GameController, webcamController: WebcamController) {
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d')!;
        this.webcamCanvas = webcamCanvas;
        this.hudCtx = webcamCanvas.getContext('2d')!;
        this.gameCanvas.width = window.innerWidth; // Set the width to the window's inner width
        this.gameCanvas.height = window.innerHeight * 0.75; // Set height to 75% of the window's inner height
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
        this.webcamController = webcamController;
        this.gameStarted = false; // Game has not started
        this.startPromptElement = document.getElementById('pausePrompt')!; // Assuming you have an element in HTML
        this.startPromptElement.style.display = 'none'; // Initially hide the prompt
        this.isActive = false;    
        this.gameOverElement = document.getElementById('game-over-overlay')!;
        this.HUD = document.getElementById('hud')!;
    }



    createObstacle() {
        if (!this.isActive) return; // Do not create obstacles if the game is not active

        const testWidth = this.gameCanvas.width * 0.1;
        const testHeight = this.gameCanvas.height * 0.1;

        let width: number;
        let height: number;

        if (testHeight < testWidth) {
            width = testWidth;
            height = width; // Setting height equal to width in this case
        } else {
            height = testHeight;
            width = height; // Setting width equal to height in this case
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
                
                // Display the game over overlay
                const finalScore = document.getElementById('final-score');
                if (this.gameOverElement && finalScore) {
                    finalScore.textContent = "Final Score: " + this.score; // Update the score display
                    this.gameOverElement.style.display = 'block'; // Make the overlay visible
                }
    
                this.isActive = false;
            }
        });
    }
    

    drawScore() {
        const scoreElement = document.getElementById('score')!;
        scoreElement.textContent = 'Score: ' + this.score;
    }

    pauseGame() {
        this.isActive = false; // Set game as inactive
        this.showPausePrompt(); // Show prompt to hold W key to start again
    }

    resetGame() {
        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame(); // Call reset on GameController
        this.gameOverElement.style.display = 'none';
        this.isGameOver = false;
        this.HUD.style.display = 'none';
        this.hidePausePrompt();
    }

    showPausePrompt() {
        this.startPromptElement.style.display = 'block'; // Show the prompt
    }

    hidePausePrompt() {
        this.startPromptElement.style.display = 'none'; // Hide the prompt
    }
   

    start() {
        this.frameCount = 0; // Reset frame count
        this.isActive = true; // Set game as active
        this.HUD.style.display = 'flex';
        this.hidePausePrompt();
    }
}
