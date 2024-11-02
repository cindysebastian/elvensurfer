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
    const initScreen = document.getElementById('initial-screen');

    const countdownElement = document.getElementById('countdown')!; // Get the countdown element
    let countdownStarted = false;
    let countdown = 3;
    let keyHeldDown = false;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !keyHeldDown) {
            keyHeldDown = true; // Set the flag indicating the key is held down
            if (game.isGameOver) {
                // If the game is over, reset and show the initial screen again
                game.resetGame();
                if (initScreen) {
                    initScreen.style.display = 'block'; // Show the initial screen again
                }
                countdownElement.textContent = `Hold down W to start!`; // Prompt the user
            } else {
                startCountdown(); // Start the countdown if the game is active
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'w') {
            keyHeldDown = false; // Reset the key held down flag
            game.pauseGame(); // Pause the game when W is released
        }
    });

    function startCountdown() {
        console.log("Starting Countdown");
        countdownElement.textContent = `Game starting in ${countdown}...`;

        const countdownInterval = setInterval(() => {
            if (keyHeldDown) {
                if (countdown > 0) {
                    console.log(`Countdown: ${countdown}`);
                    countdownElement.textContent = `Game starting in ${countdown}...`;
                    countdown--;
                } else {
                    clearInterval(countdownInterval);
                    game.start(); // Start the game
                    if (initScreen) {
                        initScreen.style.display = 'none'; // Hide the countdown element
                    }
                }
            } else {
                console.log("Did not Hold Input long enough");
                clearInterval(countdownInterval);
                countdown = 3; // Reset countdown or handle as needed
                countdownElement.textContent = `Hold down W to start!`;
            }
        }, 1000);
    }


});