// Player.ts
var Player = /** @class */ (function () {
    function Player(canvasHeight) {
        this.laneIndex = 1; // Start in the middle lane
        this.y = canvasHeight - canvasHeight * 0.4; // Set player position
        this.height = canvasHeight * 0.3;
        this.width = this.height * 0.6139; // Width of the player
        this.color = 'blue'; // Color of the player
        console.log("initiated player with width", this.width);
        console.log("Canvas height when initialized", canvasHeight);
    }
    Player.prototype.moveLeft = function () {
        if (this.laneIndex > 0) {
            this.laneIndex--; // Move to the left lane
            console.log("Moved left to lane:", this.laneIndex); // Debug line
        }
    };
    Player.prototype.moveRight = function () {
        if (this.laneIndex < 2) {
            this.laneIndex++; // Move to the right lane
            console.log("Moved right to lane:", this.laneIndex); // Debug line
        }
    };
    Player.prototype.center = function () {
        this.laneIndex = 1; // Center the player in the middle lane
        console.log(this.y);
    };
    return Player;
}());
export { Player };
