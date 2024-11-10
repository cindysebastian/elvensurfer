var PlayerController = /** @class */ (function () {
    function PlayerController(player) {
        var _this = this;
        this.player = player;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        // Event listeners
        window.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });
        window.addEventListener('keyup', function (e) { return _this.handleKeyUp(e); });
    }
    PlayerController.prototype.handleKeyDown = function (event) {
        if (!this.player) {
            console.log("no player");
            return;
        }
        ; // Ignore if player is not defined
        console.log("Key pressed:", event.code); // Debug line
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.isMovingLeft = true;
                this.player.moveLeft();
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.isMovingRight = true;
                this.player.moveRight();
                break;
        }
    };
    PlayerController.prototype.handleKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.isMovingLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.isMovingRight = false;
                break;
        }
        if (!this.isMovingLeft && !this.isMovingRight) {
            this.player.center();
        }
    };
    PlayerController.prototype.centerPlayerWebcam = function () {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.player.center(); // Moves player back to the center lane
    };
    PlayerController.prototype.movePlayerRightWebcam = function () {
        this.isMovingRight = true;
        this.isMovingLeft = false;
        this.player.moveRight();
    };
    PlayerController.prototype.movePlayerLeftWebcam = function () {
        this.isMovingLeft = true;
        this.isMovingRight = false;
        this.player.moveLeft();
    };
    return PlayerController;
}());
export { PlayerController };
