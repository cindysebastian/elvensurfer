// Main.ts
import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const webcamCanvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;
    
    if (!gameCanvas || !webcamCanvas) {
        console.error("Canvas elements not found.");
        return; // Exit if canvas elements are not found
    }

    const game = new Game(gameCanvas, webcamCanvas);
    const gameController = new GameController(game);

    // Setup webcam
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController
});
