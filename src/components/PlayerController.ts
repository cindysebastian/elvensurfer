import { Player } from './Player.js';

export class PlayerController {
    player: Player;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    constructor(player: Player) {
        this.player = player;
        this.isMovingLeft = false;
        this.isMovingRight = false;

        // Event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.player) {
            console.log("no player");
            return;
        }; // Ignore if player is not defined
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
    }

    handleKeyUp(event: KeyboardEvent) {
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
    }
}
