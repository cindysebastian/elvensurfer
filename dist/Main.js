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
    var countdown = 3; // Countdown variable
    var countdownInterval = null; // Timer for the countdown
    var countdownElement = document.getElementById('countdown'); // Get the countdown element
    // Event listener for keydown to start the countdown
    document.addEventListener('keydown', function (event) {
        if (event.key === 'w') {
            if (!countdownInterval) {
                countdownInterval = setInterval(function () {
                    if (countdown > 0) {
                        countdownElement.textContent = "Countdown: ".concat(countdown);
                        countdown--;
                    }
                    else {
                        clearInterval(countdownInterval);
                        startGame(); // Start the game when countdown ends
                    }
                }, 1000);
            }
        }
    });
    // Function to start the game
    function startGame() {
        // Hide the initial screen
        document.getElementById('initial-screen').style.display = 'none';
        // Start the game
        game.start(); // Add this method to your Game class if not already present
    }
});
