// Player.ts
var Player = /** @class */ (function () {
    function Player(canvasHeight) {
        this.laneIndex = 1; // Start in the middle lane
        this.y = canvasHeight - 50; // Set player position
        this.width = 20; // Width of the player
        this.height = 20; // Height of the player
        this.color = 'blue'; // Color of the player
    }
    Player.prototype.moveLeft = function () {
        if (this.laneIndex > 0) {
            this.laneIndex--; // Move to the left lane
        }
    };
    Player.prototype.moveRight = function () {
        if (this.laneIndex < 2) {
            this.laneIndex++; // Move to the right lane
        }
    };
    Player.prototype.center = function () {
        this.laneIndex = 1; // Center the player in the middle lane
    };
    // Reintroduced updatePosition method to set the y position based on the lane index
    Player.prototype.updatePosition = function (canvasHeight) {
        // Set y position based on lane index
        this.y = canvasHeight - 50; // Always set to the bottom of the canvas minus height
    };
    return Player;
}());
export { Player };
