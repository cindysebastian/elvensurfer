// Player.ts
export class Player {
    laneIndex: number;
    y: number;
    width: number;
    height: number;
    color: string;

    constructor(canvasHeight: number) {
        this.laneIndex = 1; // Start in the middle lane
        this.y = canvasHeight-canvasHeight*0.4; // Set player position
        this.height = canvasHeight*0.3;
        this.width = this.height*0.6139; // Width of the player
        this.color = 'blue'; // Color of the player
        console.log("initiated player with width", this.width);
        console.log("Canvas height when initialized", canvasHeight);
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
        console.log(this.y);
    }


}
