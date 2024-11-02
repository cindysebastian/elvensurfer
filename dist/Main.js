// Main.ts
import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController
document.addEventListener('DOMContentLoaded', function () {
    var gameCanvas = document.getElementById('gameCanvas');
    var webcamCanvas = document.getElementById('webcamCanvas');
    if (!gameCanvas || !webcamCanvas) {
        console.error("Canvas elements not found.");
        return; // Exit if canvas elements are not found
    }
    var game = new Game(gameCanvas, webcamCanvas);
    var gameController = new GameController(game);
    // Setup webcam
    var video = document.getElementById('webcam');
    var webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController
});
