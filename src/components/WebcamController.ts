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
                this.startProcessingLoop(); // Start the frame capture and processing loop
            };
        } catch (error) {
            console.error('Webcam setup error:', error);
        }
    }

    private startProcessingLoop() {
        const width = this.canvas.width = this.video.videoWidth;
        const height = this.canvas.height = this.video.videoHeight;

        const processFrame = () => {
            if (width > 0 && height > 0) {
                // Draw frame to canvas (invisible to user, remove display none from CSS to see the frame)
                this.ctx.drawImage(this.video, 0, 0, width, height);
                const imageData = this.ctx.getImageData(0, 0, width, height);

                // Process imageData here for movement detection

            }
            requestAnimationFrame(processFrame); // Schedule the next frame
        };

        processFrame(); // Start the first frame
    }
}
