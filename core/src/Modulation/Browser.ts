import { float, int } from "../float";
declare var SDL, _emscripten_set_main_loop_timing, _emscripten_get_now, ExitStatus, GL, GLctx;


function getWindowWidth() {
    return (
      window.innerWidth ||
      (document.documentElement && document.documentElement.clientWidth) ||
      (document.body && document.body.clientWidth) ||
      0
    );
  }

  function getWindowHeight() {
    return (
      window.innerHeight ||
      (document.documentElement && document.documentElement.clientHeight) ||
      (document.body && document.body.clientHeight) ||
      0
    );
  }

interface IModule {
    setStatus(text: string);
    statusMessage: string;
    noExitRuntime: boolean;
    ABORT: boolean;
    ctx: CanvasRenderingContext2D;
    preloadPlugins: any[];
    postMainLoop: Function;
    preMainLoop: Function;
    noImageDecoding: boolean;
    preloadedImages: any;
    noAudioDecoding: boolean;
    preloadedAudios: any[];
    Canvas: HTMLCanvasElement;
    elementPointerLock: boolean;
    getUniqueRunDependency(text: string): string;
    RemoveRunDependency(id: string): void;
    AddRunDependency(id: string): void;
    forcedAspectRatio: float;
    readAsync(url: string, callback: Function, onerror: Function): Promise<any>;
    assert(condition: boolean, message: string);
    abort(message: string);
    HEAPU32: Uint16Array;
    HEAP32: Int32Array;
    onFullScreen: Function;
    onFullscreen: Function;
    warnOnce(message: string);
    checkStackCookie(): void;
    err(message: string);
    useWebGL: boolean;
}
class MainLoop {
    private Module: IModule = null as any;
    public Scheduler: Function = null as any;
    public method: string = '';
    public currentlyRunningMainloop: int = 0;
    public func: Function = null as any;
    public arg: int = 0;
    public timingMode: int = 0;
    public timingValue: int = 0;
    public currentFrameNumber: int = 0;
    public queue: any[] = [];
    public remainingBlockers: int = 0;
    public expectedBlockers: int = 0;
    public Runner: Function = null as any;
    public tickStartTime: int = 0;

    public constructor(module: IModule) {
        this.Module = module;
    }
    public Pause() {
        this.Scheduler = null as any;
        // Incrementing this signals the previous main loop that it's now become old, and it must return.
        this.currentlyRunningMainloop++;
    }
    public Resume() {
        this.currentlyRunningMainloop++;
        const timingMode = this.timingMode;
        const timingValue = this.timingValue;
        const func = this.func;
        this.func = null as any;
        // do not set timing and call scheduler, we will do it on the next lines
        this.setMainLoop(func, 0, false, this.arg, true);
        _emscripten_set_main_loop_timing(timingMode, timingValue);
        this.Scheduler();
    }
    public UpdateStatus() {
        if (this.Module.setStatus != null) {
            var message = this.Module.statusMessage || 'Please wait...';
            var remaining = this.remainingBlockers;
            var expected = this.expectedBlockers;
            if (remaining) {
                if (remaining < expected) {
                    this.Module.setStatus(message + ' (' + (expected - remaining) + '/' + expected + ')');
                } else {
                    this.Module.setStatus(message);
                }
            } else {
                this.Module.setStatus('');
            }
        }
    }
    private setMainLoop(browserIterationFunc: Function, fps: int, simulateInfiniteLoop: boolean, arg: int, noSetTiming: boolean) {
        this.Module.noExitRuntime = true;

        this.Module.assert(!this.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');

        this.func = browserIterationFunc;
        this.arg = arg;

        var thisMainLoopId = this.currentlyRunningMainloop;

        this.Runner = () => {
            if (this.Module.ABORT) return;
            if (this.queue.length > 0) {
                const start = Date.now();
                const blocker = this.queue.shift();
                blocker.func(blocker.arg);
                if (this.remainingBlockers) {
                    var remaining = this.remainingBlockers;
                    var next = remaining % 1 === 0 ? remaining - 1 : Math.floor(remaining);
                    if (blocker.counted) {
                        this.remainingBlockers = next;
                    } else {
                        // not counted, but move the progress along a tiny bit
                        next = next + 0.5; // do not steal all the next one's progress
                        this.remainingBlockers = (8 * remaining + next) / 9;
                    }
                }
                console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
                this.UpdateStatus();

                // catches pause/resume main loop from blocker execution
                if (thisMainLoopId < this.currentlyRunningMainloop) return;

                setTimeout(this.Runner, 0);
                return;
            }

            // catch pauses from non-main loop sources
            if (thisMainLoopId < this.currentlyRunningMainloop) return;

            // Implement very basic swap interval control
            this.currentFrameNumber = this.currentFrameNumber + 1 | 0;
            if (this.timingMode == 1/*EM_TIMING_RAF*/ && this.timingValue > 1 && this.currentFrameNumber % this.timingValue !== 0) {
                // Not the scheduled time to render this frame - skip.
                this.Scheduler();
                return;
            } else if (this.timingMode === 0/*EM_TIMING_SETTIMEOUT*/) {
                this.tickStartTime = _emscripten_get_now();
            }

            // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
            // VBO double-buffering and reduce GPU stalls.

            if (this.method === 'timeout' && this.Module.ctx) {
                this.Module.warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
                this.method = ''; // just warn once per call to set main loop
            }

            this.runIter(browserIterationFunc);

            this.Module.checkStackCookie();

            // catch pauses from the main loop itself
            if (thisMainLoopId < this.currentlyRunningMainloop) return;

            // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
            // to queue the newest produced audio samples.
            // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
            //       do not need to be hardcoded into this function, but can be more generic.
            if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();

            this.Scheduler();
        }

        if (!noSetTiming) {
            if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
            else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)

            this.Scheduler();
        }

        if (simulateInfiniteLoop) {
            throw 'unwind';
        }
    }
    public runIter(func: Function): void {
        if (this.Module.ABORT) return;
        if (this.Module.preMainLoop != null) {
            var preRet = this.Module.preMainLoop();
            if (preRet === false) {
                return; // |return false| skips a frame
            }
        }
        try {
            func();
        } catch (e: any) {
            if (e instanceof ExitStatus) {
                return;
            } else if (e == 'unwind') {
                return;
            } else {
                if (e && typeof e === 'object' && e.stack)
                    this.Module.err('exception thrown: ' + [e, e.stack]);
                throw e;
            }
        }
        if (this.Module.postMainLoop != null) {
            this.Module.postMainLoop();
        }
    }

}

declare var MozBlobBuilder, WebKitBlobBuilder;
export class Browser {
    private Module: IModule = null as any;
    public mainLoop: MainLoop;
    public isFullscreen: boolean = false;
    public pointerLock: boolean = false;
    public moduleContextCreatedCallbacks: Function[] = [];
    public workers: any[] = [];
    public initted: boolean = false;
    private hasBlobConstructor: boolean = false;
    private BlobBuilder: any;
    private URLObject: any;

    public constructor(module: IModule) {
        this.mainLoop = new MainLoop(module);
        this.Module = module;
    }
    public init(): void {
        if (!this.Module.preloadPlugins != null) {
            this.Module.preloadPlugins = []; // needs to exist even in workers
        }

        if (this.initted) return;
        this.initted = true;

        try {
            new Blob();
            this.hasBlobConstructor = true;
        } catch (e) {
            this.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        this.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!this.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        this.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!this.Module.noImageDecoding && typeof this.URLObject === 'undefined') {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            this.Module.noImageDecoding = true;
        }

        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).

        var imagePlugin = {};
        imagePlugin['canHandle'] = (name) => {
            return !this.Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = (byteArray, name, onload, onerror) => {
            let b: Blob = null as any;
            if (this.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray], { type: this.getMimetype(name) });
                    if (b.size !== byteArray.length) { // Safari bug #118630
                        // Safari's Blob can only take an ArrayBuffer
                        b = new Blob([(new Uint8Array(byteArray)).buffer], { type: this.getMimetype(name) });
                    }
                } catch (e) {
                    this.Module.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
                }
            }
            if (!b) {
                var bb = new this.BlobBuilder();
                bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
                b = bb.getBlob();
            }
            var url = this.URLObject.createObjectURL(b);
            this.Module.assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var img = new Image();
            img.onload = () => {
                this.Module.assert(img.complete, 'Image ' + name + ' could not be decoded');
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);
                this.Module.preloadedImages[name] = canvas;
                this.URLObject.revokeObjectURL(url);
                if (onload) onload(byteArray);
            };
            img.onerror = (event) => {
                console.log('Image ' + url + ' could not be decoded');
                if (onerror) onerror();
            };
            img.src = url;
        };
        this.Module.preloadPlugins.push(imagePlugin);

        const audioPlugin = {};
        audioPlugin['canHandle'] = (name) => {
            return !this.Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = (byteArray, name, onload, onerror) => {
            var done = false;
            const finish = (audio) => {
                if (done) return;
                done = true;
                this.Module.preloadedAudios[name] = audio;
                if (onload) {
                    onload(byteArray);
                }
            }
            const fail = () => {
                if (done) return;
                done = true;
                this.Module.preloadedAudios[name] = new Audio(); // empty shim
                if (onerror) onerror();
            }
            if (this.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray], { type: this.getMimetype(name) });
                } catch (e) {
                    return fail();
                }
                var url = this.URLObject.createObjectURL(b); // XXX we never revoke this!
                this.Module.assert(typeof url == 'string', 'createObjectURL must return a url as a string');
                var audio = new Audio();
                audio.addEventListener('canplaythrough', function () { finish(audio) }, false); // use addEventListener due to chromium bug 124926
                audio.onerror = function audio_onerror(event) {
                    if (done) return;
                    console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
                    const encode64 = (data) => {
                        var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                        var PAD = '=';
                        var ret = '';
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = (leftchar << 8) | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = (leftchar >> (leftbits - 6)) & 0x3f;
                                leftbits -= 6;
                                ret += BASE[curr];
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD;
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 0xf) << 2];
                            ret += PAD;
                        }
                        return ret;
                    }
                    audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
                    finish(audio); // we don't wait for confirmation this worked - but it's worth trying
                };
                audio.src = url;
                // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
                this.safeSetTimeout(() => {
                    finish(audio); // try to use it even though it is not necessarily ready to play
                }, 10000);
            } else {
                return fail();
            }
        };
        this.Module.preloadPlugins.push(audioPlugin);

        // Canvas event setup

        const pointerLockChange = () => {
            this.pointerLock = document['pointerLockElement'] === this.Module.Canvas ||
                document['mozPointerLockElement'] === this.Module.Canvas ||
                document['webkitPointerLockElement'] === this.Module.Canvas ||
                document['msPointerLockElement'] === this.Module.Canvas;
        }
        var canvas = this.Module.Canvas;
        if (canvas) {
            // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
            // Module['forcedAspectRatio'] = 4 / 3;

            canvas.requestPointerLock = canvas['requestPointerLock'] ||
                canvas['mozRequestPointerLock'] ||
                canvas['webkitRequestPointerLock'] ||
                canvas['msRequestPointerLock'] ||
                function () { };
            (canvas as any).exitPointerLock = document['exitPointerLock'] ||
                document['mozExitPointerLock'] ||
                document['webkitExitPointerLock'] ||
                document['msExitPointerLock'] ||
                function () { }; // no-op if function does not exist
            (canvas as any).exitPointerLock = (canvas as any).exitPointerLock.bind(document);

            document.addEventListener('pointerlockchange', pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
            document.addEventListener('mspointerlockchange', pointerLockChange, false);

            if (this.Module.elementPointerLock) {
                canvas.addEventListener("click", (ev) => {
                    if (!this.pointerLock && this.Module.Canvas.requestPointerLock) {
                        this.Module.Canvas.requestPointerLock();
                        ev.preventDefault();
                    }
                }, false);
            }
        }
    }

    public CreateCanvas(width:int, height:int):HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    public static CreateRenderingContext(width:int, height:int):CanvasRenderingContext2D {
        const canvas:HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext('2d')!;
    }
    public CreateContext(canvas: HTMLCanvasElement, useWebGL: boolean, setInModule: boolean, webGLContextAttributes: any): CanvasRenderingContext2D {
        if (useWebGL && this.Module.ctx && canvas === this.Module.Canvas) return this.Module.ctx; // no need to recreate GL context if it's already been created for this canvas.

        var ctx;
        var contextHandle;
        if (useWebGL) {
            // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
            var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: 1,
            };

            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute];
                }
            }

            // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
            // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
            // Browser.createContext() should not even be emitted.
            if (typeof GL !== 'undefined') {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                    ctx = GL.getContext(contextHandle).GLctx;
                }
            }
        } else {
            ctx = canvas.getContext('2d');
        }

        if (!ctx) return null as any;

        if (setInModule) {
            if (!useWebGL) this.Module.assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');

            this.Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            this.Module.useWebGL = useWebGL;
            this.moduleContextCreatedCallbacks.forEach(function (callback) { callback() });
            this.init();
        }
        return ctx;
    }
    public destroyContext(canvas: HTMLCanvasElement, useWebGL: boolean, setInModule: boolean) {

    }
    private fullscreenHandlersInstalled: boolean = false;
    private lockPointer: boolean = true;
    private resizeCanvas: boolean = false;
    // private exitFullscreen:boolean = false;
    public requestFullscreen(lockPointer: boolean, resizeCanvas: boolean): void {
        this.lockPointer = lockPointer;
        this.resizeCanvas = resizeCanvas;
        /*  if (typeof this.lockPointer === 'undefined') this.lockPointer = true;
         if (typeof this.resizeCanvas === 'undefined') this.resizeCanvas = false; */

        const canvas: any = this.Module.Canvas;
        const fullscreenChange = () => {
            this.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
                document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
                document['webkitCurrentFullScreenElement']) === canvasContainer) {
                canvas.exitFullscreen = this.exitFullscreen;
                if (this.lockPointer) canvas.requestPointerLock();
                this.isFullscreen = true;
                if (this.resizeCanvas) {
                    this.setFullscreenCanvasSize();
                } else {
                    this.updateCanvasDimensions(canvas);
                }
            } else {
                // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);

                if (this.resizeCanvas) {
                    this.setWindowedCanvasSize();
                } else {
                    this.updateCanvasDimensions(canvas);
                }
            }
            if (this.Module.onFullScreen) this.Module.onFullScreen(this.isFullscreen);
            if (this.Module.onFullscreen) this.Module.onFullscreen(this.isFullscreen);
        }

        if (!this.fullscreenHandlersInstalled) {
            this.fullscreenHandlersInstalled = true;
            document.addEventListener('fullscreenchange', fullscreenChange, false);
            document.addEventListener('mozfullscreenchange', fullscreenChange, false);
            document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
            document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }

        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);

        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
            canvasContainer['mozRequestFullScreen'] ||
            canvasContainer['msRequestFullscreen'] ||
            (canvasContainer['webkitRequestFullscreen'] ? function () { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
            (canvasContainer['webkitRequestFullScreen'] ? function () { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);

        canvasContainer.requestFullscreen();
    }
    public requestFullScreen(): void {
        this.Module.abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
    }
    public exitFullscreen(): boolean {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!this.isFullscreen) {
            return false;
        }

        const CFS = document['exitFullscreen'] ||
            document['cancelFullScreen'] ||
            document['mozCancelFullScreen'] ||
            document['msExitFullscreen'] ||
            document['webkitCancelFullScreen'] ||
            (function () { });
        CFS.apply(document, []);
        return true;
    }
    public nextRAF: int = 0;
    public fakeRequestAnimationFrame(func: Function): void {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (this.nextRAF === 0) {
            this.nextRAF = now + 1000 / 60;
        } else {
            while (now + 2 >= this.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
                this.nextRAF += 1000 / 60;
            }
        }
        const delay = Math.max(this.nextRAF - now, 0);
        setTimeout(func, delay);
    }
    public requestAnimationFrame(func: Function): void {
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(func as any);
            return;
        }
        const RAF = this.fakeRequestAnimationFrame;
        RAF(func);
    }
    public safeRequestAnimationFrame(func: Function) {
        return this.requestAnimationFrame(() => {
            if (this.Module.ABORT) return;
            func();
        });
    }
    private noExitRuntime: boolean = true;
    public safeSetTimeout(func: Function, timeout: int): int {
        this.noExitRuntime = true;
        return setTimeout(() => {
            if (this.Module.ABORT) {
                return;
            }
            func();
        }, timeout) as any;
    }
    private getMimetype(name: string): string {
        return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.') + 1)] as any;
    }
    protected getUserMedia(func: Function): any {
        if (!(window as any).getUserMedia) {
            (window as any).getUserMedia = navigator['getUserMedia'] ||
                navigator['mozGetUserMedia'];
        }
        (window as any).getUserMedia(func);
    }
    private getMovementX(event): int {
        return event['movementX'] ||
            event['mozMovementX'] ||
            event['webkitMovementX'] ||
            0;
    }
    private getMovementY(event): int {
        return event['movementY'] ||
            event['mozMovementY'] ||
            event['webkitMovementY'] ||
            0;
    }
    public GetMouseWheelDelta(event): int {
        var delta = 0;
        switch (event.type) {
            case 'DOMMouseScroll':
                // 3 lines make up a step
                delta = event.detail / 3;
                break;
            case 'mousewheel':
                // 120 units make up a step
                delta = event.wheelDelta / 120;
                break;
            case 'wheel':
                delta = event.deltaY
                switch (event.deltaMode) {
                    case 0:
                        // DOM_DELTA_PIXEL: 100 pixels make up a step
                        delta /= 100;
                        break;
                    case 1:
                        // DOM_DELTA_LINE: 3 lines make up a step
                        delta /= 3;
                        break;
                    case 2:
                        // DOM_DELTA_PAGE: A page makes up 80 steps
                        delta *= 80;
                        break;
                    default:
                        throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
                }
                break;
            default:
                throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
    }
    public mouseX: int = 0;
    public mouseY: int = 0;
    public mouseMovementX: int = 0;
    public mouseMovementY: int = 0;
    public touches: any = {};
    public lastTouches: any = {};
    public CalculateMouseEvent(event) { // event should be mousemove, mousedown or mouseup
        if (this.pointerLock) {
            // When the pointer is locked, calculate the coordinates
            // based on the movement of the mouse.
            // Workaround for Firefox bug 764498
            if (event.type != 'mousemove' && ('mozMovementX' in event)) {
                this.mouseMovementX = this.mouseMovementY = 0;
            } else {
                this.mouseMovementX = this.getMovementX(event);
                this.mouseMovementY = this.getMovementY(event);
            }

            // check if SDL is available
            if (typeof SDL != "undefined") {
                this.mouseX = SDL.mouseX + this.mouseMovementX;
                this.mouseY = SDL.mouseY + this.mouseMovementY;
            } else {
                // just add the mouse delta to the current absolut mouse position
                // FIXME: ideally this should be clamped against the canvas size and zero
                this.mouseX += this.mouseMovementX;
                this.mouseY += this.mouseMovementY;
            }
        } else {
            // Otherwise, calculate the movement based on the changes
            // in the coordinates.
            var rect = this.Module.Canvas.getBoundingClientRect();
            var cw = this.Module.Canvas.width;
            var ch = this.Module.Canvas.height;

            // Neither .scrollX or .pageXOffset are defined in a spec, but
            // we prefer .scrollX because it is currently in a spec draft.
            // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
            var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
            var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
            // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
            // and we have no viable fallback.
            this.Module.assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');

            if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
                var touch = event.touch;
                if (touch === undefined) {
                    return; // the "touch" property is only defined in SDL

                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);

                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);

                var coords = { x: adjustedX, y: adjustedY };

                if (event.type === 'touchstart') {
                    this.lastTouches[touch.identifier] = coords;
                    this.touches[touch.identifier] = coords;
                } else if (event.type === 'touchend' || event.type === 'touchmove') {
                    var last = this.touches[touch.identifier];
                    if (!last) last = coords;
                    this.lastTouches[touch.identifier] = last;
                    this.touches[touch.identifier] = coords;
                }
                return;
            }

            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);

            // the canvas might be CSS-scaled compared to its backbuffer;
            // SDL-using content will want mouse coordinates in terms
            // of backbuffer units.
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);

            this.mouseMovementX = x - this.mouseX;
            this.mouseMovementY = y - this.mouseY;
            this.mouseX = x;
            this.mouseY = y;
        }
    }
    public asyncLoad(url: string, onload: Function, onerror: Function, noRunDep?: boolean) {
        const dep: string = !noRunDep ? this.Module.getUniqueRunDependency('al ' + url) : '';
        this.Module.readAsync(url, (arrayBuffer) => {
            this.Module.assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep) {
                this.Module.RemoveRunDependency(dep);
            }
        }, (event) => {
            if (onerror) {
                onerror();
            } else {
                throw 'Loading data file "' + url + '" failed.';
            }
        });
        if (dep) {
            this.Module.AddRunDependency(dep);
        }
    }
    public resizeListeners: Function[] = [];
    private updateResizeListeners(): void {
        const canvas = this.Module.Canvas;
        this.resizeListeners.forEach(function (listener) {
            listener(canvas.width, canvas.height);
        });
    }
    public setCanvasSize(width: int, height: int, noUpdates?: boolean): void {
        const canvas: HTMLCanvasElement = this.Module.Canvas;
        this.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) {
            this.updateResizeListeners();
        }
    }
    private windowedWidth: int = 0;
    private windowedHeight: int = 0;
    private setFullscreenCanvasSize(): void {
        // check if SDL is available
        if (typeof SDL != "undefined") {
            let flags = this.Module.HEAPU32[((SDL.screen) >> 2)];
            flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
            this.Module.HEAP32[((SDL.screen) >> 2)] = flags
        }
        this.updateCanvasDimensions(this.Module.Canvas);
        this.updateResizeListeners();
    }
    private setWindowedCanvasSize(): void {
        // check if SDL is available
        if (typeof SDL !== "undefined") {
            var flags = this.Module.HEAPU32[((SDL.screen) >> 2)];
            flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
            this.Module.HEAP32[((SDL.screen) >> 2)] = flags
        }
        this.updateCanvasDimensions(this.Module.Canvas);
        this.updateResizeListeners();
    }
    private updateCanvasDimensions(canvas: HTMLCanvasElement, wNative?: int, hNative?: int): void {
        if (wNative && hNative) {
            (canvas as any).widthNative = wNative;
            (canvas as any).heightNative = hNative;
        } else {
            wNative = (canvas as any).widthNative;
            hNative = (canvas as any).heightNative;
        }
        let w: int = (wNative as any);
        let h: int = (hNative as any);
        if (this.Module.forcedAspectRatio && this.Module.forcedAspectRatio > 0) {
            if (w / h < this.Module.forcedAspectRatio) {
                w = Math.round(h * this.Module.forcedAspectRatio);
            } else {
                h = Math.round(w / this.Module.forcedAspectRatio);
            }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
            document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
            document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor);
        }
        if (this.resizeCanvas) {
            if (canvas.width !== w) canvas.width = w;
            if (canvas.height !== h) canvas.height = h;
            if (typeof canvas.style !== 'undefined') {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height");
            }
        } else {
            if (canvas.width !== wNative) canvas.width = wNative!;
            if (canvas.height !== hNative) canvas.height = hNative!;
            if (typeof canvas.style !== 'undefined') {
                if (w !== wNative || h !== hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important");
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height");
                }
            }
        }
    }
    private wgetRequests: any = {};
    private nextWgetRequestHandle: int = 0;
    private getNextWgetRequestHandle() {
        var handle = this.nextWgetRequestHandle;
        this.nextWgetRequestHandle++;
        return handle;
    }

    public static get WindowWidth(): int {
        return getWindowWidth();
    }
    public static get WindowHeight(): int {
        return getWindowHeight();
    }
}