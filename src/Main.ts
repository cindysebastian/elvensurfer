import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const webcamCanvas = document.getElementById('webcamCanvas') as HTMLCanvasElement;

    const gameController = new GameController();
    const game = new Game(gameCanvas, webcamCanvas, gameController);

    gameController.setGame(game);

    // Setup webcam
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const webcamController = new WebcamController(video, webcamCanvas);
    const initScreen = document.getElementById('initial-screen');
    const countdownElement = document.getElementById('countdown')!;

    let countdown = 3;
    let keyHeldDown = false;
    let isResetting = false; // Flag to track if we're in reset mode

    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !keyHeldDown) {
            keyHeldDown = true;

            if (game.isGameOver) {
                isResetting = true; // Set the flag to reset mode
                startResetCountdown(); // Start the reset countdown
            } else {
                startGameCountdown(); // Start the game countdown if active
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'w') {
            keyHeldDown = false;
            game.pauseGame(); // Pause the game when W is released
            resetCountdown(); // Reset the countdown in case it was interrupted
        }
    });

    function startResetCountdown() {
        countdownElement.textContent = `Hold W for ${countdown} seconds to reset...`;
        
        const countdownInterval = setInterval(() => {
            if (keyHeldDown && isResetting) {
                if (countdown > 0) {
                    countdownElement.textContent = `Hold W for ${countdown} seconds to reset...`;
                    countdown--;
                } else {
                    clearInterval(countdownInterval);
                    game.resetGame(); // Reset the game
                    if (initScreen) {
                        initScreen.style.display = 'flex'; // Show initial screen
                    }
                    isResetting = false; // Reset the mode
                    resetCountdown(); // Reset countdown for the next action
                }
            } else {
                clearInterval(countdownInterval);
                resetCountdown();
            }
        }, 1000);
    }

    function startGameCountdown() {
        countdownElement.textContent = `Game starting in ${countdown} seconds...`;

        const countdownInterval = setInterval(() => {
            if (keyHeldDown && !isResetting) {
                if (countdown > 0) {
                    countdownElement.textContent = `Game starting in ${countdown} seconds...`;
                    countdown--;
                } else {
                    clearInterval(countdownInterval);
                    game.start(); // Start the game
                    if (initScreen) {
                        initScreen.style.display = 'none'; // Hide the initial screen
                    }
                }
            } else {
                clearInterval(countdownInterval);
                resetCountdown();
            }
        }, 1000);
    }

    function resetCountdown() {
        countdown = 3; // Reset the countdown to its initial state
        countdownElement.textContent = `Hold down W to start!`;
    }
});
