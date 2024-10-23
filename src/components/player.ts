// player.ts

export interface Player {
    laneIndex: number;
    y: number;
    width: number;
    height: number;
    color: string; // Fallback color if the image does not load
    dy: number;
    gravity: number;
    jumpStrength: number;
    isJumping: boolean;
}

export class PlayerController {
    private player: Player;
    private lanes: number[];

    constructor(lanes: number[]) {
        this.lanes = lanes;
        this.player = {
            laneIndex: 1,  // Start in the middle lane
            y: 0,
            width: 50,
            height: 50,
            color: 'blue', // Fallback color
            dy: 0,
            gravity: 1.5,
            jumpStrength: -20,
            isJumping: false,
        };
        this.player.y = window.innerHeight - this.player.height; // Set initial y position
    }

    public draw(ctx: CanvasRenderingContext2D, playerSprite: HTMLImageElement | null, playerSpriteLoaded: boolean) {
        const playerX = this.lanes[this.player.laneIndex] - this.player.width / 2;  // Calculate X based on the current lane
        if (playerSpriteLoaded && playerSprite) {
            ctx.drawImage(playerSprite, playerX, this.player.y, this.player.width, this.player.height);
        } else {
            // Draw the player rectangle as a backup
            ctx.fillStyle = this.player.color;
            ctx.fillRect(playerX, this.player.y, this.player.width, this.player.height);
        }
    }

    public handleMovement() {
        this.player.y += this.player.dy;
        this.player.dy += this.player.gravity;

        if (this.player.y + this.player.height > window.innerHeight) {
            this.player.y = window.innerHeight - this.player.height;
            this.player.isJumping = false;
            this.player.dy = 0;
        }
    }

    public jump() {
        if (!this.player.isJumping) {
            this.player.dy = this.player.jumpStrength;
            this.player.isJumping = true;
        }
    }

    public moveLeft() {
        if (this.player.laneIndex > 0) {
            this.player.laneIndex--;  // Move to the left lane
        }
    }

    public moveRight() {
        if (this.player.laneIndex < 2) {
            this.player.laneIndex++;  // Move to the right lane
        }
    }

    public getPlayer() {
        return this.player;
    }

    public reset() {
        this.player.y = window.innerHeight - this.player.height;
        this.player.dy = 0;
        this.player.laneIndex = 1;  // Reset to the middle lane
        this.player.isJumping = false; // Reset jumping status
    }
}
