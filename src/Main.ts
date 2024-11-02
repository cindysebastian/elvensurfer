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

    const countdownElement = document.getElementById('countdown')!; // Get the countdown element
    let countdownStarted = false;
    let countdown = 3;
    let keyHeldDown = false;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !keyHeldDown) {
            keyHeldDown = true; // Set the flag indicating the key is held down
            startCountdown(); // Start the countdown
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'w') {
            keyHeldDown = false; // Reset the key held down flag
            game.pauseGame(); // Pause the game when W is released
            game.resetCountdown(); // Reset countdown state in Game class
        }
    });

    function startCountdown() {
        console.log("Starting Countdown");
        // Reset the countdown display
        countdownElement.textContent = `Game starting in ${game.countdown}...`;
    
        game.countdownInterval = setInterval(() => {
            if (keyHeldDown) {
                if (countdown > 0) {
                    console.log(`Countdown: ${countdown}`); // Display the countdown in the console
                    countdownElement.textContent = `Game starting in ${countdown}...`; // Update the displayed countdown
                    countdown--;
                } else {
                    clearInterval(game.countdownInterval!);
                    game.start(); // Start the game
                    countdownElement.style.display = 'none'; // Hide the countdown element
                    game.hideStartPrompt(); // Hide the start prompt
                }
            } else {
                console.log("Did not Hold Input long enough");
                clearInterval(game.countdownInterval!); // Stop the countdown
                countdown = 3; // Reset countdown or handle as needed
                countdownElement.textContent = `Hold down W to start!`;
            }
        }, 1000); // Change to 1000 ms for a countdown every second
    }
    

});