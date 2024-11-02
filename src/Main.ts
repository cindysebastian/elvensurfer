import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const webcamCanvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;

    const gameController = new GameController(); // Create a GameController instance
    const game = new Game(gameCanvas, webcamCanvas, gameController); // Pass it to the Game constructor

    gameController.setGame(game); // Make sure GameController has reference to the Game

    // Setup webcam
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController

    let countdown: number = 3; // Countdown variable
    let countdownInterval: NodeJS.Timeout | null = null; // Timer for the countdown

    const countdownElement = document.getElementById('countdown')!; // Get the countdown element

    // Event listener for keydown to start the countdown
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w') {
            if (!countdownInterval) {
                countdownInterval = setInterval(() => {
                    if (countdown > 0) {
                        countdownElement.textContent = `Countdown: ${countdown}`;
                        countdown--;
                    } else {
                        clearInterval(countdownInterval!);
                        startGame(); // Start the game when countdown ends
                    }
                }, 1000);
            }
        }
    });

    // Function to start the game
    function startGame() {
        // Hide the initial screen
        document.getElementById('initial-screen')!.style.display = 'none';
        // Start the game
        game.start(); // Add this method to your Game class if not already present
    }
});
