import { Player } from './player.js';
var Game = /** @class */ (function () {
    function Game(gameCanvas, webcamCanvas, gameController, webcamController) {
        this.startCountDownActive = false;
        this.obstacleImagePath = '../assets/orc.gif'; // Path to the animated GIF
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
        this.webcamController = webcamController;
        this.gameStarted = false; // Game has not started
        this.startPromptElement = document.getElementById('pausePrompt'); // Assuming you have an element in HTML
        this.startPromptElement.style.display = 'none'; // Initially hide the prompt
        this.isActive = false;
        this.gameOverElement = document.getElementById('game-over-overlay');
        this.HUD = document.getElementById('hud');
        this.obstacleContainer = document.getElementById('obstacle-container');
    }
    Game.prototype.createObstacle = function () {
        if (!this.isActive)
            return;
        var width = this.gameCanvas.width * 0.15;
        var height = width; // Square obstacles
        var laneIndex = Math.floor(Math.random() * 3);
        var x = this.lanes[laneIndex] - width / 2;
        var y = -height;
        // Create a new img element for each obstacle
        var obstacleImg = document.createElement('img');
        obstacleImg.src = this.obstacleImagePath;
        obstacleImg.classList.add('obstacle');
        obstacleImg.style.width = "".concat(width, "px");
        obstacleImg.style.height = "".concat(height, "px");
        obstacleImg.style.position = 'absolute';
        obstacleImg.style.left = "".concat(x, "px");
        obstacleImg.style.top = "".concat(y, "px");
        // Append the img element to the obstacle container
        this.obstacleContainer.appendChild(obstacleImg);
        // Add the obstacle to the array for tracking
        this.obstacles.push({ element: obstacleImg, x: x, y: y, width: width, height: height, laneIndex: laneIndex });
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
    Game.prototype.drawObstacles = function () {
        var _this = this;
        var obstacleSpeed = 4; // Speed of obstacles
        this.obstacles.forEach(function (obstacle, index) {
            obstacle.y += obstacleSpeed;
            obstacle.element.style.top = "".concat(obstacle.y, "px");
            // Remove obstacles that move off the screen
            if (obstacle.y > _this.gameCanvas.height) {
                _this.obstacleContainer.removeChild(obstacle.element);
                _this.obstacles.splice(index, 1); // Remove from array
                _this.score++;
            }
        });
    };
    Game.prototype.detectCollision = function () {
        var _this = this;
        if (this.isGameOver)
            return;
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        this.obstacles.forEach(function (obstacle) {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + _this.player.width > obstacle.x &&
                _this.player.y < obstacle.y + obstacle.height &&
                _this.player.y + _this.player.height > obstacle.y) {
                _this.isGameOver = true;
                _this.isActive = false;
                // Retrieve the current high score from local storage
                var storedHighScore = localStorage.getItem('highScore');
                var highScore = storedHighScore ? parseInt(storedHighScore) : 0;
                // Update high score if current score is higher
                if (_this.score > highScore) {
                    localStorage.setItem('highScore', _this.score.toString());
                    // Update the game over overlay with the new high score
                    var highScoreDisplay = document.getElementById('high-score-display');
                    if (highScoreDisplay) {
                        highScoreDisplay.textContent = "".concat(_this.score);
                    }
                    var highScoreHud = document.getElementById("high-score-hud");
                    if (highScoreHud) {
                        highScoreHud.textContent = "High Score: ".concat(_this.score);
                    }
                }
                // Display the game over overlay with the final score
                var finalScore = document.getElementById('final-score');
                if (_this.gameOverElement && finalScore) {
                    finalScore.textContent = "Final Score: " + _this.score;
                    _this.gameOverElement.style.display = 'block';
                }
            }
        });
    };
    Game.prototype.drawScore = function () {
        var scoreElement = document.getElementById('score');
        scoreElement.textContent = 'Score: ' + this.score;
    };
    Game.prototype.resetGame = function () {
        this.player = new Player(this.gameCanvas.height);
        this.clearObstacles(); // Clear obstacles upon reset
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame();
        this.gameOverElement.style.display = 'none';
        this.isGameOver = false;
        this.HUD.style.display = 'none';
    };
    // Add this method in the Game class
    Game.prototype.startGameCountdown = function () {
        var _this = this;
        if (this.startCountDownActive)
            return;
        this.startCountDownActive = true;
        var countdownElement = document.getElementById('countdown'); // Assuming you have a countdown element
        var initScreen = document.getElementById('initial-screen');
        var countdown = 3;
        var isResetting = this.isGameOver; // If the game is over, we'll reset; otherwise, we'll start
        countdownElement.textContent = "Starting in ".concat(countdown, " seconds...");
        var countdownInterval = setInterval(function () {
            // Check if both middleLeft and middleRight regions are triggered
            var middleLeftActive = _this.webcamController.regionStatus.middleLeft;
            var middleRightActive = _this.webcamController.regionStatus.middleRight;
            if (middleLeftActive && middleRightActive) {
                // If both regions are active, proceed with the countdown
                countdownElement.style.display = 'block';
                countdownElement.textContent = "Starting in ".concat(countdown, " seconds...");
                if (countdown > 0) {
                    countdown--;
                }
                else {
                    // Countdown finished, start or reset the game
                    clearInterval(countdownInterval);
                    if (isResetting) {
                        _this.resetGame(); // Reset the game if it was over
                        if (initScreen) {
                            initScreen.style.display = 'flex';
                        }
                    }
                    else {
                        _this.start(); // Start the game if it's not over
                        if (initScreen) {
                            initScreen.style.display = 'none';
                        }
                    }
                    countdownElement.style.display = 'none';
                    _this.startCountDownActive = false;
                }
            }
            else {
                // If the player moves out of position, reset countdown and wait until they return to position
                countdown = 3;
                countdownElement.textContent = "Hold position to start: ".concat(countdown, " seconds...");
            }
        }, 1000);
    };
    Game.prototype.start = function () {
        this.frameCount = 0; // Reset frame count
        this.isActive = true; // Set game as active
        this.HUD.style.display = 'flex';
    };
    Game.prototype.clearObstacles = function () {
        var _this = this;
        // Remove each obstacle element from the DOM
        this.obstacles.forEach(function (obstacle) {
            _this.obstacleContainer.removeChild(obstacle.element);
        });
        // Clear the obstacles array
        this.obstacles = [];
    };
    return Game;
}());
export { Game };
