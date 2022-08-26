import { int } from "../float";
import { TVCContext } from "./TVCContext";
import { Bob } from "./Bob";
import { TextWindow } from "./TextWindow";
import { Utilities } from "./Utilities";

export class Screen {
    public tvc: any;
    public renderer: any;
    public contextName: string;
    public utilities: Utilities;
    public banks: any;
    public className: any;
    public dimension: any;
    public vars: any;
    public scale: any;
    public renderScale: any;
    public clip: any;
    public varsUpdated: any;
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public alphas: any;
    public halfBrightMode: any;
    public hamMode: boolean = false;
    public pattern: int = 0;
    public paintBorder: boolean = false;
    public ink: int = 0;
    public fillInk: int = 0;
    public borderInk: int = 0;
    public inverse: boolean = false;
    public cloned: any;
    public linePattern: any[];
    public grPosition: any;
    public dualPlayfieldFront: boolean;
    public dualPlayfieldBack: boolean;
    public font: any;
    public imageRendering: string;
    public drawingHandle: any;
    public drawingCount: int = 0;
    public onlyInk: boolean = false;
    public xor: boolean = false;
    public reverseImages: boolean = false;
    public bobsContext: TVCContext;
    public bobsToUpdate: boolean = false;
    public bobsUpdateOn: boolean = false;
    public bobsPriorityOn: boolean = false;
    public bobsPriorityReverseOn: boolean = false;
    public windows: any;
    public windowsZ: any[];
    public zones: any[];
    public scrolls: any[];
    public transparentColors: any[];
    public maxZones: int = 0;
    public fontHeight: int = 0;
    public previousFont: int = 0;
    public modified: int = 0;
    public currentTextWindow: TextWindow = null as any;
    public dualPlayfield: boolean = false;
    public pixelMode: any;
    public position: any;
    public isCenteredX: boolean = false;
    public isCenteredY: boolean = false;
    public font_loaded: boolean = false;
    public font_error: any;
    public fontWeight: any;
    public fontItalic: boolean = false;
    public fontStretch: boolean = false;
    public formatTextZones: any[] = null as any;
    public previousZone: int = 0;
    public mouseZone: int = 0;
    public previousMouse: int = 0;
    public animTextState: string = '';
    public animTextHandle: any;
    public formatTextImages: any;
    public formatTextZonesCount: int = 0;
    public paint: boolean = false;
    public listCount: int = 0;
    public formatTextDone: boolean = false;
    public formatTextResult: any;
    public emptyScreen: boolean = false;
    public displayScale: any;
    public offset: any;
    numberOfColor: any;
    numberOfColors: any;
    width: any;
    height: any;
    number: number = undefined as any;
    index: number = undefined as any;

    public constructor(tvc: any, args: any, tags: any) {
        this.tvc = tvc;
        this.renderer = args.renderer;
        this.contextName = args.contextName;
        this.utilities = tvc.utilities;
        this.banks = tvc.banks;
        this.className = 'screen';

        var noTextWindow = tvc.utilities.isTag(tags, 'noTextWindow');
        var noCls = tvc.utilities.isTag(tags, 'noCls');
        this.dimension = {};
        this.dimension.width = typeof args.width != 'undefined' ? args.width : this.tvc.manifest.default.screen.width;
        this.dimension.height = typeof args.height != 'undefined' ? args.height : this.tvc.manifest.default.screen.height;
        this.dimension.depth = typeof args.depth != 'undefined' ? args.depth : 0;
        if (this.tvc.maskHardwareCoordinates) {
            this.dimension.width &= 0xFFFFFFF0;
        }
        if (this.dimension.width <= 0 || this.dimension.height <= 0) {
            throw { error: 'illegal_function_call', parameters: [this.dimension.width, this.dimension.height] };
        }
        if (!this.tvc.unlimitedScreens) {
            if (this.dimension.width >= 1024 || this.dimension.height >= 1024) {
                throw { error: 'illegal_function_call', parameters: [this.dimension.width, this.dimension.height] };
            }
        }

        this.vars =
        {
            x: typeof args.x != 'undefined' ? args.x : this.tvc.manifest.default.screen.x,
            y: typeof args.y != 'undefined' ? args.y : this.tvc.manifest.default.screen.y,
            z: typeof args.z != 'undefined' ? args.z : 0,
            width: typeof args.displayWidth != 'undefined' ? args.displayWidth : this.dimension.width,
            height: typeof args.displayHeight != 'undefined' ? args.displayHeight : this.dimension.height,
            depth: typeof args.displayDepth != 'undefined' ? args.displayDepth : this.dimension.depth,
            offsetX: typeof args.offsetX != 'undefined' ? args.offsetX : 0,
            offsetY: typeof args.offsetY != 'undefined' ? args.offsetY : 0,
            offsetZ: typeof args.offsetZ != 'undefined' ? args.offsetZ : 0,
            scaleX: typeof args.scaleX != 'undefined' ? args.offsetX : 1,
            scaleY: typeof args.scaleY != 'undefined' ? args.offsetY : 1,
            scaleZ: typeof args.scaleZ != 'undefined' ? args.offsetZ : 1,
            hotspotX: typeof args.hotspotZ != 'undefined' ? args.hotspotX : 0,
            hotspotY: typeof args.hotspotY != 'undefined' ? args.hotspotY : 0,
            hotspotZ: typeof args.hotspotZ != 'undefined' ? args.hotspotZ : 0,
            skewX: typeof args.skewX != 'undefined' ? args.skewX : 0,
            skewY: typeof args.skewY != 'undefined' ? args.skewY : 0,
            skewZ: typeof args.skewZ != 'undefined' ? args.skewZ : 0,
            angle: typeof args.angle != 'undefined' ? args.angle : 0,
            alpha: typeof args.alpha != 'undefined' ? args.alpha : 1,
            visible: typeof args.visible != 'undefined' ? args.visible : true,
            pixelMode: typeof args.pixelMode != 'undefined' ? args.pixelMode : this.tvc.manifest.default.screen.pixelMode,
            numberOfColors: typeof args.numberOfColors != 'undefined' ? args.numberOfColors : this.tvc.manifest.default.screen.numberOfColors,
            palette: this.utilities.copyArray(typeof args.palette != 'undefined' ? args.palette : this.tvc.manifest.default.screen.palette),
            modified: 0
        };
        this.scale =
        {
            x: typeof this.tvc.manifest.display.screenScale != 'undefined' ? tvc.manifest.display.screenScale : 1,
            y: typeof this.tvc.manifest.display.screenScale != 'undefined' ? tvc.manifest.display.screenScale : 1,
            z: 1
        };
        if (this.tvc.maskHardwareCoordinates)
            this.vars.x &= 0xFFFFFFF0;
        this.vars.pixelMode != 'undefined' ? this.vars.pixelMode : '';
        if (typeof this.vars.pixelMode == 'number') {
            var pixelString = '';
            if ((this.vars.pixelMode & 1) != 0)
                pixelString += 'hires';
            if ((this.vars.pixelMode & 2) != 0)
                pixelString += ' laced';
            if ((this.vars.pixelMode & 4) != 0)
                pixelString += ' hbm';
            this.vars.pixelMode = pixelString;
        }
        this.renderScale =
        {
            x: (this.vars.pixelMode.indexOf('hires') >= 0 ? 0.5 : 1),
            y: (this.vars.pixelMode.indexOf('laced') >= 0 ? 0.5 : 1),
            z: 1
        }
        this.clip = undefined;
        if (args.clip)
            this.clip = this.utilities.getZone(args.clip, this.dimension, this.scale);

        // Create canvas
        this.varsUpdated = this.tvc.utilities.copyObject(this.vars);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.dimension.width * this.scale.x;
        this.canvas.height = this.dimension.height * this.scale.y;
        this.context = this.canvas.getContext('2d')!;

        // Colors
        if (this.tvc.usePalette)
            this.alphas = [];
        else
            this.alphas = {};
        for (var c = 0; c < Math.max(this.vars.numberOfColors, this.vars.palette.length); c++) {
            var colorString = '#000000';
            if (this.vars.palette[c]) {
                if (typeof this.vars.palette[c] == 'string')
                    colorString = this.vars.palette[c];
                else
                    colorString = this.utilities.getModernColorString(this.vars.palette[c], this.tvc.useShortColors);
            }
            this.vars.palette[c] = colorString.toUpperCase();
            if (this.tvc.usePalette)
                this.alphas[c] = 1;
            else
                this.alphas[colorString] = 1;
        }

        // Amiga specific
        this.halfBrightMode = false;
        this.hamMode = false;
        if (this.tvc.platform == 'amiga') {
            if (this.vars.numberOfColors != 2 && this.vars.numberOfColors != 4
                && this.vars.numberOfColors != 8 && this.vars.numberOfColors != 16
                && this.vars.numberOfColors != 16 && this.vars.numberOfColors != 32
                && this.vars.numberOfColors != 64 && this.vars.numberOfColors != 128
                && this.vars.numberOfColors != 256 && this.vars.numberOfColors != 4096)
                throw { error: 'illegal_function_call', parameter: this.vars.numberOfColors };
        }
        if (this.tvc.platform == 'amiga' && this.vars.numberOfColors == 64 || this.vars.pixelMode.indexOf('hbm') >= 0) {
            this.halfBrightMode = true;
            for (var p = 0; p < 32; p++) {
                this.setHalfBrightColor(p);
            }
            this.vars.numberOfColors = 32;
        }
        if (this.vars.numberOfColors == 4096) {
            this.vars.numberOfColors = 64;
            this.hamMode = true;
        }

        // Graphical operations
        this.pattern = 0;
        this.paintBorder = false;
        this.ink = 2;
        this.fillInk = 0;
        this.borderInk = 0;
        this.inverse = false;
        this.cloned = null;
        this.linePattern = [];
        this.grPosition = { x: 0, y: 0, z: 0 };
        this.dualPlayfieldFront = false;
        this.dualPlayfieldBack = false;
        this.font = null;
        this.imageRendering = 'pixelated';
        this.drawingHandle = null;
        this.drawingCount = 0;
        this.onlyInk = false;
        this.xor = false;
        this.reverseImages = false;

        // Bob context
        this.bobsContext = new TVCContext(this.tvc, this.contextName, { sorted: true });
        this.bobsContext.addContext("v1_0_collisions");
        this.bobsContext.addContext("v1_0_sprites");
        this.bobsContext.addContext("v1_0_textwindows");
        this.bobsContext.addContext("v1_0_time");

        this.bobsToUpdate = false;
        this.bobsUpdateOn = true;
        this.bobsPriorityOn = false;
        this.bobsPriorityReverseOn = false;

        // Default window
        this.windows = {};
        this.windowsZ = [];
        this.zones = [];
        this.scrolls = [];
        this.transparentColors = [];
        this.maxZones = 0;
        if (!noTextWindow)
            this.windOpen('default', null, 0, tags);

        if (!noCls)
            this.cls(0, { x: 0, y: 0, width: this.vars.width, height: this.vars.height });

        // Set first font on the list
        this.font = this.tvc.fonts.firstFont;
        this.fontHeight = this.tvc.fonts.firstFontHeight;
        this.previousFont = this.font;

        // Turn class into a real TVC Object
        this.tvc.turnIntoObject(this, {}, {},
            {
                setHotspot: this.setHotspot,
                setPosition: this.setPosition,
                setSize: this.setSize
            });

        // Set all parameters "officially". TODO: remove all above code... Process can be automatic for any objects ;)
        (this as any).setOffset({ x: this.vars.offsetX, y: this.vars.offsetY, z: this.vars.offsetZ }, '#update');
        (this as any).setScale({ x: this.vars.scaleX, y: this.vars.scaleY, z: this.vars.scaleZ }, '#update');
        this.setHotspot({ x: this.vars.hotspotX, y: this.vars.hotspotY, z: this.vars.hotspotZ }, '#update');
        this.setPosition({ x: this.vars.x, y: this.vars.y, z: this.vars.z }, '#update');
        this.setSize({ width: this.vars.width, height: this.vars.height, depth: this.vars.depth }, '#update');
        (this as any).setAlpha(typeof args.alpha != 'undefined' ? args.alpha : 1, '#update');
        (this as any).setAngle({ z: typeof args.angle != 'undefined' ? args.angle : 0 }, '#update');
        (this as any).setVisible(typeof args.visible != 'undefined' ? args.visible : true, '#update');


        // Check this!
        /*
        for ( var p = 0 in Screen.prototype )
        {
            if ( p != 'deactivate' )
                Screen.ScreenEmpty.prototype[ p ] = function() { throw 'screen_not_opened' };
            else
                Screen.ScreenEmpty.prototype[ p ] = function() {};
        }
        */
    }

    public get_this(index: int): any {
        return this.tvc.getScreen(index, null);
    }
    public setTags(tags: string[]): void {
        if (this.utilities.getTag(tags, ['refresh']) !== '')
            this.setModified();
    }
    public setModified() {
        this.modified++;
        this.renderer.setModified();
    }
    public resize(dimension: any) {
        var width = typeof dimension.width == 'undefined' ? this.dimension.width : dimension.width;
        var height = typeof dimension.height == 'undefined' ? this.dimension.height : dimension.height;
        if (width != this.dimension.width || height != this.dimension.height) {
            this.dimension.width = dimension.width;
            this.dimension.height = dimension.height;
            this.canvas.width = this.dimension.width * this.scale.x;
            this.canvas.height = this.dimension.height * this.scale.y;
            this.currentTextWindow.resize();
        }
        this.modified++;
        this.renderer.setModified();
    }
    public startDrawing() {
        this.drawingCount++;
        if (this.drawingCount == 1) {
            if (this.currentTextWindow)
                this.currentTextWindow.cursorOff();
            if (this.clip) {
                this.context.save();
                const path = new Path2D();
                path.rect(this.clip.x, this.clip.y, this.clip.width, this.clip.height);
                this.context.clip(path);
            }
        }
    }
    public endDrawing(noCursor?: boolean) {
        this.drawingCount--;
        if (this.drawingCount == 0) {
            if (this.clip)
                this.context.restore();
            if (!noCursor && this.currentTextWindow)
                this.currentTextWindow.cursorOn();
            this.setModified();
        }
    }
    public setClip(rectangle) {
        this.clip = this.utilities.getZone(rectangle, this.dimension, this.scale);
        this.setModified();
    }
    public setDualPlayfield(screen) {
        if (this.dualPlayfield || screen.dualPlayfield)
            throw 'cant_set_dual_playfield';
        if (this.pixelMode != screen.vars.pixelMode)
            throw 'cant_set_dual_playfield';

        this.dualPlayfieldFront = true;
        screen.dualPlayfieldBack = true;
        this.setTransparent(this.tvc.usePalette ? [0] : ['#000000'], true);
        screen.position.x = this.position.x;
        screen.position.y = this.position.y;
        this.tvc.screensContext.moveBefore(this.tvc.currentContextName, screen, this);
        this.setModified();
        screen.setModified();
    }
    public setDualPriority(screen) {
        var isGood = this.dualPlayfieldFront || this.dualPlayfieldBack || screen.dualPlayfieldFront || screen.dualPlayfieldBack;
        if (!isGood)
            throw 'screen_not_in_dual_playfield';
        if (!this.dualPlayfieldFront) {
            this.dualPlayfieldBack = false;
            this.dualPlayfieldFront = true;
            screen.dualPlayfieldBack = true;
            screen.dualPlayfieldFront = false;
            this.setTransparent(this.tvc.usePalette ? 0 : '#000000', true);
            screen.setTransparent(this.tvc.usePalette ? 0 : '#000000', false);
            this.tvc.moveBefore(this.tvc.currentContextName, this, screen);
            screen.setModified();
            this.setModified();
        }
    }
    public setCenter(inX, inY) {
        this.isCenteredX = inX ? true : false;
        this.isCenteredY = inY ? true : false;
        this.setModified();
    }
    public setHotspot(position, fromInstruction) {
        var hotspotX = this.vars.hotspotX;
        var hotspotY = this.vars.hotspotY;
        if (position.x == 'mask') {
            switch ((position.y & 0x70) >> 4) {
                case 0:
                    hotspotX = 0;
                    break;
                case 1:
                    hotspotX = this.dimension.width / 2;
                    break;
                case 2:
                    hotspotX = this.dimension.width;
                    break;
            }
            switch (position.y & 0x07) {
                case 0:
                    hotspotY = 0;
                    break;
                case 1:
                    hotspotY = this.dimension.height / 2;
                    break;
                case 2:
                    hotspotY = this.dimension.height;
                    break;
            }
        }
        else {
            if (typeof position.x != 'undefined')
                hotspotX = position.x;
            if (typeof position.y != 'undefined')
                hotspotY = position.y;
        }
        this.tvc.setHotspot.call(this, { x: hotspotX, y: hotspotY, z: position.z }, fromInstruction);
    }
    public setPosition(position, fromInstruction) {
        if (fromInstruction) {
            switch (fromInstruction) {
                case 'display':
                    break;
                case 'offset':
                    (this as any).setOffset(position, fromInstruction);
                    return;
                case 'size':
                    this.setSize({ width: position.x, height: position.y }, fromInstruction);
                    return;
                default:
                    break;
            }
        }
        if (position.x && this.tvc.maskHardwareCoordinates)
            position.x &= 0xFFFFFFF0;
        this.tvc.setPosition.call(this, position, fromInstruction);
    }
    public setSize(dimension, fromInstruction) {
        if (dimension.width) {
            if (this.tvc.maskHardwareCoordinates)
                dimension.width &= 0xFFFFFFF0;
        }
        if (dimension.width && dimension.width < 0)
            throw { error: 'illegal_function_call', parameter: dimension.width };
        if (dimension.height && dimension.height < 0)
            throw { error: 'illegal_function_call', parameter: dimension.height };

        this.tvc.setSize.call(this, dimension, fromInstruction);
    }
    public deactivate() {
        //this.currentTextWindow.deactivate();
    }
    public activate() {
        //this.currentTextWindow.activate( true );
    }
    public setCloned(screen) {
        this.cloned = screen;
        this.canvas = screen.canvas;
        this.context = screen.context;
        clearInterval(this.windows[0].cursorHandle);
    }
    public xScreen(x) {
        return x - this.vars.x / this.renderScale.x / this.vars.scaleX + this.vars.offsetX;
    }
    public yScreen(y) {
        return y - this.vars.y / this.renderScale.y / this.vars.scaleY + this.vars.offsetY;
    }

    //////////////////////////////////////////////////////////////////////
    // Zones
    //////////////////////////////////////////////////////////////////////
    public reserveZone(number) {
        if (typeof number != undefined) {
            if (number < 0)
                throw { error: 'illegal_function_call', parameter: number };
            this.maxZones = number;
        }
        else {
            this.zones = [];
            this.maxZones = 0;
        }
    }
    public setZone(number, rectangle) {
        if (number <= 0 || number > this.maxZones)
            throw { error: 'illegal_function_call', parameter: number };
        this.zones[number] = this.utilities.getZone(rectangle, this.dimension, { x: 1, y: 1, z: 1 });
        this.zones[number].enable = true;
    }
    public zone(number, position) {
        const screen = this.tvc.getScreen(number);
        if (screen.vars.visible) {
            for (var z = 1; z < screen.zones.length; z++) {
                if (screen.zones[z]) {
                    var zone = screen.zones[z];
                    if (zone.enable == undefined || zone.enable == true) {
                        if (position.x >= zone.x && position.x < zone.x + zone.width && position.y >= zone.y && position.y < zone.y + zone.height) {
                            return z;
                        }
                    }
                }
            }
        }
        return 0;
    }

    public zoneEnable(number, value) {
        if (typeof number != 'undefined') {
            if (number < 1 || number > this.maxZones) {
                console.log(number);
                console.log(this.maxZones);
                throw { error: 'illegal_function_call', parameter: number };
            }

            if (this.zones && this.zones[number]) {
                this.zones[number].enable = value;
            }
        }
    }

    public isZoneEnabled(number: int): boolean {
        if (typeof number != 'undefined') {
            if (number < 1 || number > this.maxZones) {
                throw { error: 'illegal_function_call', parameter: number };
            }

            if (this.zones && this.zones[number]) {
                return this.zones[number].enable;
            }

            return true;
        }

        return true;
    }
    public zonesLength() {
        return this.maxZones;
    }

    public resetZone(number: int, position: any): void {
        if (typeof number != 'undefined') {
            if (number < 1 || number > this.maxZones)
                throw { error: 'illegal_function_call', parameter: number };
            this.zones[number] = null;
        }
        else {
            this.zones = [];
        }
    }
    public isIn(position): boolean {
        if (this.vars.visible) {
            var x = Math.floor((position.x - this.vars.x) / this.renderScale.x);
            var y = Math.floor((position.y - this.vars.y) / this.renderScale.y);
            return (x >= 0 && x < this.vars.width) && (y >= 0 && y < this.vars.height);
        }
        return false;
    }

    public hZone2(position: any): any {
        position.x = (position.x - this.vars.x) / this.renderScale.x;
        position.y = (position.y - this.vars.y) / this.renderScale.y;
        return this.zone(undefined, position);
    }

    //////////////////////////////////////////////////////////////////////
    // Colors
    //////////////////////////////////////////////////////////////////////
    public setHalfBrightColor(p) {
        if (this.halfBrightMode) {
            var c = this.vars.palette[p];
            var r = ((c & 0xF00) >> 1) & 0xF00;
            var g = ((c & 0x0F0) >> 1) & 0x0F0;
            var b = ((c & 0x00F) >> 1) & 0x00F;
            this.vars.palette[p + 32] = r | g | b;
            this.setModified();
        }
    }
    public getPalette(index, mask) {
        var screen = this.tvc.getScreen(index);
        var b = 1;
        for (var c = 0; c < screen.vars.palette.length; c++) {
            if (typeof mask != 'undefined') {
                if ((mask & b) != 0) {
                    this.vars.palette[c] = screen.vars.palette[c];
                }
                b = b << 1;
            }
            else {
                this.vars.palette[c] = screen.vars.palette[c];
            }
        }
    }

    public setPalette(palette, tags?) {
        var remap = true;
        if (tags && this.utilities.getTag(tags, ['noremap']))
            remap = false;
        var oldPalette = this.utilities.copyArray(this.vars.palette)
        for (var p = 0; p < palette.length; p++) {
            if (typeof palette[p] != 'undefined') {
                if (typeof palette[p] == 'string')
                    this.vars.palette[p] = palette[p];
                else
                    this.vars.palette[p] = this.utilities.getModernColorString(palette[p], this.tvc.useShortColors);
                if (this.halfBrightMode && p < 32)
                    this.setHalfBrightColor(p);
            }
        }
        if (remap) {
            var sourceColors: any[] = [];
            var destinationColors: any[] = [];
            for (var c = 0; c < this.vars.palette.length; c++) {
                if (oldPalette[c] != this.vars.palette[c]) {
                    sourceColors.push(this.utilities.getRGBAStringColors(oldPalette[c]));
                    destinationColors.push(this.utilities.getRGBAStringColors(this.vars.palette[c]));
                }
            }
            if (sourceColors.length != 0) {
                var zone = this.utilities.getZone({}, this.dimension, this.scale)
                this.startDrawing();
                this.utilities.remapBlock(this.context, sourceColors, destinationColors, zone);
                this.endDrawing();
            }
        }
        this.setModified();
    }
    public setColour(number, color) {
        if (this.tvc.usePalette) {
            if (number < 0)
                throw { error: 'illegal_function_call', parameter: number };
            number = number % this.vars.numberOfColors;
            this.vars.palette[number] = this.utilities.getModernColorString(color, this.tvc.useShortColors);
            if (this.halfBrightMode && number < 32)
                this.setHalfBrightColor(number);
            this.setModified();
        }
    }
    public getColour(number) {
        if (!this.tvc.usePalette)
            throw 'function_not_available_in_true_color_mode';
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };

        number = number % this.vars.numberOfColors;
        var color = this.vars.palette[number];
        if (this.tvc.useShortColors)
            return parseInt('0x' + color.substr(1, 1) + color.substr(3, 1) + color.substr(5, 1));
        return parseInt('0x' + color.substr(1, 2) + color.substr(3, 2) + color.substr(5, 2));
    }

    public getColorAlpha(color) {
        if (this.tvc.usePalette)
            return this.alphas[color % this.vars.numberOfColors];

        color = this.getColorString(color);
        return typeof this.alphas[color] == 'undefined' ? 1.0 : this.alphas[color];
    }

    public getColorString(color) {
        // True color?
        if (!this.tvc.usePalette) {
            if (typeof color == 'number')
                color = color.toString(16);
            if (color.charAt(0) == '#')
                color = color.substring(1);
            while (color.length < 6)
                color = '0' + color;
            return ('#' + color).toUpperCase();
        }

        // Palette index...
        color = color % this.vars.numberOfColors;
        if (this.dualPlayfieldBack)
            color += 8;
        return this.vars.palette[color];
    }

    public setTransparent(colors, trueFalse) {
        var sourceColors: any[] = [];
        var destinationColors: any[] = [];
        var alphas: any[] = [];
        if (colors.length == 0 && !trueFalse) {
            for (var c = 0; c < this.alphas.length; c++) {
                if (this.alphas[c] == 0)
                    colors.push(c);
            }
        }
        for (var c = 0; c < colors.length; c++) {
            sourceColors[c] = this.tvc.utilities.getRGBAStringColors(this.vars.palette[colors[c] % this.vars.numberOfColors]);
            if (trueFalse) {
                alphas[c] = 0;
                destinationColors[c] = sourceColors[c];
                destinationColors[c].a = 0;
            }
            else {
                alphas[c] = 0;
                destinationColors[c] = sourceColors[c];
                destinationColors[c].a = 255;
            }
        }
        this.setColorAlpha(colors, alphas);
        this.utilities.remapBlock(this.context, sourceColors, destinationColors, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height });
        this.setModified();
    }

    public setColorAlpha(colors, alphas) {
        if (this.tvc.usePalette) {
            for (var c = 0; c < colors.length; c++) {
                if (colors[c] < 0 || alphas[c] < 0 || alphas[c] > 1)
                    throw { error: 'illegal_function_call', parameter: alphas[c] };
                this.alphas[colors[c] % this.vars.numberOfColors] = alphas[c];
            }
        }
        else {
            for (var c = 0; c < colors.length; c++) {
                var color = this.getColorString(colors[c]);
                if (alphas[c] < 0 || alphas[c] > 1)
                    throw { error: 'illegal_function_call', parameter: alphas[c] };
                this.alphas[color] = alphas[c];
            }
        }
        this.setModified();
    }

    public isTransparentColor(color) {
        if (this.tvc.usePalette) {
            if (color < 0)
                throw { error: 'illegal_function_call', parameter: color };
            return this.alphas[color % this.vars.numberOfColors] == 0;
        }
        color = (this as any).getModernColorString(color, false);
        if (typeof this.alphas[color] != 'undefined' && (typeof this.alphas[color]) as any > 0)
            return false;
        return true;
    }
    public remap(colorsSource, colorsDestination, rectangle) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale)

        // Check colors
        const rgbaSource: any[] = [], rgbaDestination: any[] = [];
        for (var c = 0; c < colorsSource.length; c++) {
            var a = (Math.floor(this.getColorAlpha(colorsSource[c]) * 255)).toString(16);
            a += a.length < 2 ? ' ' : '';
            rgbaSource.push(this.utilities.getRGBAStringColors(this.getColorString(colorsSource[c]) + a));
            if (this.dualPlayfieldBack && colorsSource[c] == 0) {
                rgbaDestination.push(this.utilities.getRGBAStringColors('#00000000'));
            }
            else {
                a = (Math.floor(this.getColorAlpha(colorsDestination[c]) * 255)).toString(16);
                a += a.length < 2 ? ' ' : '';
                rgbaDestination.push(this.utilities.getRGBAStringColors(this.getColorString(colorsSource[c]) + a));
            }
        }
        this.startDrawing();
        this.utilities.remapBlock(this.context, rgbaSource, rgbaDestination, zone);
        this.endDrawing();
    }

    public findColorIndex(r, g, b) {
        for (var p = 0; p < this.vars.palette.length; p++) {
            var rgb = this.utilities.getRGBAStringColors(this.vars.palette[p]);
            if (rgb.r == r && rgb.g == g && rgb.b == b) {
                return p;
            }
        }
        return -1;
    }

    public ink$(value): string {
        return String.fromCharCode(27) + 'IN' + value + '\r';
    }

    public setFont$(value): string {
        return String.fromCharCode(27) + 'SF' + value + '\r';
    }

    public setItalic$(value): string {
        return String.fromCharCode(27) + 'IT' + (value ? 1 : 0) + '\r';
    }

    public setBold$(value): string {
        return String.fromCharCode(27) + 'BO' + (value ? 1 : 0) + '\r';
    }

    public setFontSize$(value): string {
        return String.fromCharCode(27) + 'SS' + value + '\r';
    }

    public setImage$(name, path): string {
        return String.fromCharCode(27) + 'I1' + name + '\r' + String.fromCharCode(27) + 'I2' + path + '\r'
    }

    public setLink$(name, path): string {
        return String.fromCharCode(27) + 'L1' + name + '\r' + String.fromCharCode(27) + 'L2' + path + '\r'
    }

    //////////////////////////////////////////////////////////////////////
    // Block transfer
    //////////////////////////////////////////////////////////////////////
    public cls(color, rectangle?) {
        if (this.tvc.platform === 'tvc')
            color = typeof color == 'undefined' ? 0 : color;
        else
            color = typeof color == 'undefined' ? 1 : color;
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);

        this.startDrawing();
        if (this.isTransparentColor(color)) {
            this.context.clearRect(zone.x, zone.y, zone.width, zone.height);
        }
        else {
            this.context.globalAlpha = this.getColorAlpha(color);
            this.context.fillStyle = this.getColorString(color);
            this.context.fillRect(zone.x, zone.y, zone.width, zone.height);
        }
        this.currentTextWindow.home();
        this.endDrawing();
    }

    public pasteImage2(bankName, number, position, dimension, angle, alpha, tags, contextName) {
        position.x = typeof position.x != 'undefined' ? position.x : 0.0;
        position.y = typeof position.y != 'undefined' ? position.y : 0.0;
        var image = this.banks.getImage(bankName, number, this.tvc.currentContextName);

        dimension.width = typeof dimension.width != 'undefined' ? dimension.width : image.width;
        dimension.height = typeof dimension.height != 'undefined' ? dimension.height : image.height;
        var scale =
        {
            x: dimension.width / image.width,
            y: dimension.height / image.height
        };
        angle = !isNaN(angle) ? angle : 0;
        this.paste(bankName, number, position, scale, angle, alpha, tags, contextName);
        this.setModified();
    }

    public pasteImage(bankName, number, x, y, scaleX, scaleY, angle, alpha?, tags?, contextName?) {
        x = typeof x != 'undefined' ? x : 0.0;
        y = typeof y != 'undefined' ? y : 0.0;
        scaleX = scaleX ? scaleX : 1.0;
        scaleY = scaleY ? scaleY : scaleX;
        angle = !isNaN(angle) ? angle : 0;
        this.paste(bankName, number, { x: x, y: y }, { x: scaleX, y: scaleY }, angle, alpha, tags, contextName);
        this.setModified();
    }

    public pasteCanvas(canvas, rectangle) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);

        this.startDrawing();
        this.context.imageSmoothingEnabled = false;
        this.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, zone.x, zone.y, zone.width, zone.height);
        this.endDrawing();
    }

    public paste(bankName, number, position, scale, angle, alpha, tags?, contextName?) {
        var x = typeof position.x != 'undefined' ? position.x : 0.0;
        var y = typeof position.y != 'undefined' ? position.y : 0.0;
        var scaleX = 1.0;
        var scaleY = 1.0;
        if (scale) {
            scaleX *= typeof scale.x != 'undefined' ? scale.x : 1.0;
            scaleY *= typeof scale.y != 'undefined' ? scale.y : scaleX;
        }
        angle = !isNaN(angle) ? angle : 0;
        alpha = typeof alpha != 'undefined' ? alpha : 1.0;

        var hRev = false;
        var vRev = false;
        if (typeof number == 'number') {
            hRev = (number & 0x8000) != 0;
            vRev = (number & 0x4000) != 0;
            number &= 0x3FFF;
        }

        var image = this.banks.getImage(bankName, number, this.tvc.currentContextName);
        if (image) {
            var canvas = image.getCanvas(hRev, vRev);

            this.startDrawing();
            this.context.imageSmoothingEnabled = false;
            this.context.globalAlpha = alpha;

            if (angle === 0)
                this.context.drawImage(canvas, (x - image.hotSpotX * scaleX) * this.scale.x, (y - image.hotSpotY * scaleY) * this.scale.y, image.width * scaleX * this.scale.x, image.height * scaleY * this.scale.y);
            else {
                this.context.save();
                this.context.translate(x * this.scale.x, y * this.scale.y);
                this.context.rotate(angle);
                this.context.scale(Math.max(0.001, scaleX), Math.max(0.001, scaleY));
                this.context.translate(-image.hotSpotX, -image.hotSpotY);
                this.context.drawImage(canvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
                this.context.restore();
            }
            this.endDrawing();
        }
    }

    public screenCopy(destination, rectangleSource, rectangleDestination, mode) {
        destination.startDrawing();
        if (typeof rectangleSource == 'undefined' && typeof rectangleDestination == 'undefined') {
            destination.context.imageSmoothingEnabled = false;
            destination.context.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, destination.canvas.width, destination.canvas.height);
        }
        else {
            rectangleDestination.width = typeof rectangleDestination.width == 'undefined' ? rectangleSource.width : rectangleDestination.width;
            rectangleDestination.height = typeof rectangleDestination.height == 'undefined' ? rectangleSource.height : rectangleDestination.height;
            var szone = this.utilities.getZone(rectangleSource, this.dimension, this.scale);
            var dzone = this.utilities.getZone(rectangleDestination, destination.dimension, destination.scale);

            this.context.imageSmoothingEnabled = false;
            destination.context.imageSmoothingEnabled = false;
            destination.context.drawImage(this.canvas, szone.x, szone.y, szone.width, szone.height, dzone.x, dzone.y, dzone.width, dzone.height);
        }
        destination.endDrawing();
    }

    public screenProject(destination, x1, y1, x2, y2, dx1, dy1, dx2, dy2, dx3, dy3, dx4, dy4) {
        this.startDrawing();
        this.context.scale(1 / this.vars.scaleX, 1 / this.vars.scaleY);
        if (this != destination) {
            destination.startDrawing();
            destination.context.scale(1 / destination.vars.scaleX, 1 / destination.vars.scaleY);
        }
        x1 = typeof x1 == 'undefined' ? 0 : x1 * this.vars.scaleX;
        y1 = typeof y1 == 'undefined' ? 0 : y1 * this.vars.scaleY;
        x2 = typeof x2 == 'undefined' ? this.vars.width * this.vars.scaleX : x2 * this.vars.scaleX;
        y2 = typeof y2 == 'undefined' ? this.vars.height * this.vars.scaleY : y2 * this.vars.scaleY;
        dx1 = typeof dx1 == 'undefined' ? 0 : dx1 * destination.vars.scaleX;
        dy1 = typeof dy1 == 'undefined' ? 0 : dy1 * destination.vars.scaleY;
        dx2 = typeof dx2 == 'undefined' ? destination.vars.width * destination.vars.scaleX : dx2 * destination.vars.scaleX;
        dy2 = typeof dy2 == 'undefined' ? 0 : dy2 * destination.vars.scaleY;
        dx3 = typeof dx3 == 'undefined' ? destination.vars.width * destination.vars.scaleX : dx3 * destination.vars.scaleX;
        dy3 = typeof dy3 == 'undefined' ? destination.vars.height * destination.vars.scaleY : dy3 * destination.vars.scaleY;
        dx4 = typeof dx4 == 'undefined' ? 0 : dx4 * destination.vars.scaleX;
        dy4 = typeof dy4 == 'undefined' ? destination.vars.height * destination.vars.scaleY : dy4 * destination.vars.scaleY;

        var deltaDX1 = dx4 - dx1;
        var deltaDY1 = dy4 - dy1;
        var deltaDX2 = dx3 - dx2;
        var deltaDY2 = dy3 - dy2;
        var canvasLine = document.createElement('canvas');
        canvasLine.width = x2 - x1;
        canvasLine.height = this.vars.scaleY;
        var contextLine = canvasLine.getContext('2d')!;
        contextLine.imageSmoothingEnabled = false;

        var canvas = document.createElement('canvas');
        canvas.width = this.dimension.width * this.vars.scaleX;
        canvas.height = this.dimension.height * this.vars.scaleY;
        var context = canvas.getContext('2d')!;
        context.drawImage(this.canvas, 0, 0);

        destination.context.imageSmoothingEnabled = false;

        for (let yy1 = y1; yy1 < y2; yy1 += this.vars.scaleY) {
            contextLine.drawImage(canvas, x1, yy1, x2 - x1, this.vars.scaleY, 0, 0, x2 - x1, this.vars.scaleY);

            // Do copy
            var done = (yy1 - y1) / (y2 - y1);
            var dXX1 = dx1 + deltaDX1 * done;
            var dYY1 = dy1 + deltaDY1 * done;
            var dXX2 = dx2 + deltaDX2 * done;
            var dYY2 = dy2 + deltaDY2 * done;

            var dx = dXX2 - dXX1;
            var dy = dYY2 - dYY1;
            var angle = Math.atan2(dy, dx);
            var distance = Math.hypot(dx, dy);
            destination.context.save();
            destination.context.translate(dXX1, dYY1);
            destination.context.rotate(angle);
            destination.context.drawImage(canvasLine, 0, 0, x2 - x1, this.scale.y, 0, 0, distance, destination.vars.scaleY * (destination.vars.scaleY / this.vars.scaleY));
            destination.context.restore();
        }

        this.context.scale(this.vars.scaleX, this.vars.scaleY);
        if (this != destination) {
            destination.context.scale(destination.vars.scaleX, destination.vars.scaleY);
            destination.endDrawing();
        }
        this.endDrawing();
    }

    public defScroll(number, rectangle, displacement) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        if (!this.tvc.unlimitedScreens && number > 16)
            throw { error: 'illegal_function_call', parameter: number };
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);
        this.scrolls[number] =
        {
            zone: zone,
            dx: displacement.x * this.vars.scaleX,
            dy: displacement.y * this.vars.scaleY
        }
    }

    public scroll(number) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        if (!this.tvc.unlimitedScreen && number > 16)
            throw { error: 'illegal_function_call', parameter: number };
        if (!this.scrolls[number])
            throw 'scrolling_not_defined';
        var scroll = this.scrolls[number];
        this.startDrawing();
        this.context.imageSmoothingEnabled = false;
        if (this.dualPlayfieldFront) {
            var canvas = document.createElement('canvas');
            canvas.width = scroll.zone.width;
            canvas.height = scroll.zone.height;
            var context = canvas.getContext('2d')!;
            context.imageSmoothingEnabled = false;
            context.drawImage(this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, 0, 0, scroll.zone.width, scroll.zone.height);
            this.context.clearRect(scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height);
            this.context.drawImage(canvas, 0, 0, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height);
        }
        else {
            this.context.drawImage(this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height);
        }
        this.endDrawing();
    }
    public getImage(bankName, index, rectangle, tags, contextName) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);
        zone.width -= this.scale.x;
        zone.height -= this.scale.y;

        var canvas = document.createElement('canvas');
        canvas.width = zone.width;
        canvas.height = zone.height;
        var context = canvas.getContext('2d')!;
        context.imageSmoothingEnabled = false;
        this.startDrawing();
        context.drawImage(this.canvas, zone.x, zone.y, zone.width, zone.height, 0, 0, zone.width, zone.height);
        this.endDrawing();

        // Proper resize of canvas
        if (rectangle.width < zone.width || rectangle.height < zone.height)
            this.utilities.resample_canvas(canvas, rectangle.width, rectangle.height, true);

        var remap = (this.tvc.platform == 'amiga');
        if (this.utilities.getTag(tags, ['opaque']) != '')
            remap = false;

        // If there is transparent colors in the screen-> no remap
        /*for ( var c = 0; c < this.vars.palette.length; c++ )
        {
            if ( this.isTransparentColor( c ) )
            {
                remap = false;
                break;
            }
        }
        */
        var rgbtag = this.utilities.getTagParameter(tags, 'rgbtrans');
        if (rgbtag) {
            var rgb$ = this.utilities.getModernColorString(rgbtag, this.tvc.useShortColors);
            rgbtag = this.utilities.getRGBAStringColors(rgb$);
            rgb.r = rgbtag.r;
            rgb.g = rgbtag.g;
            rgb.b = rgbtag.b;
            remap = true;
        }
        var colortag = this.utilities.getTagParameter(tags, 'colortrans');
        if (colortag) {
            if (colortag >= 0 && colortag < this.vars.palette.length) {
                rgb = this.utilities.getRGBAStringColors(this.vars.palette[colortag]);
                remap = true;
            }
        }
        if (remap && bankName != 'icons') {
            var rgb = this.utilities.getRGBAStringColors(this.vars.palette[0]);
            this.utilities.remapBlock(context, [rgb], [{ r: 0, g: 0, b: 0, a: 0 }], { x: 0, y: 0, width: canvas.width, height: canvas.height });
        }
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.banks.insertImage(bankName, index, undefined, tags, contextName, undefined, canvas);
    }

    public getImagePalette(bankName, mask, contextName) {
        var self = this;
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var palette = this.banks.getImagePalette(bankName, contextName);
        for (var p = 0; p < Math.min(this.vars.numberOfColors, palette.length); p++) {
            if (typeof palette[p] != 'undefined') {
                if (typeof mask == 'undefined')
                    pokeColor(p, palette[p]);
                else if ((p & mask) != 0)
                    pokeColor(p, palette[p]);
            }
        }
        function pokeColor(number, color) {
            self.vars.palette[number] = color;
            if (number < 16 && self.vars.numberOfColors <= 16)
                self.vars.palette[number + 16] = color;
        }
    }



    //////////////////////////////////////////////////////////////////////
    // Drawing
    //////////////////////////////////////////////////////////////////////
    public setLine(pattern) {
        this.linePattern = [];
        if (pattern == 0)
            return;
        var b = 0x8000;
        var on = true;
        var previousCount = 0;
        var delta = 1 * this.scale.x;
        for (var count = 0; count < 16; count++) {
            if ((pattern & b) == 0 && on) {
                this.linePattern.push((count - previousCount) * delta);
                previousCount = count;
                on = false;
            }
            else if ((pattern & b) != 0 && !on) {
                this.linePattern.push((count - previousCount) * delta);
                previousCount = count;
                on = true;
            }
            b = b >> 1;
        }
    }

    public setInk(color, fillInk?, borderInk?) {
        this.ink = Math.abs(color) % this.vars.numberOfColors;
        if (typeof fillInk != 'undefined')
            this.fillInk = fillInk;
        if (typeof borderInk != 'undefined')
            this.borderInk = borderInk;
    }

    public setPattern(pattern) {
        if (pattern < 0)
            throw 'not_implemented';
        if (pattern > 34)
            throw { error: 'illegal_function_call', parameter: pattern };
        this.pattern = pattern;
    }

    public setPaint(onOff: boolean) {
        this.paintBorder = onOff;
    }

    public setWriting(style) {
        this.onlyInk = !((style & 0x01) != 0);
        this.xor = (style & 0x02) != 0;
        this.inverse = (style & 0x04) != 0;
    }
    public getInk() {
        return this.inverse ? this.fillInk : this.ink;
    }

    public getFillInk() {
        return this.inverse ? this.ink : this.fillInk;
    }

    public getBorderInk() {
        return this.borderInk;
    }

    public getCompositeOperation() {
        return this.xor ? 'difference' : 'source-over';
    }

    public plot(position, color) {
        var color = typeof color != 'undefined' ? color : this.getInk();
        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y

        if (!this.isTransparentColor(color)) {
            this.startDrawing();
            this.context.fillStyle = this.getColorString(color);
            this.context.globalAlpha = this.getColorAlpha(color);
            this.context.globalCompositeOperation = this.getCompositeOperation();
            this.context.fillRect(position.x * this.scale.x, position.y * this.scale.y, this.scale.x, this.scale.y);
            this.endDrawing();
        }
        this.grPosition = position;
    }

    public draw(rectangle) {
        rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
        rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
        if (typeof rectangle.width == 'undefined' || typeof rectangle.height == 'undefined')
            throw 'syntax_error';
        this.context.strokeStyle = this.getColorString(this.getInk());
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.setLineDash(this.linePattern);
        this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;
        this.startDrawing()
        this.context.beginPath();
        this.context.moveTo(rectangle.x * this.scale.x, rectangle.y * this.scale.y);
        this.context.lineTo((rectangle.x + rectangle.width) * this.scale.x, (rectangle.y + rectangle.height) * this.scale.y);
        this.context.stroke();
        this.endDrawing();

        this.grPosition.x = rectangle.x + rectangle.width;
        this.grPosition.y = rectangle.y + rectangle.height;
    }

    public drawTo(position) {
        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;

        this.startDrawing();
        this.context.strokeStyle = this.getColorString(this.getInk());
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.setLineDash(this.linePattern);
        this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;
        this.context.beginPath();
        this.context.moveTo(this.grPosition.x * this.scale.x, this.grPosition.y * this.scale.y);
        this.context.lineTo(position.x * this.scale.x, position.y * this.scale.y);
        this.context.stroke();
        this.endDrawing();

        this.grPosition = position;
    }

    public grLocate(position) {
        this.grPosition.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        this.grPosition.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
    }

    public isPixelTransparent(position) {
        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
        if (position.x < 0 || position.x > this.dimension.width || position.y < 0 || position.y > this.dimension.height)
            return false;
        var pixel = this.context.getImageData(position.x * this.scale.x, position.y * this.scale.y, 1, 1);
        return (pixel.data[3] == 0);
    }

    public point(position) {
        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
        if (position.x < 0 || position.x > this.dimension.width || position.y < 0 || position.y > this.dimension.height)
            return -1;
        var pixel = this.context.getImageData(position.x * this.scale.x, position.y * this.scale.y, 1, 1);
        if (this.tvc.usePalette)
            return this.findColorIndex(pixel.data[0], pixel.data[1], pixel.data[2]);
        return this.utilities.getRGBAString(pixel.data[0], pixel.data[1], pixel.data[2], pixel.data[3]);
    }

    public box(rectangle) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);

        this.startDrawing();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.rotate(0);
        this.context.strokeStyle = this.getColorString(this.getInk());
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.setLineDash(this.linePattern);
        this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;
        this.context.strokeRect(zone.x, zone.y, zone.width, zone.height);
        this.endDrawing();

        if (this.tvc.platform == 'amiga') {
            this.grPosition.x = rectangle.x + rectangle.width;
            this.grPosition.y = rectangle.y + rectangle.height;
        }
        else {
            this.grPosition.x = rectangle.x;
            this.grPosition.y = rectangle.y;
        }
    }

    public bar(rectangle) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);

        this.startDrawing();
        if (this.pattern == 0)
            this.context.fillStyle = this.getColorString(this.getInk());
        else
            this.context.fillStyle = this.createPattern(this.pattern)!;
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.fillRect(zone.x, zone.y, zone.width, zone.height);
        if (this.paintBorder) {
            this.context.strokeStyle = this.getColorString(this.getBorderInk());
            this.context.globalAlpha = this.getColorAlpha(this.getBorderInk());
            this.context.setLineDash(this.linePattern);
            this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;
            this.context.strokeRect(zone.x, zone.y, zone.width, zone.height);
        }
        this.endDrawing();

        if (this.tvc.platform === 'tvc') {
            this.grPosition.x = rectangle.x + rectangle.width;
            this.grPosition.y = rectangle.y + rectangle.height;
        }
        else {
            this.grPosition.x = rectangle.x;
            this.grPosition.y = rectangle.y;
        }
    }

    public disc(rectangle, angle1, angle2) {
        rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
        rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : rectangle.width;
        this.filledEllipse(rectangle, angle1, angle2);
    }

    public filledEllipse(rectangle, angle1, angle2, rotation?) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);
        if (this.vars.pixelMode.indexOf('hires') >= 0)
            zone.width *= 2;
        angle1 = isNaN(angle1) ? 0 : angle1;
        angle2 = isNaN(angle2) ? 2 * Math.PI : angle2;
        rotation = typeof rotation == 'undefined' ? 0 : rotation;
        this.startDrawing();
        if (this.pattern == 0)
            this.context.fillStyle = this.getColorString(this.getInk());
        else
            this.context.fillStyle = this.createPattern(this.pattern)!;
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.beginPath();
        this.context.ellipse(zone.x, zone.y, zone.width, zone.height, rotation, angle1, angle2);
        this.context.fill();
        if (this.paintBorder) {
            this.context.strokeStyle = this.getColorString(this.getBorderInk());
            this.context.setLineDash(this.linePattern);
            this.context.lineWidth = this.scale;
            this.context.stroke();
        }
        this.endDrawing();

        this.grPosition.x = rectangle.x;
        this.grPosition.y = rectangle.y;
    }

    public circle(rectangle, angle1, angle2) {
        rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
        rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : rectangle.width;
        this.ellipse(rectangle, angle1, angle2);
    }

    public ellipse(rectangle, angle1?, angle2?, rotation?) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);
        if (this.vars.pixelMode.indexOf('hires') >= 0)
            zone.width *= 2;
        angle1 = isNaN(angle1) ? 0 : angle1;
        angle2 = isNaN(angle2) ? 2 * Math.PI : angle2;
        rotation = typeof rotation == 'undefined' ? 0 : rotation;
        this.startDrawing();
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.strokeStyle = this.getColorString(this.getInk());
        this.context.setLineDash(this.linePattern);
        this.context.lineWidth = this.scale;
        this.context.beginPath();
        this.context.ellipse(zone.x, zone.y, zone.width, zone.height, rotation, angle1, angle2);
        this.context.stroke();
        this.endDrawing();

        this.grPosition.x = rectangle.x;
        this.grPosition.y = rectangle.y;
    }

    public polyline(coords) {
        var x = typeof coords[0] != 'undefined' ? coords[0] : this.grPosition.x;
        var y = typeof coords[1] != 'undefined' ? coords[1] : this.grPosition.y;

        this.startDrawing();
        this.context.strokeStyle = this.getColorString(this.getInk());
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.setLineDash(this.linePattern);
        this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;;
        this.context.beginPath();
        this.context.moveTo(x * this.scale.x, y * this.scale.y);
        for (var c = 2; c < coords.length; c += 2) {
            x = typeof coords[c] != 'undefined' ? coords[c] : x;
            y = typeof coords[c + 1] != 'undefined' ? coords[c + 1] : y;
            this.context.lineTo(x * this.scale.x, y * this.scale.y);
        }
        this.context.stroke();
        this.endDrawing();

        this.grPosition.x = x;
        this.grPosition.y = y;
    }

    public polygon(coords) {
        var x = typeof coords[0] != 'undefined' ? coords[0] : this.grPosition.x;
        var y = typeof coords[1] != 'undefined' ? coords[1] : this.grPosition.y;

        this.startDrawing();
        if (this.pattern == 0)
            this.context.fillStyle = this.getColorString(this.getInk());
        else
            this.context.fillStyle = this.createPattern(this.pattern)!;
        this.context.globalAlpha = this.getColorAlpha(this.getInk());
        this.context.globalCompositeOperation = this.getCompositeOperation();
        this.context.setLineDash(this.linePattern);

        this.context.beginPath();
        this.context.moveTo(x * this.scale.x, y * this.scale.y);
        for (var c = 2; c < coords.length; c += 2) {
            x = typeof coords[c] != 'undefined' ? coords[c] : x;
            y = typeof coords[c + 1] != 'undefined' ? coords[c + 1] : y;
            this.context.lineTo(x * this.scale.x, y * this.scale.y);
        }
        this.context.closePath();
        this.context.fill();
        if (this.paintBorder) {
            this.context.strokeStyle = this.getColorString(this.getBorderInk());
            this.context.globalAlpha = this.getColorAlpha(this.getBorderInk());
            this.context.lineWidth = (this.scale.x + this.scale.y) / 1.5;;
            this.context.stroke();
        }
        this.endDrawing();

        this.grPosition.x = x;
        this.grPosition.y = y;
    }

    public createPattern(pattern) {
        // Create a little canvas
        var canvas = document.createElement('canvas');
        canvas.width = 8 * this.scale.x;
        canvas.height = 8 * this.scale.y;
        var context = canvas.getContext('2d')!;

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var colorBack = this.utilities.getRGBAStringColors(this.getColorString(this.getFillInk()));
        var colorInk = this.utilities.getRGBAStringColors(this.getColorString(this.getInk()));

        var alphaBack = this.getColorAlpha(this.getFillInk());
        var alphaInk = this.getColorAlpha(this.getInk());
        var source = this.Patterns[pattern];
        for (let y = 0; y < 8; y++) {
            for (let yy = 0; yy < this.scale.y; yy++) {
                for (let x = 0; x < 8; x++) {
                    const mask = 0x80 >> x;
                    for (let xx = 0; xx < this.scale.x; xx++) {
                        const offset = (y * this.scale.y + yy) * 32 * this.scale.x + (x * this.scale.x + xx) * 4;
                        if ((source[y] & mask) == 0) {
                            imageData.data[offset] = colorInk.r;
                            imageData.data[offset + 1] = colorInk.g;
                            imageData.data[offset + 2] = colorInk.b;
                            imageData.data[offset + 3] = alphaBack * 255;
                        }
                        else {
                            imageData.data[offset] = colorBack.r;
                            imageData.data[offset + 1] = colorBack.g;
                            imageData.data[offset + 2] = colorBack.b;
                            imageData.data[offset + 3] = alphaInk * 255;
                        }
                    }
                }
            }
        }
        context.putImageData(imageData, 0, 0);

        // Create the pattern
        return this.context.createPattern(canvas, 'repeat');
    }
    public Patterns: any[] =
        [
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],         //  0
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],         //  1
            [0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA],         //  2
            [0xFF, 0xFF, 0xEF, 0xD7, 0xFF, 0xFF, 0xFE, 0x7D],         //  3
            [0xFD, 0xFD, 0x55, 0xAF, 0xDF, 0xDF, 0x55, 0xFA],         //  4
            [0xBF, 0x7F, 0xFF, 0xF7, 0xFB, 0xFD, 0xFF, 0xDF],         //  5
            [0x99, 0x39, 0x27, 0xE7, 0x7E, 0x72, 0xF3, 0x9F],         //  6
            [0xFF, 0xFF, 0xFB, 0xFF, 0xFF, 0xFF, 0x7F, 0xFF],         //  7
            [0x07, 0x93, 0x39, 0x70, 0xE0, 0xC9, 0x9C, 0x0E],         //  8
            [0xDE, 0xC0, 0xF3, 0x7B, 0x01, 0xFA, 0xF9, 0xFD],         //  9
            [0xF7, 0xFF, 0x55, 0xFF, 0xF7, 0xFF, 0x77, 0xFF],         //  10
            [0x88, 0x67, 0x07, 0x07, 0x88, 0x76, 0x70, 0x70],         //  11
            [0x7F, 0x7F, 0xBE, 0xC1, 0xF7, 0xF7, 0xEB, 0x1C],         //  12
            [0x7E, 0xBD, 0xDB, 0xE7, 0xF9, 0xFE, 0x7F, 0x7F],         //  13
            [0x0F, 0x0F, 0x0F, 0x0F, 0xF0, 0xF0, 0xF0, 0xF0],         //  14
            [0xF7, 0xE3, 0xC1, 0x80, 0x00, 0x80, 0xC1, 0xE3],         //  15
            [0xEE, 0xDD, 0xBB, 0x00, 0x77, 0xBB, 0xDD, 0x00],         //  16
            [0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F],         //  17
            [0xBD, 0x7E, 0x7E, 0xBD, 0xDB, 0xE7, 0xE7, 0xDB],         //  18
            [0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F],         //  19
            [0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],         //  20
            [0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F],         //  21
            [0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F],         //  22
            [0xFC, 0xF8, 0xF1, 0xE3, 0xC7, 0x8F, 0x1F, 0x3F],         //  23
            [0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F],         //  24
            [0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F],         //  25
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],         //  26
            [0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F],         //  27
            [0xFF, 0xBB, 0xFF, 0xEE, 0xFF, 0xBB, 0xFF, 0xEE],         //  28
            [0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA],         //  29
            [0x77, 0xAA, 0xDD, 0xAA, 0x77, 0xAA, 0xDD, 0xAA],         //  30
            [0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA],         //  31
            [0x55, 0x22, 0x55, 0x88, 0x55, 0x22, 0x55, 0x88],         //  32
            [0x55, 0x00, 0x55, 0x00, 0x55, 0x00, 0x55, 0x00],         //  33
            [0x11, 0x00, 0x44, 0x00, 0x11, 0x00, 0x44, 0x00]          //  34
        ]


    //////////////////////////////////////////////////////////////////////
    // Icons
    //////////////////////////////////////////////////////////////////////
    public getIconPalette(mask, contextName) {
        var self = this;
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var palette = this.banks.getIconPalette(contextName);
        for (let p = 0; p < Math.min(this.vars.numberOfColors, palette.length); p++) {
            if (typeof palette[p] != 'undefined') {
                if (typeof mask == 'undefined')
                    pokeColor(p, palette[p]);
                else if ((p & mask) != 0)
                    pokeColor(p, palette[p]);
            }
        }
        function pokeColor(number, color) {
            self.vars.palette[number] = color;
            if (number < 16 && self.vars.numberOfColors <= 16)
                self.vars.palette[number + 16] = color;
        }
    }
    public getIcon(index, rectangle, tags, contextName) {
        var zone = this.utilities.getZone(rectangle, this.dimension, this.scale);

        var canvas = document.createElement('canvas');
        canvas.width = rectangle.width;
        canvas.height = rectangle.height;
        var context = canvas.getContext('2d')!;
        context.imageSmoothingEnabled = false;
        this.startDrawing();
        context.drawImage(this.canvas, zone.x, zone.y, zone.width, zone.height, 0, 0, canvas.width, canvas.height);
        this.endDrawing();

        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.banks.insertIcon(index, undefined, tags, contextName, undefined, canvas);
    }

    //////////////////////////////////////////////////////////////////////
    // Bobs
    //////////////////////////////////////////////////////////////////////
    public getBob(index, errorMessage, unused?) {
        return this.bobsContext.getElement(this.tvc.currentContextName, index, errorMessage);
    }

    public getNumberOfBobs() {
        return this.bobsContext.getNumberOfElements(this.tvc.currentContextName);
    }

    public getHighestBobIndex() {
        return this.bobsContext.getHighestElementIndex(this.tvc.currentContextName);
    }

    public getLowestBobIndex() {
        return this.bobsContext.getLowestElementIndex(this.tvc.currentContextName);
    }

    public bob(index, position, image, tags) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index);
        if (!bob) {
            bob = new Bob(this.tvc, this, tags);
            this.bobsContext.setElement(this.tvc.currentContextName, bob, index);
        }
        bob.set(position, image, '#update');
        this.setModified();
        this.bobsToUpdate = true;
        return bob;
    }

    public bobDestroy(index, fromInstruction) {
        var self = this;
        if (typeof index == 'undefined') {
            this.bobsContext.parseAll(undefined, function (bob) {
                self.tvc.removeRootObjectFromSynchro(bob);
            });
            this.bobsContext.deleteRange(this.tvc.currentContextName);
        }
        else {
            this.tvc.removeRootObjectFromSynchro(this.bobsContext.getElement(this.tvc.currentContextName, index));
            this.bobsContext.deleteElement(this.tvc.currentContextName, index);
            this.bobsToUpdate = true;
            this.setModified();
        }
    }

    public bobsUpdate(force) {
        if (force || (this.bobsUpdateOn && this.bobsToUpdate)) {
            this.bobsToUpdate = false;

            let done: any = false;
            for (var bob = this.bobsContext.getFirstElement(this.tvc.currentContextName); bob != null; bob = this.bobsContext.getNextElement(this.tvc.currentContextName))
                done |= bob.update({ force: force });
            if (done) {
                this.sortBobsPriority();
                this.setModified();
            }
        }
    }
    public updateBank(newBank, newBankIndex) {
        var update: any = false;
        this.bobsContext.parseAll(this.tvc.currentContextName, function (bob) {
            update |= bob.updateBank(newBank, newBankIndex, this.tvc.currentContextName);
        });
        return update;
    }

    public setBobsUpdate(yes_no) {
        this.bobsUpdateOn = yes_no;
    }

    public xBob(index: int, fromInstruction) {
        return this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined').get_x(fromInstruction);
    }

    public yBob(index, fromInstruction) {
        return this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined').get_y(fromInstruction);
    }
    public iBob(index, fromInstruction) {
        return this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined').get_image(fromInstruction);
    }
    public isBob(index, fromInstruction) {
        return this.bobsContext.getElement(this.tvc.currentContextName, index) != null;
    }

    public limitBob(index, rectangle, fromInstruction) {
        if (typeof index != 'undefined') {
            var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
            bob.setLimits(rectangle, fromInstruction);
        }
        else {
            this.bobsContext.parseAll(this.tvc.currentContextName, function (bob) {
                bob.setLimits(rectangle, fromInstruction);
            });
        }
        this.bobsToUpdate = true;
        this.setModified();
    }

    public bobCamera(index, position, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setCamera(position, fromInstruction);
        this.bobsToUpdate = true;
    }

    public bobAlpha(index, alpha, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setAlpha(alpha, fromInstruction);
        this.bobsToUpdate = true;
    }

    public bobScale(index, scale, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setScale(scale, fromInstruction);
        this.bobsToUpdate = true;
    }

    public bobSkew(index, skew, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setSkew(skew, fromInstruction);
        this.bobsToUpdate = true;
    }

    public bobRotate(index, angle, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setAngle({ x: 0, y: 0, z: angle }, fromInstruction);
        this.bobsToUpdate = true;
    }

    public bobVisible(index, show_hide, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        bob.setVisible(show_hide, fromInstruction);
        this.bobsToUpdate = true;
    }

    public setBobsPriority(on_off, fromInstruction) {
        this.bobsPriorityOn = on_off;
        this.bobsToUpdate = true;
        this.setModified();
    }

    public setBobsPriorityReverse(on_off, fromInstruction) {
        this.bobsPriorityReverseOn = on_off;
        this.bobsToUpdate = true;
        this.setModified();
    }

    public sortBobsPriority() {
        if (this.bobsPriorityOn) {
            if (this.bobsPriorityReverseOn) {
                this.bobsContext.sort(this.tvc.currentContextName, function (b1, b2) {
                    if (b1.vars.y == b2.vars.y)
                        return 0;
                    return (b1.vars.y > b2.vars.y) ? -1 : 1;
                });
            }
            else {
                this.bobsContext.sort(this.tvc.currentContextName, function (b1, b2) {
                    if (b1.vars.y == b2.vars.y)
                        return 0;
                    return (b1.vars.y < b2.vars.y) ? -1 : 1;
                });
            }
        }
    }

    public putBob(index, fromInstruction) {
        var bob = this.bobsContext.getElement(this.tvc.currentContextName, index, 'bob_not_defined');
        this.startDrawing();
        if (bob.clipping) {
            this.context.save();
            const path = new Path2D();
            path.rect(bob.clipping.x * this.scale.x, bob.clipping.y * this.scale.y, bob.clipping.width * this.scale.x, bob.clipping.height * this.scale.y);
            this.context.clip(path);
        }
        this.paste('images', bob.vars.image, { x: bob.vars.x, y: bob.vars.y, z: bob.vars.z }, { x: bob.vars.scaleX, y: bob.vars.scaleY, z: bob.vars.scaleZ }, bob.vars.angle, bob.vars.alpha);
        if (bob.clipping)
            this.context.restore();
        this.endDrawing();
    }

    //////////////////////////////////////////////////////////////////////
    // Windows
    //////////////////////////////////////////////////////////////////////
    public setWindow(number: int): void {
        if (number < 0)
            throw 'illegal_text_window_parameter';
        if (!this.windows[number])
            throw 'text_window_not_opened';

        if (this.currentTextWindow.number != number) {
            this.currentTextWindow.deactivate();
            for (var z = 0; z < this.windowsZ.length; z++) {
                if (this.windowsZ[z].number == number) {
                    this.windowsZ.splice(z, 1);
                    break;
                }
            }
            this.currentTextWindow = this.windows[number];
            this.windowsZ.push(this.currentTextWindow);
            this.currentTextWindow.activate();
        }
    }

    public windOpen(number, rectangle, border, tags) {
        if (number == 'default')
            number = 0;
        else {
            if (number <= 0)
                throw 'illegal_text_window_parameter';
        }
        if (!this.tvc.unlimitedWindows && number >= 16)
            throw 'illegal_text_window_parameter';

        if (this.windows[number])
            throw 'text_window_already_opened';

        this.startDrawing();
        rectangle = rectangle ? rectangle : {};

        var windowDefinition: any = this.utilities.copyObject(this.tvc.manifest.default.screen.window);
        windowDefinition.x = rectangle.x;
        windowDefinition.y = rectangle.y;
        windowDefinition.width = rectangle.width;
        windowDefinition.height = rectangle.height;
        windowDefinition.border = border;
        if (this.currentTextWindow)
            this.currentTextWindow.deactivate();

        if (tags) {
            if (this.utilities.isTag(tags, ['fontWidth'])) {
                windowDefinition.forceFontWidth = this.utilities.getTagParameter(tags, 'fontWidth')
                if (windowDefinition.forceFontWidth < 0)
                    throw { error: 'illegal_function_call', parameter: windowDefinition.forceFontWidth };
            }
            if (this.utilities.isTag(tags, ['fontHeight'])) {
                windowDefinition.forceFontHeight = this.utilities.getTagParameter(tags, 'fontHeight')
                if (windowDefinition.forceFontHeight < 0)
                    throw { error: 'illegal_function_call', parameter: windowDefinition.forceFontHeight };
            }
        }
        this.currentTextWindow = new TextWindow(this.tvc, this, this.contextName, windowDefinition);
        this.windows[number] = this.currentTextWindow;
        this.currentTextWindow.number = number;
        this.windowsZ.push(this.currentTextWindow);
        this.endDrawing(true);
    }

    public windClose() {
        if (this.currentTextWindow == this.windows[0])
            throw 'text_window_0_cant_be_closed';

        this.startDrawing();
        this.currentTextWindow.close();
        this.windows[this.currentTextWindow.number] = null;
        this.windowsZ.pop();
        for (var z = 0; z < this.windowsZ.length; z++)
            this.windowsZ[z].restore();
        this.currentTextWindow = this.windowsZ[this.windowsZ.length - 1];
        this.currentTextWindow.activate(true);
        this.endDrawing();
    }

    public restoreWindows() {
        this.startDrawing();
        for (var z = 0; z < this.windowsZ.length - 1; z++) {
            this.windowsZ[z].restore();
        }
        this.endDrawing();
    }



    //////////////////////////////////////////////////////////////////////
    // Blocks
    //////////////////////////////////////////////////////////////////////
    public getBlock(number, rectangle, mask) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        this.tvc.blocks[number] = this.doGetBlock(rectangle, mask);
    }

    public getCBlock(number, rectangle, mask) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        this.tvc.cBlocks[number] = this.doGetBlock(rectangle, mask);
    }

    public putBlock(number, position, bitPlanes, bitMode) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        var block = this.tvc.blocks[number];
        if (!block)
            throw 'block_not_defined';
        this.doPutBlock(block, position, bitPlanes, bitMode);
    }

    public putCBlock(number, position, bitPlanes, bitMode) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        var block = this.tvc.cBlocks[number];
        if (!block)
            throw 'block_not_defined';
        this.doPutBlock(block, position, bitPlanes, bitMode);
    }

    public delBlock(number) {
        this.tvc.blocks = this.doDelBlock(this.tvc.blocks, number);
    }

    public revBlock(number, hRev, vRev) {
        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        var block = this.tvc.blocks[number];
        if (!block)
            throw 'block_not_defined';
        block.hRev = typeof hRev != 'undefined' ? hRev : block.hRev;
        block.vRev = typeof vRev != 'undefined' ? vRev : block.vRev;
    }
    public delCBlock(number) {
        this.tvc.cBlocks = this.doDelBlock(this.tvc.cBlocks, number);
    }

    public doGetBlock(rectangle, mask) {
        rectangle = this.utilities.checkRectangle(rectangle, this.grPosition, this.dimension);
        const block: any =
        {
            rectangle: rectangle,
            alpha: 1.0,
            canvas: document.createElement('canvas'),
            hRev: 0,
            vRev: 0
        }
        block.canvas.width = rectangle.width * this.scale.x;
        block.canvas.height = rectangle.height * this.scale.y;
        this.currentTextWindow.cursorOff();
        var context = block.canvas.getContext('2d');
        context.drawImage(this.canvas, rectangle.x * this.scale.x, rectangle.y * this.scale.y, block.canvas.width, block.canvas.height, 0, 0, block.canvas.width, block.canvas.height);
        this.currentTextWindow.cursorOn();

        if (typeof mask != 'undefined' && mask != 0) {
            this.utilities.remapBlock(context, [{ r: 0, g: 0, b: 0, a: 255 }], [{ r: 0, g: 0, b: 0 }], { x: 0, y: 0, width: block.canvas.width, height: block.canvas.height });
        }
        return block;
    }

    public doSetBlockAlpha(block, alpha) {
        block.alpha = alpha / 255.0;
    }

    public doPutBlock(block, position, bitPlanes, bitMode) {
        position = this.utilities.checkRectangle(position, this.grPosition);
        this.startDrawing();
        this.context.globalAlpha = block.alpha;
        var canvas = block.canvas;
        if (block.hRev || block.vRev)
            canvas = this.tvc.utilities.flipCanvas(canvas, block.hRev, block.vRev);
        this.context.drawImage(canvas, position.x * this.scale.x, position.y * this.scale.y);
        this.endDrawing();
    }

    public doDelBlock(blocks, number) {
        if (typeof number == 'undefined')
            return [];
        else {
            if (number < 0)
                throw { error: 'illegal_function_call', parameter: number };
            if (!blocks[number])
                throw 'block_not_defined';

            const dest: any[] = [];
            for (var b = 0; b < blocks.length; b++) {
                if (b != number)
                    dest[b] = blocks[b];
            }
            return dest;
        }
    };

    //////////////////////////////////////////////////////////////////////
    // Fonts
    //////////////////////////////////////////////////////////////////////
    public setFont(args, callback?) {
        var self = this;
        this.font_loaded = false;
        this.font_error = null;
        var reference = args[0] ? args[0] : this.previousFont;
        var height = typeof args[1] != 'undefined' ? args[1] : 16;
        var weight = args[2];
        var italic = args[3];
        var stretch = args[4];
        this.tvc.fonts.getFont(reference, height, weight, italic, stretch, '', this.tvc.currentContextName, function (response, font, extra) {
            if (response) {
                self.font = font;
                self.previousFont = font;
                self.fontHeight = height;
                self.fontWeight = weight;
                self.fontItalic = italic;
                self.fontStretch = stretch;
                if (callback)
                    callback(true, font, extra);
            }
            else {
                if (callback)
                    callback(false, 'cannot_load_font', extra);
                else
                    self.font_error = 'cannot_load_font';
            }
            self.font_loaded = true;
        });
    }

    public setFont_wait() {
        if (this.font_error)
            throw this.font_error;
        return this.font_loaded;
    }

    public textLength(text) {
        if (this.font)
            return this.tvc.fonts.getTextLength(text, this.font, this.fontHeight);
        throw 'font_not_available';
    }
    public text(position, text, align) {
        if (!this.font)
            throw 'font_not_available';

        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;

        var textAlign = "left";
        var textBaseLine = "alphabetic";
        var direction = "inherit";
        if (align) {
            var temp;
            if ((temp = this.utilities.getTag(align, ['left', 'center', 'right', 'start', 'end'])) != '')
                textAlign = temp;
            if ((temp = this.utilities.getTag(align, ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'])) != '')
                textBaseLine = temp;
            if ((temp = this.utilities.getTag(align, ['ltr', 'rtl', 'inherit'])) != '')
                direction = temp;
        }
        var x = position.x;
        var y = position.y;
        var width = this.textLength(text);
        var height = this.fontHeight;
        var baseLine = this.tvc.fonts.getBaseLine(this.font, this.fontHeight);
        switch (textAlign) {
            case 'left':
            case 'start':
                break;
            case 'center':
                x -= width / 2;
                break;
            case 'right':
            case 'end':
                x -= width;
                break;
        }
        switch (textBaseLine) {
            case 'top':
            case 'hanging':
                break;
            case 'middle':
                y -= height / 2;
                break;
            case 'alphabetic':
            case 'ideographic':
                y -= baseLine;
                break;
            case 'bottom':
                y -= this.fontHeight;
                break;
        }
        this.startDrawing();
        this.context.globalCompositeOperation = this.getCompositeOperation();
        if (!this.onlyInk) {
            var zone = this.utilities.getZone({ x: x, y: y, width: width, height: height }, this.dimension, this.scale);
            if (this.pattern == 0)
                this.context.fillStyle = this.getColorString(this.getFillInk());
            else
                this.context.fillStyle = this.createPattern(this.pattern)!;
            this.context.globalAlpha = this.getColorAlpha(this.getFillInk());
            this.context.fillRect(zone.x, zone.y, zone.width, zone.height);
        }
        var color = this.getColorString(this.getInk());
        var alpha = this.getColorAlpha(this.getInk());
        y += this.fontHeight / 60;
        if (this.font.fontInformation.type == 'amiga') {
            this.context.imageSmoothingEnabled = false;
            // TODO: set scale X and Y
            this.tvc.fonts.drawAmigaText(this.context, this.scale.x, x, y, text, this.font, this.fontHeight, 'left', 'top', direction, color, alpha)
        }
        else if (this.font.fontInformation.type == 'google') {
            this.context.textAlign = 'left';
            this.context.textBaseline = 'top';
            this.context.direction = direction as any;
            this.context.fillStyle = color;
            this.context.globalAlpha = alpha;
            this.context.font = this.utilities.getFontString(this.font.fontInformation.name, this.fontHeight * this.scale.x, this.fontWeight, this.fontItalic);
            this.context.fillText(text, x * this.scale.x, y * this.scale.y);
        }
        this.endDrawing();

        this.grPosition.x = x + width;
        this.grPosition.y = y + height;
    }
    public animateText(onClick, options) {
        var self = this;
        if (this.formatTextZones) {
            options = typeof options == 'undefined' ? {} : options;
            options.windowName = typeof options.windowName == 'undefined' ? '_blank' : options.windowName;
            const drawZone = (z, active) => {
                var zone = self.formatTextZones[z];
                if (zone) {
                    self.startDrawing();

                    // Clear zone background
                    self.context.fillStyle = self.getColorString(0);
                    self.context.globalAlpha = self.getColorAlpha(zone.alpha);
                    self.context.fillRect(zone.x, zone.y, zone.width, zone.height);

                    // Draw text
                    var saveInk = self.getInk();
                    var saveFont = self.font.fontInformation.name;
                    var saveFontHeight = self.fontHeight;
                    var escapeChar = String.fromCharCode(27);
                    var text = escapeChar + 'IN' + zone.ink + '\r' + escapeChar + 'SF' + zone.fontName + '\r' + escapeChar + 'SS' + zone.fontHeight + '\r';
                    if (active)
                        text += escapeChar + 'UN1\r' + zone.text + escapeChar + 'UN0\r';
                    else
                        text += zone.text;
                    text += escapeChar + 'IN' + saveInk + '\r' + escapeChar + 'SF' + saveFont + '\r' + escapeChar + 'SS' + saveFontHeight + '\r';
                    self.formatText([text, zone.x, zone.y, 100000, 100000, '#nozones']);
                    self.endDrawing();
                }
            }
            this.previousZone = -1;
            this.mouseZone = -1;
            this.previousMouse = -1;
            if (this.formatTextZones.length > 0) {
                this.animTextState = 'on';
                this.animTextHandle = setInterval(function () {
                    if (self.animTextState == 'on') {
                        var currentZone = -1;
                        var x = (self.tvc.xMouse - self.position.x) / self.renderScale.x / self.displayScale.x + self.offset.x;
                        var y = (self.tvc.yMouse - self.position.y) / self.renderScale.y / self.displayScale.y + self.offset.y;
                        for (var z = 0; z < self.formatTextZones.length; z++) {
                            var zone = self.formatTextZones[z];
                            if (x >= zone.x && x < zone.x + zone.width && y >= zone.y && y < zone.y + zone.height) {
                                currentZone = z;
                                break;
                            }
                        }
                        if (currentZone != self.previousZone) {
                            if (self.previousZone >= 0) {
                                drawZone(self.previousZone, false);
                                self.previousZone = -1;
                            }
                            if (currentZone >= 0) {
                                drawZone(currentZone, true);
                            }
                            self.previousZone = currentZone;
                        }
                        var mouse = (self.tvc.mouseButtons & 1);
                        if (mouse != self.previousMouse) {
                            self.previousMouse = mouse;
                            if (mouse)
                                self.mouseZone = currentZone;
                            else {
                                if (currentZone >= 0 && self.mouseZone == currentZone) {
                                    var zone = self.formatTextZones[currentZone];
                                    if (zone.link) {
                                        if (typeof onClick == 'undefined')
                                            self.tvc.openURL(zone.link, options.windowName);
                                        else
                                            self.tvc.runProcedure(onClick, { LINK$: zone.link, TEXT$: zone.text });
                                    }
                                }
                            }
                        }
                    }
                }, 20);
            }
        }
    }
    public stopAnimateText(state?) {
        if (this.animTextHandle) {
            clearInterval(this.animTextHandle);
            this.animTextHandle = undefined;
        }
    }
    public setAnimateTextState(state) {
        this.animTextState = state;
        if (state == 'off')
            this.stopAnimateText();
    }
    public formatText(args) {
        if (!this.font)
            throw 'font_not_available';

        var text = args[0];
        var position = { x: args[1], y: args[2] };
        var dimension = { width: args[3], height: args[4] };
        var align = args[5];
        var codeFont = args[6];
        var codeFontHeight = args[7];

        var self = this;
        var color = this.getColorString(this.getInk());
        var alpha = this.getColorAlpha(this.getInk());
        var zoneNumber = -1;
        var zoneX1, zoneY1;
        var spaceWidth = self.tvc.fonts.getTextLength(" ", this.font, this.fontHeight);
        var loadImagesList: any[] = [];
        var imagesToLoad = 0;
        var imagesLoaded = 0;
        var underscore = false;
        var listCount = 0;
        var linkName, linkZoneX, linkZoneY;
        var noZones = false;
        var textFont = this.font.fontInformation.name;
        var textFontHeight = this.fontHeight;
        codeFont = typeof codeFont == 'undefined' ? textFont : codeFont;
        codeFontHeight = typeof codeFontHeight == 'undefined' ? textFontHeight : codeFontHeight;
        this.formatTextImages = {};

        this.startDrawing();

        // Formatting functions
        function fillIt(text, x, y, test?) {
            var width = self.tvc.fonts.getTextLength(text, self.font, self.fontHeight);
            if (!test) {
                if (self.font.fontInformation.type == 'amiga') {
                    self.context.imageSmoothingEnabled = false;
                    self.tvc.fonts.drawAmigaText(self.context, self.scale.x, x, y, text, self.font, self.fontHeight, 'left', 'alphabetic', 'inherit', color, alpha)
                }
                else if (self.font.fontInformation.type == 'google') {
                    self.context.fillText(text, x * self.scale.x, y * self.scale.y);
                }
                if (underscore) {
                    self.context.strokeStyle = self.context.fillStyle;
                    self.context.lineWidth = (self.scale.x + self.scale.y) / 1.5;
                    self.context.setLineDash(self.linePattern);
                    self.context.beginPath();
                    self.context.moveTo(x * self.scale.x, (y + self.fontHeight - 2) * self.scale.y);
                    self.context.lineTo((x + width) * self.scale.x, (y + self.fontHeight - 2) * self.scale.y);
                    self.context.stroke();
                }
            }
            return x + width;
        };
        function pokeFont() {
            if (self.font.fontInformation.type == 'google')
                self.context.font = self.utilities.getFontString(self.font.fontInformation.name, self.fontHeight * self.scale.x, self.fontWeight, self.fontItalic);
            spaceWidth = self.tvc.fonts.getTextLength(" ", self.font, self.fontHeight);
        }
        function doInk(parameter, x, y, test) {
            if (!test) {
                color = self.getColorString(parameter);
                self.context.fillStyle = color;
            }
        }
        function doAlpha(parameter, x, y, test) {
            if (!test) {
                alpha = self.getColorAlpha(parameter);
                self.context.globalAlpha = alpha;
            }
        }
        function doItalic(parameter, x, y, test) {
            self.setFont([self.font, self.fontHeight, self.fontWeight, parameter ? 'italic' : 'normal']);
            pokeFont();
        }
        function doBold(parameter, x, y, test) {
            self.setFont([self.font, self.fontHeight, parameter ? 'bold' : 'normal', self.fontItalic]);
            pokeFont();
        }
        function doSetFont(parameter, x, y, test) {
            self.setFont([parameter, self.fontHeight, self.fontWeight, self.fontItalic]);
            pokeFont();
        }
        function doSetFontSize(parameter, x, y, test) {
            self.setFont([self.font, parameter, self.fontWeight, self.fontItalic]);
            pokeFont();
        }
        function doZone1(parameter, x, y, test) {
            if (!test && typeof x != 'undefined' && typeof y != 'undefined') {
                zoneNumber = parameter;
                zoneX1 = x;
                zoneY1 = y;
            }
        }
        function doZone2(parameter, x, y, test) {
            if (!test && typeof x != 'undefined' && typeof y != 'undefined') {
                if (zoneNumber >= 0) {
                    self.setZone(zoneNumber, { x: zoneX1, y: zoneY1, width: x - zoneX1, height: self.fontHeight });
                    zoneNumber = -1;
                }
            }
        }
        function doLink1(name, x, y, test) {
            linkName = name;
            linkZoneX = x;
            linkZoneY = y;
        }
        function doLink2(path, x, y, test) {
            var width = fillIt(linkName, x, y, test) - x;
            if (!test && !noZones) {
                self.formatTextZones[self.formatTextZonesCount++] =
                {
                    link: path,
                    text: linkName,
                    x: linkZoneX,
                    y: linkZoneY,
                    width: width,
                    height: self.fontHeight,
                    ink: self.ink + 1,
                    fontHeight: self.fontHeight,
                    fontName: self.font.fontInformation.name
                };
            }
            return { width: width };
        }
        function doImage1(name, x, y, test) {
            linkName = name;
        }
        function doImage2(path, x, y, test) {
            if (!test) {
                if (self.formatTextImages && self.formatTextImages[path]) {
                    var image = self.formatTextImages[path];
                    self.pasteCanvas(image, { x: position.x, y: y, width: image.width, height: image.height });
                    return { width: image.width, height: image.height };
                }
                self.context.strokeStyle = self.context.fillStyle;
                self.context.lineWidth = (self.scale.x + self.scale.y) / 1.5;
                self.context.strokeRect(x, y, 128, 128);
            }
            return { width: 128, height: 128 };
        }
        function doUnderscore(parameter, x, y, test) {
            underscore = parameter;
        }
        function doLine(parameter, x, y, test) {
            if (!test) {
                self.context.strokeStyle = self.context.fillStyle;
                self.context.lineWidth = (self.scale.x + self.scale.y) / 1.5;
                self.context.setLineDash(self.linePattern);

                self.context.beginPath();
                self.context.moveTo(0, (y + self.fontHeight / 2) * self.scale.y);
                self.context.lineTo(dimension.width * self.scale.x, (y + self.fontHeight / 2) * self.scale.y);
                self.context.stroke();
            }
            return { width: dimension.width, height: self.fontHeight };
        }
        function doBullet(parameter, x, y, test) {
            var paint = self.paint;
            self.paint = true;
            var ray = self.fontHeight / 6;
            if (!test)
                self.ellipse({ x: position.x + 16, y: y + self.fontHeight / 2, width: ray, height: ray });
            self.paint = paint;
            return { width: 32, height: 0 };
        }
        function doList(parameter, x, y, test) {
            if (parameter == 1)
                self.listCount = 1;
            var width = fillIt(self.listCount++ + '.', x, y, test);
            return { width: width, height: 0 };
        }
        var jumpTable =
        {
            'IN': doInk,
            'IT': doItalic,
            'BO': doBold,
            'SF': doSetFont,
            'SS': doSetFontSize,
            'SA': doAlpha,
            'Z1': doZone1,
            'Z2': doZone2,
            'I1': doImage1,
            'I2': doImage2,
            'K1': doLink1,
            'K2': doLink2,
            'BU': doBullet,
            'LN': doLine,
            'LI': doList,
            'UN': doUnderscore
        };

        position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
        position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
        if (dimension.width <= 0 || dimension.height <= 0)
            throw { error: 'illegal_function_call', parameters: [dimension.width, dimension.height] };

        var textAlign = "left";
        var textBaseLine = "alphabetic";
        var direction = "inherit";
        var interline = this.fontHeight / 4;
        var isHTML = false;
        var isMD = false;
        var animate = false;
        var resetAnimate = false;
        var waiting = false;
        if (align) {
            var temp;
            if (this.utilities.isTag(align, 'waiting'))
                waiting = true;
            if ((temp = this.utilities.getTag(align, ['left', 'center', 'right', 'start', 'end'])) != '')
                textAlign = temp;
            if ((temp = this.utilities.getTag(align, ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'])) != '')
                textBaseLine = temp;
            if ((temp = this.utilities.getTag(align, ['ltr', 'rtl', 'inherit'])) != '')
                direction = temp;
            if ((temp = this.utilities.getTag(align, ['html'])) != '')
                isHTML = true;
            if ((temp = this.utilities.getTag(align, ['md'])) != '')
                isMD = true;
            if ((temp = this.utilities.getTag(align, ['nozones'])) != '')
                noZones = true;
            if ((temp = this.utilities.getTag(align, ['animate'])) != '')
                animate = true;
            if ((temp = this.utilities.getTag(align, ['resetanimate'])) != '')
                resetAnimate = true;
            if (this.utilities.isTag(align, ['interline'])) {
                interline = this.utilities.getTagParameter(align, 'interline');
            }
        }
        if (animate || resetAnimate) {
            if (!this.formatTextZones || resetAnimate) {
                this.formatTextZones = [];
                this.formatTextZonesCount = 0;
            }
        }

        // Cut in lines
        var lines;
        if (isMD)
            lines = convertMD(text);
        else if (isHTML)
            lines = convertHTML(text);
        else {
            lines = [];

            var currentPosition = 0;
            var cr = text.indexOf('\n');
            while (cr >= 0) {
                var line = text.substring(currentPosition, cr);
                currentPosition = cr + 1;
                if (text.charAt(currentPosition) == '\r')
                    currentPosition++;							// We never know! :)
                lines.push(line);
                cr = text.indexOf('\n', currentPosition);
            }
            if (currentPosition < text.length)
                lines.push(text.substring(currentPosition));
        }

        // Load eventual images
        this.formatTextDone = false;
        if (waiting && loadImagesList.length) {
            for (var i = 0; i < loadImagesList.length; i++) {
                var path = loadImagesList[i];
                if (self.formatTextImages && self.formatTextImages[path])
                    continue;

                imagesToLoad++;
                var descriptor = self.tvc.filesystem.getFile(path);
                self.tvc.filesystem.loadFile(descriptor, { responseType: 'binary' }, function (response, arrayBuffer, extra) {
                    if (response) {
                        var blob = new Blob([arrayBuffer], { type: 'image/png' });
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL(blob);
                        var image = new Image();
                        image.onload = function () {
                            self.formatTextImages[extra] = this;
                            imagesLoaded++;
                            if (imagesLoaded == imagesToLoad) {
                                var height = displayLines();
                                self.endDrawing();
                                self.tvc.currentSection.waitThis = self;
                                self.tvc.currentSection.waiting = self.formatTextWait;
                                self.formatTextDone = true;
                                self.formatTextResult = height;
                            }
                        }
                        image.src = imageUrl;
                    }
                }, path);
            }
            return 0;
        }
        else {
            var height = displayLines();
            this.endDrawing();
            if (waiting) {
                this.tvc.currentSection.waitThis = this;
                this.tvc.currentSection.waiting = this.formatTextWait;
                this.formatTextResult = height;
                this.formatTextDone = true;
            }
        }
        return height;

        // Display each lines...
        function displayLines() {
            var height = 0;
            for (var l = 0; l < lines.length; l++)
                height += format(lines[l], position.x, position.y + height, dimension.width, dimension.height, textAlign, textBaseLine);
            return height;
        }
        function format(text, x, y, w, h, align, baseLine) {
            const spl = interline;
            align = typeof align == 'undefined' ? 'left' : align;
            baseLine = typeof baseLine == 'undefined' ? 'left' : baseLine;

            var split_lines = function (mw, text) {
                var words: any[] = [];
                var escape = text.indexOf(String.fromCharCode(27));
                while (escape >= 0) {
                    if (escape > 0) {
                        words = words.concat(text.substring(0, escape).split(' '));
                        text = text.substring(escape);
                    }
                    var cr = text.indexOf(String.fromCharCode(13));
                    words.push(text.substring(0, cr + 1));
                    text = text.substring(cr + 1);
                    escape = text.indexOf(String.fromCharCode(27));
                }
                if (text.length > 0)
                    words = words.concat(text.split(' '));

                var new_line = '';
                var lines: any = [];
                var width = 0;
                for (var i = 0; i < words.length; ++i) {
                    var word = words[i];

                    var position = 0;
                    while (position < word.length) {
                        var cCode = word.charCodeAt(position++);
                        if (cCode == 27) {
                            var func = jumpTable[word.substr(position, 2)];
                            if (func) {
                                var end = word.indexOf('\r', position);
                                if (end >= 0) {
                                    position--;
                                    word = word.substring(0, position) + word.substring(end + 1);
                                }
                            }
                        }
                    }
                    var wordWidth = self.tvc.fonts.getTextLength(word, self.font, self.fontHeight);
                    width += wordWidth + spaceWidth;
                    if (width < mw + spaceWidth) {
                        new_line += words[i] + " ";
                    }
                    else {
                        lines.push(new_line);
                        new_line = words[i] + " ";
                        width = wordWidth + spaceWidth;
                    }
                }
                lines.push(new_line);
                return lines;
            }

            var ly = y;
            var lyStart = ly;
            var lines = split_lines(w, text);
            var both = lines.length * (self.fontHeight + spl);
            if (typeof dimension.height != 'undefined') {
                self.context.textAlign = 'left';
                self.context.textBaseline = 'top';
                self.context.direction = 'inherit';
                self.context.fillStyle = color;
                self.context.globalAlpha = alpha;
                self.context.font = self.utilities.getFontString(self.font.fontInformation.name, self.fontHeight * self.scale.x, self.fontWeight, self.fontItalic);

                if (both >= h) {
                    // Clip context
                    self.context.save();
                    self.context.rect(x, y, w, h);
                    self.context.clip();
                }

                if (baseLine == 'middle')
                    ly = (h - both) / 2 + y + spl * lines.length;
                if (baseLine == 'bottom')
                    ly = y + h - both;
                if (align == 'center') {
                    for (var j = 0; j < lines.length; j++) {
                        var lx = x + w / 2 - textWidth(lines[j]) / 2;
                        ly += fillText(lines[j], lx, ly);
                    }
                }
                else if (align == 'right') {
                    for (var j = 0; j < lines.length; j++) {
                        var lx = x + w - textWidth(lines[j]);
                        ly += fillText(lines[j], lx, ly);
                    }
                }
                else	// left
                {
                    for (var j = 0; j < lines.length; j++) {
                        ly += fillText(lines[j], x, ly);
                    }
                }

                // Restore clipping
                if (both >= h) {
                    self.context.restore();
                }
            }
            return ly - lyStart;

            function textWidth(text) {
                var position = 0;
                var line = '';
                var width = 0;
                while (position < text.length) {
                    var c = text.charAt(position);
                    var cCode = text.charCodeAt(position++);
                    if (cCode >= 32)
                        line += c;
                    else if (cCode == 27) {
                        var func = jumpTable[text.substr(position, 2)];
                        if (func) {
                            var end = text.indexOf('\r', position);
                            if (end >= 0) {
                                var parameter;
                                if (end > position + 2) {
                                    parameter = parseInt(text.substring(position + 2, end));
                                    if (isNaN(parameter)) {
                                        parameter = text.substring(position + 2, end);
                                    }
                                }
                                position = end + 1;
                                if (line != '') {
                                    width += fillIt(line, 0, 0, true);
                                    line = '';
                                }
                                var info = func(parameter, x, y, true);
                                if (info) {
                                    if (info.width)
                                        width += info.width;
                                }
                                continue;
                            }
                        }
                    }
                }
                if (line != '')
                    width += fillIt(line, 0, 0, true);
                return width;
            };
            function fillText(text, x, y) {
                var yStart = y;
                var position = 0;
                var line = '';
                while (position < text.length) {
                    var c = text.charAt(position);
                    var cCode = text.charCodeAt(position++);
                    if (cCode >= 32)
                        line += c;
                    else if (cCode == 27) {
                        var func = jumpTable[text.substr(position, 2)];
                        if (func) {
                            var end = text.indexOf('\r', position);
                            if (end >= 0) {
                                var parameter;
                                if (end > position + 2) {
                                    parameter = parseInt(text.substring(position + 2, end));
                                    if (isNaN(parameter)) {
                                        parameter = text.substring(position + 2, end);
                                    }
                                }
                                position = end + 1;
                                if (line != '') {
                                    x = fillIt(line, x, y);
                                    line = '';
                                }
                                var info = func(parameter, x, y);
                                if (info) {
                                    if (info.width)
                                        x += info.width;
                                    if (info.height)
                                        y += info.height;
                                }
                                continue;
                            }
                        }
                    }
                }
                if (line != '') {
                    fillIt(line, x, y);
                    return y + self.fontHeight + spl - yStart;
                }
                return y - yStart;
            }
        }
        function convertHTML(text) {
            return text;
        }
        function convertMD(text) {
            var line: any[] = [];
            var headerZoom = 3;
            var isBold = false;
            var isItalic = false;
            var lineStart = 0;
            var endOfLine: any = undefined;
            var escapeChar = String.fromCharCode(27);
            var codeMode = false;

            while (true) {
                var result = '';
                var position = 0;
                var quit = false;
                var lf = text.indexOf('\n', lineStart + position);
                while (lineStart + position < text.length && !quit) {
                    var c = text.charAt(lineStart + position);
                    var cCode = text.charCodeAt(lineStart + position);
                    if (codeMode) {
                        switch (cCode) {
                            case 96:		// '`'
                                var start = position;
                                while (lineStart + position < text.length && text.charAt(lineStart + position) == '`')
                                    position++;
                                if (position - start >= 3) {
                                    codeMode = false;
                                    result += escapeChar + 'SF' + textFont + '\r' + escapeChar + 'SS' + + textFontHeight + '\r';
                                    quit = true;
                                }
                                break;
                            case 9:
                                for (var t = 0; t < 4; t++)
                                    result += String.fromCharCode(160);
                                break;
                            case 32:
                                result += String.fromCharCode(160);
                                break;
                            case 13:
                                break;
                            case 10:
                                quit = true;
                                break;
                            default:
                                result += c;
                                break;
                        }
                    }
                    else {
                        switch (cCode) {
                            case 35: 			// '#'
                                if (position == 0) {
                                    while (text.charAt(lineStart + position) == '#')
                                        position++;
                                    var n = position - lineStart;
                                    result += escapeChar + 'SS' + self.fontHeight * (n * headerZoom / 6) + '\r' + escapeChar + 'BO1\r';
                                    endOfLine = escapeChar + 'SS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
                                    continue;
                                }
                                result += c;
                                break;
                            case 60: 			// '<':
                                var pos = text.indexOf('<br>', lineStart);
                                if (pos < 0)
                                    pos = text.indexOf('<BR>', lineStart);
                                if (lf < 0 || (lf > 0 && pos < lf)) {
                                    quit = true;
                                    break;
                                }
                                result += c;
                                break;
                            case 64:			// '=':
                            case 45:			// '-':
                            case 150:			// '–':
                            case 43:			// '+':
                            case 42: 			// '*':
                                // List?
                                if (position == 0 && lineStart + 1 < text.length && text.charAt(lineStart + 1) == ' ') {
                                    if (endOfLine)
                                        result += endOfLine;
                                    endOfLine = undefined;
                                    lines.push(result);
                                    result = escapeChar + 'BU\r';
                                    position++;
                                    break;
                                }
                                else if (cCode == 64 || cCode == 45) {
                                    var start = position;
                                    while (text.charCodeAt(lineStart + position) == cCode)
                                        position++;
                                    if (cCode == 45 && position - start >= 3) {
                                        result += escapeChar + 'LN\r';
                                        quit = true;
                                        break;
                                    }
                                    break;
                                }
                                result = c;
                                break;
                            case 95: 			// '_':
                                var n = 0;
                                while (position + n < text.length && text.charCodeAt(lineStart + position + n) == cCode)
                                    n++;
                                if (n == 1 || n == 3) {
                                    isItalic = !isItalic;
                                    result += escapeChar + 'IT' + (isItalic ? '1' : '0') + '\r';
                                    position += n - 1;
                                    break;
                                }
                                if (n == 2 || n == 3) {
                                    isBold = !isBold;
                                    result += escapeChar + 'BO' + (isBold ? '1' : '0') + '\r';
                                    position += n - 1;
                                    break;
                                }
                                result += c;
                                break;
                            case 49:
                                if (position == 0 && lineStart + 1 < text.length && text.charAt(lineStart + 1) == '.')
                                    listCount = 1;
                            case 48:
                            case 50:
                            case 51:
                            case 52:
                            case 53:
                            case 54:
                            case 55:
                            case 56:
                            case 57:
                                if (position == 0 && lineStart + 1 < text.length && text.charAt(position + 1) == '.') {
                                    result += escapeChar + 'LI' + listCount + '\r';
                                    listCount++;
                                    break;
                                }
                                result += c;
                                break;
                            case 96:		// '`'
                                if (position == 0) {
                                    var start = position;
                                    while (lineStart + position < text.length && text.charAt(lineStart + position) == '`')
                                        position++;
                                    if (position - start >= 3) {
                                        codeMode = true;
                                        result += escapeChar + 'SF' + codeFont + '\r' + escapeChar + 'SS' + + codeFontHeight + '\r';
                                        if (endOfLine)
                                            result += endOfLine;
                                        endOfLine = undefined;
                                        lines.push(result);
                                        result = '';
                                        quit = true;
                                        break;
                                    }
                                }
                                result += "`";
                                break;
                            case 33:		// '!'
                                if (text.indexOf('[', lineStart + position) == lineStart + position + 1) {
                                    var end = text.indexOf(']', lineStart + position)
                                    if (lf < 0 || (lf > 0 && end < lf)) {
                                        var r = escapeChar + 'I1' + text.substring(lineStart + position + 2, end) + '\r';
                                        position = end - lineStart;
                                        var link = '';
                                        if (text.charAt(lineStart + position + 1) == '(') {
                                            end = text.indexOf(')', lineStart + position);
                                            if (lf < 0 || (lf > 0 && end < lf)) {
                                                link = text.substring(lineStart + position + 2, end).trim();
                                                loadImagesList.push(link);
                                                position = end - lineStart;
                                            }
                                        }
                                        r += escapeChar + 'I2' + link + '\r';
                                        if (endOfLine)
                                            result += endOfLine;
                                        endOfLine = undefined;
                                        if (result.length)
                                            lines.push(result);
                                        result = r;
                                        quit = true;
                                        break;
                                    }
                                }
                                result += c;
                                break;
                            case 91:		// '['
                                var end = text.indexOf(']', lineStart + position)
                                if (lf < 0 || (lf > 0 && end < lf)) {
                                    var tempResult = escapeChar + 'K1' + text.substring(lineStart + position + 1, end) + '\r';
                                    var tempPosition = end - lineStart;
                                    if (text.indexOf('(', lineStart + tempPosition) == lineStart + tempPosition + 1) {
                                        var link = '';
                                        end = text.indexOf(')', lineStart + tempPosition);
                                        if (lf < 0 || (lf > 0 && end < lf)) {
                                            link = text.substring(lineStart + position + 2, end).trim();
                                            position = end - lineStart;
                                        }
                                        result += tempResult + escapeChar + 'K2' + link + '\r';
                                        break;
                                    }
                                }
                                result += c;
                                break;
                            case 10:
                                if (position == 0)
                                    quit = true;
                                else {
                                    lineStart += position + 1;
                                    lf = text.indexOf('\n', lineStart);
                                    position = -1;
                                }
                                break;
                            case 13:
                                break;
                            default:
                                if (position == 0) {
                                    if (lf >= 0 && text.indexOf('==', lf) == lf + 1) {
                                        result += escapeChar + 'FS' + self.fontHeight * headerZoom + '\r' + escapeChar + 'BO1\r';
                                        endOfLine = escapeChar + 'FS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
                                    }
                                    if (lf >= 0 && text.indexOf('--', lf) == lf + 1) {
                                        result += escapeChar + 'FS' + self.fontHeight * headerZoom * (5 / 6) + '\r' + escapeChar + 'BO1\r';
                                        endOfLine = escapeChar + 'FS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
                                    }
                                }
                                result += c;
                                break;
                        }
                    }
                    position++;
                }
                if (endOfLine)
                    result += endOfLine;
                lines.push(result);

                if (lf < 0)
                    break;
                lineStart = lf + 1;
            }
            return lines;
        }
    }
    public formatTextWait() {
        return this.formatTextDone;
    }

    public textBase() {
        return this.tvc.fonts.getBaseLine(this.font, this.fontHeight);
    }


}

export class ScreenEmpty {
    private emptyScreen: boolean = false;
    public constructor(self?) {
        this.emptyScreen = true;
    }
}