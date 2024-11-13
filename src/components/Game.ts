import { Player } from './player.js';
import { GameController } from './GameController.js';
import { WebcamController } from './Webcam/WebcamController.js';

export class Game {
    gameCanvas: HTMLCanvasElement;
    gameCtx: CanvasRenderingContext2D;
    webcamCanvas: HTMLCanvasElement;
    hudCtx: CanvasRenderingContext2D;
    player: Player;
    obstacles: { element: HTMLImageElement; x: number; y: number; width: number; height: number; laneIndex: number; }[];
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
    startCountDownActive: boolean = false;
    obstacleContainer: HTMLElement;
    obstacleImagePath: string = '../assets/orc.gif'; // Path to the animated GIF

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
        this.obstacleContainer = document.getElementById('obstacle-container')!;
    }

    createObstacle() {
        if (!this.isActive) return;
    
        const width = this.gameCanvas.width * 0.15;
        const height = width; // Square obstacles
    
        const laneIndex = Math.floor(Math.random() * 3);
        const x = this.lanes[laneIndex] - width / 2;
        const y = -height;
    
        // Create a new img element for each obstacle
        const obstacleImg = document.createElement('img');
        obstacleImg.src = this.obstacleImagePath;
        obstacleImg.classList.add('obstacle');
        obstacleImg.style.width = `${width}px`;
        obstacleImg.style.height = `${height}px`;
        obstacleImg.style.position = 'absolute';
        obstacleImg.style.left = `${x}px`;
        obstacleImg.style.top = `${y}px`;
    
        // Append the img element to the obstacle container
        this.obstacleContainer.appendChild(obstacleImg);
    
        // Add the obstacle to the array for tracking
        this.obstacles.push({ element: obstacleImg, x, y, width, height, laneIndex });
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

    drawObstacles() {
        const obstacleSpeed = 4; // Speed of obstacles
    
        this.obstacles.forEach((obstacle, index) => {
            obstacle.y += obstacleSpeed;
            obstacle.element.style.top = `${obstacle.y}px`;
    
            // Remove obstacles that move off the screen
            if (obstacle.y > this.gameCanvas.height) {
                this.obstacleContainer.removeChild(obstacle.element);
                this.obstacles.splice(index, 1); // Remove from array
                this.score++;
            }
        });
    }
    
    detectCollision() {
        if (this.isGameOver) return;
        const playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
    
        this.obstacles.forEach(obstacle => {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y) {
    
                this.isGameOver = true;
                this.isActive = false;
    
                // Retrieve the current high score from local storage
                const storedHighScore = localStorage.getItem('highScore');
                const highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    
                // Update high score if current score is higher
                if (this.score > highScore) {
                    localStorage.setItem('highScore', this.score.toString());
    
                    // Update the game over overlay with the new high score
                    const highScoreDisplay = document.getElementById('high-score-display');
                    if (highScoreDisplay) {
                        highScoreDisplay.textContent = `${this.score}`;
                    }
                    const highScoreHud = document.getElementById(`high-score-hud`);
                    if (highScoreHud) {
                        highScoreHud.textContent = `High Score: ${this.score}`;
                    }
                }
    
                // Display the game over overlay with the final score
                const finalScore = document.getElementById('final-score');
                if (this.gameOverElement && finalScore) {
                    finalScore.textContent = "Final Score: " + this.score;
                    this.gameOverElement.style.display = 'block';
                }
            }
        });
    }

    drawScore() {
        const scoreElement = document.getElementById('score')!;
        scoreElement.textContent = 'Score: ' + this.score;
    }

    resetGame() {
        this.player = new Player(this.gameCanvas.height);
        this.clearObstacles(); // Clear obstacles upon reset
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame();
        this.gameOverElement.style.display = 'none';
        this.isGameOver = false;
        this.HUD.style.display = 'none';
    }
    

    // Add this method in the Game class
    startGameCountdown() {
        if (this.startCountDownActive) return;
    
        this.startCountDownActive = true;
        const countdownElement = document.getElementById('countdown')!;  // Assuming you have a countdown element
        const initScreen = document.getElementById('initial-screen');
    
        let countdown = 3;
        let isResetting = this.isGameOver;  // If the game is over, we'll reset; otherwise, we'll start
    
        countdownElement.textContent = `Starting in ${countdown} seconds...`;
    
        const countdownInterval = setInterval(() => {
            // Check if both middleLeft and middleRight regions are triggered
            const middleLeftActive = this.webcamController.regionStatus.middleLeft;
            const middleRightActive = this.webcamController.regionStatus.middleRight;
    
            if (middleLeftActive && middleRightActive) {
                // If both regions are active, proceed with the countdown
                countdownElement.style.display = 'block';
                countdownElement.textContent = `Starting in ${countdown} seconds...`;
    
                if (countdown > 0) {
                    countdown--;
                } else {
                    // Countdown finished, start or reset the game
                    clearInterval(countdownInterval);
                    if (isResetting) {
                        this.resetGame();  // Reset the game if it was over
                        if (initScreen) {
                            initScreen.style.display = 'flex';
                        }
                    } else {
                        this.start();  // Start the game if it's not over
                        if (initScreen) {
                            initScreen.style.display = 'none';
                        }
                    }
                    countdownElement.style.display = 'none';
                    this.startCountDownActive = false;
                }
            } else {
                // If the player moves out of position, reset countdown and wait until they return to position
                countdown = 3;
                countdownElement.textContent = `Hold position to start: ${countdown} seconds...`;
            }
        }, 1000);
    }
    

    start() {
        this.frameCount = 0; // Reset frame count
        this.isActive = true; // Set game as active
        this.HUD.style.display = 'flex';
    }

    clearObstacles() {
        // Remove each obstacle element from the DOM
        this.obstacles.forEach(obstacle => {
            this.obstacleContainer.removeChild(obstacle.element);
        });
    
        // Clear the obstacles array
        this.obstacles = [];
    }
    
}
