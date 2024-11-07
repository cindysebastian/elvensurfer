var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var WebcamController = /** @class */ (function () {
    function WebcamController(videoElement, canvasElement, overlayCanvasElement, // Accept overlay canvas element
    sensitivity, comparisonInterval) {
        if (sensitivity === void 0) { sensitivity = 500; }
        if (comparisonInterval === void 0) { comparisonInterval = 1000; }
        this.referenceFrames = {
            topLeft: null,
            topRight: null,
            bottomLeft: null,
            bottomRight: null,
            middleLeft: null,
            middleRight: null
        };
        this.lastComparisonTime = 0;
        this.video = videoElement;
        this.canvas = canvasElement;
        this.overlayCanvas = overlayCanvasElement; // Initialize overlay canvas
        this.ctx = canvasElement.getContext('2d');
        this.overlayCtx = overlayCanvasElement.getContext('2d'); // Context for overlay canvas
        this.sensitivity = sensitivity;
        this.comparisonInterval = comparisonInterval; // Time in ms between each frame comparison
        this.setupWebcam();
    }
    WebcamController.prototype.setupWebcam = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true })];
                    case 1:
                        stream = _a.sent();
                        this.video.srcObject = stream;
                        this.video.onloadedmetadata = function () {
                            _this.captureReferenceFrames(); // Capture initial reference frames for each region
                            _this.startProcessingLoop();
                        };
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Webcam setup error:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Define regions and capture initial frames for each region
    WebcamController.prototype.captureReferenceFrames = function () {
        var _a = this.video, videoWidth = _a.videoWidth, videoHeight = _a.videoHeight;
        if (videoWidth > 0 && videoHeight > 0) {
            this.canvas.width = videoWidth;
            this.canvas.height = videoHeight;
            this.overlayCanvas.width = videoWidth; // Set overlay canvas width
            this.overlayCanvas.height = videoHeight; // Set overlay canvas height
            var regionCoords = this.getRegionCoordinates();
            // Capture a reference frame for each region
            for (var region in regionCoords) {
                var regionName = region; // Explicitly type as RegionName
                var _b = regionCoords[regionName], x = _b.x, y = _b.y, width = _b.width, height = _b.height;
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                this.referenceFrames[regionName] = this.ctx.getImageData(x, y, width, height);
            }
            console.log('Reference frames captured for each region');
        }
    };
    WebcamController.prototype.startProcessingLoop = function () {
        var _this = this;
        var processFrame = function () {
            var currentTime = performance.now();
            // Check if enough time has passed for the next comparison
            if (currentTime - _this.lastComparisonTime >= _this.comparisonInterval) {
                _this.lastComparisonTime = currentTime;
                if (Object.keys(_this.referenceFrames).length === 0)
                    return; // No detection if reference frames are missing
                _this.ctx.drawImage(_this.video, 0, 0, _this.canvas.width, _this.canvas.height);
                _this.overlayCtx.clearRect(0, 0, _this.overlayCanvas.width, _this.overlayCanvas.height); // Clear the overlay canvas before drawing
                var regionCoords = _this.getRegionCoordinates();
                for (var region in regionCoords) {
                    var regionKey = region; // Explicitly type as RegionName
                    var _a = regionCoords[regionKey], x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                    var currentFrame = _this.ctx.getImageData(x, y, width, height);
                    // Draw the regions for visual confirmation with a more visible style
                    _this.overlayCtx.strokeStyle = 'rgba(255, 0, 0, 1)'; // Use bright red for visibility
                    _this.overlayCtx.lineWidth = 4; // Increase line width for better visibility
                    _this.overlayCtx.strokeRect(x, y, width, height);
                    // Ensure the reference frame for this region is not null
                    var referenceFrame = _this.referenceFrames[regionKey];
                    if (referenceFrame) {
                        if (_this.detectMovement(currentFrame, referenceFrame)) {
                            console.log("Movement detected in ".concat(region, " region!"));
                            // Trigger any actions specific to this region if needed
                        }
                    }
                    else {
                        console.warn("Reference frame for region ".concat(region, " is not available."));
                    }
                }
            }
            requestAnimationFrame(processFrame); // Schedule next frame processing
        };
        processFrame();
    };
    WebcamController.prototype.getRegionCoordinates = function () {
        var _a = this.video, width = _a.videoWidth, height = _a.videoHeight;
        return {
            topLeft: { x: 0, y: 0, width: width * 0.2, height: height * 0.2 },
            topRight: { x: width * 0.8, y: 0, width: width * 0.2, height: height * 0.2 },
            bottomLeft: { x: 0, y: height * 0.8, width: width * 0.2, height: height * 0.2 },
            bottomRight: { x: width * 0.8, y: height * 0.8, width: width * 0.2, height: height * 0.2 },
            middleLeft: { x: 0, y: height * 0.4, width: width * 0.2, height: height * 0.2 },
            middleRight: { x: width * 0.8, y: height * 0.4, width: width * 0.2, height: height * 0.2 },
        };
    };
    WebcamController.prototype.detectMovement = function (currentFrame, referenceFrame) {
        var diffCount = 0;
        var pixelDataRef = referenceFrame.data;
        var pixelDataCurrent = currentFrame.data;
        for (var i = 0; i < pixelDataRef.length; i += 4) {
            var rDiff = Math.abs(pixelDataRef[i] - pixelDataCurrent[i]);
            var gDiff = Math.abs(pixelDataRef[i + 1] - pixelDataCurrent[i + 1]);
            var bDiff = Math.abs(pixelDataRef[i + 2] - pixelDataCurrent[i + 2]);
            // Increase the threshold sensitivity for movement detection
            if (rDiff + gDiff + bDiff > this.sensitivity) {
                diffCount++;
            }
        }
        // Trigger movement detection if more than 1% of pixels are different
        return diffCount > currentFrame.width * currentFrame.height * 0.01;
    };
    return WebcamController;
}());
export { WebcamController };
