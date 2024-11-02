// Game.ts
import { Player } from './Player.js';
var Game = /** @class */ (function () {
    function Game(gameCanvas, webcamCanvas) {
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d');
        this.webcamCanvas = webcamCanvas;
        this.hudCtx = webcamCanvas.getContext('2d');
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
    }
    Game.prototype.createObstacle = function () {
        var width = 15;
        var height = 15;
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
        this.obstacles.forEach(function (obstacle) {
            if (obstacleSpriteLoaded) {
                _this.gameCtx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            else {
                _this.gameCtx.fillStyle = 'red';
                _this.gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            obstacle.y += 2;
            if (obstacle.y > _this.gameCanvas.height) {
                _this.obstacles.shift();
                _this.score++;
            }
        });
    };
    Game.prototype.detectCollision = function () {
        var _this = this;
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;
        this.obstacles.forEach(function (obstacle) {
            if (playerX < obstacle.x + obstacle.width &&
                playerX + _this.player.width > obstacle.x &&
                _this.player.y < obstacle.y + obstacle.height &&
                _this.player.y + _this.player.height > obstacle.y) {
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
        this.player = new Player(this.gameCanvas.height);
        this.obstacles = [];
        this.frameCount = 0;
        this.score = 0;
    };
    return Game;
}());
export { Game };
