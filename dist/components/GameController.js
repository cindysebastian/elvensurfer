// GameController.ts
import { PlayerController } from './PlayerController.js';
var GameController = /** @class */ (function () {
    function GameController(game) {
        var _this = this;
        this.playerSpriteLoaded = false;
        this.obstacleSpriteLoaded = false;
        this.obstacleFrequency = 120;
        this.game = game;
        this.playerController = new PlayerController(game.player);
        this.playerSprite = new Image();
        this.playerSprite.src = '../assets/legolas.png';
        this.playerSprite.onload = function () { return (_this.playerSpriteLoaded = true); };
        this.obstacleSprite = new Image();
        this.obstacleSprite.src = '../assets/orc.png';
        this.obstacleSprite.onload = function () { return (_this.obstacleSpriteLoaded = true); };
        this.startGameLoop();
    }
    GameController.prototype.startGameLoop = function () {
        var _this = this;
        var loop = function () {
            // Clear the game canvas
            _this.game.gameCtx.clearRect(0, 0, _this.game.gameCanvas.width, _this.game.gameCanvas.height);
            // Update the player's position and draw the player
            _this.game.player.updatePosition(_this.game.gameCanvas.height);
            _this.game.drawPlayer(_this.playerSprite, _this.playerSpriteLoaded);
            // Create new obstacles at defined frequency
            if (_this.game.frameCount % _this.obstacleFrequency === 0) {
                _this.game.createObstacle();
            }
            // Draw obstacles and check for collisions
            _this.game.drawObstacles(_this.obstacleSprite, _this.obstacleSpriteLoaded);
            _this.game.detectCollision();
            // Draw the score on the HUD
            _this.game.drawScore();
            // Increment the frame count for obstacle creation
            _this.game.frameCount++;
            requestAnimationFrame(loop);
        };
        loop();
    };
    return GameController;
}());
export { GameController };
