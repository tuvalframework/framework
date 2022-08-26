import { createCanvas } from "./Canvas";

/**
 * When an HTML video seeks, including when looping, there is an indeterminate period before a new frame is available.
 * This can result in the video blinking or flashing when it is drawn to a canvas. The VideoBuffer class resolves
 * this issue by drawing each frame to an off-screen canvas and preserving the prior frame during a seek.
 *
 * @example
 * let buffer = new VideoBuffer(video);
 * let bitmap = new Bitmap(buffer);
 *
 * @param {HTMLVideoElement} video The HTML video element to buffer.
 */
export class VideoBuffer {
    /**
  	 * Used by Bitmap to determine when the video buffer is ready to be drawn. Not intended for general use.
  	 * @protected
  	 * @type {Number}
  	 */
	public readyState: number;
	/**
	 * @protected
	 * @type {HTMLVideoElement}
	 */
	protected _video: HTMLVideoElement;
	/**
	 * @protected
	 * @type {HTMLCanvasElement}
	 */
	protected _canvas: HTMLCanvasElement;

	/**
	 * @protected
	 * @type {Number}
	 * @default -1
	 */
	protected _lastTime: number;

	public constructor(video: HTMLVideoElement) {
		this.readyState = video.readyState;
		this._video = video;
		this._canvas = null as any;
		this._lastTime = -1;

		if (this.readyState < 2) {
			video.addEventListener("canplaythrough", this._videoReady.bind(this));
		}
		// {once: true} isn't supported everywhere, but its a non-critical optimization here.
	}

	/**
	 * Gets an HTML canvas element showing the current video frame, or the previous frame if in a seek / loop.
	 * Primarily for use by {@link easeljs.Bitmap}.
	 */
	public getImage(): HTMLCanvasElement {
		if (this.readyState < 2) {
			return undefined as any;
		}
		let canvas = this._canvas, video = this._video;
		if (!canvas) {
			canvas = this._canvas = createCanvas();
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
		}
		if (video.readyState >= 2 && video.currentTime !== this._lastTime) {
			const ctx: any = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			this._lastTime = video.currentTime;
		}
		return canvas;
	}

	/**
	 * @protected
	 */
	protected _videoReady() {
		this.readyState = 2;
	}

}