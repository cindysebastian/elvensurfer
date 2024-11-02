import { Game } from './Game.js';
import { PlayerController } from './PlayerController.js';

export class GameController {
    game!: Game;
    playerController!: PlayerController;
    playerSprite!: HTMLImageElement;
    obstacleSprite!: HTMLImageElement;
    playerSpriteLoaded: boolean = false;
    obstacleSpriteLoaded: boolean = false;
    obstacleFrequency: number = 2000; // Adjust as needed
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

        this.obstacleSprite = new Image();
        this.obstacleSprite.src = '../assets/orc.png';
        this.obstacleSprite.onload = () => (this.obstacleSpriteLoaded = true);

        this.startGameLoop();
    }

    startGameLoop() {
        let lastTime = performance.now(); // Record the last frame time
    
        const loop = (currentTime: number) => {
            const deltaTime = currentTime - lastTime; // Calculate how much time has passed since the last frame
            lastTime = currentTime;
    
            this.game.gameCtx.clearRect(0, 0, this.game.gameCanvas.width, this.game.gameCanvas.height);
        
            if (this.game.isActive) {
                // Increment frame count for each loop iteration
                this.game.frameCount++; 
    
                // Check if enough time has passed for spawning an obstacle
                if (this.game.frameCount * this.fixedDeltaTime >= this.obstacleFrequency) {
                    console.log("Spawning Obstacle");
                    this.game.createObstacle();
                    this.game.frameCount = 0; // Reset frame count after creating obstacle
                }
        
                this.game.drawObstacles(this.obstacleSprite, this.obstacleSpriteLoaded);
                this.game.drawPlayer(this.playerSprite, this.obstacleSpriteLoaded);
                this.game.drawScore(); // Call the draw method that includes player and obstacle drawing
            }
    
            requestAnimationFrame(loop);
        };
        loop(lastTime);
    }
    

    resetGame() {
        this.playerController = new PlayerController(this.game.player); // Re-initialize player controller with new player instance
    }
}
