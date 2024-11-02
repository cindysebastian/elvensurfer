// GameController.ts

import { Game } from './Game.js';
import { PlayerController } from './PlayerController.js';

export class GameController {
    game: Game;
    playerController: PlayerController;
    playerSprite: HTMLImageElement;
    obstacleSprite: HTMLImageElement;
    playerSpriteLoaded: boolean = false;
    obstacleSpriteLoaded: boolean = false;
    obstacleFrequency: number = 120;

    constructor(game: Game) {
        this.game = game;
        this.playerController = new PlayerController(game.player);

        this.playerSprite = new Image();
        this.playerSprite.src = '../assets/legolas.png';
        this.playerSprite.onload = () => (this.playerSpriteLoaded = true);

        this.obstacleSprite = new Image();
        this.obstacleSprite.src = '../assets/orc.png';
        this.obstacleSprite.onload = () => (this.obstacleSpriteLoaded = true);

        this.startGameLoop();
    }

    startGameLoop() {
        const loop = () => {
            // Clear the game canvas
            this.game.gameCtx.clearRect(0, 0, this.game.gameCanvas.width, this.game.gameCanvas.height);

            // Update the player's position and draw the player
            this.game.player.updatePosition(this.game.gameCanvas.height);
            this.game.drawPlayer(this.playerSprite, this.playerSpriteLoaded);

            // Create new obstacles at defined frequency
            if (this.game.frameCount % this.obstacleFrequency === 0) {
                this.game.createObstacle();
            }

            // Draw obstacles and check for collisions
            this.game.drawObstacles(this.obstacleSprite, this.obstacleSpriteLoaded);
            this.game.detectCollision();

            // Draw the score on the HUD
            this.game.drawScore();

            // Increment the frame count for obstacle creation
            this.game.frameCount++;
            requestAnimationFrame(loop);
        };
        loop();
    }
}
