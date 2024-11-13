import { Game } from './Game.js';
import { PlayerController } from './PlayerController.js';

export class GameController {
    game!: Game;
    playerController!: PlayerController;
    playerSprite!: HTMLImageElement;
    playerSpriteLoaded: boolean = false;
    obstacleFrequency: number = 4000; // Adjust as needed
    lastObstacleTime: number = 0; // Track the last time an obstacle was created
    fixedDeltaTime: number = 1000 / 60; // Fixed time step for 60 FPS

    constructor() {
        // No need to initialize game here yet
    }

    setGame(game: Game) {
        this.game = game; // Assign the game reference
        this.playerController = new PlayerController(game.player); // Initialize with the current player

        this.playerSprite = new Image();
        this.playerSprite.src = '../assets/legolas.png';
        this.playerSprite.onload = () => (this.playerSpriteLoaded = true);

        this.startGameLoop();
    }

    startGameLoop() {
        let lastTime = performance.now();
    
        const loop = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
    
            this.game.gameCtx.clearRect(0, 0, this.game.gameCanvas.width, this.game.gameCanvas.height);
    
            if (this.game.isActive) {
                console.log("Game loop active");
    
                // Increment frame count for each loop iteration
                this.game.frameCount++;
                this.game.detectCollision();
    
                // Check if enough time has passed to spawn an obstacle
                if (this.game.frameCount * this.fixedDeltaTime >= this.obstacleFrequency) {
                    console.log("Spawning obstacle");
                    this.game.createObstacle();
                    this.game.frameCount = 0; // Reset frame count after creating obstacle
                }
    
                this.game.drawObstacles(); // Now using drawObstacles without parameters
                this.game.drawPlayer(this.playerSprite, this.playerSpriteLoaded); // Draw the player sprite
                this.game.drawScore();
            }
    
            requestAnimationFrame(loop);
        };
        loop(lastTime);
    }
    

    resetGame() {
        this.playerController = new PlayerController(this.game.player); // Re-initialize player controller with new player instance
    }
}
