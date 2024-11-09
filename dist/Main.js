import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/Webcam/WebcamController.js';
document.addEventListener('DOMContentLoaded', function () {
    var gameCanvas = document.getElementById('gameCanvas');
    var webcamCanvas = document.getElementById('webcamCanvas');
    var initCamCanvas = document.getElementById('initCamCanvas');
    var initWebcamOverlayCanvas = document.getElementById('webcamOverlay');
    var gameController = new GameController();
    // Setup webcam
    var video = document.getElementById('webcam');
    var webcamController = new WebcamController(video, webcamCanvas, initWebcamOverlayCanvas, gameController);
    var initVideo = document.getElementById('initWebcam');
    var initCamController = new WebcamController(initVideo, initCamCanvas, initWebcamOverlayCanvas, gameController);
    var initScreen = document.getElementById('initial-screen');
    var countdownElement = document.getElementById('countdown');
    var game = new Game(gameCanvas, webcamCanvas, gameController, webcamController);
    gameController.setGame(game);
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
            // Pause the game when W is released
            resetCountdown(); // Reset the countdown in case it was interrupted
            /*if(game.isActive){
                game.pauseGame();
            }*/
        }
    });
    function startResetCountdown() {
        countdownElement.textContent = "Hold W for ".concat(countdown, " more seconds to reset...");
        var countdownInterval = setInterval(function () {
            if (keyHeldDown && isResetting) {
                if (countdown > 0) {
                    countdownElement.style.display = 'block';
                    countdownElement.textContent = "Hold W for ".concat(countdown, " more seconds to reset...");
                    countdown--;
                }
                else {
                    clearInterval(countdownInterval);
                    game.resetGame(); // Reset the game
                    if (initScreen) {
                        initScreen.style.display = 'flex'; // Show initial screen
                    }
                    countdownElement.style.display = 'none';
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
        countdownElement.textContent = "Starting in ".concat(countdown, " seconds...");
        var countdownInterval = setInterval(function () {
            if (keyHeldDown && !isResetting) {
                if (countdown > 0) {
                    countdownElement.style.display = 'block';
                    countdownElement.textContent = "Starting in ".concat(countdown, " seconds...");
                    countdown--;
                }
                else {
                    clearInterval(countdownInterval);
                    game.start(); // Start the game
                    if (initScreen) {
                        initScreen.style.display = 'none'; // Hide the initial screen
                    }
                    countdownElement.style.display = 'none';
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
