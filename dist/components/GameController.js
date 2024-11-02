// GameController.ts
import { PlayerController } from './PlayerController.js';
var GameController = /** @class */ (function () {
    function GameController() {
        this.playerSpriteLoaded = false;
        this.obstacleSpriteLoaded = false;
        this.obstacleFrequency = 120;
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
            if (!_this.game.isGameOver) {
                _this.game.player.updatePosition(_this.game.gameCanvas.height);
                _this.game.drawPlayer(_this.playerSprite, _this.playerSpriteLoaded);
                if (_this.game.frameCount % _this.obstacleFrequency === 0) {
                    _this.game.createObstacle();
                }
                _this.game.drawObstacles(_this.obstacleSprite, _this.obstacleSpriteLoaded);
                _this.game.detectCollision();
                _this.game.drawScore();
                _this.game.frameCount++;
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
