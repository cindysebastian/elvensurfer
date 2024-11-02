import { Player } from './player.js';
var Game = /** @class */ (function () {
    function Game(gameCanvas, webcamCanvas, gameController) {
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d');
        this.webcamCanvas = webcamCanvas;
        this.hudCtx = webcamCanvas.getContext('2d');
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
        this.gameStarted = false; // Game has not started
        this.startPromptElement = document.getElementById('pausePrompt'); // Assuming you have an element in HTML
        this.startPromptElement.style.display = 'none'; // Initially hide the prompt
        this.isActive = false;
        this.gameOverElement = document.getElementById('game-over-overlay');
    }
    Game.prototype.createObstacle = function () {
        if (!this.isActive)
            return; // Do not create obstacles if the game is not active
        var testWidth = this.gameCanvas.width * 0.1;
        var testHeight = this.gameCanvas.height * 0.1;
        var width;
        var height;
        if (testHeight < testWidth) {
            width = testWidth;
            height = width; // Setting height equal to width in this case
        }
        else {
            height = testHeight;
            width = height; // Setting width equal to height in this case
        }
        var laneIndex = Math.floor(Math.random() * 3);
        var x = this.lanes[laneIndex] - width / 2;
        var y = -height;
        this.obstacles.push({ x: x, y: y, width: width, height: height, laneIndex: laneIndex });
    };
    Game.prototype.drawPlayer = function (playerSprite, playerSpriteLoaded) {
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        if (playerSpriteLoaded) {
            this.gameCtx.drawImage(playerSprite, playerX, this.player.y, this.player.width, this.player.height);
        }
        else {
            this.gameCtx.fillStyle = this.player.color;
            this.gameCtx.fillRect(playerX, this.player.y, this.player.width, this.player.height);
        }
    };
    Game.prototype.drawObstacles = function (obstacleSprite, obstacleSpriteLoaded) {
        var _this = this;
        var obstacleSpeed = 8; // Speed of the obstacles
        this.obstacles.forEach(function (obstacle) {
            if (obstacleSpriteLoaded) {
                _this.gameCtx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            else {
                _this.gameCtx.fillStyle = 'red';
                _this.gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            obstacle.y += obstacleSpeed; // Move obstacles down
            if (obstacle.y > _this.gameCanvas.height) {
                _this.obstacles.shift();
                _this.score++;
            }
        });
    };
    Game.prototype.detectCollision = function () {
        var _this = this;
        if (this.isGameOver)
            return; // Prevent collision detection if game is over
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        this.obstacles.forEach(function (obstacle) {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + _this.player.width > obstacle.x &&
                _this.player.y < obstacle.y + obstacle.height &&
                _this.player.y + _this.player.height > obstacle.y) {
                _this.isGameOver = true; // Set game state to over
                // Display the game over overlay
                var finalScore = document.getElementById('final-score');
                if (_this.gameOverElement && finalScore) {
                    finalScore.textContent = "Final Score: " + _this.score; // Update the score display
                    _this.gameOverElement.style.display = 'block'; // Make the overlay visible
                }
                _this.isActive = false;
            }
        });
    };
    Game.prototype.drawScore = function () {
        var scoreElement = document.getElementById('score');
        scoreElement.textContent = 'Score: ' + this.score;
    };
    Game.prototype.pauseGame = function () {
        this.isActive = false; // Set game as inactive
        this.showPausePrompt(); // Show prompt to hold W key to start again
    };
    Game.prototype.resetGame = function () {
        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame(); // Call reset on GameController
        this.gameOverElement.style.display = 'none';
        this.isGameOver = false;
    };
    Game.prototype.showPausePrompt = function () {
        this.startPromptElement.style.display = 'block'; // Show the prompt
    };
    Game.prototype.hidePausePrompt = function () {
        this.startPromptElement.style.display = 'none'; // Hide the prompt
    };
    Game.prototype.start = function () {
        this.frameCount = 0; // Reset frame count
        this.isActive = true; // Set game as active
    };
    return Game;
}());
export { Game };
