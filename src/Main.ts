// Main.ts
import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController

document.addEventListener('DOMContentLoaded', () => {
    // Main.ts or wherever you initialize your game

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const webcamCanvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;

const gameController = new GameController(); // Create a GameController instance
const game = new Game(gameCanvas, webcamCanvas, gameController); // Pass it to the Game constructor

gameController.setGame(game); // Make sure GameController has reference to the Game


    // Setup webcam
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController
});
