// Import the necessary types
import { RegionName, RegionMap, ReferenceFrames } from './RegionTypes.js';

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

    constructor(
        videoElement: HTMLVideoElement, 
        canvasElement: HTMLCanvasElement, 
        overlayCanvasElement: HTMLCanvasElement,  // Accept overlay canvas element
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
        this.setupWebcam();
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

    private startProcessingLoop() {
        const processFrame = () => {
            const currentTime = performance.now();

            // Check if enough time has passed for the next comparison
            if (currentTime - this.lastComparisonTime >= this.comparisonInterval) {
                this.lastComparisonTime = currentTime;

                if (Object.keys(this.referenceFrames).length === 0) return; // No detection if reference frames are missing

                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);  // Clear the overlay canvas before drawing

                const regionCoords = this.getRegionCoordinates();

                for (const region in regionCoords) {
                    const regionKey = region as RegionName;  // Explicitly type as RegionName
                    const { x, y, width, height } = regionCoords[regionKey];
                    const currentFrame = this.ctx.getImageData(x, y, width, height);

                    // Draw the regions for visual confirmation with a more visible style
                    this.overlayCtx.strokeStyle = 'rgba(255, 0, 0, 1)';  // Use bright red for visibility
                    this.overlayCtx.lineWidth = 4;  // Increase line width for better visibility
                    this.overlayCtx.strokeRect(x, y, width, height);

                    // Ensure the reference frame for this region is not null
                    const referenceFrame = this.referenceFrames[regionKey];
                    if (referenceFrame) {
                        if (this.detectMovement(currentFrame, referenceFrame)) {
                            console.log(`Movement detected in ${region} region!`);
                            // Trigger any actions specific to this region if needed
                        }
                    } else {
                        console.warn(`Reference frame for region ${region} is not available.`);
                    }
                }
            }
            requestAnimationFrame(processFrame); // Schedule next frame processing
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
