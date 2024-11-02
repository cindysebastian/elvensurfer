// PlayerController.ts

import { Player } from './Player.js';

export class PlayerController {
    player: Player;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    constructor(player: Player) {
        this.player = player;
        this.isMovingLeft = false; // Track if left key is pressed
        this.isMovingRight = false; // Track if right key is pressed

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event: KeyboardEvent) {
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
    }

    handleKeyUp(event: KeyboardEvent) {
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
    }
}
