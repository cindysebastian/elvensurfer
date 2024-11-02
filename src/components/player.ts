// Player.ts
export class Player {
    laneIndex: number;
    y: number;
    width: number;
    height: number;
    color: string;

    constructor(canvasHeight: number) {
        this.laneIndex = 1; // Start in the middle lane
        this.y = canvasHeight - 50; // Set player position
        this.width = 20; // Width of the player
        this.height = 20; // Height of the player
        this.color = 'blue'; // Color of the player
    }

    moveLeft() {
        if (this.laneIndex > 0) {
            this.laneIndex--; // Move to the left lane
            console.log("Moved left to lane:", this.laneIndex); // Debug line
        }
    }

    moveRight() {
        if (this.laneIndex < 2) {
            this.laneIndex++; // Move to the right lane
            console.log("Moved right to lane:", this.laneIndex); // Debug line
        }
    }

    center() {
        this.laneIndex = 1; // Center the player in the middle lane
    }

    updatePosition(canvasHeight: number) {
        // Set y position based on lane index
        this.y = canvasHeight - 50; // Always set to the bottom of the canvas minus height
    }
}
