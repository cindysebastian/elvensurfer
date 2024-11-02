// Game.ts
import { Player } from './Player.js';
var Game = /** @class */ (function () {
    function Game(gameCanvas, webcamCanvas, gameController) {
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d');
        this.webcamCanvas = webcamCanvas;
        this.hudCtx = webcamCanvas.getContext('2d');
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
    }
    Game.prototype.createObstacle = function () {
        var testWidth = this.gameCanvas.width * 0.1;
        var testHeight = this.gameCanvas.height * 0.1;
        // Declare width and height outside of the conditional blocks
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
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2; // Calculate player X position based on lane
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
        var obstacleSpeed = 8; // Increase this value to make obstacles move faster
        this.obstacles.forEach(function (obstacle) {
            if (obstacleSpriteLoaded) {
                _this.gameCtx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            else {
                _this.gameCtx.fillStyle = 'red';
                _this.gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            obstacle.y += obstacleSpeed; // Use the speed variable here
            // Remove obstacles that have moved off the bottom of the canvas
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
                alert("Game Over! Final Score: " + _this.score);
                _this.resetGame();
            }
        });
    };
    Game.prototype.drawScore = function () {
        var scoreElement = document.getElementById('score');
        scoreElement.textContent = 'Score: ' + this.score;
    };
    Game.prototype.resetGame = function () {
        this.isGameOver = false; // Reset game state
        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
        this.gameController.resetGame(); // Call reset on GameController
    };
    return Game;
}());
export { Game };
