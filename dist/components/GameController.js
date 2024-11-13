import { PlayerController } from './PlayerController.js';
var GameController = /** @class */ (function () {
    function GameController() {
        this.playerSpriteLoaded = false;
        this.obstacleFrequency = 4000; // Adjust as needed
        this.lastObstacleTime = 0; // Track the last time an obstacle was created
        this.fixedDeltaTime = 1000 / 60; // Fixed time step for 60 FPS
        // No need to initialize game here yet
    }
    GameController.prototype.setGame = function (game) {
        var _this = this;
        this.game = game; // Assign the game reference
        this.playerController = new PlayerController(game.player); // Initialize with the current player
        this.playerSprite = new Image();
        this.playerSprite.src = '../assets/legolas.png';
        this.playerSprite.onload = function () { return (_this.playerSpriteLoaded = true); };
        this.startGameLoop();
    };
    GameController.prototype.startGameLoop = function () {
        var _this = this;
        var lastTime = performance.now();
        var loop = function (currentTime) {
            var deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            _this.game.gameCtx.clearRect(0, 0, _this.game.gameCanvas.width, _this.game.gameCanvas.height);
            if (_this.game.isActive) {
                console.log("Game loop active");
                // Increment frame count for each loop iteration
                _this.game.frameCount++;
                _this.game.detectCollision();
                // Check if enough time has passed to spawn an obstacle
                if (_this.game.frameCount * _this.fixedDeltaTime >= _this.obstacleFrequency) {
                    console.log("Spawning obstacle");
                    _this.game.createObstacle();
                    _this.game.frameCount = 0; // Reset frame count after creating obstacle
                }
                _this.game.drawObstacles(); // Now using drawObstacles without parameters
                _this.game.drawPlayer(_this.playerSprite, _this.playerSpriteLoaded); // Draw the player sprite
                _this.game.drawScore();
            }
            requestAnimationFrame(loop);
        };
        loop(lastTime);
    };
    GameController.prototype.resetGame = function () {
        this.playerController = new PlayerController(this.game.player); // Re-initialize player controller with new player instance
    };
    return GameController;
}());
export { GameController };
