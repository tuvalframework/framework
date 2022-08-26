import { Screen, ScreenEmpty } from "./Screen";
import { MersenneTwister } from './MersenneTwister';
import { Utilities } from './Utilities';
import { TVCContext } from './TVCContext';
import { MemoryBlock } from "./MemoryBlock";
import { Banks } from "./Banks";
import { Renderer } from "./Renderer";
import { Errors } from "./Errors";
import { Filesystem } from "./Filesystem";
import { AMAL } from "./AMAL";
import { Fonts } from "./Fonts";
import { float, int } from "../float";
import { Virtual } from "../Reflection/Decorators/ClassInfo";
import { EventBus } from '../Events/EventBus';
import { Dictionary } from "../Collections";
import { is } from '../is';
import { requestAnimationFrame } from '../RequestAnimationFrame';

declare var Application, pywebview, AMALCompiler;

export const TVC_Files: any = {};
TVC_Files["image_cursor"] = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAQCAIAAACk6KkqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAbSURBVChTY/z//z8DNsAEpTHAqAQGoJoEAwMAwCIDHQlsg8AAAAAASUVORK5CYII=";

export abstract class TVC<TScreen extends Screen = Screen> {
    public IsAsync: boolean = false;
    public tvc: TVC = null as any;
    public atom: any;
    public currentContextName: string = '';
    public memoryHashMultiplier: int = 0;
    public loadingCount: int = 0;
    public loadingMax: int = 0;
    public finalWait: int = 0;
    public use: any;
    public manifest: any;
    public gotoDirectMode: any;
    public sources: any;
    public localTags: any;
    public globalTags: any;
    public developerMode: any;
    public directMode: boolean = false;
    public toDirectMode: boolean = false;
    public directModeCommand: any;
    public directModeNumber: int = 0;
    public utilities: Utilities;
    public errors: Errors;
    private banks: Banks;
    public filesystem: Filesystem;
    public renderer: Renderer = null as any;
    public amal: AMAL;
    public fonts: Fonts = null as any;
    public keyShift: int;
    public gamepad_Threshold: float;
    public gamepad_vertical_axis: int;
    public gamepad_horizontal_axis: int;
    public gamepad_Keyboard: boolean;
    public gamepad_AutoFire: boolean;
    public gamepad_AutoMove: boolean;
    public gamepads: any;
    public sections: any;
    public returns: any[];
    public section: any;
    public position: int;
    public parent: any;
    public maxLoopTime: int = 0;
    public timeCheckCounter: int = 0;
    public refreshTrigger: int = 0;
    public refreshCounter: int = 0;
    public onError: boolean = false;
    public resume: int = 0;
    public resumeLabel: int = 0;
    public isErrorOn: boolean = false;
    public isErrorProc: boolean = false;
    public lastError: int = 0;
    public displayEndAlert: boolean;
    public displayErrorAlert: any;
    public fix: int = 0;
    public degreeRadian: float;
    public key$: any[];
    public stringKey$: string;
    public handleKey$: any;
    public results: any[];
    public inkeyShift: int = 0;
    public memoryBlocks: any[];
    public memoryNumbers: int = 0;
    public everyPile: any[];
    public fps: any[];
    public fpsPosition: int = 0;
    public frameCounter: int = 0;
    public channelsTo: any[];
    public amalErrors: any[];
    public amalErrorNumberCount: int = 0;
    public amalErrorStringCount: int = 0;
    public channelBaseSprites: int = 0;
    public channelBaseBobs: int = 0;
    public updateEveryCount: int = 0;
    public isUpdate: boolean = false;
    public blocks: any[];
    public cBlocks: any[];
    public setBufferSize: int = 0;
    public xMouse: int = 0;
    public yMouse: int = 0;
    public mouseVisibleCount: int = 0;
    public synchroList: any[];
    public joyLock: any;
    public touchEmulation: any;
    public everyCount: int = 0;
    public everyOn: boolean = false;
    public objectCount: int = 0;
    public platform: string = '';
    public platformKeymap: any;
    public machine: any;
    public endian: any;
    public usePalette: boolean;
    public useShortColors: boolean = false;
    public showCopperBlack: boolean = false;
    public break: boolean;
    public pause: boolean = false;
    public currentScreen: TScreen = undefined as any;
    private pileScreen: TScreen[] = undefined as any;
    public screensContext: TVCContext;
    private screensZ: any[] = undefined as any;
    private degrees: boolean = false;
    private keymap: any;
    private lastKey: string = undefined as any;
    private lastKeyCode: number = undefined as any;
    private lastKeyName: string = undefined as any;
    private key: string = undefined as any;
    private keyCode: number = undefined as any;
    private keyName: string = undefined as any;
    private modifiers: number = undefined as any;
    private lastModifiers: number = undefined as any;
    private static SHIFT: number;
    private static CONTROL: number;
    private breakOn: boolean = undefined as any;
    private badEnd: boolean = undefined as any;
    private positionKey$: number = undefined as any;
    private clearKeyFlag: boolean = undefined as any;
    private lastKeycode: number = undefined as any;
    private lastKeyPressed: number = undefined as any;
    private static ALT: number;
    private static META: number;
    public platformTrue: any;
    private waitVblCount: number = undefined as any;
    private variablesContext: any;
    private currentContext: any;
    private currentSection: any;
    private root: any;
    private inputArgs: any;
    private inputPosition: number = undefined as any;
    private inputString: string = undefined as any;
    private inputCursor: number = undefined as any;
    private inputXCursor: any = undefined as any;
    private input$String: string = undefined as any;
    private input$Length: any = undefined as any;
    private input$length: number = undefined as any;
    private mouseInside: boolean = undefined as any
    public mouseButtons: number = undefined as any
    private clickMouse: number = undefined as any
    private doubleClick: boolean = undefined as any
    private wheelMouse: number = undefined as any
    private mouseCurrent: string = undefined as any
    private mouseShown: boolean = undefined as any
    private limitMouse: any = undefined as any;
    private is_touch: boolean = undefined as any;
    private ongoingTouches: any[] = undefined as any;
    private touches: any[] = undefined as any;
    private is_orientable: boolean = undefined as any;
    private orientationX: number = undefined as any;
    private orientationY: number = undefined as any;
    private orientationZ: number = undefined as any;
    private is_accelerator: boolean = undefined as any;
    private accelerationX: number = undefined as any;
    private accelerationY: number = undefined as any;
    private accelerationZ: number = undefined as any;
    private latitude: number = undefined as any;
    private longitude: number = undefined as any;
    private already_fs: boolean = undefined as any;
    private procName: undefined = undefined as any;
    private orientation: number = undefined as any;
    private xMouseDebug: any = undefined as any;
    private yMouseDebug: any = undefined as any;
    private welcomeClick: boolean = undefined as any;
    private removeTouches: any[] = undefined as any;
    private stringBaseIndex: number = undefined as any;
    private waitEnd: number = undefined as any;
    private timer: any;
    merseneTwister: MersenneTwister = undefined as any;
    unlimitedScreens: boolean;
    unlimitedWindows: boolean;
    maskHardwareCoordinates: boolean;
    platformFalse: number | boolean;
    defaultPalette: any[];
    waitInstructions: any;
    useSounds: boolean = undefined as any;
    loadingError: any;
    previousTime: any;
    sourcePos: any;
    lastErrorPos: any;
    errorObject: any;
    memoryNumber: any;
    gamepadMaps: any;
    amalStarted: boolean = undefined as any;
    sprites: any;
    connectedToIDE: boolean = undefined as any;
    ideWebSocket: any;
    waiting: any;
    extensionsToRun: any[] = undefined as any;
    varsUpdated: any[] = undefined as any;
    vars: any;
    modified: any;
    varsthis: any;
    crashInfo: any;
    crash: any;
    loopCounter: number = undefined as any;
    unlimitedBanks: any;
    handle: any = undefined as any;
    moduleRainbows: any;
    pileScreens: any[];
    waitThis: any;
    error: number = undefined as any;
    parentElement: any;

    public get Banks(): Banks {
        return this.banks;
    }
    public set Banks(value: Banks) {
        this.banks = value;
    }
    public constructor(canvas: string | HTMLCanvasElement, options: any) {
        //this.dos = new DOS( this );
        //this.utilities = new Utilities( this );
        var self = this;
        this.tvc = this;
        this.atom = undefined;
        this.currentContextName = 'application';
        this.memoryHashMultiplier = 1000000000000;
        this.loadingCount = 0;
        this.loadingMax = 0;
        this.finalWait = 0;
        this.use = {};

        this.parentElement = options.parent;

        var manifest = this.manifest = options.manifest;
        this.gotoDirectMode = options.gotoDirectMode;
        this.sources = options.sources;
        this.localTags = options.localTags;
        this.globalTags = options.globalTags;
        this.developerMode = options.developerMode;
        this.gotoDirectMode = options.gotoDirectMode;

        this.directMode = false;
        this.toDirectMode = false;
        this.directModeCommand = null;
        this.directModeNumber = 0;

        this.utilities = new Utilities(this);
        this.errors = new Errors(this);
        this.banks = new Banks(this);
        this.filesystem = new Filesystem(this);

        if (!is.NodeEnvironment()) {
            this.renderer = new Renderer(this, canvas);
        }

        this.amal = new AMAL(this);

        if (!is.NodeEnvironment()) {
            this.fonts = new Fonts(this);
        }

        this.keyShift = 0; // "global" version of Key Shift bitmap. BJF 19 Aug

        if (!is.NodeEnvironment()) {
            this.setKeyboard();
            this.setMouse();
            this.setGamepads();	// Called upon startup.  This will initialize the gamepad objects.  BJF
        }
        this.gamepad_Threshold = 0.2; // Default 20%
        this.gamepad_vertical_axis = 1;
        this.gamepad_horizontal_axis = 0;
        this.gamepad_Keyboard = true;	// Keypad ON
        this.gamepad_AutoFire = true;	// AutoFire ON
        this.gamepad_AutoMove = true;	// AutoMove ON

        this.gamepads = {};
        this.sections = [];
        this.returns = [];
        this.section = null;
        this.position = 0;
        this.parent = null;
        this.maxLoopTime = 1000;
        this.timeCheckCounter = 100000;
        this.refreshTrigger = 100000;
        this.refreshCounter = 0;
        this.onError = false;
        this.resume = 0;
        this.resumeLabel = 0;
        this.isErrorOn = false;
        this.isErrorProc = false;
        this.lastError = 0;
        this.displayEndAlert = this.tvc.manifest.compilation.displayEndAlert ? true : false;
        this.displayErrorAlert = this.tvc.manifest.compilation.displayErrorAlert ? true : false;
        this.fix = 16;
        this.degreeRadian = 1.0;
        this.key$ = [];
        for (let k = 0; k < 20; k++) {
            this.key$[k] = '';
        }
        this.stringKey$ = '';
        this.handleKey$ = null;
        this.results = [];
        this.inkeyShift = 0; // BJF For ScanShift states?
        this.memoryBlocks = [];
        this.memoryNumbers = 1;
        this.everyPile = [];
        this.fps = [];
        this.fpsPosition = 0;
        this.frameCounter = 0;
        for (var f = 0; f < 50; f++)
            this.fps[f] = 20;
        this.channelsTo = [];
        this.amalErrors = [];
        this.amalErrorNumberCount = 0;
        this.amalErrorStringCount = 0;
        this.channelBaseSprites = 1000000;
        this.channelBaseBobs = 2000000;
        (this as any).updateEvery = 0;
        this.updateEveryCount = 0;
        this.isUpdate = true;
        this.blocks = [];
        this.cBlocks = [];
        this.setBufferSize = 0;
        this.xMouse = 0;
        this.yMouse = 0;
        this.mouseVisibleCount = 1;
        this.synchroList = [];
        this.joyLock = {};
        this.touchEmulation =
        {
            active: true,
            fingerOnScreen: false,
            lastX: -1,
            lastY: -1
        };
        this.everyPile = [];
        this.everyCount = 0;
        this.everyOn = false;
        this.objectCount = 0;
        //this.renderer.setScreenDisplay();

        // Get crucial values from manifest
        this.platform = manifest.compilation.platform.toLowerCase();
        this.platformKeymap = manifest.compilation.keymap;
        this.machine = manifest.compilation.machine;
        this.endian = manifest.compilation.endian;
        this.usePalette = true;
        this.useShortColors = (this.platform == 'amiga'); // OR useShortColors tag is true BJF
        this.showCopperBlack = (this.platform == 'amiga' && this.machine == 'classic');
        this.unlimitedScreens = !(this.platform == 'amiga' && this.machine == 'classic');
        this.unlimitedWindows = !(this.platform == 'amiga' && this.machine == 'classic');
        this.maskHardwareCoordinates = (this.platform == 'amiga' && this.machine == 'classic');
        this.stringBaseIndex = this.manifest.compilation.stringBaseIndex;
        if (typeof this.stringBaseIndex == 'undefined')
            this.stringBaseIndex = (this.platform == 'amiga' ? 1 : 0);
        this.platformTrue = this.platform == 'amiga' ? -1 : true;
        this.platformFalse = this.platform == 'amiga' ? 0 : false;
        this.defaultPalette = [];
        if (this.usePalette) {
            for (var c = 0; c < this.manifest.default.screen.palette.length; c++)
                this.defaultPalette[c] = this.manifest.default.screen.palette[c];
        }

        this.waitInstructions =
        {
            waitKey: this.waitKey,
            waitKey_wait: this.waitKey_wait,
            wait: this.wait,
            wait_wait: this.wait_wait,
            waitVbl: this.waitVbl,
            waitVbl_wait: this.waitVbl_wait,
            waitPromise: this.waitPromise,
            waitPromise_wait: this.waitPromise_wait,
            input: this.input,
            input_wait: this.input_wait,
            input$: this.input$,
            input$_wait: this.input$_wait,
            amalStart: this.amalStart,
            amalStart_wait: this.amalStart_wait,
            setFont: (this as any).setFont,
            setFont_wait: (this as any).setFont_wait
        };

        // Initialisation of mathematic functions
        Math.tanh = Math.tanh || function (x) {
            var a = Math.exp(+x), b = Math.exp(-x);
            return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (a + b);
        };
        Math.sinh = Math.sinh || function (x) {
            return (Math.exp(x) - Math.exp(-x)) / 2;
        };
        Math.cosh = Math.cosh || function (x) {
            return (Math.exp(x) + Math.exp(-x)) / 2;
        };

        // Main loop
        this.break = false;
        this.breakOn = true;

        // Create contexts
        this.pileScreens = [];
        this.screensContext = new TVCContext(this.tvc, this.currentContextName, { sorted: false });
        this.variablesContext = new TVCContext(this.tvc, this.currentContextName, { sorted: false });

        // Is the runtime connected to Python?
        /*
        var self = this;
        window.addEventListener( 'pywebviewready', listenToSnakes );
        this.pythonIsReady = false;
        function listenToSnakes()
        {
            console.log( "Snakes! :)" );
            self.pythonIsReady = true;
            setTimeout( function()
            {
                // Set the parameters of the application
                self.callPython( 'windowTitle', [ self.manifest.infos.applicationName ] );
                self.callPython( 'windowResize', [ self.manifest.display.width, self.manifest.display.height ] );
                if ( self.manifest.display.fullScreen )
                    self.callPython( 'toggleFullScreen', [ ] );
            }, 1 );
        };
        */
        // Load welcome images
        var images: any[] = [];
        var imageCount = 5;
        var welcomeStep = 0;
        var welcomeWaitEnd = 0;
        var welcomeAlpha = 0;
        this.welcomeClick = false;
        if (/* this.manifest.bootScreen.active */ false && !this.gotoDirectMode) {
            for (var i = 0; i < 8; i++) {
                this.utilities.loadUnlockedImage("./run/resources/made_with_tvc_" + i + ".png", {}, function (response, image, count) {
                    if (response) {
                        images[count] = image;
                        imageCount--;
                        if (imageCount == 0)
                            welcomeStep = 1;
                    }
                }, i);
            }
        }
        else {
            welcomeStep = -100;
        }

        // Wait for initialization / display welcome screen...
        var handle = setInterval(function () {
            if (welcomeStep >= 0) {
                // Wait?
                var now = new Date().getTime();
                if (welcomeWaitEnd) {
                    if (now > welcomeWaitEnd) {
                        welcomeStep++;
                        welcomeWaitEnd = 0;
                    }
                    return;
                }
                else {
                    // Step!
                    var welcomeWait = 0;
                    switch (welcomeStep) {
                        case 0:
                            break;
                        case 1:
                            // White renderer screem
                            self.renderer.context.fillStyle = self.utilities.getRGBAString(welcomeAlpha, welcomeAlpha, welcomeAlpha);
                            self.renderer.context.fillRect(0, 0, self.renderer.canvas.width, self.renderer.canvas.height);
                            welcomeAlpha += 5;
                            if (welcomeAlpha >= 256) {
                                self.renderer.context.fillStyle = '#FFFFFF';
                                self.renderer.context.fillRect(0, 0, self.renderer.canvas.width, self.renderer.canvas.height);
                                welcomeWait = 100;
                            }
                            break;
                        case 2:
                            drawI(images[0], 144, -89, 1.0);
                            drawI(images[1], 225, -89, 1.0);
                            drawI(images[2], -165, 0, 1.0);
                            welcomeStep = 4;
                            welcomeAlpha = 0;
                            break;
                        case 3:
                            break;
                        case 4:
                            drawI(images[3], 110, 15, welcomeAlpha);
                            welcomeAlpha += 0.03;
                            if (welcomeAlpha >= 1)
                                welcomeWait = 500;
                            break;
                        case 5:
                            welcomeStep = -7;
                            break;
                        case 6:
                            welcomeStep++;
                            break;
                        case 7:
                            if (self.useSounds || self.manifest.bootScreen.waitSounds) {
                                if ('ontouchstart' in window || navigator.maxTouchPoints) {
                                    drawI(images[7], 0, -48, 1.0, '#bottom');
                                }
                                else {
                                    drawI(images[6], 0, -48, 1.0, '#bottom');
                                }
                                welcomeStep++;
                                break;
                            }
                            else {
                                drawI(images[4], 110, 15, 1.0);
                                drawI(images[5], 247, 110, 1.0);
                                welcomeStep = 99;
                                welcomeWait = 1000;
                            }
                            break;
                        case 8:
                            if (self.welcomeClick) {
                                if ('ontouchstart' in window || navigator.maxTouchPoints) {
                                    drawI(images[7], 0, -48, 1.0, '#nodraw #bottom');
                                }
                                else {
                                    drawI(images[6], 0, -48, 1.0, '#nodraw #bottom');
                                }
                                drawI(images[4], 110, 15, 1.0);
                                drawI(images[5], 247, 110, 1.0);
                                welcomeWait = 1000;
                                welcomeStep = 99;
                            }
                            break;
                        case 99:
                            break;
                        case 100:
                            clearInterval(handle);
                            self.default('application');
                            self.timer = 0;
                            //window.requestAnimationFrame(doUpdate);
                            if (self.IsAsync) {
                                requestAnimationFrame(doUpdateAsync);
                            } else {
                                requestAnimationFrame(doUpdate);
                            }
                            break;
                    }
                    if (welcomeWait)
                        welcomeWaitEnd = now + welcomeWait;
                }
                return;
            }
            if (self.loadingCount == self.loadingMax) {
                if (self.loadingError) {
                    clearInterval(handle);
                    var message = self.errors.getError(self.loadingError).message;
                    console.error(message);
                }
                else {
                    if (self.loadingCount != 0) {
                        self.loadingCount = 0;
                        self.loadingMax = 0;
                        welcomeStep = -welcomeStep;
                    }
                }
            }
            function drawI(image, x, y, alpha, options?) {
                self.renderer.context.imageSmoothingEnabled = true;
                self.renderer.context.imageRendering = 'pixelated';
                var ratioX = (self.renderer.width / 1280) * 0.6;
                var ratioY = ratioX;
                var xx = self.renderer.width / 2;
                var yy = self.renderer.height / 2;
                if (options && options.indexOf('#bottom') >= 0)
                    yy = self.renderer.height;
                self.renderer.context.fillStyle = '#FFFFFF';
                self.renderer.context.globalAlpha = 1;
                self.renderer.context.fillRect(xx + (x - image.width / 2) * ratioX, yy + (y - image.height / 2) * ratioY, image.width * ratioX, image.height * ratioY);
                if (!(options && options.indexOf('#nodraw') >= 0)) {
                    self.renderer.context.globalAlpha = alpha;
                    self.renderer.context.drawImage(image, 0, 0, image.width, image.height, xx + (x - image.width / 2) * ratioX, yy + (y - image.height / 2) * ratioY, image.width * ratioX, image.height * ratioY);
                }
            }
        }, 20);

        function doUpdate() {
            if (!self.already_fs && self.is_touch && self.manifest.display.fullScreen) {
                var elem: any = self.renderer.canvas;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                }
                else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                }
                else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
                else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
                self.already_fs = true;
            }
            if (self.section) {
                var time = new Date().getTime();
                if (!self.previousTime)
                    self.previousTime = time;
                self.fps[self.fpsPosition++] = time - self.previousTime;
                self.fpsPosition = self.fpsPosition >= self.fps.length ? 0 : self.fpsPosition;
                self.timer += self.platform === 'tvc' ? (time - self.previousTime) / 1000 : (time - self.previousTime) / 20;
                self.frameCounter++;
                if (!is.NodeEnvironment()) {
                    self.scanGamepads();
                }
                self.doSynchro(time - self.previousTime);
                self.previousTime = time;

                // Run current set of blocks
                //try {

                self.section = self.runBlocks(self.section, true);


                /*  }
                 catch (error) {
                     self.handleErrors(error);
                 } */

                // Render the display
                if (self.renderer != null) {
                    self.renderer.render();
                }

                // Handle interruption...
                if (!self.section || self.break || self.toDirectMode) {
                    if (self.toDirectMode) {
                        if (!self.directMode) {
                            (window as any).parent.atom.openDirectMode(true);
                        }
                        self.directMode = true;
                        self.toDirectMode = false;
                    }
                    if (self.isUnderAtom() && !self.directMode)
                        (window as any).parent.atom.tvcViewer.stopProgram();

                    self.break = true;
                    if (self.section)
                        self.section.waiting = null;

                    // Force render
                    if (self.renderer != null) {
                        self.renderer.blackAtFirstCount = 0;
                        self.renderer.render(true);
                    }

                    // Stop update
                    clearInterval(self.handle);

                    var errorMessage = '';
                    if (self.lastError) {
                        errorMessage = self.errorObject.message;
                        if (self.lastErrorPos) {
                            var pos = self.lastErrorPos.split(':');
                            var number = parseInt(pos[0]);
                            var path = self.sources[number].path;
                            var line = parseInt(pos[1]) + 1;
                            var column = parseInt(pos[2]) + 1;
                            errorMessage += '\n' + self.errors.getError('at_line').message + line + ', ';
                            errorMessage += self.errors.getError('at_column').message + column + ' ';
                            errorMessage += self.errors.getError('in_source').message + self.utilities.getFilename(path) + '.' + self.utilities.getFilenameExtension(path);
                        }
                        errorMessage += '.';
                        console.log(errorMessage);
                    }

                    var flashingText = '';
                    if (!self.isUnderAtom() && self.developerMode) {
                        let line = '.';
                        if (self.sourcePos) {
                            var pos = self.sourcePos.split(':');
                            line = ' at line ' + (parseInt(pos[1]) + 1);
                        }
                        if (self.section == null)
                            flashingText = 'Program ended';
                        else
                            flashingText = self.badEnd ? 'Program interrupted' : 'Program ended';
                        flashingText += line;
                    }
                    var display = false;
                    var displayText = '';
                    if (!self.directMode && errorMessage != '') {
                        // An error...
                        displayText = errorMessage + '\n' + flashingText;
                        if (self.displayErrorAlert)
                            display = true;
                    }
                    else {
                        if (flashingText != '') {
                            // End of program...
                            displayText = flashingText
                            if (self.displayEndAlert)
                                display = true;
                        }
                    }
                    if (display) {
                        setTimeout(function () {
                            // Stop all mouse and keyboard events
                            self.killEvents();

                            // If under ATOM, display nice information and locate the cursor to the position of the error.
                            if (self.isUnderAtom()) {
                                var pos = self.lastErrorPos.split(':');
                                var number = parseInt(pos[0]);
                                var path = self.sources[number].path;
                                var line = parseInt(pos[1]);
                                var column = parseInt(pos[2]);
                                (window as any).parent.atom.tvcAPI.displayErrorAlert(displayText, self.errorObject, path, column, line);
                                return;
                            }
                            alert(displayText);
                        }, 500);
                    }
                    else {
                        // Put program on "HALT"
                        var count = 0;
                        var speed = 60;
                        var visible = 0;
                        if (self.renderer != null) {
                            self.renderer.viewOn = true;
                        }
                        const onHalt = (doUpdate) => {
                            var time = new Date().getTime();
                            self.fps[self.fpsPosition++] = time - self.previousTime;
                            self.fpsPosition = self.fpsPosition >= self.fps.length ? 0 : self.fpsPosition;
                            self.timer += self.platform === 'tvc' ? (time - self.previousTime) / 1000 : (time - self.previousTime) / 20;
                            self.doSynchro(time - self.previousTime);
                            self.previousTime = time;

                            count++;
                            if (count == speed) {
                                count = 0;
                                visible = 1 - visible;
                                if (self.renderer != null) {
                                    self.renderer.halted = visible ? flashingText : null as any;
                                    self.renderer.modified = true;
                                }
                            }

                            self.renderer?.render();

                            // If new command from direct mode-> load the source and execute it!
                            var command;
                            if (self.isUnderAtom()) {
                                command = (window as any).parent.atom.tvcAPI.getDirectCommand();
                            }
                            if (command) {
                                // Save and load code as blob
                                var name = 'TVC_DirectCommand_' + (++self.directModeNumber);
                                var code = self.utilities.replaceStringInText(command, '%$NAME', name);
                                var script = document.createElement('script');
                                script.textContent = code;
                                document.body.appendChild(script);
                                self.directModeCommand = null;
                                self.break = false;
                                console.log(code);

                                // Wait for source to be loaded
                                var handle = setInterval(function () {
                                    if (typeof Application[name] != 'undefined') {
                                        clearInterval(handle);
                                        var blocks = Application[name](self, null, {});
                                        var last = self.section.blocks.length;
                                        for (var b = 0; b < blocks.length; b++)
                                            self.section.blocks.push(blocks[b]);
                                        self.section.position = last;
                                        self.sections.push(null);
                                        // try {
                                        this.runBlocks(self.section, false);
                                        /*  }
                                         catch (error) {
                                             self.handleErrors(error);
                                             var message = '';
                                             if (self.lastError) {
                                                 message = self.errorObject.message;
                                                 message += '.';
                                                 self.printToDirectMode(message)
                                             }
                                         } */
                                        if (self.renderer != null) {
                                            self.renderer.halted = null as any;
                                            self.renderer.render();
                                        }
                                        /* window. */requestAnimationFrame(onHalt);
                                    }
                                }, 20);
                            }
                            else {
                                /* window. */requestAnimationFrame(onHalt);
                            }
                        };
                        /* window. */requestAnimationFrame(onHalt);
                    }
                }
                else {
                    const timeBefore = new Date().getTime();
                    if (self.IsAsync) {
                        requestAnimationFrame(doUpdateAsync);
                    } else {
                   /*  window. */requestAnimationFrame(doUpdate);
                    }
                }
            }
        }
        async function doUpdateAsync() {
            if (self.pause) {
                return;
            }
            if (!self.already_fs && self.is_touch && self.manifest.display.fullScreen) {
                var elem: any = self.renderer.canvas;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                }
                else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                }
                else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
                else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
                self.already_fs = true;
            }
            if (self.section) {
                var time = new Date().getTime();
                if (!self.previousTime)
                    self.previousTime = time;
                self.fps[self.fpsPosition++] = time - self.previousTime;
                self.fpsPosition = self.fpsPosition >= self.fps.length ? 0 : self.fpsPosition;
                self.timer += self.platform === 'tvc' ? (time - self.previousTime) / 1000 : (time - self.previousTime) / 20;
                self.frameCounter++;
                if (!is.NodeEnvironment()) {
                    self.scanGamepads();
                }
                self.doSynchro(time - self.previousTime);
                self.previousTime = time;

                // Run current set of blocks
                //try {
                if (self.IsAsync) {
                    self.section = await self.runBlocksAsync(self.section, true);
                } else {
                    self.section = self.runBlocks(self.section, true);
                }

                /*  }
                 catch (error) {
                     self.handleErrors(error);
                 } */

                // Render the display
                if (self.renderer != null) {
                    self.renderer.render();
                }

                // Handle interruption...
                if (!self.section || self.break || self.toDirectMode) {
                    if (self.toDirectMode) {
                        if (!self.directMode) {
                            (window as any).parent.atom.openDirectMode(true);
                        }
                        self.directMode = true;
                        self.toDirectMode = false;
                    }
                    if (self.isUnderAtom() && !self.directMode)
                        (window as any).parent.atom.tvcViewer.stopProgram();

                    self.break = true;
                    if (self.section)
                        self.section.waiting = null;

                    // Force render
                    if (self.renderer != null) {
                        self.renderer.blackAtFirstCount = 0;
                        self.renderer.render(true);
                    }

                    // Stop update
                    clearInterval(self.handle);

                    var errorMessage = '';
                    if (self.lastError) {
                        errorMessage = self.errorObject.message;
                        if (self.lastErrorPos) {
                            var pos = self.lastErrorPos.split(':');
                            var number = parseInt(pos[0]);
                            var path = self.sources[number].path;
                            var line = parseInt(pos[1]) + 1;
                            var column = parseInt(pos[2]) + 1;
                            errorMessage += '\n' + self.errors.getError('at_line').message + line + ', ';
                            errorMessage += self.errors.getError('at_column').message + column + ' ';
                            errorMessage += self.errors.getError('in_source').message + self.utilities.getFilename(path) + '.' + self.utilities.getFilenameExtension(path);
                        }
                        errorMessage += '.';
                        console.log(errorMessage);
                    }

                    var flashingText = '';
                    if (!self.isUnderAtom() && self.developerMode) {
                        let line = '.';
                        if (self.sourcePos) {
                            var pos = self.sourcePos.split(':');
                            line = ' at line ' + (parseInt(pos[1]) + 1);
                        }
                        if (self.section == null)
                            flashingText = 'Program ended';
                        else
                            flashingText = self.badEnd ? 'Program interrupted' : 'Program ended';
                        flashingText += line;
                    }
                    var display = false;
                    var displayText = '';
                    if (!self.directMode && errorMessage != '') {
                        // An error...
                        displayText = errorMessage + '\n' + flashingText;
                        if (self.displayErrorAlert)
                            display = true;
                    }
                    else {
                        if (flashingText != '') {
                            // End of program...
                            displayText = flashingText
                            if (self.displayEndAlert)
                                display = true;
                        }
                    }
                    if (display) {
                        setTimeout(function () {
                            // Stop all mouse and keyboard events
                            self.killEvents();

                            // If under ATOM, display nice information and locate the cursor to the position of the error.
                            if (self.isUnderAtom()) {
                                var pos = self.lastErrorPos.split(':');
                                var number = parseInt(pos[0]);
                                var path = self.sources[number].path;
                                var line = parseInt(pos[1]);
                                var column = parseInt(pos[2]);
                                (window as any).parent.atom.tvcAPI.displayErrorAlert(displayText, self.errorObject, path, column, line);
                                return;
                            }
                            alert(displayText);
                        }, 500);
                    }
                    else {
                        // Put program on "HALT"
                        var count = 0;
                        var speed = 60;
                        var visible = 0;
                        if (self.renderer != null) {
                            self.renderer.viewOn = true;
                        }
                        const onHalt = (doUpdate) => {
                            var time = new Date().getTime();
                            self.fps[self.fpsPosition++] = time - self.previousTime;
                            self.fpsPosition = self.fpsPosition >= self.fps.length ? 0 : self.fpsPosition;
                            self.timer += self.platform === 'tvc' ? (time - self.previousTime) / 1000 : (time - self.previousTime) / 20;
                            self.doSynchro(time - self.previousTime);
                            self.previousTime = time;

                            count++;
                            if (count == speed) {
                                count = 0;
                                visible = 1 - visible;
                                if (self.renderer != null) {
                                    self.renderer.halted = visible ? flashingText : null as any;
                                    self.renderer.modified = true;
                                }
                            }

                            self.renderer?.render();

                            // If new command from direct mode-> load the source and execute it!
                            var command;
                            if (self.isUnderAtom()) {
                                command = (window as any).parent.atom.tvcAPI.getDirectCommand();
                            }
                            if (command) {
                                // Save and load code as blob
                                var name = 'TVC_DirectCommand_' + (++self.directModeNumber);
                                var code = self.utilities.replaceStringInText(command, '%$NAME', name);
                                var script = document.createElement('script');
                                script.textContent = code;
                                document.body.appendChild(script);
                                self.directModeCommand = null;
                                self.break = false;
                                console.log(code);

                                // Wait for source to be loaded
                                var handle = setInterval(function () {
                                    if (typeof Application[name] != 'undefined') {
                                        clearInterval(handle);
                                        var blocks = Application[name](self, null, {});
                                        var last = self.section.blocks.length;
                                        for (var b = 0; b < blocks.length; b++)
                                            self.section.blocks.push(blocks[b]);
                                        self.section.position = last;
                                        self.sections.push(null);
                                        // try {
                                        if (this.IsAsync) {
                                            this.runBlocksAsync(self.section, false);
                                        } else {
                                            this.runBlocks(self.section, false);
                                        }

                                        /*  }
                                         catch (error) {
                                             self.handleErrors(error);
                                             var message = '';
                                             if (self.lastError) {
                                                 message = self.errorObject.message;
                                                 message += '.';
                                                 self.printToDirectMode(message)
                                             }
                                         } */
                                        if (self.renderer != null) {
                                            self.renderer.halted = null as any;
                                            self.renderer.render();
                                        }
                                        /* window. */requestAnimationFrame(onHalt);
                                    }
                                }, 20);
                            }
                            else {
                                /* window. */requestAnimationFrame(onHalt);
                            }
                        };
                        /* window. */requestAnimationFrame(onHalt);
                    }
                }
                else {
                    const timeBefore = new Date().getTime();
                    if (self.IsAsync) {
                        requestAnimationFrame(doUpdateAsync);
                    } else {
                   /*  window. */requestAnimationFrame(doUpdate);
                    }
                }
            }
        }
    }


    public abstract CreateScreen(args: any, tags: any): TScreen;

    private isUnderAtom(that?, func?, wait?, args?) {
        try {
            return (window.parent && (window as any).parent.atom);
        }
        catch (e) { }
        return false;
    }

    //private lastInputXCursor: int = -1;
    private lastInputYCursor: int = -1;
    public SetInputStringInternal(str: string) {
        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.lastInputYCursor });
        this.currentScreen.currentTextWindow.print('                                                                  ');
        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.lastInputYCursor });

        this.inputString = str;
        this.inputCursor = str.length;
        this.currentScreen.currentTextWindow.print(str);
        //   this.inputXCursor = this.currentScreen.currentTextWindow.xCursor;
        this.currentScreen.currentTextWindow.forceCursor();

    }
    private callWaitFunction(that, func, wait, args) {
        this.section.waitThis = that;
        this.section.waiting = wait;
        func.call(this.section.waitThis, args);

        /*
            this.sections.push( null );
            var newSection = new callIt( this, than, args );
            newSection = this.initSection( newSection, { result: 0 } );
            try
            {
                this.runBlocks( newSection, false );
            }
            catch( error )
            {
                this.handleErrors( error );
            }
            return parent.results[ newSection.currentResult ];
            }
            throw 'method_not_found';

            function callIt( tvc, parent, args )
            {
                this.tvc=tvc;
                this.root=parent.root;
                this.parent=parent;
                this.vars={};
                this.blocks=[];
                this.blocks[0]=function(tvc,vars)
                {
                    section.waitThis = ret.waitThis;
                    section.waiting = ret.waitThis[ ret.waitFunction ];
                    section.waitThis[ ret.callFunction ].call( section.waitThis, ret.args );
                };
                this.blocks[1]=function(tvc,vars)
                {
                    return{type:0}
                };
            };
        */
    }

    private callMethod(parent, name, args) {
        var method = parent['m_' + name.toLowerCase()];
        if (method) {
            this.sections.push(null);
            var newSection = new method(this, parent, args);
            newSection = this.initSection(newSection, { result: 0 });
            //try {
            if (this.IsAsync) {
                this.runBlocksAsync(newSection, false);
            } else {
                this.runBlocks(newSection, false);
            }

            /* }
            catch (error) {
                this.handleErrors(error);
            } */
            return parent.results[newSection.currentResult];
        }
        throw 'method_not_found';
    }
    private runProcedure(name, args) {
        name = 'p_' + name.toLowerCase();			// TODO: make respect case!
        if (this.root[name]) {
            // Push previous section
            this.sections.push(null);				// Force return

            // Initialize procedure parameters
            var newSection = new this.root[name](this, this.section, args);
            newSection = this.initSection(newSection);
            // try {
            if (this.IsAsync) {
                this.runBlocksAsync(newSection, false);
            } else {
                this.runBlocks(newSection, false);
            }

            /*  }
             catch (error) {
                 this.handleErrors(error);
             } */
            return true;
        }
        return false;
    }
    private async runBlocksAsync(section, allowWaiting) {
        var ret;
        var quit = false;
        if (!section.initialized)
            section = this.initSection(section);
        var loopCounter = this.timeCheckCounter;
        var time, entryTime;
        if (allowWaiting)
            entryTime = new Date().getTime();
        var count = 0;
        do {
            this.currentSection = section;
            if (section.waiting) {
                if (!section.waiting.call(section.waitThis)) {
                    quit = true;
                    break;
                }
                section.waiting = null;
            }
            while (!ret) {
                //console.log( "Block " + section.position + " - Sourcepos: " + this.sourcePos );
                try {
                    ret = await section.blocks[section.position++].call(section, this, section.vars);
                } catch (e) {
                    console.log('hata run bok içinde.');
                }
            };

            switch (ret.type) {
                // End
                case 0:
                    section = this.popSection(section);
                    break;

                // Goto
                case 1:
                    section.position = ret.label;
                    break;

                // Gosub
                case 2:
                    section.returns.push(ret.return);
                    section.position = ret.label;
                    break;

                // Return
                case 3:
                    if (section.returns.length == 0)
                        throw 'return_without_gosub';
                    section.position = section.returns.pop();

                    // End of Every gosub?
                    if (section.position < 0) {
                        section.position = -section.position - 1;
                        quit = true;
                    }
                    break;

                // Procedure call
                case 4:
                    this.sections.push(section);
                    var newSection = new section.root['p_' + ret.procedure](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Resume
                case 5:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (this.isErrorProc)
                            section = this.popSection(section);
                        if (!ret.label)
                            section.position = section.resume - 1;
                        else
                            section.position = ret.label;
                        section.isErrorOn = false;
                    }
                    break;

                // Resume next
                case 6:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (section.isErrorProc)
                            section = this.popSection(section);
                        section.position = section.resume;
                        section.isErrorOn = false;
                    }
                    break;

                // Resume label
                case 7:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (section.isErrorProc)
                            section = this.popSection(section);
                        section.position = section.resumeLabel;
                        section.isErrorOn = false;
                    }
                    break;

                // Blocking instruction
                case 8:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waiting = this.waitInstructions[ret.instruction + '_wait'];
                    section.waitThis = this;
                    this.waitInstructions[ret.instruction].call(this, ret.args);
                    break;

                // Blocking function
                case 9:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waiting = this.waitInstructions[ret.instruction + '_wait'];
                    section.waitThis = this;
                    this.waitInstructions[ret.instruction].call(this, ret.result, ret.args);
                    break;

                // Instruction
                case 10:
                    this.sections.push(section);
                    var newSection = new section.root['i_' + ret.instruction](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Function
                case 11:
                    this.sections.push(section);
                    var newSection = new section.root['f_' + ret.instruction](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Blocking instruction from language definition
                case 12:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waitThis = ret.waitThis;
                    section.waiting = ret.waitThis[ret.waitFunction];
                    section.waitThis[ret.callFunction].call(section.waitThis, ret.args);
                    break;

                // Pop
                case 13:
                    if (section.returns.length == 0)
                        throw 'return_without_gosub';
                    section.returns.pop();
                    break;

                // Edit
                case 14:
                    this.break = true;
                    this.displayEndAlert = false;
                    break;

                // Creation of an object
                case 15:
                    this.sections.push(section);
                    var newSection = new this.root['o_' + ret.object](this, section, ret.args);
                    section.results[ret.result] = newSection;
                    section = this.initSection(newSection, ret);		// Will execute block[ 0 ]-> constructor.
                    this.turnIntoObject(section, {}, {}, {});
                    section.synchroOn = false;
                    this.addToSynchro(section);
                    break;

                // End / Break inside of procedures
                case 16:
                    this.popSection(section);
                    section = null;
                    break;

                // Call of a object derivative method
                case 17:
                    section.nextError = false;
                    var method = ret.parent['m_' + ret.method];
                    if (method) {
                        this.sections.push(section);
                        var newSection = new method(this, ret.parent, ret.args);
                        section = this.initSection(newSection, ret);
                        break;
                    }
                    throw 'method_not_found';

                // Direct call of a object method, with array list of parameters
                case 18:
                    section.nextError = false;
                    var method = ret.parent['m_' + ret.method];
                    if (method) {
                        this.sections.push(section);
                        var newSection = new method(this, ret.parent, ret.args);
                        section = this.initSection(newSection);
                        break;
                    }
                    throw 'method_not_found';

                // End the program in direct mode.
                case 19:
                    section.waiting = function () { return false; };
                    section.waitThis = this;
                    (self as any).toDirectMode = true;
                    break;

            }
            ret = null;

            // Never more than... X frames (depending on manifest settings)
            if (allowWaiting) {
                time = new Date().getTime();
                loopCounter--;
                if (loopCounter <= 0 || time - entryTime > this.maxLoopTime)
                    break;
            }
        } while (section && !quit && !this.break)
        return section;
    }

    private runBlocks(section, allowWaiting) {
        var ret;
        var quit = false;
        if (!section.initialized)
            section = this.initSection(section);
        var loopCounter = this.timeCheckCounter;
        var time, entryTime;
        if (allowWaiting)
            entryTime = new Date().getTime();
        var count = 0;
        do {
            this.currentSection = section;
            if (section.waiting) {
                if (!section.waiting.call(section.waitThis)) {
                    quit = true;
                    break;
                }
                section.waiting = null;
            }
            while (!ret) {
                //console.log( "Block " + section.position + " - Sourcepos: " + this.sourcePos );
                ret = section.blocks[section.position++].call(section, this, section.vars);
            };

            switch (ret.type) {
                // End
                case 0:
                    section = this.popSection(section);
                    break;

                // Goto
                case 1:
                    section.position = ret.label;
                    break;

                // Gosub
                case 2:
                    section.returns.push(ret.return);
                    section.position = ret.label;
                    break;

                // Return
                case 3:
                    if (section.returns.length == 0)
                        throw 'return_without_gosub';
                    section.position = section.returns.pop();

                    // End of Every gosub?
                    if (section.position < 0) {
                        section.position = -section.position - 1;
                        quit = true;
                    }
                    break;

                // Procedure call
                case 4:
                    this.sections.push(section);
                    var newSection = new section.root['p_' + ret.procedure](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Resume
                case 5:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (this.isErrorProc)
                            section = this.popSection(section);
                        if (!ret.label)
                            section.position = section.resume - 1;
                        else
                            section.position = ret.label;
                        section.isErrorOn = false;
                    }
                    break;

                // Resume next
                case 6:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (section.isErrorProc)
                            section = this.popSection(section);
                        section.position = section.resume;
                        section.isErrorOn = false;
                    }
                    break;

                // Resume label
                case 7:
                    if (!section.isErrorOn && !section.isErrorProc) {
                        throw 'resume_without_error';
                    }
                    else {
                        if (section.isErrorProc)
                            section = this.popSection(section);
                        section.position = section.resumeLabel;
                        section.isErrorOn = false;
                    }
                    break;

                // Blocking instruction
                case 8:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waiting = this.waitInstructions[ret.instruction + '_wait'];
                    section.waitThis = this;
                    this.waitInstructions[ret.instruction].call(this, ret.args);
                    break;

                // Blocking function
                case 9:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waiting = this.waitInstructions[ret.instruction + '_wait'];
                    section.waitThis = this;
                    this.waitInstructions[ret.instruction].call(this, ret.result, ret.args);
                    break;

                // Instruction
                case 10:
                    this.sections.push(section);
                    var newSection = new section.root['i_' + ret.instruction](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Function
                case 11:
                    this.sections.push(section);
                    var newSection = new section.root['f_' + ret.instruction](this, section, ret.args);
                    section = this.initSection(newSection, ret);
                    break;

                // Blocking instruction from language definition
                case 12:
                    if (!allowWaiting)
                        throw 'cannot_wait_in_event_procedures';
                    section.waitThis = ret.waitThis;
                    section.waiting = ret.waitThis[ret.waitFunction];
                    section.waitThis[ret.callFunction].call(section.waitThis, ret.args);
                    break;

                // Pop
                case 13:
                    if (section.returns.length == 0)
                        throw 'return_without_gosub';
                    section.returns.pop();
                    break;

                // Edit
                case 14:
                    this.break = true;
                    this.displayEndAlert = false;
                    break;

                // Creation of an object
                case 15:
                    this.sections.push(section);
                    var newSection = new this.root['o_' + ret.object](this, section, ret.args);
                    section.results[ret.result] = newSection;
                    section = this.initSection(newSection, ret);		// Will execute block[ 0 ]-> constructor.
                    this.turnIntoObject(section, {}, {}, {});
                    section.synchroOn = false;
                    this.addToSynchro(section);
                    break;

                // End / Break inside of procedures
                case 16:
                    this.popSection(section);
                    section = null;
                    break;

                // Call of a object derivative method
                case 17:
                    section.nextError = false;
                    var method = ret.parent['m_' + ret.method];
                    if (method) {
                        this.sections.push(section);
                        var newSection = new method(this, ret.parent, ret.args);
                        section = this.initSection(newSection, ret);
                        break;
                    }
                    throw 'method_not_found';

                // Direct call of a object method, with array list of parameters
                case 18:
                    section.nextError = false;
                    var method = ret.parent['m_' + ret.method];
                    if (method) {
                        this.sections.push(section);
                        var newSection = new method(this, ret.parent, ret.args);
                        section = this.initSection(newSection);
                        break;
                    }
                    throw 'method_not_found';

                // End the program in direct mode.
                case 19:
                    section.waiting = function () { return false; };
                    section.waitThis = this;
                    (self as any).toDirectMode = true;
                    break;

            }
            ret = null;

            // Never more than... X frames (depending on manifest settings)
            if (allowWaiting) {
                time = new Date().getTime();
                loopCounter--;
                if (loopCounter <= 0 || time - entryTime > this.maxLoopTime)
                    break;
            }
        } while (section && !quit && !this.break)
        return section;
    }
    public run(section?, position?, parent?) {
        if (this.sections.length == 0) {
            this.root = section;
        }
        this.sections.push(this.section);
        this.section = this.initSection(section);
        this.section.position = position;
        this.section.parent = parent;
        this.section.waiting = null;

        if (parent)
            this.section.root = parent.root;
    }

    public stop(): void {
        this.break = true;
    }

    private initSection(section, ret?) {
        if (ret) {
            section.currentResult = ret.result;
        }
        section.results = [];
        section.returns = [];
        section.onError = false;
        section.isErrorProc = false;
        section.lastError = 0;
        section.position = 0;
        section.initialized = true;
        section.nextError = null;

        // Find a sub-object
        section.getObject = function (index) {
            var thisArray = this.parent[this.className];
            if (!thisArray)
                thisArray = this.parent[this.objectName];
            if (!thisArray)
                throw 'object_not_found';
            if (!thisArray[index])
                throw 'object_not_found';
            return thisArray[index];
        };
        return section;
    }
    private popSection(currentSection) {
        // If object constructor takes a long time-> no synchro before end!
        currentSection.synchroOn = true;

        // Do the pop!
        var pop = this.sections.pop();
        if (pop) {
            if (this.finalWait) {
                this.finalWait--;
                if (this.finalWait == 0) {
                    this.waitThis = this;
                    this.waiting = this.waitForFinalLoad;
                    if (this.gotoDirectMode && !this.directMode) {
                        this.gotoDirectMode = false;
                        this.toDirectMode = true;
                        this.break = true;
                    }
                }
            }
        }
        return pop;
    }

    private handleErrors(error) {
        throw error;
        var section = this.currentSection;
        section.waiting = null;
        if (this.utilities.isObject(error) && error.stack && !error.fromTVC) {
            // Trapped error?
            if (!section.nextError) {
                section.badEnd = true;
                this.errorObject = this.errors.getError('internal_error');
                this.lastError = this.errorObject.number;
                this.lastErrorPos = this.sourcePos;
                section.error = this.errorObject.number;
                console.log(error.message);
                console.log(error.stack);
                this.renderer.captureCrash(error);
                if (this.tvc.platform == "amiga") {
                    this.renderer.meditate();
                    this.clickMouse = false as any;
                    this.waiting = this.waitForGuru;
                    this.waitThis = this;
                }
                else {
                    this.utilities.sendCrashMail();
                    this.break = true;
                }
                return;
            }
            error = section.nextError;
            section.nextError = null;
        }

        // Trap? No error and branch to the next instruction
        var errorObject = this.errors.getError(error);
        if (section.trapPosition == section.position) {
            this.section = this.currentSection;
            section.trappedErrorNumber = errorObject.number;
            section.trapPosition = -1;
            return;
        }
        else if (section.onError) {
            this.section = this.currentSection;
            section.lastError = errorObject.number;
            if (typeof section.onError == 'number') {
                section.resume = section.position;
                section.position = section.onError;
                section.isErrorOn = true;
            }
            else {
                // Push previous section
                this.sections.push(section);

                // Initialize procedure parameters
                var newSection = new section.onError(this, section, {});
                newSection = this.initSection(newSection);
                newSection.isErrorProc = true;
            }
            return;
        }

        // Break application
        this.errorObject = this.errors.getError(error);
        this.lastError = this.errorObject.number;
        this.lastErrorPos = this.sourcePos;
        this.badEnd = true;
        this.break = true;
    }
    public printToDirectMode(text: string) {
        if (window.parent && (window as any).parent.atom && (window as any).parent.atom.printLine) {
            (window as any).parent.atom.printLine(text);
        }
    }

    private callPython(functionName, args, callback, extra) {
        if (pywebview) {
            switch (args.length) {
                case 0:
                    pywebview.api[functionName]().then(function (result) {
                        if (callback)
                            callback(true, result, extra);
                    }, function (error) {
                        if (callback)
                            callback(false, error, extra);
                    });
                    return;
                case 1:
                    pywebview.api[functionName](args[0]).then(function (result) {
                        if (callback)
                            callback(true, result, extra);
                    }, function (error) {
                        if (callback)
                            callback(false, error, extra);
                    });
                    return;
                case 2:
                    pywebview.api[functionName](args[0], args[1]).then(function (result) {
                        if (callback)
                            callback(true, result, extra);
                    }, function (error) {
                        if (callback)
                            callback(false, error, extra);
                    });
                    return;
                default:
                    throw 'internal_error'
            }
        }
        return false;
    }

    /////////////////////////////////////////////////////////////////////////
    //
    // UPDATE PROCESSUS - TODO -> a voir pas clar ici!
    //
    /////////////////////////////////////////////////////////////////////////
    private addToSynchro(thisObject, rootObject?) {
        if (thisObject['update_m']) {
            if (typeof rootObject !== 'undefined')
                rootObject.synchroOn = true;
            else
                rootObject = thisObject;
            var found = this.synchroList.findIndex(function (element) {
                return (element.thisObject == thisObject && element.thisObject.objectNumber == thisObject.objectNumber);
            });
            if (found < 0)
                this.synchroList.splice(0, 0, { thisObject: thisObject, rootObject: rootObject });
            else
                this.synchroList[found].rootObject = rootObject;
        }
    }

    private removeRootObjectFromSynchro(rootObject) {
        var found;
        do {
            found = this.synchroList.findIndex(function (element) {
                return element.rootObject == rootObject;
            });
            if (found >= 0) {
                this.synchroList.splice(found, 1);
            }
        } while (found >= 0)
    }

    private removeFromSynchro(thatObject) {
        var found = this.synchroList.findIndex(function (element) {
            return element == thatObject && element.objectNumber == thatObject.objectNumber;
        });
        if (found >= 0) {
            this.synchroList.splice(found, 1);
        }
    }

    private doSynchro(deltaTime) {
        //try {
        if (this.amal && this.amal.isSynchro)
            this.amal.doSynchro();

        // Every
        if (this.everyOn) {
            for (var e = 0; e < this.everyPile.length; e++) {
                var info = this.everyPile[e];
                info.deltaTime -= deltaTime;
                if (info.deltaTime < 0) {
                    info.deltaTime += info.interval;
                    while (info.deltaTime < 0)
                        info.deltaTime += info.interval;

                    if (info.definition.type == 'gosub') {
                        this.everyOn = false;
                        info.section.returns.push(-(info.section.position + 1));
                        info.section.position = info.definition.label;
                        var saveWaiting = info.section.waiting;
                        var saveWaitingThis = info.section.waitThis;
                        info.section.waiting = null;
                        // try {
                        if (this.IsAsync) {
                            this.runBlocksAsync(info.section, false);
                        } else {
                            this.runBlocks(info.section, false);
                        }
                        /* }
                        catch (error) {
                            this.handleErrors(error);
                        } */
                        info.section.waiting = saveWaiting;
                        info.section.waitThis = saveWaitingThis;
                    }
                    else {
                        this.everyOn = false;
                        this.sections.push(null);
                        var section = new this.root['p_' + info.definition.procedure](this, this.section);
                        //try {

                        if (this.IsAsync) {
                            this.runBlocksAsync(section, false);
                        } else {
                            this.runBlocks(section, false);
                        }
                        /*}
                         catch (error) {
                            this.handleErrors(error);
                        } */
                    }
                }
            };
        }

        // All objects update
        for (var o = 0; o < this.synchroList.length; o++) {
            var thisObject = this.synchroList[o].thisObject;
            var method = thisObject['update_m'];
            if (method) {
                var rootObject = this.synchroList[o].rootObject;
                if (rootObject.synchroOn) {
                    this.sections.push(null);
                    method.vars.channel = rootObject;
                    method.vars.deltaTime = deltaTime;
                    method.position = 0;
                    rootObject.synchroOn = false;
                    //try {
                    if (this.IsAsync) {
                        this.runBlocksAsync(method, false);
                    } else {
                        this.runBlocks(method, false);
                    }

                    /*  }
                     catch (error) {
                         this.handleErrors(error);
                     } */
                    rootObject.synchroOn = true;

                    if (method.parent.className == 'Movement')
                        this.tvc.callAnimations(rootObject, deltaTime);
                }
            }
        }
        /*  }
         catch (error) {
             this.handleErrors(error);
         } */
    }

    private openURL(url, windowName) {
        try {
            if (window.parent != null && (window as any).parent.atom != null) {
                var command = (window as any).parent.atom.tvcAPI.openURL(url, windowName);
                return;
            }
        }
        catch (err) {
        }
        window.open(url, windowName);
    }

    private setUpdate(onOff) {
        this.isUpdate = onOff;
    }

    private setBobsUpdate(onOff) {
        if (this.isUpdate !== onOff) {
            this.isUpdate = onOff;
            for (var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement())
                screen.setBobsUpdate(onOff);
        }
    }
    public rendererUpdate() {
        this.updateEveryCount++;
        if (this.updateEveryCount > (this as any).updateEvery) {
            this.updateEveryCount = 0;
            this.update();
        }
    }

    private update(force?) {
        if (!force)
            force = this.isUpdate;
        //else ???
        //	force = !this.isUpdate;
        if (force) {
            if (this.sprites)
                this.sprites.update(force);
            for (var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement())
                screen.bobsUpdate(force);
        }
    }
    private bobsUpdate(force: boolean) {
        if (!force)
            force = this.isUpdate;
        //else
        //	force = !this.isUpdate;
        if (force) {
            for (var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement())
                screen.bobsUpdate(force);
        }
    }

    private updateEvery(every) {
        if (every < 1)
            throw { error: 'illegal_function_call', parameter: every };
        this.updateEvery = every;
        this.updateEveryCount = 0;
    }

    private free() {
        return 0;
    }

    private fastFree() {
        return 0;
    }

    private chipFree() {
        return 0;
    }
    private setTags(tags) {
        if (this.utilities.getTag(tags, ['refresh']) !== '')
            this.renderer.setModified();
        if (this.utilities.getTag(tags, ['restart']) !== '')
            this.run();
        if (this.utilities.getTag(tags, ['debugger']) !== '')
            debugger;
        if (this.utilities.getTag(tags, ['break']) !== '')
            this.break;
        /*
        Possible tags:
        #step-> go in step-through mode after property has been set in TVC debugger (do today?)
        #record -> record all the values of the property with time
        */
    }

    private displayWidth(): int {
        var result;
        if (this.platform === 'amiga') {
            result = 342;
        }
        else {
            result = this.renderer.width;
        }
        return result;
    }
    private displayHeight() {
        var result;
        if (this.platform === 'amiga') {
            result = this.manifest.display.tvStandard === 'ntsc' ? 261 : 311;
        }
        else {
            result = this.renderer.height;
        }
        return result;
    }

    private ntsc(): boolean {
        return this.platform == 'amiga' && this.manifest.display.tvStandard == 'ntsc';
    }

    public allowRefresh(): void {
        this.refreshCounter++;
        if (this.refreshCounter > this.refreshTrigger) {
            this.refreshCounter = 0;
            this.loopCounter = 0;
        }
    }

    /* private stop() {
        debugger;
        //throw 'program_interrupted';
    } */

    private every(interval, definition) {
        if (this.everyPile.find(function (element) {
            return definition = element.definition;
        }))
            throw 'every_already_defined';

        // Only one Gosub
        if (definition.type == 'gosub') {
            if (this.everyPile.find(function (element) {
                return element.definition.type == 'gosub';
            }))
                throw 'every_already_defined';
        }
        if (interval <= 0)
            throw { error: 'illegal_function_call', parameter: interval };
        if (this.manifest.compilation.platform !== 'tvc' && this.manifest.compilation.platform !== 'pc')
            interval /= 50;
        interval *= 1000;
        var info =
        {
            definition: definition,
            section: this.currentSection,
            deltaTime: 0,
            interval: interval
        };
        this.everyPile.push(info);
        this.everyOn = true;
    }
    private everyOnOff(onOff: boolean) {
        if (!onOff)
            this.everyPile = [];
        else
            this.everyOn = true;
    }

    /////////////////////////////////////////////////////////////////////////
    //
    // SCREENS
    //
    /////////////////////////////////////////////////////////////////////////
    public screenOpen(args, tags) {
        args.index = typeof args.index != 'undefined' ? args.index : 0;
        if (typeof args.index === 'number' && args.index < 0)
            throw { error: 'illegal_function_call', parameter: args.index };

        var keepCurrent = this.utilities.isTag(tags, 'keepCurrent');
        var pushCurrent = this.utilities.isTag(tags, 'pushCurrent');
        if (pushCurrent) {
            this.currentScreen.deactivate();
            this.pileScreen.push(this.currentScreen);
            keepCurrent = false;
        }
        if (this.utilities.isTag(tags, 'findFreeIndex')) {
            if (typeof args.index == 'number') {
                // Get a free screen number
                while (this.screensContext.getElement(this.currentContextName, args.index, undefined))
                    args.index++;
            }
            else
                throw { error: 'illegal_function_call', parameter: args.index };
        }

        // Open the screen
        args.renderer = this.renderer;
        args.contextName = this.currentContextName;
        var screen = this.CreateScreen(args, tags);
        if (screen != null) {
            screen.number = parseInt(args.index);
            screen.vars.z = 0;
            if (typeof args.z == 'undefined')
                this.screenToFront(screen);

            // Close screen if same number?
            if (!keepCurrent) {
                if (this.currentScreen) {
                    var previousScreen = this.screensContext.getElement(this.currentContextName, args.index);
                    if (previousScreen)
                        this.screenClose(previousScreen);
                    else if (this.currentScreen)
                        this.currentScreen.deactivate();
                }
                this.currentScreen = screen;
            }
            this.screensContext.setElement(this.currentContextName, screen, args.index, true);
            this.renderer.setModified();
            return screen;
        }
    }

    public screenClose(index, tags?) {
        var popCurrent = this.utilities.isTag(tags, 'popCurrent');
        var keepCurrent = this.utilities.isTag(tags, 'keepCurrent');
        if (popCurrent) {
            keepCurrent = true;
            if (this.currentScreen)
                index = this.currentScreen.number;
        }
        var screen = this.getScreen(index);

        // Close cloned screens
        var self = this;
        do {
            var redo = false;
            for (var s = this.screensContext.getFirstElement(this.currentContextName); s != null; s = this.screensContext.getNextElement(this.currentContextName)) {
                if (s.cloned == screen) {
                    closeIt(s);
                    redo = true;
                    break;
                }
            }
        } while (redo);

        // Close screen
        closeIt(screen);
        if (popCurrent) {
            if (this.pileScreens.length == 0)
                throw { error: 'illegal_function_call', parameter: '(empty pile)' };
            this.currentScreen = this.pileScreens.pop();
        }
        else {
            for (let s = 0; s < this.pileScreens.length; s++) {
                if (this.pileScreens[s] == screen) {
                    this.pileScreens.splice(s, 1);
                    break;
                }
            }
        }
        this.renderer.setModified();

        function closeIt(screen) {
            screen.deactivate();
            self.screensContext.deleteElement(self.currentContextName, screen);
            if (!keepCurrent) {
                self.currentScreen = self.screensContext.getLastElement(self.currentContextName);
                if (!self.currentScreen) {
                    self.currentScreen = new ScreenEmpty(self) as any;
                    self.currentScreen.index = -1;
                }
            }
        }
    }

    private screenClone(number, tags) {
        //var screen = this.getScreen( number );
        var oldScreen = this.currentScreen;
        tags = typeof tags != 'undefined' ? tags : '';
        var screen = this.screenOpen(this.currentScreen.vars, tags);
        if (screen != null) {
            screen.setCloned(oldScreen);
            this.setScreen(oldScreen.number);
            this.renderer.setModified();
        }
    }

    public setScreen(number) {
        var screen = this.getScreen(number);
        if (this.currentScreen)
            this.currentScreen.deactivate();
        this.currentScreen = screen;
        this.currentScreen.activate();
    }

    public getScreen(number, error?) {
        error = typeof error != 'undefined' ? error : 'screen_not_opened';

        if (typeof number == 'undefined')
            return this.currentScreen;
        if (this.utilities.isObject(number) && number.className == 'screen')
            return number;
        return this.screensContext.getElement(this.currentContextName, number, error);
    }

    private getScreenOrCreateOne(args, tags) {
        if (typeof args.index == 'undefined') {
            if (this.currentScreen.emptyScreen)
                throw 'screen_not_opened'
            return this.currentScreen;
        }

        // TODOFL: check that tags are the same
        tags = typeof tags != 'undefined' ? tags : '';
        var screen = this.screensContext.getElement(this.currentContextName, args.index);
        if (screen)
            return screen;

        // Create screen, and cursoff!
        this.screenOpen(args, tags);
        this.currentScreen.currentTextWindow.setCursor(false);
        return this.currentScreen;
    }

    private screenIn(number, position) {
        if (typeof number != 'undefined') {
            return this.getScreen(number).isIn(position) ? number : -1;
        }

        // Scan all screens
        var found: Screen = undefined as any;
        this.screensContext.parseSorted(undefined, function (screen1, screen2) {
            if (screen1.vars.z > screen2.vars.z)
                return -1;
            if (screen1.vars.z < screen2.vars.z)
                return 1;
            if (screen1.index > screen2.index)
                return -1;
            if (screen1.index < screen2.index)
                return 1;
            return 0;
        },
            function (screen) {
                if (!found && screen.vars.visible) {
                    if (screen.isIn(position)) {
                        if (!screen.isPixelTransparent(position)) {
                            found = screen;
                        }
                    }
                }
            });
        if (found)
            return found.number;
        return -1;
    }

    private mouseScreen(position) {
        for (var screen = this.screensContext.getLastElement(this.currentContextName); screen != null; screen = this.screensContext.getPreviousElement(this.currentContextName)) {
            if (screen.isIn(position)) {
                return screen.number;
            }
        }
        return -1;
    }

    private screenToBack(index) {
        var zMin = 10000000;
        var screen = this.getScreen(index);
        this.screensContext.parseAll(this.currentContextName, function (s) {
            if (s != screen)
                zMin = Math.min(s.vars.z, zMin);
        });
        if (zMin != 10000000 && zMin < screen.vars.z) {
            if (zMin > 0)
                zMin = 0;
            else
                zMin = zMin - 1;
            screen.setPosition({ z: zMin });
        }
    }
    public screenToFront(index) {
        var zMax = 0;
        var sMax = undefined;
        var screen = this.getScreen(index);
        this.screensContext.parseAll(this.currentContextName, function (s) {
            zMax = Math.max(s.vars.z, zMax);
            sMax = s;
        });
        if (sMax && sMax != screen && zMax >= screen.vars.z)
            screen.setPosition({ z: zMax + 1 });
    }
    private screenSkew(number, xSkew, ySkew) {
        var screen = this.getScreen(number);
        screen.xSkewDisplay = typeof xSkew != 'undefined' ? xSkew : screen.xSkewDisplay;
        screen.ySkewDisplay = typeof ySkew != 'undefined' ? ySkew : screen.ySkewDisplay;
        screen.setModified();
    }

    private screenScale(number, xScale, yScale) {
        var screen = this.getScreen(number);
        screen.xScaleDisplay = typeof xScale != 'undefined' ? xScale : screen.xScaleDisplay;
        screen.yScaleDisplay = typeof yScale != 'undefined' ? yScale : screen.yScaleDisplay;
        screen.setModified();
    }

    private dualPlayfield(screen1, screen2) {
        screen1 = this.getScreen(screen1);
        screen2 = this.getScreen(screen2);
        screen1.setDualPlayfield(screen2);
    }

    private dualPriority(screen1, screen2) {
        screen1 = this.getScreen(screen1);
        screen2 = this.getScreen(screen2);
        screen1.dualPriority(screen2);
    }

    private setDefaultPalette(palette) {
        for (var p = 0; p < palette.length; p++) {
            if (typeof palette[p] != 'undefined') {
                this.defaultPalette[p] = this.utilities.getModernColorString(palette[p]);
            }
        }
    }
    private colourBack(color, isIndex) {
        if (!isIndex)
            color = this.utilities.getModernColorString(color);
        else {
            if (color < 0)
                throw { error: 'illegal_function_call', parameter: color };
            color %= this.currentScreen.vars.numberOfColors;
            color = this.currentScreen.vars.palette[color];
        }
        this.renderer.setBackgroundColor(color);
    }

    private swapZScreenPosition(screen1, screen2) {
        var z1, z2;
        for (z1 = 0; z1 < this.screensZ.length; z1++) {
            if (this.screensZ[z1] === screen1)
                break;
        }
        for (z2 = 0; z2 < this.screensZ.length; z2++) {
            if (this.screensZ[z2] == screen2)
                break;
        }
        var temp = this.screensZ[z1];
        this.screensZ[z1] = this.screensZ[z2];
        this.screensZ[z2] = temp;
    }

    private setBelowZScreenPosition(screen1: Screen, screen2: Screen) {
        var z1, z2;
        for (z1 = 0; z1 < this.screensZ.length; z1++) {
            if (this.screensZ[z1].number == screen1.number)
                break;
        }
        for (z2 = 0; z2 < this.screensZ.length; z2++) {
            if (this.screensZ[z2].number == screen2.number)
                break;
        }
        if (z1 > z2) {
            this.screensZ.splice(z1, 1);
            this.screensZ.splice(z2, 0, screen1);
        }
    }
    private default(contextName) {
        this.screenOpen({}, '');
    }

    private lprint() {
        throw 'instruction_not_implemented';
    }

    private doError(number) {
        throw this.errors.getErrorFromNumber(number).index;
    }

    private asc(text) {
        if (text != '')
            return text.charCodeAt(0);
        return 0;
    }

    private repeat$(text, number) {
        if (number < 0)
            throw ('illegal_text_window_parameter');
        var result = '';
        for (var n = 0; n < number; n++)
            result += text;
        return result;
    }

    public str$(value) {
        if (value === false)
            value = 0;
        if (this.platform !== 'tvc') {
            if (value === true)
                value = -1;
        }
        else {
            if (value === true)
                value = 1;
        }
        var space = value >= 0 ? ' ' : '';

        var result;
        if (this.fix == 16)
            result = '' + value;
        else if (this.fix >= 0)
            result = value.toFixed(this.fix);
        else
            result = value.toExponential(-this.fix);

        // Fix -0.00 problem...
        if (result.substring(0, 3) === '-0.') {
            var onlyZeros = true;
            for (var p = 0; p < result.length; p++) {
                var c = result.charAt(p);
                if (c >= '1' && c <= '9') {
                    onlyZeros = false;
                    break;
                }
            }
            if (onlyZeros)
                result = result.substring(1);
        }
        return space + result;
    }

    private val(value) {
        var base = 10;
        var result = 0;
        var s = value.substring(0, 1);
        switch (s) {
            case '$':
                value = value.substring(1);
                base = 16;
                result = parseInt(value, base);
                break;
            case '%':
                value = value.substring(1);
                base = 2;
                result = parseInt(value, base);
                break;
            default:
                result = parseFloat(value);
        }
        if (isNaN(result))
            result = 0;
        return result;
    }
    /*
        Note:  Minor issue remains on val.
        In AMOS Pro, if the variable being set is an Integer, the integer value should
        be taken before conversion, so no rounding occurs.  So...
            X = Val("1234.56") would return X as 1234 vs. 1235.
    */
    private checkIndex(index) {
        if (typeof index == 'string') {
            if (index.indexOf('.') >= 0 || index.indexOf(':') >= 0 || index.indexOf('/') >= 0 || index.indexOf('\\') >= 0) {
                var name = this.utilities.getFilename(index);
                if (name)
                    return name;
            }
        }
        return index;
    }
    private space$(value) {
        if (value < 0)
            throw { error: 'illegal_function_call', parameter: value };

        var result = '';
        for (var s = 0; s < value; s++)
            result += ' ';
        return result;
    }

    private toRadian(value) {
        if (this.degrees)
            return value / 180 * (Math.PI / 2);
        return value;
    }

    private toDegree(value) {
        if (this.degrees)
            return value * 180 / (Math.PI / 2);
        return value;
    }

    // Keyboard / mouse
    private static keyModifiers = {
        amiga:
        {
            'LEFTSHIFT': 0x0001,
            'RIGHTSHIFT': 0x0002,
            'LEFTCONTROL': 0x8008, // BJF was 4
            'RIGHTCONTROL': 0x0008,
            'CONTROL': 0x8008, // BJF control C fix.
            'LEFTALT': 0x0010,
            'RIGHTALT': 0x0020,
            'LEFTMETA': 0x0040,
            'RIGHTMETA': 0x0080,
            'CAPSLOCK': 0x0004,
            'NUMLOCK': 0x0200,
            'SCROLLLOCK': 0x0400,
            'FUNCLOCK': 0x0800 // BJF added
            // do we also need INSERTLOCK?
        },
        tvc:
        {
            'LEFTSHIFT': 0x0001,
            'RIGHTSHIFT': 0x0002,
            'LEFTCONTROL': 0x0004,
            'RIGHTCONTROL': 0x0008,
            'CONTROL': 0x000C, // BJF control C fix
            'LEFTALT': 0x0010,
            'RIGHTALT': 0x0020,
            'LEFTMETA': 0x0040,
            'RIGHTMETA': 0x0080,
            'CAPSLOCK': 0x0100,
            'NUMLOCK': 0x0200, //
            'SCROLLLOCK': 0x0400,
            'FUNCLOCK': 0x0800 // BJF added
        }
    }

    private static keyPressed = {
        // TVC
        tvc:
        {
            'Minus': { inkey$: '-', keyCode: 189 },
            'Equal': { inkey$: '=', keyCode: 187 },

            'Insert': { inkey$: '', keyCode: 45 },
            'Delete': { inkey$: '', keyCode: 46 },
            'Home': { inkey$: '', keyCode: 36 },
            'End': { inkey$: '', keyCode: 35 },
            'PageUp': { inkey$: '', keyCode: 33 },
            'PageDown': { inkey$: '', keyCode: 34 },

            'ArrowLeft': { inkey$: String.fromCharCode(29), keyCode: 37 },
            'ArrowRight': { inkey$: String.fromCharCode(28), keyCode: 39 },
            'ArrowUp': { inkey$: String.fromCharCode(30), keyCode: 38 },
            'ArrowDown': { inkey$: String.fromCharCode(31), keyCode: 40 },

            'Enter': { inkey$: String.fromCharCode(13), keyCode: 13 },

            'Backspace': { inkey$: String.fromCharCode(8), keyCode: 8 },
            'Backquote': { inkey$: '`', keyCode: 192 },
            'Backslash': { inkey$: '\\', keyCode: 220 },

            'Del': { inkey$: '', keyCode: 'event.which' },
            //'End': { inkey$: '', keyCode: 35 },
            // 'Home': { inkey$: '', keyCode: 36 },

            'ScrollLock': { inkey$: '', keyCode: 145 },
            'Pause': { inkey$: '', keyCode: 19 },
            'NumLock': { inkey$: '', keyCode: 144 },
            'CapsLock': { inkey$: '', keyCode: 20 },

            'Tab': { inkey$: String.fromCharCode(9), keyCode: 9 },

            'Comma': { inkey$: ',', keyCode: 188 },
            'Period': { inkey$: '.', keyCode: 190 },
            'Slash': { inkey$: '/', keyCode: 191 },
            'Quote': { inkey$: '"', keyCode: 222 },
            'Semicolon': { inkey$: ';', keyCode: 186 },
            'BracketLeft': { inkey$: '[', keyCode: 219 },
            'BracketRight': { inkey$: ']', keyCode: 221 },
            'Escape': { inkey$: String.fromCharCode(0), keyCode: 27 },

            // modifier keys
            'Shift': { inkey$: '', keyCode: 16 },
            'Control': { inkey$: '', keyCode: 17 },
            'ShiftLeft': { inkey$: '', keyCode: 16 },
            'ShiftRight': { inkey$: '', keyCode: 16 },
            'ControlLeft': { inkey$: '', keyCode: 17 },
            'ControlRight': { inkey$: '', keyCode: 17 },
            'AltLeft': { inkey$: '', keyCode: 18 },
            'AltRight': { inkey$: '', keyCode: 18 },
            'OSLeft': { inkey$: '', keyCode: 91 },
            'MetaLeft': { inkey$: '', keyCode: 91 },
            'ContextMenu': { inkey$: '', keyCode: 92 },

            'IntlBackslash': { inkey$: '<', keyCode: 'event.which' },

            'F1': { inkey$: '', keyCode: 112 },
            'F2': { inkey$: '', keyCode: 113 },
            'F3': { inkey$: '', keyCode: 114 },
            'F4': { inkey$: '', keyCode: 115 },
            'F5': { inkey$: '', keyCode: 116 },
            'F6': { inkey$: '', keyCode: 117 },
            'F7': { inkey$: '', keyCode: 118 },
            'F8': { inkey$: '', keyCode: 119 },
            'F9': { inkey$: '', keyCode: 120 },
            'F10': { inkey$: '', keyCode: 121 },

            // F11 & F12 are used by macOS
            'F11': { inkey$: '', keyCode: 122 },
            'F12': { inkey$: '', keyCode: 123 },
            'F13': { inkey$: '', keyCode: 124 },

            'Numpad0': { inkey$: '0', keyCode: 96 },
            'Numpad1': { inkey$: '1', keyCode: 97 },
            'Numpad2': { inkey$: '2', keyCode: 98 },
            'Numpad3': { inkey$: '3', keyCode: 99 },
            'Numpad4': { inkey$: '4', keyCode: 100 },
            'Numpad5': { inkey$: '5', keyCode: 101 },
            'Numpad6': { inkey$: '6', keyCode: 102 },
            'Numpad7': { inkey$: '7', keyCode: 103 },
            'Numpad8': { inkey$: '8', keyCode: 104 },
            'Numpad9': { inkey$: '9', keyCode: 105 },

            'NumpadDivide': { inkey$: '/', keyCode: 111 },
            'NumpadMultiply': { inkey$: '*', keyCode: 106 },
            'NumpadSubtract': { inkey$: '-', keyCode: 109 },
            'NumpadAdd': { inkey$: '+', keyCode: 107 },
            'NumpadEnter': { inkey$: String.fromCharCode(13), keyCode: 13 },
            'NumpadDecimal': { inkey$: '.', keyCode: 110 },
            'NumpadEqual': { inkey$: '=', keyCode: 187 },

            'Digit0': { inkey$: 'event.key', keyCode: 48 },
            'Digit1': { inkey$: 'event.key', keyCode: 49 },
            'Digit2': { inkey$: 'event.key', keyCode: 50 },
            'Digit3': { inkey$: 'event.key', keyCode: 51 },
            'Digit4': { inkey$: 'event.key', keyCode: 52 },
            'Digit5': { inkey$: 'event.key', keyCode: 53 },
            'Digit6': { inkey$: 'event.key', keyCode: 54 },
            'Digit7': { inkey$: 'event.key', keyCode: 55 },
            'Digit8': { inkey$: 'event.key', keyCode: 56 },
            'Digit9': { inkey$: 'event.key', keyCode: 57 },
            'Space': { inkey$: 'event.key', keyCode: 32 },
            'KeyA': { inkey$: 'event.key', keyCode: 65 },
            'KeyB': { inkey$: 'event.key', keyCode: 66 },
            'KeyC': { inkey$: 'event.key', keyCode: 67 },
            'KeyD': { inkey$: 'event.key', keyCode: 68 },
            'KeyE': { inkey$: 'event.key', keyCode: 69 },
            'KeyF': { inkey$: 'event.key', keyCode: 70 },
            'KeyG': { inkey$: 'event.key', keyCode: 71 },
            'KeyH': { inkey$: 'event.key', keyCode: 72 },
            'KeyI': { inkey$: 'event.key', keyCode: 73 },
            'KeyJ': { inkey$: 'event.key', keyCode: 74 },
            'KeyK': { inkey$: 'event.key', keyCode: 75 },
            'KeyL': { inkey$: 'event.key', keyCode: 76 },
            'KeyM': { inkey$: 'event.key', keyCode: 77 },
            'KeyN': { inkey$: 'event.key', keyCode: 78 },
            'KeyO': { inkey$: 'event.key', keyCode: 79 },
            'KeyP': { inkey$: 'event.key', keyCode: 80 },
            'KeyQ': { inkey$: 'event.key', keyCode: 81 },
            'KeyR': { inkey$: 'event.key', keyCode: 82 },
            'KeyS': { inkey$: 'event.key', keyCode: 83 },
            'KeyT': { inkey$: 'event.key', keyCode: 84 },
            'KeyU': { inkey$: 'event.key', keyCode: 85 },
            'KeyV': { inkey$: 'event.key', keyCode: 86 },
            'KeyW': { inkey$: 'event.key', keyCode: 87 },
            'KeyX': { inkey$: 'event.key', keyCode: 88 },
            'KeyY': { inkey$: 'event.key', keyCode: 89 },
            'KeyZ': { inkey$: 'event.key', keyCode: 90 },
        },

        // Javascript -> Amiga
        amiga:
        {
            'Minus': { inkey$: '-', keyCode: 0x0B },
            'Equal': { inkey$: '=', keyCode: 0x0C },

            'Insert': { inkey$: '', keyCode: 45 },
            'Delete': { inkey$: '', keyCode: 46 },
            'Home': { inkey$: '', keyCode: 36 },
            'End': { inkey$: '', keyCode: 35 },
            'PageUp': { inkey$: '', keyCode: 33 },
            'PageDown': { inkey$: '', keyCode: 34 },

            'ArrowLeft': { inkey$: String.fromCharCode(29), keyCode: 79 },
            'ArrowRight': { inkey$: String.fromCharCode(28), keyCode: 78 },
            'ArrowUp': { inkey$: String.fromCharCode(30), keyCode: 76 },
            'ArrowDown': { inkey$: String.fromCharCode(31), keyCode: 77 },

            'Enter': { inkey$: String.fromCharCode(13), keyCode: 0x44 }, // 69 },
            'Backspace': { inkey$: String.fromCharCode(8), keyCode: 65 },
            'Backquote': { inkey$: '``', keyCode: 192 },
            'Backslash': { inkey$: '\\', keyCode: 13 },

            'Del': { inkey$: String.fromCharCode(0), keyCode: 70 },

            'Tab': { inkey$: '\t', keyCode: 66 },
            'Comma': { inkey$: ',', keyCode: 56 },
            'Period': { inkey$: '.', keyCode: 57 },
            'Slash': { inkey$: '/', keyCode: 58 },
            'Quote': { inkey$: '"', keyCode: 42 },
            'Semicolon': { inkey$: ';', keyCode: 41 },
            'BracketLeft': { inkey$: '[', keyCode: 26 },
            'BracketRight': { inkey$: ']', keyCode: 27 },
            'Escape': { inkey$: String.fromCharCode(27), keyCode: 69 },

            // locking keys
            'CapsLock': { inkey$: '', keyCode: 0x62 },
            'ScrollLock': { inkey$: undefined, keyCode: undefined },
            'NumLock': { inkey$: '', keyCode: 12 + 128 },

            // modifier keys
            'Shift': { inkey$: '', keyCode: undefined },
            'Control': { inkey$: '', keyCode: undefined },

            'ShiftLeft': { inkey$: '', keyCode: 0x60 },
            'ShiftRight': { inkey$: '', keyCode: 0x61 },
            'ControlLeft': { inkey$: '', keyCode: 0x63 },
            'ControlRight': { inkey$: '', keyCode: 0x63 },
            'AltLeft': { inkey$: '', keyCode: 0x64 },
            'AltRight': { inkey$: '', keyCode: 0x65 },
            'OSLeft': { inkey$: '', keyCode: 0x66 },
            'MetaLeft': { inkey$: '', keyCode: 0x66 },
            'ContextMenu': { inkey$: '', keyCode: 0x67 },

            'IntlBackslash': { inkey$: '<', keyCode: 'event.which' },

            'F1': { inkey$: '', keyCode: 80 },
            'F2': { inkey$: '', keyCode: 81 },
            'F3': { inkey$: '', keyCode: 82 },
            'F4': { inkey$: '', keyCode: 83 },
            'F5': { inkey$: '', keyCode: 84 },
            'F6': { inkey$: '', keyCode: 85 },
            'F7': { inkey$: '', keyCode: 86 },
            'F8': { inkey$: '', keyCode: 87 },
            'F9': { inkey$: '', keyCode: 88 },
            'F10': { inkey$: '', keyCode: 89 },
            'F11': { inkey$: '', keyCode: 122 },
            'F12': { inkey$: '', keyCode: 123 },
            'F13': { inkey$: '', keyCode: 124 },
            'Numpad0': { inkey$: '0', keyCode: 15 },
            'Numpad1': { inkey$: '1', keyCode: 29 },
            'Numpad2': { inkey$: '2', keyCode: 30 },
            'Numpad3': { inkey$: '3', keyCode: 31 },
            'Numpad4': { inkey$: '4', keyCode: 45 },
            'Numpad5': { inkey$: '5', keyCode: 46 },
            'Numpad6': { inkey$: '6', keyCode: 47 },
            'Numpad7': { inkey$: '7', keyCode: 61 },
            'Numpad8': { inkey$: '8', keyCode: 62 },
            'Numpad9': { inkey$: '9', keyCode: 63 },
            'NumpadDivide': { inkey$: '/', keyCode: 92 },
            'NumpadMultiply': { inkey$: '*', keyCode: 93 },
            'NumpadSubtract': { inkey$: '-', keyCode: 74 },
            'NumpadAdd': { inkey$: '+', keyCode: 94 },
            'NumpadEnter': { inkey$: String.fromCharCode(13), keyCode: 67 },
            'NumpadDecimal': { inkey$: '.', keyCode: 60 },
            'NumpadEqual': { inkey$: '=', keyCode: 187 }, // = non-existent on Amiga

            'Digit0': { inkey$: 'event.key', keyCode: 10 },
            'Digit1': { inkey$: 'event.key', keyCode: 1 },
            'Digit2': { inkey$: 'event.key', keyCode: 2 },
            'Digit3': { inkey$: 'event.key', keyCode: 3 },
            'Digit4': { inkey$: 'event.key', keyCode: 4 },
            'Digit5': { inkey$: 'event.key', keyCode: 5 },
            'Digit6': { inkey$: 'event.key', keyCode: 6 },
            'Digit7': { inkey$: 'event.key', keyCode: 7 },
            'Digit8': { inkey$: 'event.key', keyCode: 8 },
            'Digit9': { inkey$: 'event.key', keyCode: 9 },

            'Space': { inkey$: 'event.key', keyCode: 64 },

            'KeyA': { inkey$: 'event.key', keyCode: 32 },
            'KeyB': { inkey$: 'event.key', keyCode: 53 },
            'KeyC': { inkey$: 'event.key', keyCode: 51 },
            'KeyD': { inkey$: 'event.key', keyCode: 34 },
            'KeyE': { inkey$: 'event.key', keyCode: 18 },
            'KeyF': { inkey$: 'event.key', keyCode: 35 },
            'KeyG': { inkey$: 'event.key', keyCode: 36 },
            'KeyH': { inkey$: 'event.key', keyCode: 37 },
            'KeyI': { inkey$: 'event.key', keyCode: 23 },
            'KeyJ': { inkey$: 'event.key', keyCode: 38 },
            'KeyK': { inkey$: 'event.key', keyCode: 39 },
            'KeyL': { inkey$: 'event.key', keyCode: 40 },
            'KeyM': { inkey$: 'event.key', keyCode: 55 },
            'KeyN': { inkey$: 'event.key', keyCode: 54 },
            'KeyO': { inkey$: 'event.key', keyCode: 24 },
            'KeyP': { inkey$: 'event.key', keyCode: 25 },
            'KeyQ': { inkey$: 'event.key', keyCode: 16 },
            'KeyR': { inkey$: 'event.key', keyCode: 19 },
            'KeyS': { inkey$: 'event.key', keyCode: 33 },
            'KeyT': { inkey$: 'event.key', keyCode: 20 },
            'KeyU': { inkey$: 'event.key', keyCode: 22 },
            'KeyV': { inkey$: 'event.key', keyCode: 52 },
            'KeyW': { inkey$: 'event.key', keyCode: 17 },
            'KeyX': { inkey$: 'event.key', keyCode: 50 },
            'KeyY': { inkey$: 'event.key', keyCode: 21 },
            'KeyZ': { inkey$: 'event.key', keyCode: 49 },
        }
    }

    private lastKeyPressTime: int = 0;
    private repeatTimerDic: Dictionary<int, any> = null as any;
    public setKeyboard(): void {
        this.repeatTimerDic = new Dictionary();

        this.keymap = {};
        this.lastKey = ''; // undefined;	// string
        this.lastKeyCode = 0; // undefined;	// numeric
        this.lastKeyName = ''; // undefined;	// string
        this.key = ''; // undefined;
        this.keyCode = 0; // undefined;
        this.keyName = ''; // undefined; BJF 19 Aug fixed undefined
        this.modifiers = 0;
        this.lastModifiers = 0;

        var self = this;
        if (this.parentElement) {
            this.parentElement.addEventListener('keydown', onKeyDown);
            this.parentElement.addEventListener('keyup', onKeyUp);
        } /* else { // parent ile çalıştırılmalı. parent sız olanı umay kullanıyor.
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
        } */


        /* document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp; */

        function onKeyDown(event) {
            //---------------------EventBus Fires------------------------------
            setTimeout(() => EventBus.Default.fire('console.key.' + event.key, {}), 1);
            //---------------------------------------------------------------

            // 15.07.2021 de kapatıldı.
              if (!self.developerMode) {
                 if (event && event.target && event.target.getAttribute('keys-binding') != 'yes') {
                     event.preventDefault();
                 }
             }

            // If called under Python, "code" is not defined. Find it from keyCode.
            if (typeof event.code == 'undefined') {
                if (TVC.keyPressed[self.platformKeymap]) {
                    var keys = TVC.keyPressed[self.platformKeymap];
                    for (var k in keys) {
                        if (keys[k].keyCode == event.keyCode) {
                            event.code = k;
                            break;
                        }
                    }
                }
            }

            if ((window as any).application.tvc.break) {
                if (event.key == 'Escape') {
                    if (window.parent && (window as any).parent.atom && (window as any).parent.atom.openDirectMode) {
                        if ((window as any).parent.TVCViewer) {
                            if ((window as any).parent.TVCViewer.monitor.style.display == 'block') {
                                (window as any).parent.atom.closeTVCViewer();
                                return;
                            }
                        }
                        (window as any).parent.atom.openDirectMode();
                        return;
                    }
                }

                if (event.key === 'Enter') {
                    if (window.parent && (window as any).parent.atom && (window as any).parent.atom.closeTVCViewer) {
                        (window as any).parent.atom.closeTVCViewer();
                        return;
                    }
                }

                if (event.key === 'F2') {
                    (window as any).location.reload(false);
                    return;
                }
            }

            // Javascript name of the key
            self.keyName = event.code;  // code is *mostly* unique.

            // Javascript event keys
            var info = self.convertToPlatform(self.platformKeymap, event);

            if (info) {
                self.key = event.key;
                self.keyCode = info.keyCode;
                self.keymap[info.keyCode] = true;

                // Modifiers
                setModifiers(self.platformKeymap, event);
                this.keyShift = self.modifiers;

                // Function keys which = 112 - 121 = F1 - F10
                // If pressed function key, send associated stored contents.  BJF
                if (event.keyCode >= 112 && event.keyCode < 122) {
                    var number = event.keyCode - 112; // 0-9 = F1-F10
                    if ((self.modifiers && TVC.SHIFT) != 0) // wrong spelling modifier vs modifiers - wrong & vs &&
                        number += 10;   // 10-19 = Shift F1 to Shift F10
                    if (self.key$[number + 1] && self.key$[number + 1] != '') {
                        self.startKeyboardInput(self.key$[number + 1]);
                    }
                }

                // Control-C
                TVC.CONTROL = 0x000C; // for tvc (either control)
                // 0x8008 for Amiga (either control`)
                // 0x0200 = NUMLOCK - if numlock ON fails
                if ((event.keyCode == 67) && ((self.modifiers & TVC.CONTROL) === 4) && self.breakOn == true) {
                    self.break = true;
                    self.badEnd = true;
                }
            }
            self.lastKeyPressTime = performance.now();

        }

        function onKeyUp(event) {
            if ((performance.now() - self.lastKeyPressTime) < 20) { // user hold a key. dont fire key up
                if (self.repeatTimerDic.ContainsKey(event.code)) {
                    const repeatId = self.repeatTimerDic.Get(event.code);
                    clearTimeout(repeatId);
                    self.repeatTimerDic.Add(event.code, setTimeout(() => onKeyUp(event), 50));
                    return;
                } else {
                    self.repeatTimerDic.Add(event.code, setTimeout(() => onKeyUp(event), 50));
                    return;
                }
                // clearTimeout(self.repeatTimerId);

            }

            if (self.repeatTimerDic.ContainsKey(event.code)) {
                self.repeatTimerDic.Remove(event.code);
            }
            if (event.defaultPrevented || event.repeat) {
                return;
            }

            // Keymap UP!
            var info = self.convertToPlatform(self.platformKeymap, event);
            if (info)
                self.keymap[info.keyCode] = false;

            // Modifiers
            clearModifiers(self.platformKeymap, event);
            self.keyShift = self.modifiers;
        }

        function clearModifiers(platform, event) {
            var mask = 0;
            mask |= (event.which == 16 && event.location == 1 ? getFlag(platform, 'LEFTSHIFT') : 0);
            mask |= (event.which == 16 && event.location == 2 ? getFlag(platform, 'RIGHTSHIFT') : 0);
            mask |= (event.which == 17 && event.location == 1 ? getFlag(platform, 'LEFTCONTROL') : 0);
            mask |= (event.which == 17 && event.location == 2 ? getFlag(platform, 'RIGHTCONTROL') : 0);
            mask |= (event.which == 91 ? getFlag(platform, 'LEFTMETA') : 0);
            mask |= (event.which == 93 ? getFlag(platform, 'RIGHTMETA') : 0);
            mask |= (event.which == 18 && event.location == 1 ? getFlag(platform, 'LEFTALT') : 0);
            mask |= (event.which == 18 && event.location == 2 ? getFlag(platform, 'RIGHTALT') : 0);
            mask |= (event.getModifierState('CapsLock') ? getFlag(platform, 'CAPSLOCK') : 0);
            mask |= (event.getModifierState('NumLock') ? getFlag(platform, 'NUMLOCK') : 0);
            mask |= (event.getModifierState('ScrollLock') ? getFlag(platform, 'SCROLLLOCK') : 0);
            mask |= (event.getModifierState('FuncLock') ? getFlag(platform, 'FUNCLOCK') : 0);
            self.modifiers &= ~mask;
        }
        function setModifiers(platform, event) {
            // get the shift state.
            self.modifiers |= (event.which == 16 && event.location == 1 ? getFlag(platform, 'LEFTSHIFT') : 0);
            self.modifiers |= (event.which == 16 && event.location == 2 ? getFlag(platform, 'RIGHTSHIFT') : 0);
            self.modifiers |= (event.which == 17 && event.location == 1 ? getFlag(platform, 'LEFTCONTROL') : 0);
            self.modifiers |= (event.which == 17 && event.location == 2 ? getFlag(platform, 'RIGHTCONTROL') : 0);
            self.modifiers |= (event.which == 91 ? getFlag(platform, 'LEFTMETA') : 0);
            self.modifiers |= (event.which == 93 ? getFlag(platform, 'RIGHTMETA') : 0);
            self.modifiers |= (event.which == 18 && event.location == 1 ? getFlag(platform, 'LEFTALT') : 0);
            self.modifiers |= (event.which == 18 && event.location == 2 ? getFlag(platform, 'RIGHTALT') : 0);
            self.modifiers |= (event.getModifierState('CapsLock') ? getFlag(platform, 'CAPSLOCK') : 0);
            self.modifiers |= (event.getModifierState('NumLock') ? getFlag(platform, 'NUMLOCK') : 0);
            self.modifiers |= (event.getModifierState('ScrollLock') ? getFlag(platform, 'SCROLLLOCK') : 0);
            self.modifiers |= (event.getModifierState('FuncLock') ? getFlag(platform, 'FUNCLOCK') : 0);
        }
        function getFlag(platform, tvcModifierCode) // return bitmask for specified modifier (tvcModifierCode)
        {
            if (TVC.keyModifiers[platform][tvcModifierCode]) {
                return TVC.keyModifiers[platform][tvcModifierCode];
            }
            return 0;
        }
    }
    private convertToPlatform(platform, event)	// Convert to current platform (Todo: make Atari please)
    {
        var result;
        if (platform && TVC.keyPressed[platform]) {
            var keyDef = TVC.keyPressed[platform][event.code]; // Does key exist in this key map?
            if (keyDef) {
                result =
                {
                    key: getKey(keyDef.inkey$),
                    keyCode: getKey(keyDef.keyCode)
                }
            }
            else {
                console.log('undefined key')
            }
        }
        return result;

        function getKey(value) {
            if (value == 'event.key')
                return event.key;
            else if (value == 'event.code')
                return event.code;
            else if (value == 'event.which')
                return event.which;
            return value;
        }
    }


    private startKeyboardInput(text) {
        var self = this;
        self.positionKey$ = 0;
        self.stringKey$ += text;
        self.clearKeyFlag = false;

        if (!self.handleKey$) // Make sure we're NOT already handling keys.
        {
            setTimeout(function () {
                self.handleKey$ = setInterval(function () {
                    if (self.clearKeyFlag) {
                        clearInterval(self.handleKey$);
                        self.handleKey$ = null;
                        self.stringKey$ = '';
                    }
                    else {
                        self.modifiers = 0;
                        // Check for embedded scan codes. BJF
                        if (self.stringKey$.indexOf('$(SCAN', self.positionKey$) == self.positionKey$) {
                            var end = self.stringKey$.indexOf('SCAN)$', self.positionKey$ + 6);
                            if (end > 0) {
                                self.lastKeycode = parseInt(self.stringKey$.substring(self.positionKey$ + 6, end));
                                switch (self.lastKeycode) {
                                    case 13: self.lastKeyPressed = 13; break;	// Return
                                    case 37: self.lastKeyPressed = 29; break;	// Left
                                    case 39: self.lastKeyPressed = 28; break;	// Right
                                    case 38: self.lastKeyPressed = 30; break;  	// Up
                                    case 40: self.lastKeyPressed = 31; break;	// Down
                                }
                            }
                            self.positionKey$ = end + 6;
                        } // Check for embedded scan code.
                        // Check for MASK (modifiers)
                        else if (self.stringKey$.indexOf('$(MASK', self.positionKey$) == self.positionKey$) {
                            var end = self.stringKey$.indexOf('MASK)$', self.positionKey$ + 6);
                            if (end > 0) {
                                var mask = parseInt(self.stringKey$.substring(self.positionKey$ + 6, end));
                                // these shift states should be using the platform - BJF
                                if ((mask & 0x0003) != 0)			// Shift
                                    self.modifiers |= TVC.SHIFT;
                                else if ((mask & 0x0004) != 0)		// Caps lock
                                    self.modifiers |= TVC.SHIFT;
                                else if ((mask & 0x0008) != 0)		// Ctrl
                                    self.modifiers |= TVC.CONTROL;
                                else if ((mask & 0x0030) != 0)		// Alt
                                    self.modifiers |= TVC.ALT;
                                else if ((mask & 0x0040) != 0)		// Meta
                                    self.modifiers |= TVC.META;
                            }
                            self.positionKey$ = end + 6;
                        } // Check for embedded MASK (modifiers)
                        else {
                            /*
                            // Added new code: BJF 20 Aug
                            var keyboardEvent = document.createEvent("KeyboardEvent");
                            var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
                            keyboardEvent[initMethod]
                            (
                                "keydown", true, true, window, false, false, false, false, false,
                                self. stringKey$.substring( self.positionKey$++, end ) , // keyCode
                                0 // charCode BJF
                            );
                            document.dispatchEvent(keyboardEvent); // BJF
                            */
                            // Process the data here? BJF
                            /*
                            var key = this.key;
                            if ( key )
                            {
                                this.key = null;
                                this.lastKeyCode = this.keyCode;
                                this.lastKeyName = this.keyName;
                                this.lastModifiers = this.modifiers;
                            */
                            //						this.modifiers=self.modifiers; // BJF added.
                            // BJF changed self. to this. below
                            self.lastKeyPressed = self.stringKey$.charCodeAt(self.positionKey$++);
                        }

                        if (self.positionKey$ >= self.stringKey$.length) {
                            // We scanned to the end of
                            clearInterval(self.handleKey$);
                            self.handleKey$ = null;
                            self.stringKey$ = '';
                        }
                    }
                }, 20);
            }, 100);
        }
    }

    private debugOnKeyPress(key) {
        if (this.lastKeyName == key) {
            debugger;
        }
    }

    private putKey(text) {
        this.startKeyboardInput(text);
    }

    private clearKey() {
        this.lastKeyPressed = 0;
        this.clearKeyFlag = true;
    }

    public inkey$(): string {
        var key = this.key;
        if (key) {
            this.key = null as any;
            this.lastKeyCode = this.keyCode;
            this.lastKeyName = this.keyName;
            this.lastModifiers = this.modifiers;
            switch (key) {
                case 'Enter': key = String.fromCharCode(13); break;
                case 'CapsLock': key = ''; break;
                case 'Tab': key = String.fromCharCode(9); break;
                case 'Backspace': key = String.fromCharCode(8); break;
                case 'Escape': key = String.fromCharCode(27); break;
                case 'Shift': key = ''; break;
                case 'Control': key = ''; break;
                case 'Alt': key = ''; break;
                case 'Meta': key = ''; break;
                case 'ContextMenu': key = ''; break;
                case 'ArrowLeft': key = String.fromCharCode(28); break;
                case 'ArrowRight': key = String.fromCharCode(31); break;
                case 'ArrowUp': key = String.fromCharCode(29); break;
                case 'ArrowDown': key = String.fromCharCode(30); break;
                case 'Home': key = String.fromCharCode(0); break;
                case 'End': key = String.fromCharCode(0); break;
                case 'PageUp': key = String.fromCharCode(0); break;
                case 'PageDown': key = String.fromCharCode(0); break;
                case 'ScrollLock': key = ''; break;
                case 'NumLock': key = ''; break;
                case 'Insert': key = String.fromCharCode(30); break;
                case 'Delete': key = String.fromCharCode(30); break;
                case 'Clear': key = String.fromCharCode(30); break;
                case 'F1': key = String.fromCharCode(30); break;
                case 'F2': key = String.fromCharCode(30); break;
                case 'F3': key = String.fromCharCode(30); break;
                case 'F4': key = String.fromCharCode(30); break;
                case 'F5': key = String.fromCharCode(30); break;
                case 'F6': key = String.fromCharCode(30); break;
                case 'F7': key = String.fromCharCode(30); break;
                case 'F8': key = String.fromCharCode(30); break;
                case 'F9': key = String.fromCharCode(30); break;
                case 'F10': key = String.fromCharCode(30); break;
                case 'F11': key = String.fromCharCode(30); break;
                case 'F12': key = String.fromCharCode(30); break;
                case 'F13': key = String.fromCharCode(30); break;
                case 'Help': key = String.fromCharCode(30); break;
                default: break;
            }
            return key;
        }
        return '';
    }

    public getScanCode(): int {
        var key = this.lastKeyCode;
        this.lastKeyCode = 0;
        if (key === undefined)
            key = 0;
        return key;
    }

    public getKeyState(code: int): boolean | int {
        const result = this.keymap[code];
        if (!result)
            return 0;
        else
            return this.platformTrue;
    }

    private getScanShift() {
        var modifiers = this.lastModifiers;
        this.lastModifiers = 0;
        return modifiers;
    }

    private getKeyName() {
        var keyName = this.lastKeyName;
        this.lastKeyName = '';
        return keyName
    }

    public getKeyShift(shift?) {
        return this.modifiers;
    }

    private waitKey() {
        this.keyName = undefined as any;
    }
    private waitKey_wait() {
        if (this.key) {
            this.key = undefined as any;
            this.keyName = '';
            this.keyCode = 0;
            this.lastKey = '';
            this.lastKeyCode = 0;
            this.lastKeyName = '';

            return true;
        }
        return false;
    }

    private waitVbl() {
        this.waitVblCount = 2;
    }
    private waitVbl_wait() {
        this.waitVblCount--;
        return (this.waitVblCount === 0);
    }

    private isPromiseWaiting: boolean = false;
    private waitPromise(args) {
        this.isPromiseWaiting = true;
        args.promise.then((..._args: any[]) => {
            args.callback(..._args);
            this.isPromiseWaiting = false;
        }).catch(error => {
            args.errorCallback(error);
            this.isPromiseWaiting = false;
        });
    }
    private waitPromise_wait() {
        return !this.isPromiseWaiting;
    }

    private setKey$(value, number, mask) {
        if (number <= 0 || number > 20) {
            throw { error: 'illegal_function_call', parameter: number };
        }
        this.key$[number] = value;
    }
    private getKey$(number, mask) {
        if (number < 0 || number > 20)
            throw { error: 'illegal_function_call', parameter: number };
        return this.key$[number];
    }

    private scan$(number, mask) {
        let result = '$(SCAN' + number + 'SCAN)$';
        if (typeof mask != 'undefined') {
            result += '$(MASK' + mask + 'MASK)$';
        }
        return result;
    }

    private varPtr(variableDefinition) {
        try {
            variableDefinition = JSON.parse(variableDefinition);
        }
        catch (e) {
            throw { error: 'illegal_function_call', parameter: '(internal)' };
        }
        var index = variableDefinition.variable.index * this.tvc.memoryHashMultiplier;

        var variable = this.variablesContext.getElement(this.currentContext, index);
        if (!variable) {
            variableDefinition.variable.root = this.section;
            variableDefinition.variable.dimensions = undefined;
            this.variablesContext.setElement(this.currentContext, variableDefinition, index);
        }
        return index;
    }

    private getVariableDefinition(index: int) {
        return this.variablesContext.getElement(this.currentContext, index, 'variable_not_found').variable;
    }

    private getVariableType(index) {
        return this.variablesContext.getElement(this.currentContext, index, 'variable_not_found').variable.type;
    }

    private getVariableName(index) {
        return this.variablesContext.getElement(this.currentContext, index, 'variable_not_found').variable.name;
    }

    private getVariableValue(index, type) {
        var variable = this.variablesContext.getElement(this.currentContext, index, 'variable_not_found').variable;
        if (type == 'string' && variable.type != 'string')
            throw 'type_mismatch';
        else if (type == 'number' && !(variable.type == 'integer' || variable.type == 'float'))
            throw 'type_mismatch';
        return this.getVariable(variable);
    }

    private setVariable(variable, value) {
        if (!variable.dimensions) {
            if (variable.parent)
                this.currentSection.parent.vars[variable.name] = value;
            else if (variable.root)
                this.root.vars[variable.name] = value;
            else
                this.currentSection.vars[variable.name] = value;
        }
        else {
            if (variable.parent)
                this.currentSection.parent.vars[variable.name].setValue(variable.dimensions, value);
            else if (variable.root)
                this.root.vars[variable.name].setValue(variable.dimensions, value);
            else
                this.currentSection.vars[variable.name].setValue(variable.dimensions, value);
        }
    }

    private getVariable(variable) {
        if (!variable.dimensions) {
            if (variable.parent)
                return this.currentSection.parent.vars[variable.name];
            else if (variable.root)
                return this.root.vars[variable.name];
            else
                return this.currentSection.vars[variable.name];
        }
        else {
            if (variable.parent)
                return this.currentSection.parent.vars[variable.name].getValue(variable.dimensions);
            else if (variable.root)
                return this.root.vars[variable.name].getValue(variable.dimensions);
            else
                return this.currentSection.vars[variable.name].getValue(variable.dimensions);
        }
    }
    private input(args) {
        this.inputArgs = args;
        this.inputPosition = 0;
        this.inputString = '';
        this.keyName = undefined as any;
        this.inputCursor = 0;
        if (typeof args.text != 'undefined') {
            this.currentScreen.currentTextWindow.print(args.text);
        }
        else {
            this.currentScreen.currentTextWindow.print('? ');
        }
        this.inputXCursor = this.currentScreen.currentTextWindow.xCursor;
        this.currentScreen.currentTextWindow.anchorYCursor();
        this.currentScreen.currentTextWindow.forceCursor();

        this.lastInputYCursor = this.currentScreen.currentTextWindow.yCursor;
    }

    private input_wait(args) {
        if (this.keyName) {
            switch (this.keyName) {
                case 'Enter':
                case 'NumpadEnter':
                    var previousComma = 0;
                    var inputString;
                    while (true) {
                        var comma = this.inputString.indexOf(',', previousComma);
                        if (this.inputArgs.variables.length > 1 && comma >= 0 && !this.inputArgs.isLineInput) {
                            inputString = this.inputString.substring(previousComma, comma);
                            previousComma = comma + 1;
                        }
                        else {
                            inputString = this.inputString.substring(previousComma);
                            previousComma = this.inputString.length;
                        }
                        var variable = this.inputArgs.variables[this.inputPosition];
                        var value;
                        if (variable.type == 0)
                            value = inputString.length > 0 ? parseInt(inputString) : 0;
                        else if (variable.type == 1)
                            value = inputString.length > 0 ? parseFloat(inputString) : 0;
                        else
                            value = inputString;
                        if (variable.type != 2 && isNaN(value)) {
                            this.currentScreen.currentTextWindow.print('', true);
                            this.currentScreen.currentTextWindow.print(this.errors.getError('please_redo_from_start').message);
                            this.inputXCursor = this.currentScreen.currentTextWindow.xCursor;
                            this.currentScreen.currentTextWindow.anchorYCursor();
                            this.inputPosition = 0;
                            this.inputString = '';
                            break;
                        }
                        this.setVariable(variable, value);
                        this.inputPosition++;
                        if (this.inputPosition >= this.inputArgs.variables.length) {
                            if (this.inputArgs.newLine)
                                this.currentScreen.currentTextWindow.print('', true);
                            this.key = null as any;
                            this.currentScreen.currentTextWindow.restoreCursor();
                            return true;
                        }
                        if (previousComma >= this.inputString.length) {
                            this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                            this.currentScreen.currentTextWindow.cMove({ x: this.inputString.length, y: 0 });
                            this.currentScreen.currentTextWindow.print('', true);
                            this.currentScreen.currentTextWindow.print('?? ');
                            this.inputXCursor = this.currentScreen.currentTextWindow.xCursor;
                            this.currentScreen.currentTextWindow.anchorYCursor();
                            this.inputString = '';
                            this.inputCursor = 0;
                            break;
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (this.inputCursor > 0) {
                        this.inputCursor--;
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.cMove({ x: this.inputCursor, y: 0 });
                    }
                    break;
                case 'ArrowRight':
                    if (this.inputCursor < this.inputString.length) {
                        this.inputCursor++;
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.cMove({ x: this.inputCursor, y: 0 });
                    }
                    break;
                case 'Backspace':
                    if (this.inputCursor > 0) {
                        this.inputCursor--;
                        this.inputString = this.inputString.substring(0, this.inputCursor) + this.inputString.substring(this.inputCursor + 1);
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.print(this.inputString + ' ');
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.cMove({ x: this.inputCursor, y: 0 });
                    }
                    break;
                case 'Del':
                    if (this.inputCursor < this.inputString.length) {
                        this.inputString = this.inputString.substring(0, this.inputCursor) + this.inputString.substring(this.inputCursor + 1);
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.print(this.inputString + ' ');
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.cMove({ x: this.inputCursor, y: 0 });
                    }
                    break;
                default:
                    if (this.key.length == 1) {
                        // Normal character
                        this.inputString = this.inputString.substring(0, this.inputCursor) + this.key + this.inputString.substring(this.inputCursor);
                        this.inputCursor++;
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.print(this.inputString);
                        this.currentScreen.currentTextWindow.locate({ x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor });
                        this.currentScreen.currentTextWindow.cMove({ x: this.inputCursor, y: 0 });
                    }
                    break;
            }
            this.keyName = null as any;
        }
        return false;
    }

    private input$(args) {
        this.input$String = '';
        this.input$Length = args[0];
        if (this.input$length <= 0)
            throw { error: 'illegal_function_call', parameter: args[0] };
        this.key = undefined as any;
    }

    private input$_wait(args) {
        if (this.key) {
            if (this.key.length == 1)
                this.input$String += this.key;
            this.key = undefined as any;
        }
        if (this.input$String.length >= this.input$Length) {
            return true;
        }
        return false;
    };

    // Mouse
    private static buttonToMouse = {
        0: 0x0001,
        1: 0x0004,
        2: 0x0002
    }
    private killEvents() {
        this.renderer.canvas.onmousemove = undefined as any;
        this.renderer.canvas.onmouseleave = undefined as any;
        this.renderer.canvas.onmouseenter = undefined as any;
        this.renderer.canvas.onmousedown = undefined as any;
        this.renderer.canvas.onmouseup = undefined as any;
        this.renderer.canvas.onclick = undefined as any;
        this.renderer.canvas.ondblclick = undefined as any;
        this.renderer.canvas.oncontextmenu = undefined as any;
        document.onclick = undefined as any;
    }

    private setMouse() {
        var self = this;
        this.renderer.canvas.onmousemove = function (event) { self.onMouseMove(event) };
        this.renderer.canvas.onmouseleave = function (event) { self.onMouseLeave(event) };
        this.renderer.canvas.onmouseenter = function (event) { self.onMouseEnter(event) };
        this.renderer.canvas.onmousedown = function (event) { self.onMouseDown(event) };
        this.renderer.canvas.onmouseup = function (event) { self.onMouseUp(event) };
        this.renderer.canvas.onclick = function (event) { self.onClick(event) };
        this.renderer.canvas.ondblclick = function (event) { self.onDblClick(event) };
        this.renderer.canvas.oncontextmenu = function (event) { self.onContextMenu(event) };
        document.onclick = function (event) { self.onClickDocument(event) };

        if (document.body.addEventListener) {
            document.body.addEventListener('mousewheel', function (event) { self.onMouseWheel(event) }, false);
            document.body.addEventListener('DOMMouseScroll', function (event) { self.onMouseWheel(event) }, false);
        }
        else {
            (document.body as any).attachEvent('onmousewheel', function (event) { self.onMouseWheel(event) });
        }

        this.xMouse = 0;
        this.yMouse = 0;
        this.mouseInside = false;
        this.mouseButtons = 0;
        this.clickMouse = 0;
        this.doubleClick = false;
        this.wheelMouse = 0;
        this.mouseCurrent = 'auto';
        this.mouseShown = true;
        this.limitMouse = null;

        this.is_touch = 'ontouchstart' in window;
        this.ongoingTouches = new Array();
        this.touches = new Array();
        this.is_orientable = 'ondeviceorientation' in window;
        this.orientationX = 0;
        this.orientationY = 0;
        this.orientationZ = 0;
        this.is_accelerator = 'ondevicemotion' in window;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.accelerationZ = 0;
        this.latitude = 0.0;
        this.longitude = 0.0;
        this.already_fs = false;
        this.procName = undefined;

        if ('ontouchstart' in window) {
            self.renderer.canvas.addEventListener('touchstart', function (event) { self.onTouchStart(event) }, false);
            self.renderer.canvas.addEventListener('touchmove', function (event) { self.onTouchMove(event) }, false);
            self.renderer.canvas.addEventListener('touchend', function (event) { self.onTouchEnd(event) }, false);
            self.renderer.canvas.addEventListener('touchcancel', function (event) { self.onTouchCancel(event) }, false);
            self.renderer.canvas.addEventListener('touchleave', function (event) { self.onTouchEnd(event) }, false)
        }

        if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', function (event) { self.onDeviceOrientation(event) }, false);
        }

        if ('ondevicemotion' in window) {
            window.addEventListener('devicemotion', function (event) { self.onDeviceMotion(event) }, false);
        }

        if ('onorientationchange' in window) {
            if (window.orientation === 90 || window.orientation === -90) {
                self.orientation = 0;
            }
            else {
                self.orientation = 1;
            }

            window.addEventListener("orientationchange", function () {
                if (window.orientation === 90 || window.orientation === -90) {
                    self.orientation = 0;
                }
                else {
                    self.orientation = 1;
                }
            }, false);
        }
    }

    private onMouseMove(event) {
        this.xMouseDebug = event.clientX;
        this.yMouseDebug = event.clientY;

        var x = (event.clientX - (this.renderer.canvas.offsetLeft + this.renderer.xLeftDraw)) / this.renderer.xRatioDisplay + this.renderer.hardLeftX;
        var y = (event.clientY - (this.renderer.canvas.offsetTop + this.renderer.yTopDraw)) / this.renderer.yRatioDisplay + this.renderer.hardTopY;
        if (this.manifest.compilation.platform == 'amiga') {
            x = Math.round(x);
            y = Math.round(y);
        }
        if (this.limitMouse) {
            if (x < this.limitMouse.x)
                x = this.limitMouse.x;
            if (x > this.limitMouse.x + this.limitMouse.width)
                x = this.limitMouse.x + this.limitMouse.width;
            if (y < this.limitMouse.y)
                y = this.limitMouse.y;
            if (y > this.limitMouse.y + this.limitMouse.height)
                y = this.limitMouse.y + this.limitMouse.height;
        }
        this.xMouse = x;
        this.yMouse = y;

        if (this.touchEmulation.active && this.touchEmulation.fingerOnScreen) {

            const touches = {
                identifier: 'mouse_emulation_0',
                clientX: event.clientX,
                clientY: event.clientY,
                tvcState: 2
            }

            var result = this.computeTouch(0, touches);
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 2);
            this.touchEmulation.lastX = result.x;
            this.touchEmulation.lastY = result.y;
            this.ongoingTouches.splice(touches as any);
            this.updateTouches();
        }
    }
    private onMouseEnter(event) {
        this.mouseInside = true;
    }
    private onMouseLeave(event) {
        this.mouseInside = false;
    }
    private onMouseWheel(event) {
        this.wheelMouse = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    }
    private onMouseDown(event) {
        this.mouseButtons |= TVC.buttonToMouse[event.button];
        this.clickMouse = this.mouseButtons;

        if (this.touchEmulation.active) {

            var touches = {
                identifier: 'mouse_emulation_0',
                clientX: event.clientX,
                clientY: event.clientY,
                tvcState: 1
            }

            var result = this.computeTouch(0, touches);
            this.touchEmulation.fingerOnScreen = true;
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 1);
            this.touchEmulation.lastX = -1;
            this.touchEmulation.lastY = -1;
            this.ongoingTouches.push(touches);
            this.updateTouches();
        }
    }
    private onMouseUp(event) {
        this.mouseButtons &= ~TVC.buttonToMouse[event.button];
        if (this.touchEmulation.active) {

            var touches = {
                identifier: 'mouse_emulation_0',
                clientX: event.clientX,
                clientY: event.clientY,
                tvcState: 3
            }

            this.touchEmulation.fingerOnScreen = false;
            var result = this.computeTouch(0, touches);
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 3);
            this.touchEmulation.lastX = result.x;
            this.touchEmulation.lastY = result.y;
            this.ongoingTouches.splice(touches as any);
            this.updateTouches();
        }
    }
    private onClick(event) {
        this.welcomeClick = true;
    }
    private onClickDocument(event) {
        this.welcomeClick = true;
        if (this.renderer.isInFullScreenIcon({ x: this.xMouseDebug, y: this.yMouseDebug })) {
            this.renderer.swapFullScreen();
        }
    }
    private onDblClick(event) {
        this.doubleClick = true;
    }
    private onContextMenu(event) {
        if (event.preventDefault != undefined)
            event.preventDefault();
        if (event.stopPropagation != undefined)
            event.stopPropagation();
    }

    private onTouchStart(event) {
        event.preventDefault();

        this.welcomeClick = true;
        var touches = event.changedTouches;
        if (this.touches == undefined) {
            this.touches = new Array();
        }

        this.mouseButtons = 1;
        this.clickMouse = 1;

        for (var i = 0; i < touches.length; i++) {
            touches[i].tvcState = 1;
            var result = this.computeTouch(i, touches[i]);
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 1);
            this.ongoingTouches.push(touches[i]);
        }
        this.updateTouches();
    }

    private onTouchMove(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        this.mouseButtons = 1;
        this.clickMouse = 1;

        for (var i = 0; i < touches.length; i++) {
            touches[i].tvcState = 2;
            var result = this.computeTouch(i, touches[i]);

            var idx = this.getTouchById(touches[i].identifier);
            var result = this.computeTouch(i, touches[i]);
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 2);
            this.ongoingTouches.splice(idx, 1, touches[i]);
        }
        this.updateTouches();
    }

    private onTouchEnd(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        this.touches = new Array();

        this.removeTouches = new Array();

        this.mouseButtons = 0;
        this.clickMouse = 0;

        for (var i = 0; i < touches.length; i++) {
            touches[i].tvcState = 3;
            var idx = this.getTouchById(touches[i].identifier);
            var result = this.computeTouch(i, touches[i]);
            this.execTouchOnChange(result.x, result.y, result.lastX, result.lastY, 3);
            this.ongoingTouches.splice(idx, 1);
        }
        this.updateTouches();
    }

    private onTouchCancel(event) {
        event.preventDefault();
        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            this.ongoingTouches.splice(i, 1);
        }
        this.updateTouches();
    }
    private onDeviceOrientation(event) {
        event.preventDefault();

        this.orientationX = event.gamma;
        this.orientationY = event.beta;
        this.orientationZ = event.alpha;

    }

    private onDeviceMotion(event) {
        event.preventDefault();

        this/* self */.accelerationX = event.accelerationIncludingGravity.x;
        this/* self */.accelerationY = event.accelerationIncludingGravity.y;
        this/* self */.accelerationZ = event.accelerationIncludingGravity.z;

    }

    private getTouchById(idToFind) {

        for (var i = 0; i < this.ongoingTouches.length; i++) {
            var id = this.ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1;
    }

    private updateTouches() {
        this.touches = new Array();

        for (let i = 0; i < this.ongoingTouches.length; i++) {
            var result = this.computeTouch(i, this.ongoingTouches[i]);
            this.touches.push({ x: result.x, y: result.y, state: this.ongoingTouches[i].tvcState });

            if (i === 0) {
                this.xMouseDebug = this.touches[i].clientX;
                this.yMouseDebug = this.touches[i].clientY;
                this.xMouse = result.x;
                this.yMouse = result.y;
            }
        }
    }

    private computeTouch(i, touch) {
        var x = (touch.clientX - (this.renderer.canvas.offsetLeft + this.renderer.xLeftDraw)) / this.renderer.xRatioDisplay + this.renderer.hardLeftX;
        var y = (touch.clientY - (this.renderer.canvas.offsetTop + this.renderer.yTopDraw)) / this.renderer.yRatioDisplay + this.renderer.hardTopY;
        if (this.manifest.compilation.platform == 'amiga') {
            x = Math.round(x);
            y = Math.round(y);
        }
        if (this.limitMouse) {
            if (x < this.limitMouse.x)
                x = this.limitMouse.x;
            if (x > this.limitMouse.x + this.limitMouse.width)
                x = this.limitMouse.x + this.limitMouse.width;
            if (y < this.limitMouse.y)
                y = this.limitMouse.y;
            if (y > this.limitMouse.y + this.limitMouse.height)
                y = this.limitMouse.y + this.limitMouse.height;
        }

        var ni = i;
        if (this.ongoingTouches) {
            for (let ii = 0; ii < this.ongoingTouches.length; ii++) {
                if (this.ongoingTouches[ii].identifier == touch.identifier) {
                    ni = ii;
                    break;
                }
            }
        }

        var lastX = x;
        var lastY = y;
        if (this.ongoingTouches[ni]) {
            lastX = (this.ongoingTouches[ni].clientX - (this.renderer.canvas.offsetLeft + this.renderer.xLeftDraw)) / this.renderer.xRatioDisplay + this.renderer.hardLeftX;
            lastY = (this.ongoingTouches[ni].clientY - (this.renderer.canvas.offsetTop + this.renderer.yTopDraw)) / this.renderer.yRatioDisplay + this.renderer.hardTopY;
            if (this.manifest.compilation.platform == 'amiga') {
                lastX = Math.round(x);
                lastY = Math.round(y);
            }
            if (this.limitMouse) {
                if (lastX < this.limitMouse.x)
                    lastX = this.limitMouse.x;
                if (lastX > this.limitMouse.x + this.limitMouse.width)
                    lastX = this.limitMouse.x + this.limitMouse.width;
                if (lastY < this.limitMouse.y)
                    lastY = this.limitMouse.y;
                if (lastY > this.limitMouse.y + this.limitMouse.height)
                    lastY = this.limitMouse.y + this.limitMouse.height;
            }
        }

        if (this.touchEmulation.active) {
            if (this.touchEmulation.lastX == - 1) {
                this.touchEmulation.lastX = x;
            }

            if (this.touchEmulation.lastY == - 1) {
                this.touchEmulation.lastY = y;
            }

            lastX = this.touchEmulation.lastX;
            lastY = this.touchEmulation.lastY;
        }
        return { x: x, y: y, lastX: lastX, lastY: lastY };
    }

    private touchOnChange(procName) {
        this.procName = procName;
    }

    private execTouchOnChange(x, y, lastX, lastY, state) {
        if (this.procName == undefined || this.procName == '') {
            return;
        }
        var args =
        {
            X: Number(x).toFixed(3),
            Y: Number(y).toFixed(3),
            LASTX: Number(lastX).toFixed(3),
            LASTY: Number(lastY).toFixed(3),
            STATE: state
        };
        this.runProcedure(this.procName, args);
    }

    private geoLocation() {
        var self = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            self.latitude = position.coords.latitude;
            self.longitude = position.coords.longitude;
        });
    }

    private getTouchX(index) {
        if (this.touches[index] == undefined) {
            return -1;
        }
        return this.touches[index].x;
    }

    private getTouchY(index) {
        if (this.touches[index] == undefined) {
            return -1;
        }
        return this.touches[index].y;
    }

    private getTouchState(index) {
        if (this.touches[index] == undefined) {
            return -1;
        }
        return this.touches[index].state;
    }

    private setMouseLimits(rectangle) {
        this.limitMouse = rectangle;
    }
    private xor(a, b) {
        return (a && !b) || (!a && b);
    }
    /*   private mouseScreen() {
          return this.screenIn(undefined, this.xMouse, this.yMouse);
      } */
    private mouseWheel() {
        var temp = this.wheelMouse;
        this.wheelMouse = 0;
        return temp;
    }

    private showMouse(flag, count) {
        if (count) {
            if (flag)
                this.mouseVisibleCount++;
            else
                this.mouseVisibleCount--;
            flag = (this.mouseVisibleCount > 0)
        }
        if (flag != this.mouseShown) {
            this.mouseShown = flag;
            if (!flag)
                this.renderer.canvas.style.cursor = 'none';
            else
                this.renderer.canvas.style.cursor = this.mouseCurrent;
        }
    }
    private mouseClick() {
        var click = this.clickMouse;
        this.clickMouse = 0;
        return click;
    }
    private changeMouse(type) {
        switch (type) {
            case 1:
            case 'default':
            case 'auto':
            default:
                this.mouseCurrent = 'auto';
                break;
            case 'crosshair':
            case 2:
                this.mouseCurrent = 'crosshair';
                break;
            case 'wait':
            case 3:
                this.mouseCurrent = 'wait';
                break;
            case 'pointer':
            case 4:
                this.mouseCurrent = 'pointer';
        }
        if (this.mouseShown)
            this.renderer.canvas.style.cursor = this.mouseCurrent;
    }

    private xHard(x, screen) {
        screen = this.getScreen(screen);
    }
    private yHard(y, screen) {
        screen = this.getScreen(screen);
        return y * screen.renderScaleY + screen.y;
    }

    private xScreen(x, screen) {
        screen = this.getScreen(screen);
        return (x - screen.position.x) / screen.renderScaleX / screen.displayScale.x;
    }

    private yScreen(y, screen) {
        screen = this.getScreen(screen);
        return (y - screen.y) / screen.renderScaleY / screen.displayScale.x;
    }

    private isIn(number, x, y) {
        var screen = this.getScreen(number);
        x = (x - screen.x) / screen.renderScaleX;
        y = (y - screen.y) / screen.renderScaleY;
        this.currentScreen.isIn({ x: x, y: y });
    }

    private hZone(number, x, y) {
        var screen = this.getScreen(number);
        x = (x - screen.x) / screen.renderScaleX;
        y = (y - screen.y) / screen.renderScaleY;
        return screen.zone(number, x, y);
    }

    private mouseZone() {
        return this.hZone(undefined, this.xMouse, this.yMouse);
    }

    private setXMouse(x) {
        this.xMouse = x;
    }

    private setYMouse(y) {
        this.yMouse = y;
    }

    public GetXMouse(x?) {
        return isNaN(this.xMouse) ? 0 : this.xMouse;
    }

    public GetYMouse(y?) {
        return isNaN(this.yMouse) ? 0 : this.yMouse;
    }

    // Data/read
    private read(section, type) {
        if (section.dataPosition >= section.datas.length)
            throw ('out_of_data');

        var value = section.datas[section.dataPosition++];
        if (typeof value == 'function')
            value = value.call(section, this, section.vars);
        if (type == 0 || type == 1) {
            if (typeof value == 'string')
                throw ('type_mismatch');
        }
        else {
            if (typeof value != 'string')
                throw ('type_mismatch');
        }
        return value;
    }

    private add(section, variable, plus, start, end) {
        var number = this.getVariableFromDescription(section, variable);
        number += plus;
        if (typeof start != 'undefined' && typeof end != 'undefined') {
            if (number > end)
                number = start;
            if (number < start)
                number = end;
        }
        this.setVariableFromDescription(section, variable, number);
    }

    private getVariableFromDescription(section, variable) {
        var result;
        if (variable.dimensions) {
            if (!variable.root)
                result = section.vars[variable.name].getValue(variable.dimensions);
            else
                result = this.root.vars[variable.name].getValue(variable.dimensions);
        }
        else {
            if (!variable.root)
                result = section.vars[variable.name];
            else
                result = this.root.vars[variable.name];
        }
        return result;
    }

    private setVariableFromDescription(section, variable, value) {
        if (variable.dimensions) {
            if (!variable.root)
                section.vars[variable.name].setValue(variable.dimensions, value);
            else
                this.root.vars[variable.name].setValue(variable.dimensions, value);
        }
        else {
            if (!variable.root)
                section.vars[variable.name] = value;
            else
                this.root.vars[variable.name] = value;
        }
    }

    // Instruction set
    private setStringBaseIndex(number) {
        if (typeof number == 'undefined')
            throw 'illegal_function_call';
        if (number < 0 || number > 1)
            throw { error: 'illegal_function_call', parameter: number };
        this.stringBaseIndex = number ? 1 : 0;
    }
    private instr(text, search, position) {
        if (position < 0)
            throw { error: 'illegal_function_call', parameter: position };
        if (typeof position == 'undefined')
            position = this.stringBaseIndex;

        position = Math.max(position - this.stringBaseIndex, 0);
        var result = text.indexOf(search, position);
        if (result >= 0)
            return result + this.stringBaseIndex;
        return this.stringBaseIndex - 1;
    }
    private string$(text, number) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        var result = '';
        var chr = text.charAt(0);
        for (var c = 0; c < number; c++)
            result += chr;
        return result;
    }
    private trim$(text, position) {
        position = (typeof position == 'undefined' ? 0 : position);
        if (position < 0 || position > 2)
            throw { error: 'illegal_function_call', parameter: position };

        var start = (position == 0 || position == 1);
        var end = (position == 0 || position == 2);
        if (start) {
            while (text.length > 0 && text.charAt(0) == ' ')
                text = text.substring(1);
        }
        if (end) {
            while (text.length > 0 && text.charAt(text.length - 1) == ' ')
                text = text.substring(0, text.length - 1);
        }
        return text;
    }

    private flip$(text) {
        var result = '';
        for (var c = text.length - 1; c >= 0; c--)
            result += text.charAt(c);
        return result;
    }

    private getLeft$(text, position) {
        if (position < 0)
            throw { error: 'illegal_function_call', parameter: position };
        if (typeof position == 'undefined')
            position = 0;
        return text.substring(0, position);
    }

    private setLeft$(text, variable, position) {
        this.setMid$(text, variable, 0, position);
    }

    private getMid$(text, start, len) {
        if (start < 0)
            throw { error: 'illegal_function_call', parameter: start };
        start = Math.max(start - this.stringBaseIndex, 0);
        if (typeof len == 'undefined')
            return text.substr(start);

        if (len < 0)
            throw { error: 'illegal_function_call', parameter: len };
        if (start + len > text.length)
            len = text.length - start;
        return text.substr(start, len);
    }

    private setMid$(text, variable, start, len) {
        if (start < 0)
            throw { error: 'illegal_function_call', parameter: start };

        start = Math.max(start - this.stringBaseIndex, 0);
        var value = this.getVariable(variable);
        if (start > value.length)
            start = value.length;

        if (typeof len == 'undefined')
            len = value.length - start;  // changed text.length to value.length
        else if (len < 0)
            throw { error: 'illegal_function_call', parameter: len };

        var lReplace = Math.min(text.length, len);
        if (start + lReplace > value.length)
            lReplace = value.length - start;
        value = value.substring(0, start) + text.substr(0, len) + value.substring(start + lReplace);
        this.setVariable(variable, value);
    }

    private getRight$(text, start) {
        if (start < 0)
            throw { error: 'illegal_function_call', parameter: start };
        if (start > text.length)
            start = text.length;
        return text.substring(text.length - start);
    }

    private setRight$(text, variable, len) {
        var value = this.getVariable(variable);
        if (typeof len == 'undefined')
            len = value.length;
        if (len < 0)
            throw { error: 'illegal_function_call', parameter: len };
        len = Math.min(len, value.length);

        var start = Math.max(0, value.length - len);
        value = value.substring(0, start) + text.substr(0, len) + value.substring(start + len);
        this.setVariable(variable, value);
    }

    private subtractString(string1, string2) {
        return this.utilities.replaceStringInText(string1, string2, '');
    }

    private isDep: boolean = false;
    private dep() {
        this.isDep = true;
    }
    public ReleaseDep() {
        this.isDep = false;
    }
    private wait(args) {
        var delay = args[0];
        if (delay < 0)
            throw { error: 'illegal_function_call', parameter: delay };
        this.waitEnd = new Date().getTime() + (this.platform != 'tvc' ? delay * 20 : delay * 1000);
    }


    private dep_wait() {
        return !this.isDep;
    }
    private wait_wait() {
        var now = new Date().getTime();
        return (now >= this.waitEnd);
    }

    private bin$(value, digits) {
        var result = value.toString(2);
        if (typeof value != 'undefined') {
            if (value < 0)
                throw { error: 'illegal_function_call', parameter: value };
            for (var l = result.length; l < digits; l++)
                result = '0' + result;
        }
        return '%' + result;
    }
    private hex$(value, digits) {
        var result = value.toString(16).toUpperCase();
        if (typeof value != 'undefined') {
            if (value < 0)
                throw { error: 'illegal_function_call', parameter: value };
            for (var l = result.length; l < digits; l++)
                result = '0' + result;
        }
        return '$' + result;
    }

    private setTimer(time) {
        if (time < 0)
            throw { error: 'illegal_function_call', parameter: time };
        this.timer = time;
    }
    public getTimer() {
        return this.platform === 'tvc' ? this.timer : Math.floor(this.timer);
    }

    // Mersene Twister random generator
    public rnd(value) {
        if (typeof value != 'undefined') {
            if (this.merseneTwister) {
                var number = this.merseneTwister.genrand_res53() * (value + 1);
                return Math.floor(number);
            }
            if (Math.floor(value) == value)
                return Math.floor(Math.random() * (value + 1));
            else
                return Math.random() * value;
        }
        return Math.random();
    }
    private randomize(initial) {
        this.merseneTwister = new MersenneTwister(initial);
    }

    //
    // MEMORY BANKS
    //
    public allocMemoryBlock(data, endian) {
        var memoryBlock = new MemoryBlock(this, data, endian);
        memoryBlock.memoryHash = this.memoryNumbers++;
        if (this.memoryNumber > 9000)
            this.memoryNumber = 1;
        this.memoryBlocks.push(memoryBlock);
        return memoryBlock;
    }

    public freeMemoryBlock(block) {
        for (var b = 0; b < this.memoryBlocks.length; b++) {
            if (this.memoryBlocks[b] == block) {
                this.memoryBlocks = this.utilities.slice(this.memoryBlocks, b, 1);
                break;
            }
        }
    }
    public getMemoryBlockFromAddress(address) {
        var index = Math.floor(address / this.memoryHashMultiplier);
        for (var b = 0; b < this.memoryBlocks.length; b++) {
            if (this.memoryBlocks[b].memoryHash == index) {
                return this.memoryBlocks[b];
            }
        }
        throw { error: 'illegal_function_call', parameter: address };
    }

    public getMemory(number) {
        var result;
        var index = Math.floor(number / this.memoryHashMultiplier);
        if (index == 0) {
            var bank = this.banks.getBank(number);
            if (!bank.isType(['picpac', 'amal', 'work', 'tracker', 'data']))
                throw 'bank_type_mismatch';
            result =
            {
                bank: bank,
                block: bank.getElement(1),
                start: this.banks.getStart(number),
                length: this.banks.getLength(number)
            };
        }
        else {
            var block = this.getMemoryBlockFromAddress(number);
            result =
            {
                block: block,
                start: number,
                length: block.length
            }
        }
        return result;
    }

    private poke(address, value) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        memoryBlock.poke(address, value);
    }

    private doke(address, value) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        memoryBlock.doke(address, value);
    }

    private loke(address, value) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        memoryBlock.loke(address, value);
    }

    private peek(address) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        return memoryBlock.peek(address, false);
    }

    private deek(address) {
        const memoryBlock = this.getMemoryBlockFromAddress(address);
        return memoryBlock.deek(address, false);
    }

    private leek(address) {
        const memoryBlock = this.getMemoryBlockFromAddress(address);
        return memoryBlock.leek(address, false);
    }

    private poke$(address, text) {
        const memoryBlock = this.getMemoryBlockFromAddress(address);
        memoryBlock.poke$(address, text);
    }

    private doke$(address, text) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        memoryBlock.doke$(address, text);
    }

    private peek$(address, length, stop) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        return memoryBlock.peek$(address, length, stop);
    }

    private deek$(address, length, stop) {
        var memoryBlock = this.getMemoryBlockFromAddress(address);
        return memoryBlock.deek$(address, length, stop);
    }

    private fill(start, end, value) {
        var startBlock = this.getMemoryBlockFromAddress(start);
        var endBlock = this.getMemoryBlockFromAddress(end);
        if (startBlock != endBlock)
            throw { error: 'illegal_function_call', parameter: '' };
        startBlock.fill(start, end, value);
    }
    private copy(source, length, destination) {
        var sourceBlock = this.getMemoryBlockFromAddress(source);
        sourceBlock.copy(destination, length);
    }

    private hunt(start, end, text) {
        var startBlock = this.getMemoryBlockFromAddress(start);
        var endBlock = this.getMemoryBlockFromAddress(end);
        if (startBlock != endBlock)
            throw { error: 'illegal_function_call', parameter: '' };
        return startBlock.hunt(start, end, text);
    }

    private bSet(variable, shift) {
        var value = this.getVariable(variable);
        this.setVariable(variable, value | (1 << shift));
    }

    private bClr(variable, shift) {
        var value = this.getVariable(variable);
        this.setVariable(variable, value & (~(1 << shift)));
    }
    private bChg(variable, shift) {
        var value = this.getVariable(variable);
        this.setVariable(variable, value ^ (1 << shift));
    }

    private rolB(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x80) != 0 ? 0x01 : 0x00;
        this.setVariable(variable, (value & 0xFFFFFF00) | ((value << shift) & 0xFF) | carry);
    }

    private rolW(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x8000) != 0 ? 0x01 : 0x00;
        this.setVariable(variable, (value & 0xFFFF0000) | ((value << shift) & 0xFFFF) | carry);
    }

    private rolL(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x80000000) != 0 ? 0x01 : 0x00;
        this.setVariable(variable, (value << shift) | carry);
    }

    private rorB(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x01) != 0 ? 0x80 : 0x00;
        this.setVariable(variable, (value & 0xFFFFFF00) | ((value >>> shift) & 0xFF) | carry);
    }
    private rorW(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x01) != 0 ? 0x8000 : 0x0000;
        this.setVariable(variable, (value & 0xFFFF0000) | ((value >>> shift) & 0xFFFF) | carry);
    }

    private rorL(variable, shift) {
        var value = this.getVariable(variable);
        var carry = (value & 0x01) != 0 ? 0x80000000 : 0x00000000;
        this.setVariable(variable, (value >>> shift) | carry);
    }

    private getBrowserName() {
        /*
            NOTE: Some browsers masquerade as others.  For example:
                Vivaldi & Brave:	Chrome
                Tor Browser:		Firefox
           I'll simplify the code later.
        */
        var result = 'Unknown';
        var ua = navigator.userAgent.toLowerCase();
        const isMSIE = ua.indexOf('msie') >= 0;		// Internet Explorer 8-10
        const isExplorer = ua.indexOf('explorer') >= 0;	// Internet Explorer 11
        const isEdge = ua.indexOf(' edg\/') >= 0;
        const isFirefox = ua.indexOf('firefox') >= 0;
        const isOpera = ua.indexOf(' opr\/') >= 0;
        const isChromium = ua.indexOf(' chromium') >= 0;	// Windows, OS/X, Linux, Android
        const isMaxthon = ua.indexOf(' maxthon') >= 0;	// Maxthon SHOULD WE BLOCK IT, or at least WARN the user about it?!  (Major security issue!)
        const isChrome = ua.indexOf('chrome') >= 0 && ua.indexOf(' opr\/') < 0 && ua.indexOf(' edg\/') < 0;
        const isSafari = ua.indexOf('safari\/') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf(' opr\/') < 0;
        // Popular Linux browsers
        const isSeamonkey = ua.indexOf(' seamonkey') >= 0;
        const isMidori = ua.indexOf(' midori') >= 0;
        const isKonquerer = ua.indexOf(' konquerer') >= 0;
        const isPaleMoon = ua.indexOf(' palemoon') >= 0;
        const isFalkon = ua.indexOf(' falkon') >= 0;
        const isW3M = ua.indexOf('w3m') >= 0;
        // Mobile Browsers
        const isOperaMini = ua.indexOf(' opera mini') >= 0;	// Android & Blackberry
        const isUCBrowser = ua.indexOf('ucbrowser') >= 0;	// Android

        if (isMSIE) result = 'MSIE'; // 8-10
        if (isExplorer) result = 'Explorer'; // 11
        if (isEdge) result = 'Edge';
        if (isFirefox) result = 'Firefox';
        if (isOpera) result = 'Opera';
        if (isChromium) result = 'Chromium';
        if (isMaxthon) result = 'Maxthon';
        if (isSafari) result = 'Safari';
        if (isChrome) result = 'Chrome';
        // Popular Linux Browsers
        if (isSeamonkey) result = 'Seamonkey';
        if (isMidori) result = 'Midori';
        if (isKonquerer) result = 'Konquerer';
        if (isPaleMoon) result = 'Pale Moon';
        if (isW3M) result = 'W3M';
        // Mobile Browsers
        if (isUCBrowser) result = 'UCBrowser';		// Android
        if (isOperaMini) result = 'Opera Mini';	// Android & Blackberry

        return result;
    }	// getBrowserName()

    private browserIsWeird() {
        var BN = this.getBrowserName();
        return (BN == 'Firefox' || BN == 'Seamonkey') //
    }
    // Gamepads
    private static GAMEPAD_FIRE: int = 0;
    private static GAMEPAD_UP: int = 12;
    private static GAMEPAD_DOWN: int = 13;
    private static GAMEPAD_RIGHT: int = 15;
    private static GAMEPAD_LEFT: int = 14;
    private static GAMEPAD_A: int = 0;
    private static GAMEPAD_B: int = 1;
    private static GAMEPAD_X: int = 2;
    private static GAMEPAD_Y: int = 3;
    private static GAMEPAD_STICKLEFT: int = 10;
    private static GAMEPAD_STICKRIGHT: int = 11;
    private static GAMEPAD_BOTTOMLEFT: int = 6;
    private static GAMEPAD_TOPLEFT: int = 4;
    private static GAMEPAD_BOTTOMRIGHT: int = 7;
    private static GAMEPAD_TOPRIGHT: int = 5;
    private static GAMEPAD_CENTERLEFT: int = 8;
    private static GAMEPAD_CENTERRIGHT: int = 9;
    private static GAMEPAD_HAXELEFT: int = 0;
    private static GAMEPAD_VAXELEFT: int = 1;
    private static GAMEPAD_HAXERIGHT: int = 2;
    private static GAMEPAD_VAXERIGHT: int = 3;
    private static MAPPING_BUTTONS: int = 0;  // ???
    private static MAPPING_AXES: int = 16;
    private static MAPPING_TRIGGERS: int = 32;

    private getGamepadAutoMove() {
        return this.gamepad_AutoMove ? this.platformTrue : false
    }

    private getGamepadKeyboard() {
        return this.gamepad_Keyboard ? this.platformTrue : false
    }

    private getGamepadTreshold() // BJF
    {
        return this.gamepad_Threshold
    }

    private setGamepads() {
        //
        // initialize gamepadMaps{} and gamepads objects.
        //
        this.gamepadMaps = {};
        this.gamepads = navigator.getGamepads();

        //	alert(this.browserIsWeird());

        if (this.browserIsWeird()) { this.gamepad_vertical_axis = 2; this.gamepad_horizontal_axis = 1; }
        else { this.gamepad_vertical_axis = 1; this.gamepad_horizontal_axis = 0; }

        //	alert(this.gamepad_vertical_axis.toString() + ',' + this.gamepad_horizontal_axis.toString());

        //
        // Add required event handlers for connecting / disconnecting gamepads.
        // NOTE:	When connecting/disconnecting a gamepad, need to create/destroy the
        //			gamepad data structures for the for the indicated gamepad index.
        //
        window.addEventListener("gamepadconnected", function (e) {
            // 1. See if mapping exists for this gamepad.
            //   a. If so, load that mapping structure.
            //   b. If not, create structure from the default mapping.
        });

        window.addEventListener("gamepaddisconnected", function (e) {
            // Dispose of mapping structure for this gamepad index.
        });

    } // setGamepads

    private scanGamepads() // I think this may have been placed here in lieu of the connect & disconnect events.
    {										// It may no longer be needed once those are in place.
        this.gamepads = navigator.getGamepads(); // This is also called by setGamepads.
        if (this.browserIsWeird()) { this.gamepad_vertical_axis = 2; this.gamepad_horizontal_axis = 1; }
        else { this.gamepad_vertical_axis = 1; this.gamepad_horizontal_axis = 0; }

    }

    private getMapping(gamepad, key, delta) {
        /*
        if ( gamepad.mapping == 'standard' )
            return key;
    // alert(gamepad.id); // BJF
        if ( this.gamepadMaps[ gamepad.id ] )
        {
            var keyMapped = this.gamepadMaps[ gamepad.id ][ key + delta ];
            if ( typeof keyMapped != 'undefined' )
                return keyMapped;
        }
        */
        return key;
    } // getMapping

    private getKeyMapping(key) {
        var code = this.manifest.gamepad.mapping[key];
        if (code) {
            var info = this.convertToPlatform(this.platformKeymap, { code: code });
            if (info && info.keyCode != 'undefined') {
                return this.keymap[info.keyCode];
            }
        }
        return false;
    } // getKeyMapping

    private setKeyMapping(direction, keycode) {
        if (this.manifest.gamepad.mapping[direction]) {
            this.manifest.gamepad.mapping[direction] = keycode
        }
        else {
            throw ('Invalid JoyKey function');
        }
    } // setKeyMapping

    private lockJoystick(state, lock, direction?) {
        if (lock) {
            if (state) {
                if (this.joyLock[direction])
                    state = false;
                this.joyLock[direction] = true;
            }
            else {
                this.joyLock[direction] = false;
            }
        }
        return state ? this.platformTrue : false;
    } // lockJoystick

    // For jUp, jDown, jLeft, jRight
    // Default "LEFT" is Axis(0)=-1
    // Default "RIGHT" is Axis(0)=1
    // Default "UP" is Axis(1) = -1
    // Default "DOWN" is Axis(1) = 1

    // For WEIRD browsers (Firefox, Seamonkey, Safari)
    // Default "UP" is Axis(1) = -1
    // Default "DOWN" is Axis(1) = 1
    // Default "LEFT" is Axis(2) = -1
    // Default "RIGHT" is Axis(2) = 1
    // Digital gamepad Up function, but usually read as analog and converted to digital.
    private jUp(number, lock) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) < (-this.gamepad_Threshold)) || // analog to digital emulation
                        (this.getKeyMapping('up')), lock, 'up')); // keyboard emulation
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('up'), lock, 'up');
    } // jUp

    // Digital gamepad Down function, but usually read as analog and converted to digital.
    private jDown(number, lock) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) > (this.gamepad_Threshold)) ||
                        (this.getKeyMapping('down')), lock, 'down'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('down'), lock, 'down');
    } // jDown

    // Digital gamepad Left function, but usually read as analog and converted to digital.
    private jLeft(number, lock) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_horizontal_axis) < (-this.gamepad_Threshold)) ||
                        (this.getKeyMapping('left')), lock, 'left'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('left'), lock, 'left');
    } // jLeft

    // Digital gamepad Right function, but usually read as analog and converted to digital.
    private jRight(number, lock) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_horizontal_axis) > (this.gamepad_Threshold)) ||
                        (this.getKeyMapping('right')), lock, 'right'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('right'), lock, 'right');
    } // jRight

    // Digital gamepad Up & Left function, but usually read as analog and converted to digital.
    private jUpLeft(number, lock)  // BJF
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) < (-this.gamepad_Threshold) &&
                            this.gamepadAxis(number, this.gamepad_horizontal_axis) < (-this.gamepad_Threshold)) ||
                        (this.getKeyMapping('up') & this.getKeyMapping('left')), lock, 'upleft'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('up') & this.getKeyMapping('left'), lock, 'upleft');
    } // jUpLeft

    // Digital gamepad Up & Right function, but usually read as analog and converted to digital.
    private jUpRight(number, lock) // BJF
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) < (-this.gamepad_Threshold) &&
                            this.gamepadAxis(number, this.gamepad_horizontal_axis) > (this.gamepad_Threshold)) ||
                        (this.getKeyMapping('up') & this.getKeyMapping('right')), lock, 'upright'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('up') & this.getKeyMapping('right'), lock, 'upright');
    } // jUpRight

    // Digital gamepad Down & Left function, but usually read as analog and converted to digital.
    private jDownLeft(number, lock) // BJF
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) > (this.gamepad_Threshold) &&
                            this.gamepadAxis(number, this.gamepad_horizontal_axis) < (-this.gamepad_Threshold)) ||
                        (this.getKeyMapping('down') & this.getKeyMapping('left')), lock, 'downleft'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('down') & this.getKeyMapping('left'), lock, 'downleft');
    } // jDownLeft

    // Digital gamepad Down & Right function, but usually read as analog and converted to digital.
    private jDownRight(number, lock) // BJF
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return (this.lockJoystick(
                        (this.gamepadAxis(number, this.gamepad_vertical_axis) > (this.gamepad_Threshold) &&
                            this.gamepadAxis(number, this.gamepad_horizontal_axis) > (this.gamepad_Threshold)) ||
                        (this.getKeyMapping('down') & this.getKeyMapping('right')), lock, 'downright'));
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('down') & this.getKeyMapping('right'), lock, 'downright');
    } // jDownRight

    private fire(number, lock) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {	// Button 0 is usually the main fire button.
                    // Some browsers use "pressed", while others use "value", so check both.
                    //				console.log(gamepad.buttons[0].pressed || gamepad.buttons[0].value ? 1 : 0);
                    //				console.log(-Math.abs((gamepad.buttons[0].pressed) || gamepad.buttons[0].value)));
                    return this.lockJoystick(
                        //							((-Math.abs((gamepad.buttons[0].pressed || gamepad.buttons[0].value))) ||
                        ((gamepad.buttons[0].pressed || gamepad.buttons[0].value) ||
                            (this.getKeyMapping('fire'))), lock);
                }
            }
        }
        return this.lockJoystick(this.getKeyMapping('fire'), lock);
    } // fire

    private joy(number) {
        var result = 0;
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    if (gamepad.mapping == 'standard') {
                        result |= gamepad.buttons[this.getMapping(gamepad, TVC.GAMEPAD_UP, TVC.MAPPING_BUTTONS)].pressed ? 0x01 : 0x00;
                        result |= gamepad.buttons[this.getMapping(gamepad, TVC.GAMEPAD_DOWN, TVC.MAPPING_BUTTONS)].pressed ? 0x02 : 0x00;
                        result |= gamepad.buttons[this.getMapping(gamepad, TVC.GAMEPAD_LEFT, TVC.MAPPING_BUTTONS)].pressed ? 0x04 : 0x00;
                        result |= gamepad.buttons[this.getMapping(gamepad, TVC.GAMEPAD_RIGHT, TVC.MAPPING_BUTTONS)].pressed ? 0x08 : 0x00;
                        result |= gamepad.buttons[this.getMapping(gamepad, TVC.GAMEPAD_FIRE, TVC.MAPPING_BUTTONS)].pressed ? 0x10 : 0x00;
                        return result;
                    }
                }
            }
        }
        result |= this.getKeyMapping('up') ? 0x01 : 0x00;
        result |= this.getKeyMapping('down') ? 0x02 : 0x00;
        result |= this.getKeyMapping('left') ? 0x04 : 0x00;
        result |= this.getKeyMapping('right') ? 0x08 : 0x00;
        result |= this.getKeyMapping('fire') ? 0x10 : 0x00;
        return result;
    } // joy

    //
    // NOTE:  Need the events:	gamepadConnected
    //							gamepadDisconnected
    // (since everything changes when gamepads are plugged in or unplugged)
    //
    private gamepadDisconnected(number)	// BJF Added
    {

    } // gamepadDisconnected

    private gamepadConnected(number) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                return (this.gamepads && this.gamepads[number] && this.gamepads[number].connected) ? this.platformTrue : false;
            }
        }
        return 0
    } // gamepadConnected

    private gamepadName$(number) // BJF added
    {
        if (this.gamepads) // gamepads object exists
        {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return gamepad.id;
                }
            }
        }
        return '';
    } // gamepadName$(n)

    private gamepadVendor$(number) // BJF added
    {
        if (this.gamepads) // gamepads object exists
        {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return gamepad.id; // later change to ONLY Vendor$
                }
            }
        }
        return '';
    } // gamepadVendor$(n)

    private gamepadProduct$(number) // BJF added
    {
        if (this.gamepads) // gamepads object exists
        {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    return gamepad.id; // later change to ONLY Product$
                }
            }
        }
        return '';
    } // gamepadProduct$(n)

    private gamepadNumAxes(number) // BJF added 9/1
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected)
                    return gamepad.axes.length;
            }
        }
        return 0
    } // gamepadAxes

    private gamepadNumButtons(number) // BJF added 9/1
    {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected)
                    return gamepad.buttons.length
            }
        }
        return 0
    } // gamepadButtons

    private gamepadAxis(number, axis) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    if (gamepad.axes) {
                        var value = gamepad.axes[this.getMapping(gamepad, axis, TVC.MAPPING_AXES)];
                        return typeof value != 'undefined' ? value : 0;
                    }
                }
            }
        }
        return 0;
    } // gamepadAxis

    private gamepadButton(number, button) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    const b = gamepad.buttons[button];
                    //			var b = gamepad.buttons[ this.getMapping( gamepad, button, TVC.MAPPING_BUTTONS ) ];
                    if (b != undefined) {
                        return (b.pressed || b.value) ? this.platformTrue : false;
                    }
                }
            }
        }
        return 0;
    } // gamepadButton

    private gamepadTrigger(number, trigger) {
        if (this.gamepads) {
            if (number >= 0 && number < this.gamepads.length) {
                var gamepad = this.gamepads[number];
                if (gamepad && gamepad.connected) {
                    if (gamepad.mapping == 'standard') {
                        trigger = (trigger == 0 ? TVC.GAMEPAD_BOTTOMLEFT : TVC.GAMEPAD_BOTTOMRIGHT);
                        return gamepad.buttons[trigger].value;
                    }
                    else if (gamepad.axes) {
                        var value = gamepad.axes[this.getMapping(gamepad, trigger, TVC.MAPPING_TRIGGERS)];
                        return typeof value != 'undefined' ? value : 0;
                    }
                }
            }
        }
        return 0;
    } // gamepadTrigger

    // Animations primitives
    private getAnimation(channel, name, angle) {
        var clip;

        // Already running?
        name = name.toLowerCase();
        if ((channel.currentClip && channel.currentClip.initialized && name == channel.currentClip.vars.name.toLowerCase()) && channel.currentDirection == angle)
            return channel.currentClip;

        // Find new clip
        const deltas: int[] = [];
        for (var c = 0; c < channel.clip.length; c++)
            deltas[c] = 1000;
        for (var c = 0; c < channel.clip.length; c++) {
            if (channel.clip[c].vars.name == name) {
                deltas[c] = Math.abs(channel.clip[c].vars.direction - angle);
            }
        }
        var bestDelta = 1000;
        for (var c = 0; c < channel.clip.length; c++) {
            if (channel.clip[c].vars.name.toLowerCase() == name) {
                if (deltas[c] < bestDelta) {
                    bestDelta = deltas[c];
                    clip = channel.clip[c];
                }
            }
        }
        // Not found-> get the first one.
        if (!clip)
            clip = channel.clip[0];

        var previousClip = channel.currentClip;
        if (clip != previousClip) {
            channel.currentClip = clip;
            channel.clip_current = clip;
            channel.currentDirection = angle;

            this.sections.push(null);
            var section = clip['start_m'];
            section.vars.channel = channel;
            section.vars.previousClip = previousClip;
            section.position = 0;
            //try {
            if (this.IsAsync) {
                this.runBlocksAsync(section, false);
            } else {
                this.runBlocks(section, false);
            }
            /* }
            catch (error) {
                this.handleErrors(error);
            } */
        }
        return clip;
    }
    private callAnimations(channel, deltaTime) {
        var angle = (channel.movement_current ? channel.movement_current.vars.angle : 0);
        if (channel.clip && channel.clip.length > 0) {
            var speed = (channel.movement_current ? channel.movement_current.vars.speed : 1000);
            var toRotate = (channel.movement_current ? channel.movement_current.vars.rotation : false);
            var name = (speed == 0 ? 'static' : 'moving');
            var clip = this.getAnimation(channel, name, angle);
            if (clip) {
                this.sections.push(null);
                var section = clip['animate_m'];
                section.vars.channel = channel;
                section.vars.deltaTime = deltaTime;
                section.vars.speed = speed;
                section.position = 0;
                //try {
                if (this.IsAsync) {
                    this.runBlocksAsync(section, false);
                } else {
                    this.runBlocks(section, false);
                }
                /* }
                catch (error) {
                    this.handleErrors(error);
                } */
                if (toRotate)
                    channel.set_angle(angle);
            }
        }
        else {
            var toRotate = (channel.movement_current ? channel.movement_current.vars.rotation : false);
            if (toRotate)
                channel.set_angle(angle);
        }
    }

    private setAnimState(index, className, state) {
        for (var o = 0; o < this.synchroList.length; o++) {
            var channel = this.synchroList[o];
            if (channel.animations) {
                var doIt = true;
                if (typeof className != 'undefined' && channel.className != className)
                    doIt = false;
                if (typeof index != 'undefined' && index != channel.index)
                    doIt = false;
                if (doIt) {
                    for (var a in channel.animations) {
                        for (var aa = 0; aa < channel.animations[a].length; aa++)
                            channel.animations[a][aa].set_state(state);
                    }
                }
            }
        }
    }

    private setMoveState(index, className, state) {
        for (var o = 0; o < this.synchroList.length; o++) {
            var channel = this.synchroList[o];
            if (channel.movement) {
                var doIt = true;
                if (typeof className != 'undefined' && channel.className != className)
                    doIt = false;
                if (typeof index != 'undefined' && index != channel.index)
                    doIt = false;
                if (doIt)
                    channel.movement.set_state(state);
            }
        }
    }

    private getObjectFromType(type, index, errorString) {
        if (type.toLowerCase() == 'bob')
            return this.tvc.currentScreen.getBob(index, errorString ? 'bob' + errorString : undefined);
        else if (type.toLowerCase() == 'sprite')
            return this.tvc.getSprite(index, errorString ? 'sprite' + errorString : undefined);
        return undefined;
    }

    public getAnimationChannel(channelNumber, throwError?) {
        return this.tvc.channelsTo[channelNumber];
    }

    private checkAnimationChannel(channelNumber, channelType, objectNumber, objectType, force) {
        var channel = this.tvc.channelsTo[channelNumber];
        if (channel) {
            if (channelType && channelType != channel.channelType)
                channel = undefined;
            if (objectType && objectType != channel.objectType)
                channel = undefined;
        }
        if (!channel && force) {
            var f = function () { return undefined; }
            if (objectType) {
                f = (window[objectType] as any).get_this
                if (!f)
                    f = (window[objectType] as any).prototype.get_this
                if (!f)
                    throw 'internal_error';
            }
            channel =
            {
                tvc: this.tvc,
                type: objectType,
                objectNumber: objectNumber,
                channelNumber: channelNumber,
                channelType: channelType,
                get_this: f
            };
            this.channelsTo[channelNumber] = channel;
        }
        return channel;
    }

    private destroyAnimationChannel(channel) {
    }


    ///////////////////////////////////////////////////////////////////////////
    //
    // AMAL!
    //
    ///////////////////////////////////////////////////////////////////////////
    private amalOnOff(onOff, channelNumber) {
        this.amal.setOnOff(onOff, channelNumber);
    }
    private amalStart(args) {
        var channelNumber = args[0];
        var source = args[1];
        var address = args[2];
        var compiler = new AMALCompiler(this);
        if (typeof source == 'number')
            debugger;						// TODO please ;)

        this.amalErrors = [];
        this.amalErrorNumberCount = 0;
        this.amalErrorStringCount = 0;
        var code = compiler.compile(source, {})
        if (this.utilities.isArray(code)) {
            this.amalErrors = code;
            throw 'amal_error';
        }

        var self = this;
        this.amalStarted = false;
        this.tvc.checkAnimationChannel(channelNumber, null, channelNumber, null, false);
        var channel = this.tvc.getAnimationChannel(channelNumber);
        this.amal.runChannel(channel, code, function (response, data, extra) {
            if (!response)
                throw 'illegal_function_call';
            self.amalStarted = true;
        });
    }

    private amalStart_wait(channel, source, address) {
        return this.amalStarted;
    }

    private amalError() {
        if (this.amalErrorNumberCount < this.amalErrors.length) {
            return this.amalErrors[this.amalErrorNumberCount++].position;
        }
        return 0;
    }

    private amalError$() {
        if (this.amalErrorStringCount < this.amalErrors.length) {
            return this.errors.getError(this.amalErrors[this.amalErrorStringCount++].error);
        }
        return '';
    }

    //
    // fp2Int - Return the integer portion of a floating point number.
    //
    public fp2Int(f) // BJF
    {
        if (f < 0)
            return Math.ceil(f)
        else
            return Math.floor(f);
    }

    /*
    TVC.ptototype.setGamepadThreshold= function ( t ) // BJF
    {
        this.gamepad_Threshold = t;
    }
    */



    /////////////////////////////////////////////////////////////////////////
    //
    // OBJECT ORIENTATION
    //
    /////////////////////////////////////////////////////////////////////////
    private getBob(index) {
        return this.currentScreen.getBob(index, 'bob_not_defined');
    }

    private getSprite(index, errorString) {
        return this.sprites.context.getElement(this.tvc.currentContextName, index, errorString);
    }

    private addObject(thisObject, thatObject) {
        var className = thatObject.className.toLowerCase();
        if (!thisObject[className]) {
            thisObject[className] = [];
            thisObject[className + '_current'] = null;
        }

        thisObject[className].push(thatObject);
        thisObject[className + '_current'] = thatObject;
        thatObject.rootObject = thisObject;
        this.addToSynchro(thatObject, thisObject);
    }
    private setObject(thisObject, thatObject, index) {
        var className = thatObject.className.toLowerCase();
        if (typeof index == 'undefined') {
            thisObject[className] = [thatObject];
            thisObject[className + '_current'] = thatObject;
        }
        else {
            if (!thisObject[className])
                thisObject[className] = [];
            if (index < 0 || index > thisObject[className].length + 1)
                throw { error: 'illegal_function_call', parameter: index };
            thisObject[className][index] = thatObject;
            thisObject[className + '_current'] = thatObject;
        }
        this.addToSynchro(thatObject, thisObject);
    }

    private delObject(thisObject, thatObject, index) {
        var className = thatObject.className.toLowerCase();
        if (thisObject[className]) {
            // Find the good object
            if (index < 0) {
                thatObject = thisObject[className + '_current'];
                index = undefined;
            }
            if (typeof index == 'undefined') {
                index = thisObject[className].findIndex(function (element) {
                    return element == thatObject;
                });
            }

            // Delete
            if (index < 0 || index >= thisObject[className].length)
                throw { error: 'illegal_function_call', parameter: index };
            thisObject[className].slice(index, 1);

            // The object at its position becomes the current one
            if (thisObject[className].length > 0) {
                if (index == thisObject[className].length)
                    index = thisObject[className].length - 1;
                thisObject[className + '_current'] = thisObject[className][index];
            }
            this.removeFromSynchro(thatObject);
        }
    }

    private sendMessage(message, options, callback, extra) {
        // Send message to IDE
        if (this.connectedToIDE == true) {
            this.ideWebSocket.send(JSON.stringify(message));

            if (callback) {
                callback(true, {}, {});
            }
        }
        else {
            if (callback) {
                callback(false, "Web socket not opened", {});
            }
        }
    }

    private waitForFinalLoad() {
        if (this.loadingCount == this.loadingMax) {
            this.waiting = null;
        }
    }
    private waitForGuru() {
        if (this.clickMouse) {
            if (this.clickMouse & 0x01)
                this.utilities.sendCrashMail();
            this.waiting = null;
            this.break = true;
        }
    }

    private pushExtension(section) {
        this.extensionsToRun.push(section);
    }
    public static HREV: int = 0x8000;
    public static VREV: int = 0x4000;

    private get_fromInstruction(name, fromInstruction) {
        if (fromInstruction.indexOf('#update') >= 0) {
            var value = this.varsUpdated[name];
            this.varsUpdated[name] = undefined;
            return value;
        }
        return this.vars[name];
    }
    private get_x(fromInstruction) {
        if (!fromInstruction)
            return this.vars.x;
        return this.get_fromInstruction('x', fromInstruction);
    }

    private get_y(fromInstruction) {
        if (!fromInstruction)
            return this.vars.y;
        return this.get_fromInstruction('y', fromInstruction);
    }

    private get_z(fromInstruction) {
        if (!fromInstruction)
            return this.vars.z;
        return this.get_fromInstruction('z', fromInstruction);
    }

    private get_width(fromInstruction) {
        if (!fromInstruction)
            return this.vars.width;
        return this.get_fromInstruction('width', fromInstruction);
    }

    private get_height(fromInstruction) {
        if (!fromInstruction)
            return this.vars.height;
        return this.get_fromInstruction('height', fromInstruction);
    }

    private get_depth(fromInstruction) {
        if (!fromInstruction)
            return this.vars.depth;
        return this.get_fromInstruction('depth', fromInstruction);
    }

    private get_skewX(fromInstruction) {
        if (!fromInstruction)
            return this.vars.skewX;
        return this.get_fromInstruction('skewX', fromInstruction);
    }

    private get_skewY(fromInstruction) {
        if (!fromInstruction)
            return this.vars.skewY;
        return this.get_fromInstruction('skewY', fromInstruction);
    }

    private get_skewZ(fromInstruction) {
        if (!fromInstruction)
            return this.vars.skewZ;
        return this.get_fromInstruction('skewZ', fromInstruction);
    }
    private get_offsetX(fromInstruction) {
        if (!fromInstruction)
            return this.vars.offsetX;
        return this.get_fromInstruction('offsetX', fromInstruction);
    }

    private get_offsetY(fromInstruction) {
        if (fromInstruction)
            return this.vars.offsetY;
        return this.get_fromInstruction('offsetY', fromInstruction);
    }
    private get_offsetZ(fromInstruction) {
        if (fromInstruction)
            return this.vars.offsetZ;
        return this.get_fromInstruction('offsetZ', fromInstruction);
    }

    private get_scaleX(fromInstruction) {
        if (!fromInstruction)
            return this.vars.scaleX;
        return this.get_fromInstruction('scaleX', fromInstruction);
    }

    private get_scaleY(fromInstruction) {
        if (!fromInstruction)
            return this.vars.scaleY;
        return this.get_fromInstruction('scaleY', fromInstruction);
    }

    private get_scaleZ(fromInstruction) {
        if (!fromInstruction)
            return this.vars.scaleZ;
        return this.get_fromInstruction('scaleZ', fromInstruction);
    }

    private get_cameraX(fromInstruction) {
        if (!fromInstruction)
            return this.vars.cameraX;
        return this.get_fromInstruction('cameraY', fromInstruction);
    }

    private get_cameraY(fromInstruction) {
        if (!fromInstruction)
            return this.vars.cameraY;
        return this.get_fromInstruction('cameraY', fromInstruction);
    }

    private get_cameraZ(fromInstruction) {
        if (!fromInstruction)
            return this.vars.cameraZ;
        return this.get_fromInstruction('cameraZ', fromInstruction);
    }

    private get_hotspotX(fromInstruction) {
        if (!fromInstruction)
            return this.vars.hotspotX;
        return this.get_fromInstruction('hotspotX', fromInstruction);
    }

    private get_hotspotY(fromInstruction) {
        if (!fromInstruction)
            return this.vars.hotspotY;
        return this.get_fromInstruction('hotspotY', fromInstruction);
    }

    private get_hotspotZ(fromInstruction) {
        if (!fromInstruction)
            return this.vars.hotspotZ;
        return this.get_fromInstruction('hotspotZ', fromInstruction);
    }

    private get_image(fromInstruction) {
        if (!fromInstruction)
            return this.vars.image;
        return this.get_fromInstruction('image', fromInstruction);
    }

    private get_angle(fromInstruction) {
        if (!fromInstruction)
            return this.vars.angle;
        return this.get_fromInstruction('angle', fromInstruction);
    }
    private get_alpha(fromInstruction) {
        if (!fromInstruction)
            return this.vars.alpha;
        return this.get_fromInstruction('alpha', fromInstruction);
    }
    private get_visible(fromInstruction) {
        if (!fromInstruction)
            return this.vars.visible;
        return this.get_fromInstruction('visible', fromInstruction);
    }
    private set_x(value, fromInstruction) {
        this.setPosition({ x: value }, fromInstruction);
    }
    private set_y(value, fromInstruction) {
        this.setPosition({ y: value }, fromInstruction);
    }
    private set_z(value, fromInstruction) {
        this.setPosition({ z: value }, fromInstruction);
    }
    private set_scaleX(value, fromInstruction) {
        this.setScale({ x: value }, fromInstruction);
    }
    private set_scaleY(value, fromInstruction) {
        this.setScale({ y: value }, fromInstruction);
    }
    private set_scaleZ(value, fromInstruction) {
        this.setScale({ z: value }, fromInstruction);
    }
    private set_offsetX(value, fromInstruction) {
        this.setOffset({ x: value }, fromInstruction);
    }
    private set_offsetY(value, fromInstruction) {
        this.setOffset({ y: value }, fromInstruction);
    }
    private set_offsetZ(value, fromInstruction) {
        this.setOffset({ z: value }, fromInstruction);
    }
    private set_skewX(value, fromInstruction) {
        this.setSkew({ x: value }, fromInstruction);
    }
    private set_skewY(value, fromInstruction) {
        this.setSkew({ y: value }, fromInstruction);
    }
    private set_skewZ(value, fromInstruction) {
        this.setSkew({ z: value }, fromInstruction);
    }
    private set_cameraX(value, fromInstruction) {
        this.setCamera({ x: value }, fromInstruction);
    }
    private set_cameraY(value, fromInstruction) {
        this.setCamera({ y: value }, fromInstruction);
    }
    private set_cameraZ(value, fromInstruction) {
        this.setCamera({ z: value }, fromInstruction);
    }
    private set_hotspotX(value, fromInstruction) {
        this.setHotspot({ x: value }, fromInstruction);
    }
    private set_hotspotY(value, fromInstruction) {
        this.setHotspot({ y: value }, fromInstruction);
    }
    private set_hotspotZ(value, fromInstruction) {
        this.setHotspot({ z: value }, fromInstruction);
    }
    private set_width(value, fromInstruction) {
        (this as any).setDimensions({ width: value }, fromInstruction);
    }
    private set_height(value, fromInstruction) {
        (this as any).setDimensions({ height: value }, fromInstruction);
    }
    private set_depth(value, fromInstruction) {
        (this as any).setDimensions({ depth: value }, fromInstruction);
    }
    private set_image(value, fromInstruction) {
        this.setImage(value, fromInstruction);
    }
    private set_angle(value, fromInstruction) {
        this.setAngle({ z: value }, fromInstruction);
    }
    private set_visible(value, fromInstruction) {
        this.setVisible(value, fromInstruction);
    }
    private set_alpha(value, fromInstruction) {
        this.setAlpha(value, fromInstruction);
    }

    // GENERIC FUNCTIONS
    private set_fromInstruction(updated, fromInstruction) {
        if (fromInstruction.indexOf('#update') >= 0) {
            for (var p in updated)
                this.varsUpdated[p] = updated[p];
        }
    }
    private setPosition(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.x) {
                modified = true;
                this.vars.x = rectangle.x;
                updated.x = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.y) {
                modified = true;
                this.vars.y = rectangle.y;
                updated.y = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars.z) {
                modified = true;
                this.vars.z = rectangle.z;
                updated.z = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setHotspot(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.hotspotX) {
                modified = true;
                this.vars.hotspotX = rectangle.x;
                updated.hotspotX = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.hotspotY) {
                modified = true;
                this.vars.hotspotY = rectangle.y;
                updated.hotspotY = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars.hotspotZ) {
                modified = true;
                this.vars.hotspotZ = rectangle.z;
                updated.hotspotZ = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }

    public setSize(dimension, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof dimension.width != 'undefined') {
            if (dimension.width != this.vars.width) {
                modified = true;
                this.vars.width = dimension.width;
                updated.width = dimension.x;
            }
        }
        if (typeof dimension.height != 'undefined') {
            if (dimension.height != this.vars.height) {
                modified = true;
                this.vars.height = dimension.height;
                updated.height = dimension.height;
            }
        }
        if (typeof dimension.depth != 'undefined') {
            if (dimension.depth != this.vars.depth) {
                modified = true;
                this.vars.depth = dimension.depth;
                updated.depth = dimension.depth;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setOffset(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.offsetX) {
                modified = true;
                this.vars.offsetX = rectangle.x;
                updated.offsetX = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.offsetY) {
                modified = true;
                this.vars.offsetY = rectangle.y;
                updated.offsetY = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars.offsetZ) {
                modified = true;
                this.vars.offsetZ = rectangle.z;
                updated.offsetZ = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setSkew(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.skewX) {
                modified = true;
                this.vars.skewX = rectangle.x;
                updated.skewX = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.skewY) {
                modified = true;
                this.vars.skewY = rectangle.y;
                updated.skewY = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.x != this.vars.skewZ) {
                modified = true;
                this.vars.skewZ = rectangle.z;
                updated.skewZ = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setScale(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.scaleX) {
                modified = true;
                this.vars.scaleX = rectangle.x;
                updated.scaleX = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.scaleY) {
                modified = true;
                this.vars.scaleY = rectangle.y;
                updated.scaleY = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars.scaleZ) {
                modified = true;
                this.vars.scaleZ = rectangle.z;
                updated.scaleZ = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setCamera(rectangle, fromInstruction) {
        var modified = false;
        var updated: any = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars.cameraX) {
                modified = true;
                this.vars.cameraX = rectangle.x;
                updated.cameraX = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars.cameraY) {
                modified = true;
                this.vars.cameraY = rectangle.y;
                updated.cameraY = rectangle.y;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars.cameraZ) {
                modified = true;
                this.vars.cameraZ = rectangle.z;
                updated.cameraZ = rectangle.z;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction)
            this.setModified();
        }
    }
    private setAngle(angle, fromInstruction) {
        if (angle.z != this.vars.angle) {
            this.vars.angle = angle.z;
            if (fromInstruction)
                this.set_fromInstruction(angle.z, fromInstruction)
            this.setModified();
        }
    }
    private setVisible(flag, fromInstruction) {
        if (flag != this.vars.visible) {
            this.vars.visible = flag;
            if (fromInstruction)
                this.set_fromInstruction({ visible: flag }, fromInstruction)
            this.setModified();
        }
    }
    private setAlpha(alpha, fromInstruction) {
        if (alpha != this.vars.alpha) {
            this.vars.alpha = alpha;
            if (fromInstruction)
                this.set_fromInstruction({ alpha: alpha }, fromInstruction)
            this.setModified();
        }
    }
    public setImage(image, fromInstruction) {
        if (image != this.vars.image) {
            this.vars.image = image;
            if (fromInstruction)
                this.set_fromInstruction({ image: image }, fromInstruction)
            this.setModified();
        }
    }
    private setGenericCoordinates(name, rectangle, fromInstruction) {
        var modified = false;
        var updated = {};
        if (typeof rectangle.x != 'undefined') {
            if (rectangle.x != this.vars[name + 'X']) {
                modified = true;
                this.vars[name + 'X'] = rectangle.x;
                updated[name + 'X'] = rectangle.x;
            }
        }
        if (typeof rectangle.y != 'undefined') {
            if (rectangle.y != this.vars[name + 'Y']) {
                modified = true;
                this.vars[name + 'Y'] = rectangle.y;
                updated[name + 'Y'] = rectangle.x;
            }
        }
        if (typeof rectangle.z != 'undefined') {
            if (rectangle.z != this.vars[name + 'Z']) {
                modified = true;
                this.varsthis.vars[name + 'Z'] = rectangle.z;
                updated[name + 'Z'] = rectangle.x;
            }
        }
        if (modified) {
            if (fromInstruction)
                this.set_fromInstruction(updated, fromInstruction);
            this.setModified();
        }
    }
    private setGenericProperty(name, value, fromInstruction) {
        if (value != this.vars[name]) {
            this.vars[name] = value;
            if (fromInstruction) {
                var updated = {};
                updated[name] = value;
                this.set_fromInstruction(updated, fromInstruction);
            }
            this.setModified();
        }
    }
    private destroy() {
        this.parent.parent.destroy(this);
    }

    // METHODS
    private m_position(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            x: args[0],
            y: args[1],
            z: args[2]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setPosition({ x: vars.x, y: vars.y, z: vars.z }, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_hotspot(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            x: args[0],
            y: args[1],
            z: args[2]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setHotspot({ x: vars.x, y: vars.y, z: vars.z }, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_scale(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            x: args[0],
            y: args[1],
            z: args[2]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setScale({ x: vars.x, y: vars.y, z: vars.z }, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_rotate(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            angle: args[0]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setAngle({ x: 0, y: 0, z: vars.angle * tvc.degreeRadian }, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_skew(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            x: args[0],
            y: args[1],
            z: args[2],
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setSkew({ x: vars.x, y: vars.y, z: vars.z }, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_offset(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            x: args[0],
            y: args[1],
            z: args[2],
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setOffset({ x: vars.x, y: vars.y, z: vars.z }, '#update');
                    return { type: 0 };
                }
            ]
    }
    private m_size(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            width: args[0],
            height: args[1],
            depth: args[2],
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setSize({ x: vars.width, y: vars.height, z: vars.depth }, '#update');
                    return { type: 0 };
                }
            ]
    }
    private m_visible(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            value: args[0],
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setVisible(vars.value, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_hide(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars.fromInstruction = args[0];
        this.vars =
        {
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setVisible(false, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_show(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setVisible(true, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_destroy(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars = args;
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.parent.destroy(this.parent.index);
                    return { type: 0 }
                }
            ]
    }
    private m_transparency(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            transparency: args[0],
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setAlpha(vars.transparency, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_image(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            image: args[0]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setImage(vars.image, '#update');
                    return { type: 0 }
                }
            ]
    }
    private m_camera(tvc, parent, args) {
        this.tvc = tvc;
        this.parent = parent;
        this.vars =
        {
            camera: args[0]
        };
        this.blocks =
            [
                function (tvc, vars) {
                    this.parent.setCamera(vars.camera, '#update');
                    return { type: 0 }
                }
            ]
    }
    private setModified() {
        this.modified++;
    }
    public turnIntoObject(objet, setters, methods, replacements) {
        var list =
        {
            x: { g: this.get_x, s: this.set_x },
            y: { g: this.get_y, s: this.set_y },
            z: { g: this.get_z, s: this.set_z },
            angle: { g: this.get_angle, s: this.set_angle },
            width: { g: this.get_width, s: this.set_width },
            height: { g: this.get_height, s: this.set_height },
            depth: { g: this.get_depth, s: this.set_depth },
            scaleX: { g: this.get_scaleX, s: this.set_scaleX },
            scaleY: { g: this.get_scaleY, s: this.set_scaleY },
            scaleZ: { g: this.get_scaleZ, s: this.set_scaleZ },
            hotspotX: { g: this.get_hotspotX, s: this.set_hotspotX },
            hotspotY: { g: this.get_hotspotY, s: this.set_hotspotY },
            hotspotZ: { g: this.get_hotspotZ, s: this.set_hotspotZ },
            offsetX: { g: this.get_offsetX, s: this.set_offsetX },
            offsetY: { g: this.get_offsetY, s: this.set_offsetY },
            offsetZ: { g: this.get_offsetZ, s: this.set_offsetZ },
            skewX: { g: this.get_skewX, s: this.set_skewX },
            skewY: { g: this.get_skewY, s: this.set_skewY },
            skewZ: { g: this.get_skewZ, s: this.set_skewZ },
            cameraX: { g: this.get_cameraX, s: this.set_cameraX },
            cameraY: { g: this.get_cameraY, s: this.set_cameraY },
            cameraZ: { g: this.get_cameraZ, s: this.set_cameraZ },
            image: { g: this.get_image, s: this.set_image },
            visible: { g: this.get_visible, s: this.set_visible },
            alpha: { g: this.get_alpha, s: this.set_alpha },
        };
        var listMethods =
        {
            x: { m_position: this.m_position, setPosition: this.setPosition },
            angle: { m_rotate: this.m_rotate, setAngle: this.setAngle },
            width: { m_size: this.m_size, setSize: this.setSize },
            hotspotX: { m_hotspot: this.m_hotspot, setHotspot: this.setHotspot },
            scaleX: { m_scale: this.m_scale, setScale: this.setScale },
            offsetX: { m_offset: this.m_offset, setOffset: this.setOffset },
            cameraX: { m_camera: this.m_camera, setCamera: this.setCamera },
            skewX: { m_skew: this.m_skew, setSkew: this.setSkew },
            alpha: { m_transparency: this.m_transparency, setAlpha: this.setAlpha },
            image: { m_image: this.m_image, setImage: this.setImage },
            visible: { m_show: this.m_show, m_hide: this.m_hide, setVisible: this.setVisible },
            index: { m_destroy: this.m_destroy, destroy: this.destroy },
        };

        objet.objectNumber = this.objectCount++;

        replacements = typeof replacements == 'undefined' ? {} : replacements;
        putSetters(objet, list, replacements);
        if (setters)
            putSetters(objet, setters);

        putMethods(objet, listMethods, replacements);
        if (methods)
            putMethods(objet, methods);

        if (typeof objet.setModified == 'undefined')
            objet.setModified = function () { this.modified = true; };
        objet.set_fromInstruction = this.set_fromInstruction;
        objet.get_fromInstruction = this.get_fromInstruction;

        function putSetters(obj, lst, replacements?) {
            for (var p in lst) {
                var prop = lst[p];
                if (typeof obj.vars[p] != 'undefined') {
                    if (replacements[p]) {
                        obj['get_' + p] = replacements[p].getter;
                        obj['set_' + p] = replacements[p].setter;
                    }
                    else {
                        obj['get_' + p] = prop.g;
                        obj['set_' + p] = prop.s;
                    }
                }
            }
        };
        function putMethods(obj, lst, replacements?) {
            for (var m in lst) {
                if (typeof obj.vars[m] != 'undefined') {
                    for (var mm in lst[m]) {
                        if (replacements[mm])
                            obj[mm] = replacements[mm];
                        else
                            obj[mm] = lst[m][mm];
                    }
                }
            }
        }
    }

}

