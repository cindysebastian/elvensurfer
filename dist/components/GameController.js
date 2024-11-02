// GameController.ts
import { PlayerController } from './PlayerController.js';
var GameController = /** @class */ (function () {
    function GameController() {
        this.playerSpriteLoaded = false;
        this.obstacleSpriteLoaded = false;
        this.obstacleFrequency = 100;
        // No need to initialize game here yet
    }
    GameController.prototype.setGame = function (game) {
        var _this = this;
        this.game = game; // Assign the game reference
        this.playerController = new PlayerController(game.player); // Initialize with the current player
        this.playerSprite = new Image();
        this.playerSprite.src = '../assets/legolas.png';
        this.playerSprite.onload = function () { return (_this.playerSpriteLoaded = true); };
        this.obstacleSprite = new Image();
        this.obstacleSprite.src = '../assets/orc.png';
        this.obstacleSprite.onload = function () { return (_this.obstacleSpriteLoaded = true); };
        this.startGameLoop();
    };
    GameController.prototype.startGameLoop = function () {
        var _this = this;
        var loop = function () {
            _this.game.gameCtx.clearRect(0, 0, _this.game.gameCanvas.width, _this.game.gameCanvas.height);
            if (_this.game.isActive) {
                if (_this.game.frameCount % _this.obstacleFrequency === 0) {
                    _this.game.createObstacle();
                }
                _this.game.drawObstacles(_this.obstacleSprite, _this.obstacleSpriteLoaded);
                _this.game.drawPlayer(_this.playerSprite, _this.obstacleSpriteLoaded);
                _this.game.drawScore(); // Call the draw method that includes player and obstacle drawing
            }
            requestAnimationFrame(loop);
        };
        loop();
    };
    GameController.prototype.resetGame = function () {
        this.playerController = new PlayerController(this.game.player); // Re-initialize player controller with new player instance
    };
    return GameController;
}());
export { GameController };
