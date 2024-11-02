import { Game } from './components/Game.js';
import { GameController } from './components/GameController.js';
import { WebcamController } from './components/WebcamController.js'; // Import the new WebcamController
document.addEventListener('DOMContentLoaded', function () {
    var gameCanvas = document.getElementById('gameCanvas');
    var webcamCanvas = document.getElementById('webcamCanvas');
    var gameController = new GameController(); // Create a GameController instance
    var game = new Game(gameCanvas, webcamCanvas, gameController); // Pass it to the Game constructor
    gameController.setGame(game); // Make sure GameController has reference to the Game
    // Setup webcam
    var video = document.getElementById('webcam');
    var webcamController = new WebcamController(video, webcamCanvas); // Pass video and canvas to WebcamController
    var initScreen = document.getElementById('initial-screen');
    var countdownElement = document.getElementById('countdown'); // Get the countdown element
    var countdownStarted = false;
    var countdown = 3;
    var keyHeldDown = false;
    document.addEventListener('keydown', function (event) {
        if (event.key === 'w' && !keyHeldDown) {
            keyHeldDown = true; // Set the flag indicating the key is held down
            startCountdown(); // Start the countdown
        }
    });
    document.addEventListener('keyup', function (event) {
        if (event.key === 'w') {
            keyHeldDown = false; // Reset the key held down flag
            game.pauseGame(); // Pause the game when W is released
        }
    });
    function startCountdown() {
        console.log("Starting Countdown");
        // Reset the countdown display
        countdownElement.textContent = "Game starting in ".concat(countdown, "...");
        var countdownInterval = setInterval(function () {
            if (keyHeldDown) {
                if (countdown > 0) {
                    console.log("Countdown: ".concat(countdown)); // Display the countdown in the console
                    countdownElement.textContent = "Game starting in ".concat(countdown, "..."); // Update the displayed countdown
                    countdown--;
                }
                else {
                    clearInterval(countdownInterval);
                    game.start(); // Start the game
                    if (initScreen) { // Check if initScreen is not null
                        initScreen.style.display = 'none'; // Hide the countdown element
                    }
                    game.hideStartPrompt(); // Hide the start prompt
                }
            }
            else {
                console.log("Did not Hold Input long enough");
                clearInterval(countdownInterval); // Stop the countdown
                countdown = 3; // Reset countdown or handle as needed
                countdownElement.textContent = "Hold down W to start!";
            }
        }, 1000); // Change to 1000 ms for a countdown every second
    }
});
