import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js';
document.addEventListener('DOMContentLoaded', function () {
    var gameCanvas = document.getElementById('gameCanvas');
    var webcamCanvas = document.getElementById('webcamCanvas');
    var gameController = new GameController();
    var game = new Game(gameCanvas, webcamCanvas, gameController);
    gameController.setGame(game);
    // Setup webcam
    var video = document.getElementById('webcam');
    var webcamController = new WebcamController(video, webcamCanvas);
    var initScreen = document.getElementById('initial-screen');
    var countdownElement = document.getElementById('countdown');
    var countdown = 3;
    var keyHeldDown = false;
    var isResetting = false; // Flag to track if we're in reset mode
    document.addEventListener('keydown', function (event) {
        if (event.key === 'w' && !keyHeldDown) {
            keyHeldDown = true;
            if (game.isGameOver) {
                isResetting = true; // Set the flag to reset mode
                startResetCountdown(); // Start the reset countdown
            }
            else {
                startGameCountdown(); // Start the game countdown if active
            }
        }
    });
    document.addEventListener('keyup', function (event) {
        if (event.key === 'w') {
            keyHeldDown = false;
            game.pauseGame(); // Pause the game when W is released
            resetCountdown(); // Reset the countdown in case it was interrupted
        }
    });
    function startResetCountdown() {
        countdownElement.textContent = "Hold W for ".concat(countdown, " seconds to reset...");
        var countdownInterval = setInterval(function () {
            if (keyHeldDown && isResetting) {
                if (countdown > 0) {
                    countdownElement.textContent = "Hold W for ".concat(countdown, " seconds to reset...");
                    countdown--;
                }
                else {
                    clearInterval(countdownInterval);
                    game.resetGame(); // Reset the game
                    if (initScreen) {
                        initScreen.style.display = 'block'; // Show initial screen
                    }
                    isResetting = false; // Reset the mode
                    resetCountdown(); // Reset countdown for the next action
                }
            }
            else {
                clearInterval(countdownInterval);
                resetCountdown();
            }
        }, 1000);
    }
    function startGameCountdown() {
        countdownElement.textContent = "Game starting in ".concat(countdown, " seconds...");
        var countdownInterval = setInterval(function () {
            if (keyHeldDown && !isResetting) {
                if (countdown > 0) {
                    countdownElement.textContent = "Game starting in ".concat(countdown, " seconds...");
                    countdown--;
                }
                else {
                    clearInterval(countdownInterval);
                    game.start(); // Start the game
                    if (initScreen) {
                        initScreen.style.display = 'none'; // Hide the initial screen
                    }
                }
            }
            else {
                clearInterval(countdownInterval);
                resetCountdown();
            }
        }, 1000);
    }
    function resetCountdown() {
        countdown = 3; // Reset the countdown to its initial state
        countdownElement.textContent = "Hold down W to start!";
    }
});
