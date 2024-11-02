// Main.ts
import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController
document.addEventListener('DOMContentLoaded', function () {
    // Main.ts or wherever you initialize your game
    var gameCanvas = document.getElementById('gameCanvas');
    var webcamCanvas = document.getElementById('webcamCanvas');
    var gameController = new GameController(); // Create a GameController instance
    var game = new Game(gameCanvas, webcamCanvas, gameController); // Pass it to the Game constructor
    gameController.setGame(game); // Make sure GameController has reference to the Game
    // Setup webcam
    var video = document.getElementById('webcam');
    var webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController
});
