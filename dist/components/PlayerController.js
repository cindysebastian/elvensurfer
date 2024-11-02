// PlayerController.ts
var PlayerController = /** @class */ (function () {
    function PlayerController(player) {
        var _this = this;
        this.player = player;
        this.isMovingLeft = false; // Track if left key is pressed
        this.isMovingRight = false; // Track if right key is pressed
        window.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });
        window.addEventListener('keyup', function (e) { return _this.handleKeyUp(e); });
    }
    PlayerController.prototype.handleKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.isMovingLeft = true; // Mark left key as pressed
                this.player.moveLeft(); // Move left
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.isMovingRight = true; // Mark right key as pressed
                this.player.moveRight(); // Move right
                break;
        }
    };
    PlayerController.prototype.handleKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.isMovingLeft = false; // Mark left key as released
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.isMovingRight = false; // Mark right key as released
                break;
        }
        // Center the player back to the middle lane when no keys are held
        if (!this.isMovingLeft && !this.isMovingRight) {
            this.player.center(); // Center the player
        }
    };
    return PlayerController;
}());
export { PlayerController };
