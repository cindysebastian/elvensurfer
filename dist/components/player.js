// Player.ts
var Player = /** @class */ (function () {
    function Player(canvasHeight) {
        this.laneIndex = 1; // Start in the middle lane
        this.y = canvasHeight - canvasHeight * 0.4; // Set player position
        this.height = canvasHeight * 0.3;
        this.width = this.height * 0.6139; // Width of the player
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
    return Player;
}());
export { Player };
