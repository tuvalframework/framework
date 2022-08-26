import { TVC } from './TVC';
import { Banks } from './Banks';
import { Utilities } from './Utilities';

export class Renderer {
    tvc: TVC;
    manifest: any;
    utilities: Utilities;
    banks: Banks;
    canvas: HTMLCanvasElement;
    context: any;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
    scaleX: any;
    background: any;
    backgroundColor: any;
    redrawBars: boolean;
    xLeftDraw: number;
    yTopDraw: number;
    widthDraw: number;
    heightDraw: number;
    halted: boolean;
    blackAtFirst: boolean;
    fpsRectX: any;
    fpsRectY: any;
    fpsRectWidth: any;
    fpsRectHeight: number = undefined as any;
    debugX: number;
    debugY: number;
    fullScreenIcons: any;
    modified: boolean;
    doubleBuffer: boolean;
    viewOn: boolean;
    fullScreenIconRatio: number = undefined as any;
    resetDisplay: boolean = undefined as any;
    forceOnce: boolean = undefined as any;
    previousFps: any;
    hardLeftX: number = undefined as any;
    hardTopY: number = undefined as any;
    hardWidth: number = undefined as any;
    hardHeight: number = undefined as any;
    scaleY: number = undefined as any;
    platform: string = undefined as any;
    rendering: any;
    xRatioDisplay: number = undefined as any;
    yRatioDisplay: number = undefined as any;
    fullScreenIconOn: any;
    fullScreenIconX: any;
    fullScreenIconWidth: any;
    fullScreenIconY: any;
    fullScreenIconHeight: any;
    guruMeditation: any;
    blackAtFirstCount: number = undefined as any;

    public constructor(tvc: TVC, canvas:string | HTMLCanvasElement){
        this.tvc = tvc;


        this.manifest = this.tvc.manifest;
        this.utilities = this.tvc.utilities;
        this.banks = this.tvc.Banks;
        this.canvas = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as any;
        this.context = this.canvas.getContext('2d')!;

        var width = this.canvas.width;
        var height = this.canvas.height;
        if (this.manifest.display.fullScreen || this.manifest.display.fullPage) {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        this.width = width;
        this.height = height;
        this.originalWidth = width;
        this.originalHeight = height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.scaleX = typeof this.manifest.display.scaleX != 'undefined' ? this.manifest.display.scaleX : 1;
        this.scaleY = typeof this.manifest.display.scaleY != 'undefined' ? this.manifest.display.scaleY : 1;
        this.background = typeof this.manifest.display.background != 'undefined' ? this.manifest.display.background : 'color';
        this.backgroundColor = typeof this.manifest.display.backgroundColor != 'undefined' ? this.manifest.display.backgroundColor : '#000000';
        this.redrawBars = true;
        this.xLeftDraw = 0;
        this.yTopDraw = 0;
        this.widthDraw = 320;
        this.heightDraw = 200;
        this.halted = false;

        var self = this;
        this.blackAtFirst = true;
        setTimeout(function () {
            self.blackAtFirst = false;
        }, 100);


        // Display FPS?
        if (this.manifest.display.fps) {
            var height = this.utilities.getFontStringHeight(this.manifest.display.fpsFont);
            this.fpsRectX = this.manifest.display.fpsX;
            this.fpsRectY = this.manifest.display.fpsY;
            this.fpsRectWidth = this.context.measureText('XXX FPS').width;
            this.fpsRectHeight = height;
        }

        this.debugX = 1;
        this.debugY = 1;
        window.addEventListener("resize", doResize);
        doResize(true);

        // Load the full screen icons
        if (this.manifest.display.fullScreenIcon) {
            this.utilities.loadUnlockedImages(
                [
                    './run/resources/full_screen.png',
                    './run/resources/small_screen.png',
                ], {}, function (response, images, extra) {
                    if (response) {
                        self.fullScreenIcons = images;
                    }
                    else {
                        self.tvc.loadingError = 'file_not_found';
                    }
                });
        }

        this.modified = true;
        this.doubleBuffer = false;
        this.viewOn = true;

        function doResize(force) {
            console.log(self);
            if (force && (self.manifest.display.fullScreen || self.manifest.display.fullPage)) {
                self.width = window.innerWidth;
                self.height = window.innerHeight;
                self.canvas.width = self.width;
                self.canvas.height = self.height;
                self.fullScreenIconRatio = self.width / self.manifest.display.width;
                self.redrawBars = true;
                self.resetDisplay = true;
            }

            self.forceOnce = true
        }

    }

    private init() {
    };
    private getSoftwareFromHardwareX(x) {

    };
    private setDoubleBuffer() {
        this.doubleBuffer = true;
    };
    private autoback(mode) {
        if (!this.doubleBuffer)
            throw { error: 'illegal_function_call', parameter: '(double buffer not set)' };
        if (mode == 0)
            this.viewOn = false;
        else
            this.viewOn = true;
    };
    private screenSwap() {
        if (!this.doubleBuffer)
            throw { error: 'illegal_function_call', parameter: '(double buffer not set)' };
        if (!this.viewOn)
            this.render(true);
    }

    public setModified() {
        this.modified = true;
    }

    public setBackgroundColor(color) {
        this.backgroundColor = color;
        this.resetDisplay = true;
        this.setModified();
    }

    private setView(onOff) {
        this.viewOn = onOff;
    }

    private view(onOff) {
        this.viewOn = true;
        this.render(true);
    }

    private setScreenDisplay() {
        var hardTopY = 0, hardHeight = 0;
        if (this.tvc.platform == 'amiga') {
            switch (this.manifest.display.tvStandard) {
                case 'pal':
                    hardTopY = 30;
                    hardHeight = 311 - hardTopY;
                    break;
                default:
                case 'ntsc':
                    hardTopY = 30;
                    hardHeight = 261 - hardTopY;
                    break;
            }
        }
        else if (this.platform == 'atari') {

        }

        switch (this.tvc.platform) {
            default:
            case 'atari':
                break;
            case 'amiga':
                this.hardLeftX = 110;
                this.hardTopY = hardTopY;
                this.hardWidth = 342;
                this.hardHeight = hardHeight;
                break;

            case 'tvc':
            case 'pc':
                this.hardLeftX = 0;
                this.hardTopY = 0;
                this.hardWidth = this.widthDraw / this.scaleX;
                this.hardHeight = this.heightDraw / this.scaleY;
                break;
        }
    }

    public render(force?) {
        var self = this;
        if (this.blackAtFirst)
            return;

        force = typeof force == 'undefined' ? false : true;
        force |= (this.forceOnce as any);
        this.forceOnce = false;
        if (!this.tvc.crash && !this.rendering && (force || (this.modified && this.viewOn))) {
            this.rendering = true;
            this.context.save();
            this.context.globalAlpha = 1.0;

            if (this.manifest.display.smoothing) {
                this.context.imageSmoothingEnabled = true;
                this.context.mozImageSmoothingEnabled = true;
                this.context.webkitImageSmoothingEnabled = true;
                this.context.msImageSmoothingEnabled = true;
                this.context.imageSmoothingEnabled = true;
                this.context.imageRendering = 'smooth';
            }
            else {
                this.context.imageSmoothingEnabled = false;
                this.context.mozImageSmoothingEnabled = false;
                this.context.webkitImageSmoothingEnabled = false;
                this.context.msImageSmoothingEnabled = false;
                this.context.imageSmoothingEnabled = false;
                this.context.imageRendering = 'pixelated';
            }

            // Drawing area
            var widthDraw = this.width;
            var heightDraw = this.height;
            var doClip = false;
            if (this.manifest.display.fullPage || this.manifest.display.fullScreen) {
                if (this.manifest.display.keepProportions) {
                    var originalRatio = this.manifest.display.width / this.manifest.display.height;
                    var w = heightDraw * originalRatio;
                    var h = widthDraw / originalRatio;
                    if (h <= heightDraw) {
                        widthDraw = h * originalRatio;
                        heightDraw = h;
                    }
                    else {
                        widthDraw = w;
                        heightDraw = w / originalRatio;
                    }
                    doClip = true;
                }
            }

            var xLeftDraw = (this.width - widthDraw) / 2;
            var yTopDraw = (this.height - heightDraw) / 2;

            this.xLeftDraw = xLeftDraw;
            this.yTopDraw = yTopDraw;
            this.widthDraw = widthDraw;
            this.heightDraw = heightDraw;
            this.setScreenDisplay();

            // Reset display
            if (this.background == 'transparent') {
                if (this.resetDisplay)
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                else
                    this.context.clearRect(xLeftDraw, yTopDraw, widthDraw, heightDraw);
            }
            else {
                this.context.fillStyle = this.backgroundColor;
                if (this.resetDisplay)
                    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                else
                    this.context.fillRect(xLeftDraw, yTopDraw, widthDraw, heightDraw);
            }
            this.resetDisplay = false;

            // If full screen, clip!
            if (doClip) {
                const path = new Path2D();
                path.rect(xLeftDraw, yTopDraw, widthDraw, heightDraw);
                this.context.clip(path);
            }
            this.xRatioDisplay = widthDraw / this.hardWidth;
            this.yRatioDisplay = heightDraw / this.hardHeight;

            if (this.tvc.platform == 'tvc' || this.tvc.platform == 'pc') {
                this.xRatioDisplay *= (widthDraw / this.manifest.display.width);
                this.yRatioDisplay *= (heightDraw / this.manifest.display.height);
            }

            // Draw screens
            if (this.tvc.screensContext.isAny()) {
                // Rainbows
                var rainbowsToRemove;
                var rainbowsToDraw;
                if (this.tvc.moduleRainbows) {
                    var numberOfRainbows = 0;
                    var rainbows: any[] = [];
                    for (var rainbow = this.tvc.moduleRainbows.context.getFirstElement(this.tvc.currentContextName); rainbow != null; rainbow = this.tvc.moduleRainbows.context.getNextElement(this.tvc.currentContextName))
                        rainbows[numberOfRainbows++] = rainbow;

                    if (this.tvc.moduleRainbows.mode == 'slow') {
                        if (numberOfRainbows)
                            rainbowsToDraw = rainbows;
                    }
                    else if (this.tvc.moduleRainbows.mode == 'fast') {
                        if (numberOfRainbows > 0) {
                            // Insert rainbow screen at the correct Z position in screens
                            var screen;
                            var screens: any[] = [];
                            var countScreens = 0;
                            for (screen = this.tvc.screensContext.getFirstElement(this.tvc.currentContextName); screen != null; screen = this.tvc.screensContext.getNextElement()) {
                                for (var r = 0; r < numberOfRainbows; r++) {
                                    var rainbow = rainbows[r];
                                    if (countScreens == rainbow.zPosition && rainbow.screen) {
                                        if (!screens[r]) {
                                            screens[r] = screen;
                                            countScreens++;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (countScreens) {
                                rainbowsToRemove = [];
                                for (var r = 0; r < rainbows.length; r++) {
                                    if (rainbows[r].screen) {
                                        rainbowsToRemove.push(rainbows[r]);
                                        rainbows[r].screen.show(true);
                                        if (screens[r]) {
                                            this.tvc.screensContext.addElement(this.tvc.currentContextName, rainbows[r].screen);
                                            this.tvc.screensContext.moveBefore(this.tvc.currentContextName, rainbows[r].screen, screens[r]);
                                            screens[r] = null;
                                        }
                                    }
                                }
                                for (var r = 0; r < rainbows.length; r++) {
                                    if (rainbows[r].screen) {
                                        if (screens[r]) {
                                            this.tvc.screensContext.addElement(this.tvc.currentContextName, rainbows[r]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Update the bobs and sprites
                this.tvc.rendererUpdate();
                this.tvc.screensContext.parseSorted(undefined, function (screen1, screen2) {
                    if (screen1.vars.z < screen2.vars.z)
                        return -1;
                    if (screen1.vars.z > screen2.vars.z)
                        return 1;
                    if (screen1.index < screen2.index)
                        return -1;
                    if (screen1.index > screen2.index)
                        return 1;
                    return 0;
                },
                    function (screen) {
                        if (screen.vars.visible) {
                            var xDrawScreen;
                            var yDrawScreen;
                            var offsetX = screen.vars.offsetX * screen.vars.scaleX/* screen.scale.x */;
                            var offsetY = screen.vars.offsetY * screen.vars.scaleY/* screen.scale.y */;
                            if (screen.isCenteredX)
                                xDrawScreen = xLeftDraw + widthDraw / 2 - (screen.dimension.width / 2 * screen.vars.scaleX /* screen.scale.x */ * self.xRatioDisplay) - self.hardLeftX * self.xRatioDisplay;
                            else
                                xDrawScreen = (screen.vars.x - self.hardLeftX) * self.xRatioDisplay + xLeftDraw;
                            if (screen.isCenteredY)
                                yDrawScreen = yTopDraw + heightDraw / 2 - (screen.dimension.height / 2 * screen.vars.scaleY/*  screen.scale.y */ * self.yRatioDisplay) - self.hardTopY * self.yRatioDisplay;
                            else
                                yDrawScreen = (screen.vars.y - self.hardTopY) * self.yRatioDisplay + yTopDraw;
                            var xScaleScreen = screen.vars.scaleX * screen.renderScale.x * (self.xRatioDisplay / screen.scale.x);// as '/ screen.scale.x' is cancelled out in all but one place it is used, I deleted it here.
                            var yScaleScreen = screen.vars.scaleY * screen.renderScale.y * (self.yRatioDisplay / screen.scale.y);
                            var width = screen.vars.width * screen.scale.x;
                            var height = screen.vars.height * screen.scale.y;

                            var widthDrawScreen = width * xScaleScreen;  // changed because...
                            //  Effectively >>>
                            //  widthDrawScreen = screen.vars.width * screen.scale.x * screen.vars.scaleX * screen.renderScale.x * self.xRatioDisplay / screen.scale.x;
                            //                                             |                                                                                  |
                            //                                             \____________________________ cancel each other out _______________________________/

                            var heightDrawScreen = height * yScaleScreen;

                            var deltaX = 0;
                            var deltaY = 0;
                            if (screen.vars.angle == 0 && screen.vars.skewX == 0 && screen.vars.skewY == 0 && screen.vars.offsetX == 0 && screen.vars.offsetY == 0) {
                                deltaX = screen.vars.hotspotX * self.xRatioDisplay * screen.vars.scaleX;
                                deltaY = screen.vars.hotspotY * self.yRatioDisplay * screen.vars.scaleY;
                                self.context.drawImage(screen.canvas, screen.vars.offsetX * screen.scale.x, screen.vars.offsetY * screen.scale.y, width, height, xDrawScreen - deltaX, yDrawScreen - deltaY, widthDrawScreen, heightDrawScreen);

                                // Bobs!
                                if (screen.bobsContext.isAny()) {
                                    // Clip the canvas
                                    self.context.save();
                                    const path = new Path2D();
                                    path.rect(Math.max(xDrawScreen - deltaX - offsetX, 0), Math.max(yDrawScreen - deltaY - offsetY, 0), widthDrawScreen - Math.abs(offsetX), heightDrawScreen - Math.abs(offsetY));
                                    self.context.clip(path);

                                    // Go through all the bobs...
                                    screen.bobsContext.parseAll(undefined, function (bob) {
                                        if (bob.vars.visible && bob.canvas) {
                                            var canvas = bob.canvas;

                                            var xScale = xScaleScreen * bob.scaleDisplay.x * screen.scale.x;
                                            //  Effectively >>>
                                            //  xScale = screen.vars.scaleX * screen.renderScale.x * self.xRatioDisplay / screen.scale.x * bob.scaleDisplay.x * screen.scale.x;
                                            //                                           										|                                      |
                                            //                                            										 \______ cancel each other out _______/

                                            var yScale = yScaleScreen * bob.scaleDisplay.y * screen.scale.y;
                                            var xBob = bob.positionDisplay.x * screen.renderScale.x * xScaleScreen * screen.scale.x + xDrawScreen - deltaX;
                                            //  Effectively >>>
                                            //	xBob = bob.positionDisplay.x * screen.renderScale.x * screen.vars.scaleX * screen.renderScale.x * self.xRatioDisplay / screen.scale.x * screen.scale.x + xDrawScreen - deltaX
                                            //											\______________ used twice _______________/								           \__cancel each other__/

                                            var yBob = bob.positionDisplay.y * screen.renderScale.y * yScaleScreen * screen.scale.y + yDrawScreen - deltaY;
                                            if (bob.clipping) {
                                                self.context.save();
                                                const path = new Path2D();
                                                path.rect(bob.clipping.x * screen.renderScale.x * xScaleScreen * screen.scale.x + xDrawScreen,
                                                    // again here  /_____________/________________/

                                                    bob.clipping.y * screen.renderScale.y * yScaleScreen * screen.scale.y + yDrawScreen,
                                                    bob.clipping.width * screen.renderScale.x * xScaleScreen * screen.scale.x,
                                                    // again here  /_______________/_______________/

                                                    bob.clipping.height * screen.renderScale.y * yScaleScreen * screen.scale.y);
                                                self.context.clip(path);
                                            }
                                            self.context.globalAlpha = bob.vars.alpha;
                                            if (bob.angleDisplay.z == 0 && bob.skewDisplay.x == 0 && bob.skewDisplay.y == 0) {
                                                self.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, xBob - bob.hotSpot.x * xScale, yBob - bob.hotSpot.y * yScale, xScale * canvas.width, yScale * canvas.height);
                                            }
                                            else {
                                                self.context.translate(xBob, yBob);
                                                self.context.rotate(bob.angleDisplay.z);
                                                self.context.scale(xScale, yScale);
                                                self.context.translate(-bob.hotSpot.x, -bob.hotSpot.y);
                                                self.context.drawImage(canvas, 0, 0);
                                                self.context.rotate(0);
                                                self.context.setTransform(1, 0, 0, 1, 0, 0);
                                            }
                                            if (bob.clipping)
                                                self.context.restore();
                                        }
                                    });
                                    self.context.restore();
                                }
                            }
                            else {
                                self.context.translate(xDrawScreen, yDrawScreen);
                                self.context.rotate(screen.vars.angle);
                                //self.context.scale( xScaleScreen, yScaleScreen );
                                self.context.transform(xScaleScreen, screen.vars.skewX, screen.vars.skewY, yScaleScreen, 0, 0);
                                self.context.translate(-screen.vars.hotspotX * screen.scale.x, -screen.vars.hotspotY * screen.scale.y);
                                self.context.drawImage(screen.canvas, offsetX, offsetY, width, height, 0, 0, width, height);

                                // Bobs!
                                if (screen.bobsContext.isAny()) {
                                    // Clip the canvas
                                    self.context.save();
                                    const path = new Path2D();
                                    path.rect(Math.max(-offsetX, 0), Math.max(-offsetY, 0), screen.vars.width - Math.abs(offsetX), screen.vars.height - Math.abs(offsetY));
                                    self.context.clip(path);

                                    // Go through all the bobs...
                                    screen.bobsContext.parseAll(undefined, function (bob) {
                                        if (bob.vars.visible && bob.canvas) {
                                            var canvas = bob.canvas;
                                            var xBob = bob.positionDisplay.x * screen.scale.x - offsetX;
                                            var yBob = bob.positionDisplay.y * screen.scale.y - offsetY;
                                            if (bob.clipping) {
                                                self.context.save();
                                                const path = new Path2D();
                                                path.rect(bob.clipping.x * screen.scale.x,
                                                    bob.clipping.y * screen.scale.y,
                                                    bob.clipping.width * screen.scale.x,
                                                    bob.clipping.height * screen.scale.y);
                                                self.context.clip(path);
                                            }
                                            self.context.globalAlpha = bob.vars.alpha;
                                            if (bob.angleDisplay.z === 0 && bob.skewDisplay.x === 0 && bob.skewDisplay.y === 0) {
                                                self.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, xBob - bob.hotSpot.x * bob.scaleDisplay.x * screen.scale.x, yBob - bob.hotSpot.y * bob.scaleDisplay.y * screen.scale.y, canvas.width * bob.scaleDisplay.x * screen.scale.x, canvas.height * bob.scaleDisplay.y * screen.scale.y);
                                            }
                                            else {
                                                if (!bob.clipping)
                                                    self.context.save();
                                                self.context.translate(xBob, yBob);
                                                self.context.rotate(bob.angleDisplay.z);
                                                self.context.scale(bob.scaleDisplay.x * screen.scale.x, bob.scaleDisplay.y * screen.scale.y);
                                                self.context.translate(-bob.hotSpot.x * screen.scale.x, -bob.hotSpot.y * screen.scale.y);
                                                self.context.drawImage(canvas, 0, 0);
                                                if (!bob.clipping)
                                                    self.context.restore();
                                            }
                                            if (bob.clipping)
                                                self.context.restore();
                                        }
                                    });

                                    // Restore canvas
                                    self.context.restore();
                                }
                                self.context.setTransform(1, 0, 0, 1, 0, 0); // Line added here
                            }
                        }
                    });
                if (rainbowsToRemove) {
                    for (var r = 0; r < rainbowsToRemove.length; r++) {
                        this.tvc.screensContext.deleteElement(this.tvc.currentContextName, rainbowsToRemove[r].screen);
                    }
                }
                else if (rainbowsToDraw) {
                    var scale =
                    {
                        x: this.canvas.width / (this.hardWidth - this.hardLeftX),
                        y: heightDraw / (this.hardHeight - this.hardTopY)
                    };
                    for (var r = 0; r < rainbowsToDraw.length; r++) {
                        var rainbow = rainbowsToDraw[r];
                        var y = Math.floor((rainbow.y - self.hardTopY) * self.yRatioDisplay + yTopDraw);
                        var height = Math.floor(rainbow.displayHeight * self.yRatioDisplay);
                        y = Math.max(y, yTopDraw);
                        height = Math.floor(Math.min(heightDraw - y, height));
                        if (height > 0)
                            rainbow.render(this.context, { x: xLeftDraw, y: y, width: widthDraw, height: height }, scale);
                    }
                }
            };

            // Sprites!
            // Draw sprites
            this.context.setTransform(1, 0, 0, 1, 0, 0);							// Line added here
            if (this.tvc.sprites) {
                this.tvc.sprites.context.parseAll(undefined, function (sprite) {
                    if (sprite.vars.visible && sprite.canvas) {
                        var canvas = sprite.canvas;
                        if (canvas) {
                            self.context.globalAlpha = sprite.vars.alpha;
                            var xDraw = (sprite.positionDisplay.x - self.hardLeftX) * self.xRatioDisplay + xLeftDraw;
                            var yDraw = (sprite.positionDisplay.y - self.hardTopY) * self.yRatioDisplay + yTopDraw;
                            // Added 'scaleDisplay.x == 0 && sprite.scaleDisplay.y == 0 &&' to following line
                            if (sprite.angleDisplay.z === 0 && sprite.skewDisplay.x === 0 && sprite.skewDisplay.y === 0) {
                                var deltaX = sprite.hotSpot.x * sprite.scaleDisplay.x * self.xRatioDisplay;
                                var deltaY = sprite.hotSpot.y * sprite.scaleDisplay.y * self.yRatioDisplay;
                                var width = sprite.imageObject.width * Math.abs(sprite.scaleDisplay.x) * self.xRatioDisplay;
                                var height = sprite.imageObject.height * Math.abs(sprite.scaleDisplay.y) * self.yRatioDisplay;
                                self.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, xDraw - deltaX, yDraw - deltaY, width, height);
                            }
                            else {
                                self.context.translate(xDraw, yDraw);
                                self.context.rotate(sprite.angleDisplay.z);
                                self.context.scale(sprite.scaleDisplay.x * self.xRatioDisplay, sprite.scaleDisplay.y * self.yRatioDisplay);
                                self.context.translate(-sprite.hotSpot.x, -sprite.hotSpot.y);
                                self.context.drawImage(canvas, 0, 0);
                                self.context.setTransform(1, 0, 0, 1, 0, 0);
                                self.context.rotate(0);
                            }
                        }
                    }
                });
            }

            // All done!
            this.context.restore();
        }

        if (this.halted) {
            var heightFont = Math.floor(this.width * 0.015);
            var text = this.halted;
            var x1 = 0;
            var y1 = this.height - heightFont;
            var x2 = this.width;
            var y2 = this.height * 0.85;
            var xText = (x1 + x2) / 2;
            var yText = (y1 + y2) / 2;

            this.context.fillStyle = this.manifest.display.backgroundColor;
            this.context.fillRect(x1, y1, x2 - x1, y2 - y1);
            this.context.fillStyle = "#E0E0E0";
            this.context.font = heightFont + 'px Verdana';
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
            this.context.fillText(text, xText, yText);
        }
        if (!this.tvc.crash) {
            // Display FPS?
            if (this.manifest.display.fps) {
                if ((this.tvc.fpsPosition % 10) == 0 || !this.previousFps) {
                    this.previousFps = 0;
                    for (var f = 0; f < this.tvc.fps.length; f++)
                        this.previousFps += this.tvc.fps[f];
                    this.previousFps = 1000 / (this.previousFps / this.tvc.fps.length);
                }

                let text = this.tvc.errors.getErrorFromNumber(202).message;
                text = this.tvc.utilities.replaceStringInText(text, '%1', '' + Math.floor(this.previousFps));
                this.context.fillStyle = this.manifest.display.backgroundColor;
                this.context.fillRect(this.fpsRectX, this.fpsRectY, this.fpsRectWidth, this.fpsRectHeight);
                this.context.fillStyle = this.manifest.display.fpsColor;
                this.context.font = this.manifest.display.fpsFont;
                this.context.textBaseline = 'top';
                this.context.fillText(text, this.manifest.display.fpsX, this.manifest.display.fpsY);
            }

            // Display Full Screen Icons?
            /* TODO!
            if ( this.manifest.display.fullScreenIcon && this.fullScreenIcons )
            {
                if ( this.isFullScreen() )
                    this.fullScreenIconOn = 'small_screen';
                else
                    this.fullScreenIconOn = 'full_screen';
                var image = this.fullScreenIcons[ this.fullScreenIconOn ];
                this.fullScreenIconX = this.manifest.display.fullScreenIconX >= 0 ? this.manifest.display.fullScreenIconX * this.fullScreenIconRatio : this.width + this.manifest.display.fullScreenIconX  * this.fullScreenIconRatio;
                this.fullScreenIconY = this.manifest.display.fullScreenIconY >= 0 ? this.manifest.display.fullScreenIconY * this.fullScreenIconRatio : this.height + this.manifest.display.fullScreenIconY * this.fullScreenIconRatio;
                this.fullScreenIconWidth = image.width * this.fullScreenIconRatio;
                this.fullScreenIconHeight = image.height * this.fullScreenIconRatio;
                this.context.fillStyle = this.manifest.display.backgroundColor;
                this.context.fillRect( this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
                this.context.drawImage( image, this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
            }
            */
        }
        // The end!
        this.modified = false;
        this.rendering = false;
    };

    private isFullScreen() {
        var full_screen_element = document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement || null;
        return full_screen_element != null;
    }

    public isInFullScreenIcon(position) {
        if (this.fullScreenIconOn) {
            if (position.x >= this.fullScreenIconX && position.x < this.fullScreenIconX + this.fullScreenIconWidth
                && position.y >= this.fullScreenIconY && position.y < this.fullScreenIconY + this.fullScreenIconHeight)
                return this.fullScreenIconOn;

            return false;
        }
    }

    public swapFullScreen() {
        if (document.fullscreenEnabled) {
            if (this.fullScreenIconOn == 'full_screen')
                this.canvas.requestFullscreen();
            else
                document.exitFullscreen();
        }
    }
    public captureCrash(error) {
        // Captures the display
        this.tvc.crash = {};
        this.tvc.crash.canvas = this.canvas.toDataURL('image/png');
        this.tvc.crash.error = error;
    };
    public meditate(error?) {
        var meditations1 =
            [
                'BAAAAAAD',
                'BAADF00D',
                'BADDCAFE',
                '8BADF00D',
                '1BADB002',
                'ABADBABE',
                'DEAD2BAD',
                'DEADBAAD',
                'DEADBABE',
                'DEADBEAF',
                'DEADC0DE',
            ];
        var meditations2 =
            [
                'CODECACA',
                'CODEBAAD',
                'B16B00B5',
                'B105F00D',
                'BEEFBABE',
                'CAFEBABE',
                'CAFED00D',
                'DABBAD00',
                'DAEBA000',
                'FACEFEED',
                'FBADBEEF',
                'FEE1DEAD',
                'FEEDBABE',
                'FEEDC0DE'
            ];

        this.guruMeditation =
        {
            sx: this.canvas.width,
            sy: 160,
            borderOn: false
        }
        this.guruMeditation.sLine = this.guruMeditation.sy / 20,
            this.guruMeditation.fontHeight = this.guruMeditation.sy / 6,
            this.guruMeditation.sxBorder = this.guruMeditation.sx / 40;
        this.guruMeditation.syBorder = this.guruMeditation.sy / 8;
        this.guruMeditation.yText1 = this.guruMeditation.sy / 2 - this.guruMeditation.fontHeight;
        this.guruMeditation.yText2 = this.guruMeditation.sy / 2 + this.guruMeditation.fontHeight;
        this.guruMeditation.guru1 = meditations1[Math.floor(Math.random() * meditations1.length)];
        this.guruMeditation.guru2 = meditations2[Math.floor(Math.random() * meditations2.length)];

        // Shift image down
        this.context.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, this.guruMeditation.sy, this.canvas.width, this.canvas.height - this.guruMeditation.sy);
        this.guruMeditation.borderOn = true;
        this.drawGuruMeditation();

        // Draw meditation
        var self = this;
        this.guruMeditation.handle = setInterval(function () {
            self.guruMeditation.borderOn = !self.guruMeditation.borderOn;
            self.drawGuruMeditation();
        }, 1000);
    };
    private drawGuruMeditation() {
        this.context.fillStyle = '#000000';
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, this.guruMeditation.sx, this.guruMeditation.sy);

        if (this.guruMeditation.borderOn) {
            this.context.strokeStyle = '#FF0000';
            this.context.setLineDash([]);
            this.context.lineWidth = this.guruMeditation.sLine;
            this.context.strokeRect(this.guruMeditation.sxBorder, this.guruMeditation.syBorder, this.guruMeditation.sx - this.guruMeditation.sxBorder * 2, this.guruMeditation.sy - this.guruMeditation.syBorder * 2);
        }

        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = '#FF0000';
        this.context.font = this.guruMeditation.fontHeight + 'px Arial';
        var text = 'Software Failure. Press left mouse button to continue.';
        if (this.tvc.crashInfo)
            text = 'Software Failure. Press left mouse button to send a report.';
        this.context.fillText(text, this.guruMeditation.sx / 2, this.guruMeditation.yText1);
        this.context.fillText('Magician Meditation #' + this.guruMeditation.guru1 + '.' + this.guruMeditation.guru2, this.guruMeditation.sx / 2, this.guruMeditation.yText2);
    }
}