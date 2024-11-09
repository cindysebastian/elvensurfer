// Import the necessary types
import { RegionName, RegionMap, ReferenceFrames } from './RegionTypes.js';
import { GameController } from '../GameController.js';

export class WebcamController {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private overlayCanvas: HTMLCanvasElement;  // New overlay canvas
    private overlayCtx: CanvasRenderingContext2D;  // Context for overlay canvas
    private referenceFrames: ReferenceFrames = {
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null,
        middleLeft: null,
        middleRight: null
    };
    private sensitivity: number;
    private lastComparisonTime: number = 0;
    private comparisonInterval: number;
    private gameController: GameController;
    private regionStatus: { [key in RegionName]: boolean } = {
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false,
        middleLeft: false,
        middleRight: false
    };
    
    constructor(
        videoElement: HTMLVideoElement, 
        canvasElement: HTMLCanvasElement, 
        overlayCanvasElement: HTMLCanvasElement,  // Accept overlay canvas element,
        gameController: GameController,
        sensitivity: number = 300, 
        comparisonInterval: number = 1000
    ) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.overlayCanvas = overlayCanvasElement;  // Initialize overlay canvas
        this.ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
        this.overlayCtx = overlayCanvasElement.getContext('2d') as CanvasRenderingContext2D;  // Context for overlay canvas
        this.sensitivity = sensitivity;
        this.comparisonInterval = comparisonInterval;  // Time in ms between each frame comparison
        this.gameController = gameController;
        this.setupWebcam();
        this.setupRetakeButton();
    }

    private async setupWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;

            this.video.onloadedmetadata = () => {
                this.captureReferenceFrames(); // Capture initial reference frames for each region
                this.startProcessingLoop();
            };
        } catch (error) {
            console.error('Webcam setup error:', error);
        }
    }

    // Define regions and capture initial frames for each region
    captureReferenceFrames() {
        const { videoWidth, videoHeight } = this.video;

        if (videoWidth > 0 && videoHeight > 0) {
            this.canvas.width = videoWidth;
            this.canvas.height = videoHeight;
            this.overlayCanvas.width = videoWidth;  // Set overlay canvas width
            this.overlayCanvas.height = videoHeight;  // Set overlay canvas height

            const regionCoords = this.getRegionCoordinates();

            // Capture a reference frame for each region
            for (const region in regionCoords) {
                const regionName = region as RegionName; // Explicitly type as RegionName
                const { x, y, width, height } = regionCoords[regionName];
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                this.referenceFrames[regionName] = this.ctx.getImageData(x, y, width, height);
            }
            console.log('Reference frames captured for each region');
        }
    }

    private setupRetakeButton() {
        const button = document.getElementById('retakeReferenceFramesButton') as HTMLButtonElement;

        if (button) {
            button.addEventListener('click', () => {
                this.startRetakeTimer();
            });
        }
    }

    private startRetakeTimer() {
        console.log('Starting 3-second timer to retake reference frames.');

        // Disable the button and start the timer
        const button = document.getElementById('retakeReferenceFramesButton') as HTMLButtonElement;
        if (button) button.disabled = true;

        // Countdown for 3 seconds
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                console.log(`Retake reference frames in ${countdown} seconds...`);
                countdown--;
            } else {
                clearInterval(countdownInterval);  // Stop the countdown
                console.log('Retaking reference frames...');
                this.captureReferenceFrames();  // Retake reference frames
                if (button) button.disabled = false;  // Enable button again after retake
            }
        }, 1000);
    }

    private startProcessingLoop() {
        const processFrame = () => {
            const currentTime = performance.now();
    
            if (currentTime - this.lastComparisonTime >= this.comparisonInterval) {
                this.lastComparisonTime = currentTime;
    
                // Draw the current frame and clear the overlay canvas
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    
                const regionCoords = this.getRegionCoordinates();
                for (const region in regionCoords) {
                    const regionKey = region as RegionName;
                    const { x, y, width, height } = regionCoords[regionKey];
                    const currentFrame = this.ctx.getImageData(x, y, width, height);

                    // Draw the regions for visual confirmation with a more visible style
                    this.overlayCtx.strokeStyle = 'rgba(255, 0, 0, 1)';  // Use bright red for visibility
                    this.overlayCtx.lineWidth = 4;  // Increase line width for better visibility
                    this.overlayCtx.strokeRect(x, y, width, height);

                    // Ensure the reference frame for this region is not null
                    const referenceFrame = this.referenceFrames[regionKey];
                    if (referenceFrame) {
                        const movementDetected = this.detectMovement(currentFrame, referenceFrame);
                        this.regionStatus[regionKey] = movementDetected;
                    }
                }
    
                // Check region status to control player movement
                const moveRight = this.regionStatus.topRight && this.regionStatus.bottomLeft;
                const moveLeft = this.regionStatus.topLeft && this.regionStatus.bottomRight;
    
                if (moveRight) {
                    this.gameController.playerController.movePlayerRightWebcam(); // Move player right
                } else if (moveLeft) {
                    this.gameController.playerController.movePlayerLeftWebcam(); // Move player left
                } else {
                    this.gameController.playerController.centerPlayerWebcam(); // Move player to center if no movement
                }
            }
    
            requestAnimationFrame(processFrame);
        };
    
        processFrame();
    }
    
    

    private getRegionCoordinates(): RegionMap {
        const { videoWidth: width, videoHeight: height } = this.video;

        return {
            topLeft: { x: 0, y: 0, width: width * 0.2, height: height * 0.2 },
            topRight: { x: width * 0.8, y: 0, width: width * 0.2, height: height * 0.2 },
            bottomLeft: { x: 0, y: height * 0.8, width: width * 0.2, height: height * 0.2 },
            bottomRight: { x: width * 0.8, y: height * 0.8, width: width * 0.2, height: height * 0.2 },
            middleLeft: { x: 0, y: height * 0.4, width: width * 0.2, height: height * 0.2 },
            middleRight: { x: width * 0.8, y: height * 0.4, width: width * 0.2, height: height * 0.2 },
        };
    }

    private detectMovement(currentFrame: ImageData, referenceFrame: ImageData): boolean {
        let diffCount = 0;
        const pixelDataRef = referenceFrame.data;
        const pixelDataCurrent = currentFrame.data;

        for (let i = 0; i < pixelDataRef.length; i += 4) {
            const rDiff = Math.abs(pixelDataRef[i] - pixelDataCurrent[i]);
            const gDiff = Math.abs(pixelDataRef[i + 1] - pixelDataCurrent[i + 1]);
            const bDiff = Math.abs(pixelDataRef[i + 2] - pixelDataCurrent[i + 2]);

            // Increase the threshold sensitivity for movement detection
            if (rDiff + gDiff + bDiff > this.sensitivity) {
                diffCount++;
            }
        }

        // Trigger movement detection if more than 1% of pixels are different
        return diffCount > currentFrame.width * currentFrame.height * 0.01;
    }    
}
