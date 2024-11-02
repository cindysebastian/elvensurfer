// GameController.ts

import { Game } from './Game.js';
import { PlayerController } from './PlayerController.js';

export class GameController {
    game!: Game;
    playerController!: PlayerController;
    playerSprite!: HTMLImageElement;
    obstacleSprite!: HTMLImageElement;
    playerSpriteLoaded: boolean = false;
    obstacleSpriteLoaded: boolean = false;
    obstacleFrequency: number = 100;

    constructor() {
        // No need to initialize game here yet
    }

    setGame(game: Game) {
        this.game = game; // Assign the game reference
        this.playerController = new PlayerController(game.player); // Initialize with the current player

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
            this.game.gameCtx.clearRect(0, 0, this.game.gameCanvas.width, this.game.gameCanvas.height);

            if (!this.game.isGameOver) {
                
                this.game.drawPlayer(this.playerSprite, this.playerSpriteLoaded);

                if (this.game.frameCount % this.obstacleFrequency === 0) {
                    this.game.createObstacle();
                }

                this.game.drawObstacles(this.obstacleSprite, this.obstacleSpriteLoaded);
                this.game.detectCollision();
                this.game.drawScore();

                this.game.frameCount++;
            }

            requestAnimationFrame(loop);
        };
        loop();
    }

    resetGame() {
        this.playerController = new PlayerController(this.game.player); // Re-initialize player controller with new player instance
    }
}
