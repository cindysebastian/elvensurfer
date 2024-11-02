// WebcamController.ts
export class WebcamController {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;

        this.setupWebcam();
    }

    private async setupWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;

            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;

                // Start capturing movement at a specified interval
                setInterval(() => this.captureMovement(), 1000);
            };
        } catch (error) {
            console.error('Webcam setup error:', error);
        }
    }

    private captureMovement() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (width <= 0 || height <= 0) {
            console.error('Invalid canvas dimensions');
            return;
        }

        try {
            this.ctx.drawImage(this.video, 0, 0, width, height);
            const imageData = this.ctx.getImageData(0, 0, width, height);

            // Process imageData for movement detection
            // Implement movement logic based on image processing here

        } catch (error) {
            console.error('Error during captureMovement:', error);
        }
    }

    public updateSnapshot() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (this.ctx) {
            // Resize canvas to the webcam dimensions if needed
            this.ctx.drawImage(this.video, 0, 0, width, height);
        }
    }
}
