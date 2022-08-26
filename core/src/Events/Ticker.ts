import { EventDispatcher } from "./EventDispatcher";
import { _Event } from "./Event";

export class Ticker extends EventDispatcher {
    public timingMode: string;
    public maxDelta: number;
    public paused: boolean;
    private _inited: boolean;
    private _startTime: number;
    private _pausedTime: number;
    private _ticks: number;
    private _pausedTicks: number;
    private _interval: number;
    private _lastTime: number;
    private _times: Array<any>;
    private _tickTimes: Array<any>;
    private _timerId: number;
    private _raf: boolean;
    public static get RAF_SYNCHED() { return "synched"; }
    public static get RAF() { return "raf"; }
    public static get TIMEOUT() { return "timeout"; }
    public constructor(name: string) {
        super();
        this.name = name;
        this.timingMode = Ticker.TIMEOUT;
        this.maxDelta = 0;
        this.paused = false;
        this._inited = false;
        this._startTime = 0;
        this._pausedTime = 0;
        this._ticks = 0;
        this._pausedTicks = 0;
        this._interval = 50;
        this._lastTime = 0;
        this._times = null as any;
        this._tickTimes = null as any;
        this._timerId = null as any;
        this._raf = true;
    }

    public get interval(): number {
        return this._interval;
    }
    public set interval(interval: number) {
        this._interval = interval;
        if (!this._inited) { return; }
        this._setupTick();
    }

    public get framerate(): number {
        return 1000 / this._interval;
    }
    public set framerate(framerate: number) {
        this.interval = 1000 / framerate;
    }

    public init(): void {
        if (this._inited) { return; }
        this._inited = true;
        this._times = [];
        this._tickTimes = [];
        this._startTime = this._getTime();
        this._times.push(this._lastTime = 0);
        this._setupTick();
    }

	/**
	 * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
	 */
    public reset(): void {
        if (this._raf) {
            let f = window.cancelAnimationFrame || (window as any).webkitCancelAnimationFrame || (<any>window).mozCancelAnimationFrame ||
                (<any>window).oCancelAnimationFrame || (<any>window).msCancelAnimationFrame;
            f && f(this._timerId);
        } else {
            clearTimeout(this._timerId);
        }
        this.removeAllEventListeners("tick");
        this._timerId = this._times = this._tickTimes = null as any;
        this._startTime = this._lastTime = this._ticks = 0;
        this._inited = false;
    }

	/**
	 * Init the Ticker instance if it hasn't been already.
	 */
    public addEventListener(type: string, listener: Function | Object, useCapture?: boolean): Object | Function {
        !this._inited && this.init();
        return super.addEventListener(type, listener, useCapture);
    }

	/**
	 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
	 * because it only measures the time spent within the tick execution stack.
	 *
	 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
	 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
	 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
	 *
	 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
	 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
	 * other than the tick is using ~80ms (another script, DOM rendering, etc).
	 *
	 * @param {number} [ticks=null] The number of previous ticks over which to measure the average time spent in a tick.
	 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
	 * @return {number} The average time spent in a tick in milliseconds.
	 */
    public getMeasuredTickTime(ticks: number = null as any): number {
        const times = this._tickTimes;
        if (!times || times.length < 1) { return -1; }
        // by default, calculate average for the past ~1 second:
        ticks = Math.min(times.length, ticks || (this.framerate | 0));
        return times.reduce((a, b) => a + b, 0) / ticks;
    }

	/**
	 * Returns the actual frames / ticks per second.
	 *
	 * @param {number} [ticks=null] The number of previous ticks over which to measure the actual frames / ticks per second.
	 * Defaults to the number of ticks per second.
	 * @return {number} The actual frames / ticks per second. Depending on performance, this may differ
	 * from the target frames per second.
	 */
    public getMeasuredFPS(ticks: number = null as any): number {
        const times = this._times;
        if (!times || times.length < 2) { return -1; }
        // by default, calculate fps for the past ~1 second:
        ticks = Math.min(times.length - 1, ticks || (this.framerate | 0));
        return 1000 / ((times[0] - times[ticks]) / ticks);
    }

    public getDeltaTime(): number {
        const fps = this.getMeasuredFPS();
        return 1 / fps;
    }

	/**
	 * Returns the number of milliseconds that have elapsed since Ticker was initialized via {@link core.Ticker#init}.
	 * Returns -1 if Ticker has not been initialized. For example, you could use
	 * this in a time synchronized animation to determine the exact amount of time that has elapsed.
	 *
	 * @param {boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
	 * If false, the value returned will be total time elapsed since the first tick event listener was added.
	 * @return {number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
	 */
    public getTime(runTime: boolean = false): number {
        return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
    }

	/**
	 * Similar to {@link core.Ticker#getTime}, but returns the time on the most recent {@link core.Ticker#event:tick}
	 * event object.
	 *
	 * @param {boolean} [runTime=false] If true, the runTime property will be returned instead of time.
	 * @returns {number} The time or runTime property from the most recent tick event or -1.
	 */
    public getEventTime(runTime: boolean = false): number {
        return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
    }

	/**
	 * Returns the number of ticks that have been broadcast by Ticker.
	 *
	 * @param {boolean} [pauseable=false] Indicates whether to include ticks that would have been broadcast
	 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
	 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
	 * value.
	 * @return {number} of ticks that have been broadcast.
	 */
    public getTicks(pauseable: boolean = false): number {
        return this._ticks - (pauseable ? this._pausedTicks : 0);
    }

	/**
	 * @private
	 */
    private _handleSynch(): void {
        this._timerId = null as any;
        this._setupTick();

        // run if enough time has elapsed, with a little bit of flexibility to be early:
        if (this._getTime() - this._lastTime >= (this._interval - 1) * 0.97) {
            this._tick();
        }
    }

	/**
	 * @private
	 */
    private _handleRAF(): void {
        this._timerId = null as any;
        this._setupTick();
        this._tick();
    }

	/**
	 * @private
	 */
    private _handleTimeout(): void {
        this._timerId = null as any;
        this._setupTick();
        this._tick();
    }

	/**
	 * @private
	 */
    private _setupTick(): void {
        if (this._timerId != null) { return; } // avoid duplicates
        const mode = this.timingMode || (this._raf && Ticker.RAF);
        if (mode === Ticker.RAF_SYNCHED || mode === Ticker.RAF) {
            const f = window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame || (<any>window).mozRequestAnimationFrame || (<any>window).oRequestAnimationFrame || (<any>window).msRequestAnimationFrame;
            if (f) {
                this._timerId = f(mode === Ticker.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
                this._raf = true;
                return;
            }
        }
        this._raf = false;
        const id: any = setTimeout(this._handleTimeout.bind(this), this._interval);
        this._timerId = id;
    }

	/**
	 * @private
	 * @emits core.Ticker#event:tick
	 */
    private _tick(): void {
        const paused = this.paused, time = this._getTime(), elapsedTime = time - this._lastTime;
        this._lastTime = time;
        this._ticks++;

        if (paused) {
            this._pausedTicks++;
            this._pausedTime += elapsedTime;
        }

        if (this.hasEventListener("tick")) {
            const event = new _Event("tick");
            const maxDelta = this.maxDelta;
            event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
            event.paused = paused;
            event.time = time;
            event.runTime = time - this._pausedTime;
            this.dispatchEvent(event);
        }

        this._tickTimes.unshift(this._getTime() - time);
        while (this._tickTimes.length > 100) { this._tickTimes.pop(); }

        this._times.unshift(time);
        while (this._times.length > 100) { this._times.pop(); }
    }

	/**
	 * @private
	 */
    private _getTime(): number {
        const now = window.performance && window.performance.now;
        return ((now && now.call(performance)) || (new Date().getTime())) - this._startTime;
    }

    static on(type: any, listener: any, scope: any, once: any, data: any, useCapture: any) { return _instance.on(type, listener, scope, once, data, useCapture); }
    static removeEventListener(type: any, listener: any, useCapture: any) { _instance.removeEventListener(type, listener, useCapture); }
    static off(type: any, listener: any, useCapture: any) { _instance.off(type, listener, useCapture); }
    static removeAllEventListeners(type: any) { _instance.removeAllEventListeners(type); }
    static dispatchEvent(eventObj: any, bubbles: any, cancelable: any) { return _instance.dispatchEvent(eventObj, bubbles, cancelable); }
    static hasEventListener(type: any) { return _instance.hasEventListener(type); }
    static willTrigger(type: any) { return _instance.willTrigger(type); }
    static toString() { return _instance.toString(); }
    static init() { _instance.init(); }
    static reset() { _instance.reset(); }
    static addEventListener(type: any, listener: any, useCapture?: any) { _instance.addEventListener(type, listener, useCapture); }
    static getMeasuredTickTime(ticks: any) { return _instance.getMeasuredTickTime(ticks); }
    static getMeasuredFPS(ticks: any) { return _instance.getMeasuredFPS(ticks); }
    static getTime(runTime: any) { return _instance.getTime(runTime); }
    static getEventTime(runTime: any) { return _instance.getEventTime(runTime); }
    static getTicks(pauseable: any) { return _instance.getTicks(pauseable); }
    static getDeltaTime() { return _instance.getDeltaTime(); }

    static get interval() { return _instance.interval; }
    static set interval(interval) { _instance.interval = interval; }
    static get framerate() { return _instance.framerate; }
    static set framerate(framerate) { _instance.framerate = framerate; }
    // static get name() { return _instance.name; }
    // static set name(name) { _instance.name = name; }
    static get timingMode() { return _instance.timingMode; }
    static set timingMode(timingMode) { _instance.timingMode = timingMode; }
    static get maxDelta() { return _instance.maxDelta; }
    static set maxDelta(maxDelta) { _instance.maxDelta = maxDelta; }
    static get paused() { return _instance.paused; }
    static set paused(paused) { _instance.paused = paused; }

}

/**
 * Dispatched each tick. The event will be dispatched to each listener even when the Ticker has been paused.
 *
 * @example
 * Ticker.addEventListener("tick", event => console.log("Paused:", event.paused, event.delta));
 *
 * @event core.Ticker#tick
 * @type {Object}
 * @property {Object} target The object that dispatched the event.
 * @property {string} type The event type.
 * @property {boolean} paused Indicates whether the ticker is currently paused.
 * @property {number} delta The time elapsed in ms since the last tick.
 * @property {number} time The total time in ms since Ticker was initialized.
 * @property {number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
 * you could determine the amount of time that the Ticker has been paused since initialization with `time-runTime`.
 * @since 0.6.0
 */


// the default Ticker instance
const _instance = new Ticker("tuval.global");