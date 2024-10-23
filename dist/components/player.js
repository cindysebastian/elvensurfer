// player.ts
var PlayerController = /** @class */ (function () {
    function PlayerController(lanes) {
        this.lanes = lanes;
        this.player = {
            laneIndex: 1,
            y: 0,
            width: 50,
            height: 50,
            color: 'blue',
            dy: 0,
            gravity: 1.5,
            jumpStrength: -20,
            isJumping: false,
        };
        this.player.y = window.innerHeight - this.player.height; // Set initial y position
    }
    PlayerController.prototype.draw = function (ctx, playerSprite, playerSpriteLoaded) {
        var playerX = this.lanes[this.player.laneIndex] - this.player.width / 2; // Calculate X based on the current lane
        if (playerSpriteLoaded && playerSprite) {
            ctx.drawImage(playerSprite, playerX, this.player.y, this.player.width, this.player.height);
        }
        else {
            // Draw the player rectangle as a backup
            ctx.fillStyle = this.player.color;
            ctx.fillRect(playerX, this.player.y, this.player.width, this.player.height);
        }
    };
    PlayerController.prototype.handleMovement = function () {
        this.player.y += this.player.dy;
        this.player.dy += this.player.gravity;
        if (this.player.y + this.player.height > window.innerHeight) {
            this.player.y = window.innerHeight - this.player.height;
            this.player.isJumping = false;
            this.player.dy = 0;
        }
    };
    PlayerController.prototype.jump = function () {
        if (!this.player.isJumping) {
            this.player.dy = this.player.jumpStrength;
            this.player.isJumping = true;
        }
    };
    PlayerController.prototype.moveLeft = function () {
        if (this.player.laneIndex > 0) {
            this.player.laneIndex--; // Move to the left lane
        }
    };
    PlayerController.prototype.moveRight = function () {
        if (this.player.laneIndex < 2) {
            this.player.laneIndex++; // Move to the right lane
        }
    };
    PlayerController.prototype.getPlayer = function () {
        return this.player;
    };
    PlayerController.prototype.reset = function () {
        this.player.y = window.innerHeight - this.player.height;
        this.player.dy = 0;
        this.player.laneIndex = 1; // Reset to the middle lane
        this.player.isJumping = false; // Reset jumping status
    };
    return PlayerController;
}());
export { PlayerController };
