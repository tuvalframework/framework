import { int } from '../float';
import { TVC } from './TVC';
import { Screen } from './Screen';
import { Utilities } from './Utilities';

(String.prototype as any).strReplace = function (strSearch, strReplace) {
    var newStr = '';
    for (let n = 0; n < this.length; n++) {
        var part = this.substr(n, strSearch.length);
        if (part == strSearch) {
            newStr = newStr + strReplace;
            n = n + (strSearch.length - 1);
        }
        else {
            newStr = newStr + part.substr(0, 1);
        }
    }

    return newStr;
}

export class TextWindow {
    tvc: TVC;
    screen: Screen;
    utilities: Utilities;
    contextName: string;
    font: any;
    fontString: string;
    fontWidth: number;
    fontHeight: number;
    width: any;
    height: any;
    x: any;
    y: any;
    border: any;
    lineWidth: any;
    lineHeight: any;
    xInside: number;
    yInside: number;
    pen: number;
    paper: number;
    writing: any;
    oldPaper: number;
    oldPen: number;
    oldWriting: number;
    xCursor: number;
    yCursor: number;
    focus: boolean;
    scrollOn: boolean;
    tab: number;
    borderPaper: number;
    borderPen: number;
    titleTop: string;
    titleBottom: string;
    memoryX: number;
    memoryY: number;
    activated: boolean;
    cursorCanvas: HTMLCanvasElement;
    cursorContext: CanvasRenderingContext2D;
    cursorActive: any;
    cursorCount: number;
    cursorFlashCount: number;
    cursorFlash: any;
    cursorImage: any;
    cursorImageCanvas: HTMLCanvasElement = undefined as any;
    cursorImageContext: CanvasRenderingContext2D = undefined as any;
    cursorHandle: any;
    lines: any[];
    linePens: any[];
    linePapers: any[];
    lineWritings: any[];
    cursorActiveSave: any;
    private _cursPen: number = undefined as any;
    cursorRed: any;
    cursorGreen: any;
    cursorBlue: any;
    yCursorAnchor: number = undefined as any; saveWidth: any;
    saveHeight: any;
    saveCanvas: HTMLCanvasElement = undefined as any;
    number: any;
    ;

    public constructor(tvc: TVC, screen: Screen, contextName: string, definition: any) {
        this.tvc = tvc;
        this.screen = screen;
        this.utilities = tvc.utilities;
        this.contextName = contextName;

        // Font
        this.font = this.tvc.fonts.windowFonts[contextName];
        this.fontString = this.utilities.getFontString(this.font.fontInformation.name, definition.font.height, definition.font.weight, definition.font.italic, definition.font.stretch);

        // Get the original fontWidth and fontHeight out of the manifest
        this.fontWidth = (this.tvc.manifest.default.screen.width / this.tvc.manifest.default.screen.window.width);
        this.fontHeight = (this.tvc.manifest.default.screen.height / this.tvc.manifest.default.screen.window.height);

        // Get the actual width and height
        if (definition.width)
            this.width = definition.width;
        else
            this.width = Math.floor(screen.dimension.width / this.fontWidth);
        if (definition.height)
            this.height = definition.height;
        else
            this.height = Math.floor(screen.dimension.height / this.fontHeight);
        this.x = typeof definition.x != 'undefined' ? definition.x : 0;
        this.y = typeof definition.y != 'undefined' ? definition.y : 0;
        this.border = typeof definition.border != 'undefined' ? definition.border : 0;
        this.lineWidth = this.border == 0 ? this.width : this.width - 2;
        this.lineHeight = this.border == 0 ? this.height : this.height - 2;
        if (this.width <= 0)
            throw 'text_window_too_small';
        if (this.height <= 0)
            throw 'text_window_too_small';
        this.x = this.x & 0xFFFFFFF0;
        if (this.border)
            this.x += this.fontWidth;
        if (this.x < 0 || this.x + this.width * this.fontWidth > this.screen.dimension.width)
            throw 'text_window_too_large';
        if (this.y < 0 || this.y + this.height * this.fontHeight > this.screen.dimension.height)
            throw 'text_window_too_large';
        if (this.border < 0 || this.border > 15)
            throw { error: 'illegal_text_window_parameter', parameter: this.border };
        this.xInside = 0;
        this.yInside = 0;
        if (this.border) {
            this.xInside = 1;
            this.yInside = 1;
        }

        // Other properties
        this.pen = typeof definition.pen != 'undefined' ? (definition.pen % 32) : 2;
        this.paper = typeof definition.paper != 'undefined' ? (definition.paper % 32) : 1;
        this.writing = TextWindow.FLAG_NORMAL;
        this.oldPaper = -1;
        this.oldPen = -1;
        this.oldWriting = -1;
        this.xCursor = 0;
        this.yCursor = 0;
        this.focus = true;
        this.scrollOn = true;
        this.tab = 4;
        this.borderPaper = 1;
        this.borderPen = 2;
        this.titleTop = '';
        this.titleBottom = '';
        this.memoryX = 0;
        this.memoryY = 0;
        this.activated = true;

        // Cursor
        this.cursorCanvas = document.createElement('canvas');
        this.cursorCanvas.width = Math.max(Math.floor(this.fontWidth * this.screen.scale.x), 1);
        this.cursorCanvas.height = Math.max(Math.floor(this.fontHeight * this.screen.scale.y), 1);
        this.cursorContext = this.cursorCanvas.getContext('2d')!;

        this.cursorActive = this.tvc.manifest.default.screen.window.cursorOn;
        this.cursorCount = 1;
        this.cursorFlashCount = -1;
        this.cursorFlash = this.tvc.manifest.default.screen.window.cursorColors;
        var self = this;
        this.utilities.loadUnlockedImage('./run/resources/cursor.js', { type: 'image/png' }, function (response, image, extra) {
            if (response) {
                self.cursorImage = image;
                self.cursorImageCanvas = document.createElement('canvas');
                self.cursorImageCanvas.width = image.width;
                self.cursorImageCanvas.height = image.height;
                self.cursorImageContext = self.cursorImageCanvas.getContext('2d')!;
            }
        });

        // Cursor animation
        var self = this;
        this.cursorHandle = setInterval(function () {
            if (self.activated && self.cursorImage) {
                // Boot: save behind the cursor first
                if (self.cursorFlashCount < 0) {
                    var x = (self.x + (self.xInside + self.xCursor) * self.fontWidth) * self.screen.scale.x;
                    var y = (self.y + (self.yInside + self.yCursor) * self.fontHeight) * self.screen.scale.y;
                    self.cursorContext.drawImage(self.screen.canvas, x, y, self.cursorCanvas.width, self.cursorCanvas.height, 0, 0, self.cursorCanvas.width, self.cursorCanvas.height);
                }

                // Cycle through animation
                self.cursorFlashCount++;
                if (self.cursorFlashCount >= self.cursorFlash.length)
                    self.cursorFlashCount = 0;

                // Remap image of cursor to new color
                self.cursorImageContext.clearRect(0, 0, (self.cursorImageContext as any).width, (self.cursorImageContext as any).height);
                self.cursorImageContext.drawImage(self.cursorImage, 0, 0);
                self.utilities.remapBlock(self.cursorImageContext, [{ r: 255, g: 255, b: 255 }], [self.cursorFlash[self.cursorFlashCount]], { x: 0, y: 0, width: self.cursorImageCanvas.width, height: self.cursorImageCanvas.height });
                self.cursorDraw();
            }
        }, 40);

        // Text save buffer
        this.lines = [];
        this.linePens = [];
        this.linePapers = [];
        this.lineWritings = [];

        // Clear
        this.clw();

        // Flashing cursor
    }

    public resize() {
        this.width = Math.floor(this.screen.dimension.width / this.fontWidth);
        this.height = Math.floor(this.screen.dimension.height / this.fontHeight);
        this.lineWidth = this.border == 0 ? this.width : this.width - 2;
        this.lineHeight = this.border == 0 ? this.height : this.height - 2;
        if (this.width <= 0)
            throw 'text_window_too_small';
        if (this.height <= 0)
            throw 'text_window_too_small';
        this.x = this.x & 0xFFFFFFF0;
        if (this.border)
            this.x += this.fontWidth;
        if (this.x < 0 || this.x + this.width * this.fontWidth > this.screen.dimension.width)
            throw 'text_window_too_large';
        if (this.y < 0 || this.y + this.height * this.fontHeight > this.screen.dimension.height)
            throw 'text_window_too_large';
        if (this.border < 0 || this.border > 15)
            throw { error: 'illegal_text_window_parameter', parameter: this.border };
        this.xInside = 0;
        this.yInside = 0;
        if (this.border) {
            this.xInside = 1;
            this.yInside = 1;
        }

        // Reset text save buffer
        this.lines = [];
        this.linePens = [];
        this.linePapers = [];
        this.lineWritings = [];
        this.clw(undefined, true);
    };

    // Writing flags
    private static FLAG_INVERSE: int = 0x0001;
    private static FLAG_UNDER: int = 0x0002;
    private static FLAG_SHADE: int = 0x0004;
    private static FLAG_BOLD: int = 0x0008;
    private static FLAG_ITALIC: int = 0x0010;
    private static FLAG_REPLACE: int = 0x0020;
    private static FLAG_OR: int = 0x0040;
    private static FLAG_XOR: int = 0x0080;
    private static FLAG_AND: int = 0x0100;
    private static FLAG_IGNORE: int = 0x0200;
    private static FLAG_NORMAL: int = 0x0400;
    private static FLAG_ONLYPAPER: int = 0x0800;
    private static FLAG_ONLYPEN: int = 0x1000;
    private static FLAG_SHADOW: int = 0x2000;
    private static MASK_WRITING1: int = (TextWindow.FLAG_REPLACE | TextWindow.FLAG_OR | TextWindow.FLAG_XOR | TextWindow.FLAG_XOR | TextWindow.FLAG_AND);
    private static MASK_WRITING2: int = (TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPAPER | TextWindow.FLAG_ONLYPEN | TextWindow.FLAG_SHADOW);

    public forceCursor() {
        this.cursorActiveSave = this.cursorActive;
        this.cursorActive = true;
    }
    public restoreCursor() {
        this.cursorActive = this.cursorActiveSave;
    }

    public cursorOff() {
        this.cursorCount--;
        if (this.cursorCount == 0 && this.cursorActive && this.activated) {
            var x = (this.x + (this.xInside + this.xCursor) * this.fontWidth) * this.screen.scale.x;
            var y = (this.y + (this.yInside + this.yCursor) * this.fontHeight) * this.screen.scale.y;
            this.screen.context.drawImage(this.cursorCanvas, x, y);
            this.screen.setModified();
        }
    }

    public cursorOn() {
        this.cursorCount++;
        if (this.cursorCount == 1 && this.cursorActive && this.activated) {
            var x = (this.x + (this.xInside + this.xCursor) * this.fontWidth) * this.screen.scale.x;
            var y = (this.y + (this.yInside + this.yCursor) * this.fontHeight) * this.screen.scale.y;
            this.cursorContext.drawImage(this.screen.canvas, x, y, this.cursorCanvas.width, this.cursorCanvas.height, 0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
        }
    };
    private cursorDraw() {
        if (this.cursorCount == 1 && this.cursorActive && this.activated && this.cursorImageCanvas) {
            var x = (this.x + (this.xInside + this.xCursor) * this.fontWidth) * this.screen.scale.x;
            var y = (this.y + (this.yInside + this.yCursor) * this.fontHeight) * this.screen.scale.y;
            this.screen.context.drawImage(this.cursorCanvas, x, y);
            this.screen.context.drawImage(this.cursorImageCanvas, 0, 0, this.cursorImageCanvas.width, this.cursorImageCanvas.height, x, y, this.fontWidth * this.screen.scale.x, this.fontHeight * this.screen.scale.y);
            this.screen.setModified();
        }
    };
    private setCursPen(pen) {
        this.cursorOff();
        this._cursPen = pen % this.screen.vars.numberOfColors;
        var colors = this.utilities.getRGBAStringColors(this.screen.getColorString(this._cursPen));
        this.cursorRed = colors.r;
        this.cursorGreen = colors.g;
        this.cursorBlue = colors.b;
        this.cursorOn();
    };
    private setCurs(array) {
        this.cursorOff();
        var canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        var context = canvas.getContext('2d')!;
        context.fillStyle = '#FFFFFF';
        for (var y = 0; y < array.length; y++) {
            var line = array[y];
            if (line) {
                var mask = 0x80;
                for (var x = 0; x < 8; x++) {
                    if ((line & mask) != 0) {
                        context.fillRect(x, y, 1, 1);
                    }
                    mask >>= 1;
                }
            }
        }
        /*
        var imageData = context.getImageData( 0, 0, 8, 8 );
        var imageBytes = imageData.data;
        for ( var y = 0; y < array.length; y++ )
        {
            var line = array[ y ];
            if ( line )
            {
                var mask = 0x80;
                for ( var x = 0; x < 8; x++ )
                {
                    if ( ( line & mask ) != 0 )
                    {
                        imageBytes[ ( y * 8 + x ) * 4 ] = 255;
                        imageBytes[ ( y * 8 + x ) * 4 + 1 ] = 255;
                        imageBytes[ ( y * 8 + x ) * 4 + 2 ] = 255;
                    }
                    mask >>= 1;
                }
            }
        }
        context.putImageData( imageData, 0, 0 );
        */
        this.cursorImage = canvas;
        this.cursorImageCanvas = document.createElement('canvas');
        this.cursorImageCanvas.width = canvas.width;
        this.cursorImageCanvas.height = canvas.height;
        this.cursorImageContext = this.cursorImageCanvas.getContext('2d')!;
        this.cursorOn();
    }

    public close() {
        clearInterval(this.cursorHandle);
    }
    private clw(paper?, noFill?) {
        // Reset the save buffers
        var line = '';
        var linePen = '';
        var linePaper = '';
        var lineWriting = '';
        for (var l = 0; l < this.lineWidth; l++) {
            line += ' ';
            linePen += String.fromCharCode(this.pen + 32);
            linePaper += String.fromCharCode(this.paper + 32);
            lineWriting += String.fromCharCode(this.writing);
        }
        for (var l = 0; l < this.lineHeight; l++) {
            this.lines[l] = line;
            this.linePapers[l] = linePaper;
            this.linePens[l] = linePen;
            this.lineWritings[l] = lineWriting;
        }

        // Cursor on top left
        this.xCursor = 0;
        this.yCursor = 0;
        this.yCursorAnchor = 0;

        if (!noFill) {
            this.cursorOff();
            if (typeof paper != 'undefined')
                this.paper = paper;
            this.screen.context.fillStyle = this.screen.getColorString(this.paper);
            this.screen.context.fillRect((this.x + this.xInside * this.fontWidth) * this.screen.scale.x, (this.y + this.yInside * this.fontHeight) * this.screen.scale.y, this.lineWidth * this.fontWidth * this.screen.scale.x, this.lineHeight * this.fontHeight * this.screen.scale.y);
            this.drawBorders();
            this.cursorOn();

        }
        this.screen.setModified();
    };
    private windSave() {
        this.cursorOff();

        var x = (this.x + this.xInside * this.fontWidth) * this.screen.scale.x;
        var y = (this.y + this.yInside * this.fontHeight) * this.screen.scale.y;
        var width = this.lineWidth * this.fontWidth * this.screen.scale.x;
        var height = this.lineHeight * this.fontHeight * this.screen.scale.y;
        this.saveWidth = this.lineWidth;
        this.saveHeight = this.lineHeight;

        this.saveCanvas = document.createElement('canvas')!;
        this.saveCanvas.width = width;
        this.saveCanvas.height = height;
        var context = this.saveCanvas.getContext('2d')!;
        context.drawImage(this.screen.canvas, x, y, width, height, 0, 0, width, height);

        this.cursorOn();
    };
    private restore() {
        this.cursorOff();
        if (this.saveCanvas) {
            if (this.saveWidth == this.lineWidth && this.saveHeight == this.lineHeight) {
                var x = (this.x + this.xInside * this.fontWidth) * this.screen.scale.x;
                var y = (this.y + this.yInside * this.fontHeight) * this.screen.scale.y;
                var width = this.lineWidth * this.fontWidth * this.screen.scale.x;
                var height = this.lineHeight * this.fontHeight * this.screen.scale.y;
                this.screen.context.drawImage(this.saveCanvas, 0, 0, this.saveCanvas.width, this.saveCanvas.height, x, y, width, height);
            }
            else {
                this.restoreText();
            }
        }
        else {
            this.restoreText();
        }
        this.drawBorders();
        this.cursorOn();
        this.screen.setModified();
    };
    private windon() {
        return this.number;
    };
    private windMove(position) {
        if (this.number === 0)
            throw { error: 'illegal_text_window_parameter', parameter: this.number };

        var x = typeof position.x != 'undefined' ? position.x : this.x;
        var y = typeof position.y != 'undefined' ? position.y : this.y;
        x &= 0xFFFFFFF0;
        if (this.border)
            x += this.fontWidth;
        if (x < 0 || x + this.width * this.fontWidth > this.screen.dimension.width)
            throw 'text_window_too_large';
        if (y < 0 || y + this.height * this.fontHeight > this.screen.dimension.height)
            throw 'text_window_too_large';

        if (this.x != x || this.y != y) {
            this.cursorOff();
            this.screen.restoreWindows();
            this.x = x;
            this.y = y;
            this.restore();
            this.cursorOn();
        }
    };
    private windSize(dimension) {
        dimension.width = typeof dimension.width != 'undefined' ? dimension.width : this.width;
        dimension.height = typeof dimension.height != 'undefined' ? dimension.height : this.height;

        if (dimension.width <= 0)
            throw 'text_window_too_small';
        if (dimension.height <= 0)
            throw 'text_window_too_small';
        if (this.x + dimension.width * this.fontWidth > this.screen.dimension.width)
            throw 'text_window_too_large';
        if (this.y + dimension.height * this.fontHeight > this.screen.dimension.height)
            throw 'text_window_too_large';

        if (dimension.width != this.width || dimension.height != this.height) {
            this.cursorOff();
            this.screen.restoreWindows();

            this.width = dimension.width;
            this.height = dimension.height;
            var oldLineWidth = this.lineWidth;
            var oldLineHeight = this.lineHeight;
            this.lineWidth = this.border == 0 ? this.width : this.width - 2;
            this.lineHeight = this.border == 0 ? this.height : this.height - 2;

            var line = '';
            var linePen = '';
            var linePaper = '';
            var lineWriting = '';
            if (this.lineWidth > oldLineWidth) {
                for (var c = 0; c < this.lineWidth - oldLineWidth; c++) {
                    line += ' ';
                    linePen += String.fromCharCode(this.pen + 32);
                    linePaper += String.fromCharCode(this.paper + 32);
                    lineWriting += String.fromCharCode(this.writing);
                }
            }
            if (this.lineWidth > oldLineWidth) {
                for (var l = 0; l < Math.min(oldLineHeight, this.lineHeight); l++) {
                    this.lines[l] = this.lines[l] + line;
                    this.linePapers[l] = this.linePapers[l] + linePaper;
                    this.linePens[l] = this.linePens[l] + linePen;
                    this.lineWritings[l] = this.lineWritings[l] + lineWriting;
                }
            }
            else if (this.lineWidth < oldLineWidth) {
                for (var l = 0; l < Math.min(oldLineHeight, this.lineHeight); l++) {
                    this.lines[l] = this.lines[l].substring(0, this.lineWidth);
                    this.linePapers[l] = this.linePapers[l].substring(0, this.lineWidth);
                    this.linePens[l] = this.linePens[l].substring(0, this.lineWidth);
                    this.lineWritings[l] = this.lineWritings[l].substring(0, this.lineWidth);
                }
            }
            if (this.lineHeight > oldLineHeight) {
                line = '';
                linePen = '';
                linePaper = '';
                lineWriting = '';
                for (let c = 0; c < this.lineWidth; c++) {
                    line += ' ';
                    linePen += String.fromCharCode(this.pen + 32);
                    linePaper += String.fromCharCode(this.paper + 32);
                    lineWriting += String.fromCharCode(this.writing);
                }
                for (let l = oldLineHeight; l < this.lineHeight; l++) {
                    this.lines[l] = line;
                    this.linePapers[l] = linePaper;
                    this.linePens[l] = linePen;
                    this.lineWritings[l] = lineWriting;
                }
            }
            else if (this.lineHeight < oldLineHeight) {
                this.lines.length = this.lineHeight;
                this.linePapers.length = this.lineHeight;
                this.linePens.length = this.lineHeight;
                this.lineWritings.length = this.lineHeight;
            }

            if (this.xCursor > this.lineWidth)
                this.xCursor = this.lineWidth - 1;
            if (this.yCursor > this.lineHeight)
                this.yCursor = this.lineHeight - 1;

            this.restore();
            this.cursorOn();
            this.screen.setModified();
        }
    };
    private setTitleTop(title) {
        this.titleTop = title;
        this.drawBorders();
    };
    private setTitleBottom(title) {
        this.titleBottom = title;
        this.drawBorders();
    };
    private setBorder(border, paper, pen) {
        if (border < 0 || border > 15)
            throw { error: 'illegal_text_window_parameter', parameter: border };
        this.border = border;
        if (typeof paper != 'undefined') {
            if (!this.tvc.usePalette)
                this.borderPaper = paper;
            else {
                if (paper < 0)
                    throw { error: 'illegal_text_window_parameter', parameter: paper };
                this.borderPaper = paper % this.screen.vars.numberOfColors;
            }
        }
        if (typeof pen != 'undefined') {
            if (!this.tvc.usePalette)
                this.borderPen = pen;
            else {
                if (pen < 0)
                    throw { error: 'illegal_text_window_parameter', parameter: pen };
                this.borderPen = pen % this.screen.vars.numberOfColors;
            }
        }
        this.drawBorders();
    }

    public activate(noRestore?) {
        this.activated = true;
        if (!noRestore)
            this.restore();
        this.cursorOn();
    }

    public deactivate() {
        this.cursorOff();
        this.activated = false;
    }

    public home() {
        this.cursorOff();
        this.xCursor = 0;
        this.yCursor = 0;
        this.cursorOn();
    }

    private xText(x) {
        return Math.floor((x - this.xInside * this.fontWidth) / this.fontWidth);
    }
    private yText(y) {
        return Math.floor((y - this.yInside * this.fontHeight) / this.fontHeight);
    }
    public setPen(pen) {
        if (!this.tvc.usePalette)
            this.pen = pen;
        else {
            if (pen < 0)
                throw { error: 'illegal_text_window_parameter', parameter: pen };
            this.pen = pen % this.screen.vars.numberOfColors;
        }
    }

    public setPaper(paper) {
        if (!this.tvc.usePalette)
            this.paper = paper;
        else {
            if (paper < 0)
                throw { error: 'illegal_text_window_parameter', parameter: paper };
            this.paper = paper % this.screen.vars.numberOfColors;
        }
    }

    private setWriting(mode1, mode2) {
        mode1 = typeof mode1 == 'undefined' ? 0 : mode1;
        mode2 = typeof mode2 == 'undefined' ? 0 : mode2;
        if (mode1 < 0 || mode1 > 4)
            throw { error: 'illegal_text_window_parameter', parameter: mode1 };
        if (mode2 < 0 || mode2 > 3)
            throw { error: 'illegal_text_window_parameter', parameter: mode2 };

        var modes1 = [TextWindow.FLAG_REPLACE, TextWindow.FLAG_OR, TextWindow.FLAG_XOR, TextWindow.FLAG_AND, TextWindow.FLAG_IGNORE];
        var modes2 = [TextWindow.FLAG_NORMAL, TextWindow.FLAG_ONLYPAPER, TextWindow.FLAG_ONLYPEN, TextWindow.FLAG_SHADOW];
        this.writing = (this.writing & ~(TextWindow.MASK_WRITING1 | TextWindow.MASK_WRITING2)) | modes1[mode1] | modes2[mode2];
    };
    private setText(mode) {
        this.writing = (this.writing & ~TextWindow.FLAG_UNDER) | ((mode & 0x0001) != 0 ? TextWindow.FLAG_UNDER : 0);
        this.writing = (this.writing & ~TextWindow.FLAG_BOLD) | ((mode & 0x0002) != 0 ? TextWindow.FLAG_BOLD : 0);
        this.writing = (this.writing & ~TextWindow.FLAG_ITALIC) | ((mode & 0x0004) != 0 ? TextWindow.FLAG_ITALIC : 0);
    };
    private getTextStyles(mode) {
        var result = (this.writing & TextWindow.FLAG_UNDER) != 0 ? 0x0001 : 0;
        result |= (this.writing & TextWindow.FLAG_BOLD) != 0 ? 0x0002 : 0;
        result |= (this.writing & TextWindow.FLAG_ITALIC) != 0 ? 0x0004 : 0;
        return result;
    }
    public setInverse(onOff) {
        this.writing = (this.writing & ~TextWindow.FLAG_INVERSE) | (onOff ? TextWindow.FLAG_INVERSE : 0);
    }
    private setUnder(onOff) {
        this.writing = (this.writing & ~TextWindow.FLAG_UNDER) | (onOff ? TextWindow.FLAG_UNDER : 0);
    }
    private setShade(onOff) {
        this.writing = (this.writing & ~TextWindow.FLAG_SHADE) | (onOff ? TextWindow.FLAG_SHADE : 0);
    }
    private setScroll(onOff) {
        this.scrollOn = onOff;
    }
    public setCursor(onOff) {
        this.cursorOff();
        this.cursorActive = onOff;
        this.cursorOn();
    }
    private cursorUp() {
        this.cMove({ y: -1 });
    }
    private cursorDown() {
        this.cMove({ y: 1 });
    }
    private cursorLeft() {
        this.cMove({ x: -1 });
    }
    private cursorRight() {
        this.cMove({ x: 1 });
    }
    private cursorMove(distance) {
        this.cMove(distance);
    }
    private cursPen(pen) {
        if (pen < 0 || pen >= this.screen.numberOfColor)
            throw { error: 'illegal_text_window_parameter', parameter: pen };
        var values = this.utilities.getRGBAStringColors(this.screen.getColorString(pen));
        this.cursorRed = values.r;
        this.cursorGreen = values.g;
        this.cursorBlue = values.b;
    };
    private xGraphic(x) {
        if (x < 0 || x >= this.lineWidth)
            throw { error: 'illegal_text_window_parameter', parameter: x };
        return (this.xInside + x) * this.fontWidth;
    };
    private yGraphic(y) {
        if (y < 0 || y >= this.lineHeight)
            throw { error: 'illegal_text_window_parameter', parameter: y };
        return (this.yInside + y) * this.fontHeight;
    };
    private cLine(width) {
        var x;
        if (typeof width != 'undefined') {
            x = this.xCursor;
            if (width + this.xCursor > this.lineWidth)
                width = this.lineWidth - this.xCursor;
        }
        else {
            x = 0;
            width = this.lineWidth;
        }

        if (width > 0) {
            this.cursorOff();
            var space = '';
            for (var c = 0; c < width; c++)
                space += ' ';
            var xSave = this.xCursor;
            this.xCursor = x;
            this.printLine(space, this.paper, this.pen, this.writing, false, false);
            this.xCursor = xSave;
            this.cursorOn();
        }
    };
    private setTab(value) {
        if (value < 0)
            throw { error: 'illegal_text_window_parameter', parameter: value };
        else
            this.tab = value;
    };
    public locate(position) {
        this.cursorOff();
        if (typeof position.x != 'undefined') {
            if (position.x < 0 || position.x >= this.lineWidth)
                throw { error: 'illegal_text_window_parameter', parameter: position.x };
            this.xCursor = position.x;
        }
        if (typeof position.y != 'undefined') {
            if (position.y < 0 || position.y >= this.lineHeight)
                throw { error: 'illegal_text_window_parameter', parameter: position.y };
            this.yCursor = position.y;
        }
        this.cursorOn();
    }
    public anchorYCursor(y?) {
        this.yCursorAnchor = typeof y != 'undefined' ? y : this.yCursor;
    }
    public cMove(displacement) {
        this.cursorOff();
        if (typeof displacement.x != 'undefined') {
            while (displacement.x > 0) {
                displacement.x--;
                this.xCursor += 1;
                if (this.xCursor >= this.lineWidth) {
                    this.xCursor = 0;
                    this.yCursor++;
                    if (this.yCursor >= this.lineHeight - 1)
                        this.scroll({ x: 0, y: -1 }, true);
                }
            }
            while (displacement.x < 0) {
                displacement.x++;
                this.xCursor--;
                if (this.xCursor < 0) {
                    this.xCursor = this.lineWidth - 1;
                    this.yCursor--;
                    if (this.yCursor < 0)
                        this.scroll({ x: 0, y: 1 }, true);
                }
            }
        }
        if (typeof displacement.y != 'undefined') {
            while (displacement.y > 0) {
                this.yCursor++;
                if (this.yCursor >= this.lineHeight)
                    this.scroll({ x: 0, y: -1 }, true);
                displacement.y--;
            }
            while (displacement.y < 0) {
                this.yCursor--;
                if (this.yCursor < 0)
                    this.scroll({ x: 0, y: 1 }, true);
                displacement.y++;
            }
        }
        this.cursorOn();
    };
    private scroll(displacement, moveCursor, position?, size?) {
        this.cursorOff();

        position = typeof position != 'undefined' ? position : {};
        size = typeof size != 'undefined' ? size : {};
        var xScroll = typeof position.x == 'undefined' ? 0 : position.x;
        var yScroll = typeof position.y == 'undefined' ? 0 : position.y;
        var sxScroll = typeof size.width == 'undefined' ? this.lineWidth : size.width;
        var syScroll = typeof size.height == 'undefined' ? this.lineHeight : size.height;
        var width = (sxScroll * this.fontWidth) * this.screen.scale.x;
        var height = (syScroll * this.fontHeight) * this.screen.scale.y;
        var dx = displacement.x;
        var dy = displacement.y;

        // Clip and paste with scrolling
        this.screen.context.save();
        var xClip = (this.x + this.xInside * this.fontWidth) * this.screen.scale.x;
        var yClip = (this.y + this.yInside * this.fontHeight) * this.screen.scale.y;
        var widthClip = this.lineWidth * this.fontWidth * this.screen.scale.x;
        var heightClip = this.lineHeight * this.fontHeight * this.screen.scale.y;
        this.screen.context.beginPath();
        this.screen.context.moveTo(xClip, yClip);
        this.screen.context.lineTo(xClip + widthClip, yClip);
        this.screen.context.lineTo(xClip + widthClip, yClip + heightClip);
        this.screen.context.lineTo(xClip, yClip + heightClip);
        this.screen.context.lineTo(xClip, yClip);
        this.screen.context.clip();
        var sourceX = (this.x + (this.xInside + xScroll + (dx < 0 ? -dx : 0)) * this.fontWidth) * this.screen.scale.x;
        var sourceY = (this.y + (this.yInside + yScroll + (dy < 0 ? -dy : 0)) * this.fontHeight) * this.screen.scale.y;
        var destX = (this.x + (this.xInside + xScroll + (dx > 0 ? dx : 0)) * this.fontWidth) * this.screen.scale.x;
        var destY = (this.y + (this.yInside + yScroll + (dy > 0 ? dy : 0)) * this.fontHeight) * this.screen.scale.y;
        this.screen.context.drawImage(this.screen.canvas, sourceX, sourceY, width, height, destX, destY, width, height);

        // Fill the new areas
        var x = (this.x + (this.xInside + xScroll) * this.fontWidth) * this.screen.scale.x;
        var y = (this.y + (this.yInside + yScroll) * this.fontHeight) * this.screen.scale.x;
        this.screen.context.fillStyle = this.screen.getColorString(this.paper);
        if (dx < 0) {
            var fWidth = -dx * this.fontWidth * this.screen.scale.x;
            this.screen.context.fillRect(x + width - fWidth, y, fWidth, height);
        }
        if (dx > 0) {
            var fWidth = dx * this.fontWidth * this.screen.scale.x;
            this.screen.context.fillRect(x, y, fWidth, height);
        }
        if (dy < 0) {
            var fHeight = -dy * this.fontHeight * this.screen.scale.y;
            this.screen.context.fillRect(x, y + height - fHeight, width, fHeight);
        }
        if (dy > 0) {
            var fHeight = dy * this.fontHeight * this.screen.scale.y;
            this.screen.context.fillRect(x, y, width, fHeight);
        }
        this.screen.context.restore();
        this.screen.setModified();

        // Scroll the save buffers
        var addLine = '';
        var addLinePapers = '';
        var addLinePens = '';
        var addLineWritings = '';
        if (dx) {
            for (var l = 0; l < Math.abs(dx); l++) {
                addLine += ' ';
                addLinePapers += String.fromCharCode(this.paper + 32);
                addLinePens += String.fromCharCode(this.pen + 32);
                addLineWritings += String.fromCharCode(this.writing);
            }
        }
        if (dx < 0) {
            for (let l = yScroll; l < yScroll + syScroll; l++) {
                this.lines[l] = this.lines[l].substring(0, xScroll) + this.lines[l].substr(xScroll - dx, sxScroll + dx) + addLine + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substring(0, xScroll) + this.linePapers[l].substr(xScroll - dx, sxScroll + dx) + addLinePapers + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substring(0, xScroll) + this.linePens[l].substr(xScroll - dx, sxScroll + dx) + addLinePens + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substring(0, xScroll) + this.lineWritings[l].substr(xScroll - dx, sxScroll + dx) + addLineWritings + this.lineWritings[l].substring(xScroll + sxScroll);
            }
        }
        if (dx > 0) {
            for (let l = yScroll; l < yScroll + syScroll; l++) {
                this.lines[l] = this.lines[l].substring(0, xScroll) + addLine + this.lines[l].substr(xScroll, sxScroll - dx) + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substring(0, xScroll) + addLinePapers + this.linePapers[l].substr(xScroll, sxScroll - dx) + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substring(0, xScroll) + addLinePens + this.linePens[l].substr(xScroll, sxScroll - dx) + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substring(0, xScroll) + addLineWritings + this.lineWritings[l].substr(xScroll, sxScroll - dx) + this.lineWritings[l].substring(xScroll + sxScroll);
            }
        }
        if (dy) {
            addLine = '';
            addLinePapers = '';
            addLinePens = '';
            addLineWritings = '';
            for (var l = 0; l < sxScroll; l++) {
                addLine += ' ';
                addLinePapers += String.fromCharCode(this.paper + 32);
                addLinePens += String.fromCharCode(this.pen + 32);
                addLineWritings += String.fromCharCode(this.writing);
            }
        }
        if (dy < 0) {
            for (let l = yScroll; l < yScroll + syScroll + dy; l++) {
                this.lines[l] = this.lines[l].substring(0, xScroll) + this.lines[l - dy].substr(xScroll, sxScroll) + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substring(0, xScroll) + this.linePapers[l - dy].substr(xScroll, sxScroll) + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substring(0, xScroll) + this.linePens[l - dy].substr(xScroll, sxScroll) + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substring(0, xScroll) + this.lineWritings[l - dy].substr(xScroll, sxScroll) + this.lineWritings[l].substring(xScroll + sxScroll);
            }
            for (l = yScroll + syScroll + dy; l < yScroll + syScroll; l++) {
                this.lines[l] = this.lines[l].substr(0, xScroll) + addLine + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substr(0, xScroll) + addLinePapers + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substr(0, xScroll) + addLinePens + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substr(0, xScroll) + addLineWritings + this.lineWritings[l].substring(xScroll + sxScroll);
            }
        }
        if (dy > 0) {
            for (var l = yScroll + syScroll - 1; l >= yScroll + dy; l--) {
                this.lines[l] = this.lines[l].substring(0, xScroll) + this.lines[l - dy].substr(xScroll, sxScroll) + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substring(0, xScroll) + this.linePapers[l - dy].substr(xScroll, sxScroll) + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substring(0, xScroll) + this.linePens[l - dy].substr(xScroll, sxScroll) + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substring(0, xScroll) + this.lineWritings[l - dy].substr(xScroll, sxScroll) + this.lineWritings[l].substring(xScroll + sxScroll);
            }
            for (l = yScroll; l < yScroll + dy; l++) {
                this.lines[l] = this.lines[l].substr(0, xScroll) + addLine + this.lines[l].substring(xScroll + sxScroll);
                this.linePapers[l] = this.linePapers[l].substr(0, xScroll) + addLinePapers + this.linePapers[l].substring(xScroll + sxScroll);
                this.linePens[l] = this.linePens[l].substr(0, xScroll) + addLinePens + this.linePens[l].substring(xScroll + sxScroll);
                this.lineWritings[l] = this.lineWritings[l].substr(0, xScroll) + addLineWritings + this.lineWritings[l].substring(xScroll + sxScroll);
            }
        }
        this.yCursorAnchor += dy;

        // Move the cursor
        if (moveCursor) {
            this.xCursor += dx;
            if (this.xCursor < 0)
                this.xCursor = 0;
            if (this.xCursor >= this.lineWidth)
                this.xCursor = this.lineWidth - 1;
            this.yCursor += dy;
            if (this.yCursor < 0)
                this.yCursor = 0;
            if (this.yCursor >= this.lineHeight)
                this.yCursor = this.lineHeight - 1;
        }

        this.cursorOn();
    };
    private hScroll(param) {
        switch (param) {
            case 1:
                this.scroll({ x: -1, y: 0 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: 1 });
                break;
            case 2:
                this.scroll({ x: -1, y: 0 }, false);
                break;
            case 3:
                this.scroll({ x: 1, y: 0 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: 1 });
                break;
            case 4:
                this.scroll({ x: 1, y: 0 }, false);
                break;
            default:
                throw { error: 'illegal_text_window_parameter', parameter: param };
        }
    };

    private vScroll(param) {
        switch (param) {
            case 1: // Scroll down on text below cursor line
                this.scroll({ x: 0, y: 1 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: this.lineHeight - this.yCursor - 1 });
                break;
            case 2: // Scroll down from top TO cursor line
                this.scroll({ x: 0, y: 1 }, false, { x: 0, y: 0 }, { width: this.lineWidth, height: this.yCursor });
                break;
            case 3: // Scroll up from top TO cursor line
                this.scroll({ x: 0, y: -1 }, false, { x: 0, y: 0 }, { width: this.lineWidth, height: this.yCursor + 1 });
                break;
            case 4: // Scroll up on or below cursor line
                this.scroll({ x: 0, y: -1 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: this.lineHeight - this.yCursor }); // BJF corrected mode 4
                break;
            default:
                throw { error: 'illegal_text_window_parameter', parameter: param };
        }
    }

    public centre(text) {
        var l = this.getPrintLength(text);
        this.cursorOff();
        this.xCursor = Math.floor(this.lineWidth / 2) - Math.floor(l / 2);
        this.print(text, false, true);
        this.cursorOn();
    }
    private paper$(value) {
        var escape = String.fromCharCode(27);
        if (!this.tvc.usePalette)
            return escape + 'PA' + value + '\r';
        else {
            if (value < 0)
                throw { error: 'illegal_text_window_parameter', parameter: value };
            return escape + 'PA' + value % this.screen.numberOfColors + '\r';
        }
    }
    private pen$(value) {
        var escape = String.fromCharCode(27);
        if (!this.tvc.usePalette)
            return escape + 'PE' + value + '\r';
        else {
            if (value < 0)
                throw { error: 'illegal_text_window_parameter', parameter: value };
            return escape + 'PE' + value % this.screen.numberOfColors + '\r';
        }
    }
    public zone$(text, zone) {
        var escape = String.fromCharCode(27);
        return escape + 'Z1' + zone + '\r' + text + escape + 'Z2\r';
    }
    private border$(text, border) {
        var escape = String.fromCharCode(27);
        return escape + 'B1' + border + '\r' + text + escape + 'B2\r';
    }

    private at$(position) {
        var escape = String.fromCharCode(27);
        var result = '';
        if (typeof position.x != 'undefined') {
            if (position.x < 0 || position.x >= this.lineWidth)
                throw { error: 'illegal_text_window_parameter', parameter: position.x };
            result += escape + 'MX' + position.x + '\r';
        }
        if (typeof position.y != 'undefined') {
            if (position.y < 0 || position.y >= this.lineHeight)
                throw { error: 'illegal_text_window_parameter', parameter: position.y };
            result += escape + 'MY' + position.y + '\r';
        }
        return result;
    };
    private move$(displacement) {
        var escape = String.fromCharCode(27);
        var result = '';
        if (typeof displacement.x != 'undefined' && displacement.x != 0) {
            result += escape + 'DX' + displacement.x + '\r';
        }
        if (typeof displacement.y != 'undefined' && displacement.y != 0) {
            result += escape + 'DY' + displacement.y + '\r';
        }
        return result;
    }
    public printUsing(format, variables, newLine) {
        var result = '';
        var variableNumber = 0;
        var formats: any[] = [];
        for (var f = 0; f < variables.length; f++)
            formats[f] = {};

        for (var p = 0; p < format.length; p++) {
            var variable = variables[variableNumber];
            var c = format.charAt(p);
            switch (c) {
                case '~':
                    if (formats[variableNumber].type == 'number')
                        variableNumber++;
                    if (variableNumber < variables.length) {
                        if (!formats[variableNumber].type) {
                            formats[variableNumber].variable = variables[variableNumber];
                            formats[variableNumber].type = 'string';
                            formats[variableNumber].position = p;
                            formats[variableNumber].length = 1;
                        }
                        else {
                            formats[variableNumber].length++;
                        }
                    }
                    result += ' ';
                    break;
                case '+':
                case '-':
                case '–':
                case '.':
                case ';':
                case '#':
                case '^':
                    if (formats[variableNumber].type == 'string')
                        variableNumber++;
                    if (variableNumber < variables.length) {
                        if (!formats[variableNumber].type) {
                            formats[variableNumber].variable = variables[variableNumber];
                            formats[variableNumber].type = 'number';
                            formats[variableNumber].integers = [];
                            formats[variableNumber].decimals = [];
                            formats[variableNumber].exponentials = [];
                            formats[variableNumber].integerCount = 0;
                            formats[variableNumber].decimalCount = 0;
                            formats[variableNumber].exponentialCount = 0;
                            formats[variableNumber].dot = '';
                        }
                        switch (c) {
                            case '+':
                                formats[variableNumber].sign = 'plus';
                                formats[variableNumber].signPosition = p;
                                break;
                            case '-':
                            case '–':
                                formats[variableNumber].sign = 'minus';
                                formats[variableNumber].signPosition = p;
                                break;
                            case '.':
                                formats[variableNumber].dotPosition = p;
                                formats[variableNumber].dot = 'dot';
                                break;
                            case ';':
                                formats[variableNumber].dotPosition = p;
                                formats[variableNumber].dot = 'semiColumn';
                                break;
                            case '^':
                                formats[variableNumber].exponentials[formats[variableNumber].exponentialCount++] = p;
                                break;
                            case '#':
                                if (formats[variableNumber].dot == '')
                                    formats[variableNumber].integers[formats[variableNumber].integerCount++] = p;
                                else
                                    formats[variableNumber].decimals[formats[variableNumber].decimalCount++] = p;
                                break;
                        }
                    }
                    result += ' ';
                    break;
                default:
                    result += c;
                    break;
            }
        }

        var lastFormat = 0;
        for (var v = 0; v < formats.length; v++) {
            if (formats[v].type == 'string') {
                lastFormat = v;
                var variable = formats[v].variable;
                if (typeof variable != 'string')
                    variable = this.tvc.str$(variable);
                result = this.utilities.pokeString(result, variable, formats[v].position, formats[v].length);
            }
            else if (formats[v].type == 'number') {
                if (typeof variable == 'string')
                    throw 'type_mismatch';
                lastFormat = v;
                var exponential;
                if (formats[v].exponentialCount == 0)
                    variable = formats[v].variable.toFixed(formats[v].decimalCount);
                else {
                    variable = formats[v].variable.toExponential(formats[v].decimalCount);
                    exponential = variable.substring(variable.indexOf('e'));
                    variable = variable.substring(0, variable.indexOf('e'));
                }

                var start = variable >= 0 ? 0 : 1;
                if (formats[v].sign == 'plus') {
                    if (formats[v].variable >= 0)
                        result = this.utilities.pokeString(result, '+', formats[v].signPosition, 1);
                    else
                        result = this.utilities.pokeString(result, '-', formats[v].signPosition, 1);
                }
                else if (formats[v].sign == 'minus') {
                    if (formats[v].variable < 0)
                        result = this.utilities.pokeString(result, '-', formats[v].signPosition, 1);
                }
                if (formats[v].integerCount > 0) {
                    var pos = variable.indexOf('.');
                    if (pos < 0)
                        pos = variable.length;
                    for (let d = formats[v].integerCount - 1/* , pos-- */; d >= 0; d--, pos--) {
                        if (pos >= start)
                            result = this.utilities.pokeString(result, variable.substr(pos, 1), formats[v].integers[d], 1);
                    }
                }
                if (formats[v].dot == 'dot') {
                    result = this.utilities.pokeString(result, '.', formats[v].dotPosition, 1);
                }
                if (formats[v].decimalCount > 0) {
                    var pos = variable.indexOf('.');
                    if (pos < 0)
                        pos = variable.length;
                    for (let d = 0/* , pos++ */; d < formats[v].decimalCount; d++, pos++) {
                        if (pos < variable.length)
                            result = this.utilities.pokeString(result, variable.substr(pos, 1), formats[v].decimals[d], 1);
                    }
                }
                if (formats[v].exponentialCount > 0) {
                    for (let d = 0; d < formats[v].exponentialCount; d++) {
                        if (d < exponential.length)
                            result = this.utilities.pokeString(result, exponential.substr(d, 1), formats[v].exponentials[d], 1);
                    }
                }
            }
        }
        for (v = lastFormat + 1; v < variables.length; v++) {
            result += variables[v];
        }
        this.print(result, newLine);
    }

    public print(text, newLine?, centre?) {
        var self = this;
        var jumpTable =
        {
            'PE': doPen,
            'PA': doPaper,
            'MX': doX,
            'MY': doY,
            'DX': doDX,
            'DY': doDY,
            'Z1': doZone1,
            'Z2': doZone2,
            'B1': doBorder1,
            'B2': doBorder2
        };
        centre = typeof centre == 'undefined' ? false : centre;
        var position = 0;
        var line = '';
        var zoneNumber = -1;
        var borderNumber = -1;
        var zoneX1, zoneY1;
        var escape = String.fromCharCode(27);

        // Clean the string and send to console
        if (this.tvc.directMode) {
            position = text.indexOf(escape);
            while (position >= 0) {
                var end = text.indexOf('\r', position);
                if (end > 0) {
                    text = text.substring(0, position) + text.substring(end + 1);
                    position = text.indexOf(escape, position);
                }
                else {
                    break;
                }
            }
            this.tvc.printToDirectMode(text);
            if (newLine)
                this.tvc.printToDirectMode('\n');
            return;
        }

        // Normal screen printing
        this.cursorOff();
        while (position < text.length) {
            var cCode = text.charCodeAt(position);
            var c = text.charAt(position++);
            switch (cCode) {
                case 9:
                    if (line != '') {
                        this.printLine(line, this.paper, this.pen, this.writing, true);
                        line = '';
                    }
                    var newX = Math.floor((this.xCursor + this.tab) / this.tab) * this.tab;
                    for (var x = this.xCursor; x < newX; x++)
                        line += ' ';
                    continue;

                // Command
                case 27:
                    var func = jumpTable[text.substr(position, 2)];
                    if (func) {
                        var end = text.indexOf('\r', position);
                        if (end >= 0) {
                            var parameter;
                            if (end > position + 2)
                                parameter = parseInt(text.substring(position + 2, end));
                            position = end + 1;
                            if (line != '') {
                                self.printLine(line, self.paper, self.pen, self.writing, true);
                                line = '';
                            }
                            func(parameter);
                            continue;
                        }
                    }
                    break;
                // Right
                case 28:
                    this.printLine(line, this.paper, this.pen, this.writing, true);
                    line = '';
                    self.cMove({ x: 1 });
                    break;
                // Left
                case 29:
                    this.printLine(line, this.paper, this.pen, this.writing, true);
                    line = '';
                    self.cMove({ x: -1 });
                    break;
                // Up
                case 30:
                    this.printLine(line, this.paper, this.pen, this.writing, true);
                    line = '';
                    self.cMove({ y: -1 });
                    break;
                // Down
                case 31:
                    this.printLine(line, this.paper, this.pen, this.writing, true);
                    line = '';
                    self.cMove({ y: 1 });
                    break;
                // CR-> do nothing.
                case 13:
                    break;
                // LF
                case 10:
                    this.printLine(line, this.paper, this.pen, this.writing, true);
                    line = '';
                    break;
                // Any other character-> print
                default:
                    line += c;
                    if (this.xCursor + line.length >= this.lineWidth) {
                        this.printLine(line, this.paper, this.pen, this.writing, true);
                        line = '';
                    }
                    break;
            }
        }
        this.printLine(line, this.paper, this.pen, this.writing, true);
        if (newLine) {
            this.xCursor = 0;
            this.yCursor++;
            if (this.yCursor >= this.lineHeight) {
                if (this.scrollOn)
                    this.scroll({ x: 0, y: -1 }, true);
                else
                    this.yCursor = 0;
            }
        }
        this.cursorOn();
        this.tvc.allowRefresh();

        // Formatting functions
        function doPaper(parameter) {
            self.setPaper(parameter);
        }
        function doPen(parameter) {
            self.setPen(parameter);
        }
        function doX(parameter) {
            self.locate({ x: parameter });
        }
        function doY(parameter) {
            self.locate({ y: parameter });
        }
        function doDX(parameter) {
            self.cMove({ x: parameter });
        }
        function doDY(parameter) {
            self.cMove({ y: parameter });
        }
        function doZone1(parameter) {
            zoneNumber = parameter;
            zoneX1 = self.xCursor;
            zoneY1 = self.yCursor;
        }
        function doZone2(parameter) {
            if (zoneNumber >= 0) {
                var x1 = zoneX1 * self.fontWidth;
                var y1 = zoneY1 * self.fontHeight;
                var x2 = self.xCursor * self.fontWidth;
                var y2 = (self.yCursor + 1) * self.fontHeight;
                self.screen.setZone(zoneNumber, { x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
                zoneNumber = -1;
            }
        }
        let borderX1;
        let borderY1;
        function doBorder1(parameter) {
            borderNumber = parameter;
            borderX1 = self.xCursor;
            borderY1 = self.yCursor;
        }
        function doBorder2(parameter) {
            if (borderNumber >= 0) {
                self.drawBorders(borderNumber, { x: borderX1, y: borderY1 }, { width: self.xCursor - borderX1, height: self.yCursor - borderY1 + 1 }, self.paper, self.pen, false);
                borderNumber = -1;
            }
        }
    };
    private getPrintLength(text) {
        var position = 0;
        var count = 0;
        while (position < text.length) {
            var c = text.charCodeAt(position++);
            if (c == 27) {
                var end = text.indexOf('\r', position)
                if (end >= 0) {
                    position = end + 1;
                }
            }
            else if (c >= 32)
                count++;
        }
        return count;
    };


    private drawBorders(border?, position?, size?, paper?, pen?, drawTitle?) {
        border = typeof border != 'undefined' ? border : this.border;
        position = typeof position == 'undefined' ? {} : position;
        size = typeof size == 'undefined' ? {} : size;

        var xStart = typeof position.x != 'undefined' ? position.x : 0;
        var yStart = typeof position.y != 'undefined' ? position.y : 0;
        var width = typeof size.width != 'undefined' ? size.width : this.lineWidth;
        var height = typeof size.height != 'undefined' ? size.height : this.lineHeight;
        pen = typeof pen != 'undefined' ? pen : this.borderPen;
        paper = typeof paper != 'undefined' ? paper : this.borderPaper;
        drawTitle = typeof drawTitle != 'undefined' ? drawTitle : true;

        this.cursorOff();
        var positions =
            [
                // Top left
                {
                    x: - 1,
                    y: - 1,
                    width: 1,
                    height: 1
                },
                // Top center
                {
                    x: 0,
                    y: - 1,
                    width: width,
                    height: 1
                },
                // Top right
                {
                    x: width,
                    y: -1,
                    width: 1,
                    height: 1
                },
                // Center left
                {
                    x: -1,
                    y: 0,
                    width: 1,
                    height: height
                },
                // Center right
                {
                    x: width,
                    y: 0,
                    width: 1,
                    height: height
                },
                // Bottom left
                {
                    x: -1,
                    y: height,
                    width: 1,
                    height: 1
                },
                // Bottom center
                {
                    x: 0,
                    y: height,
                    width: width,
                    height: 1
                },
                // Bottom right
                {
                    x: width,
                    y: height,
                    width: 1,
                    height: 1
                }
            ]
        for (let position = 0; position < 8; position++) {
            var data = positions[position];
            var canvas = this.createBorderCharacter(border, position, paper, pen, this.writing);
            for (var y = 0; y < data.height; y++) {
                var yText = yStart + data.y + y;
                if (!drawTitle) {
                    if (yText < 0)
                        yText = this.lineHeight + yText;
                    if (yText > this.lineHeight)
                        yText = yText - this.lineHeight;
                }
                for (var x = 0; x < data.width; x++) {
                    var xText = xStart + data.x + x;
                    if (!drawTitle) {
                        if (xText < 0)
                            xText = this.lineWidth + xText;
                        if (xText > this.lineWidth)
                            xText = xText - this.lineWidth;
                    }
                    var xGraphic = (this.x + (xText + this.xInside) * this.fontWidth) * this.screen.scale.x;
                    var yGraphic = (this.y + (yText + this.yInside) * this.fontHeight) * this.screen.scale.y;
                    this.screen.context.drawImage(canvas, xGraphic, yGraphic, this.fontWidth * this.screen.scale.x, this.fontHeight * this.screen.scale.y);
                }
            }
        }

        // Draw the titles
        var self = this;
        if (drawTitle) {
            if (this.titleTop != '')
                printIt(this.titleTop, -1);
            if (this.titleBottom != '')
                printIt(this.titleBottom, this.lineHeight);
        }
        this.cursorOn();
        this.screen.setModified();

        function printIt(title, y) {
            if (self.border > 0) {
                if (title.length > self.lineWidth)
                    title = title.substring(self.lineWidth);
                var xSave = self.xCursor;
                var ySave = self.yCursor;
                self.xCursor = Math.floor(self.lineWidth / 2) - Math.floor(title.length / 2);
                self.yCursor = y;
                self.printLine(title, self.borderPaper, self.borderPen, self.writing, false, true);
                self.xCursor = xSave;
                self.yCursor = ySave;
            }
        }
    };
    private restoreText() {
        var paper, pen, writing;
        this.cursorOff();
        paper = this.linePapers[0].charCodeAt(0) - 32;
        pen = this.linePens[0].charCodeAt(0) - 32;
        writing = this.lineWritings[0].charCodeAt(0);

        var xSaveCursor = this.xCursor;
        var ySaveCursor = this.yCursor;
        for (var l = 0; l < this.lineHeight; l++) {
            var line = '';
            var xCursor = 0;
            this.yCursor = l;
            for (var c = 0; c < this.lineWidth; c++) {
                if (paper != this.linePapers[l].charCodeAt(c) - 32 || pen != this.linePens[l].charCodeAt(c) - 32 || writing != this.lineWritings[l].charCodeAt(c)) {
                    if (line != '') {
                        this.xCursor = xCursor;
                        this.printLine(line, paper, pen, writing, false);
                        xCursor += line.length;
                        line = '';
                    }
                    paper = this.linePapers[l].charCodeAt(c) - 32;
                    pen = this.linePens[l].charCodeAt(c) - 32;
                    writing = this.lineWritings[l].charCodeAt(c);
                }
                line += this.lines[l].charAt(c);
            }
            this.xCursor = xCursor;
            this.printLine(line, paper, pen, writing, false, false);
        }
        this.xCursor = xSaveCursor;
        this.yCursor = ySaveCursor;

        // Draw the border
        this.drawBorders();
        this.cursorOn();
        this.screen.setModified();
    };
    private createBorderCharacter(border, position, paper, pen, writing) {
        var canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        var context = canvas.getContext('2d')!;
        var source = this.Borders[border * 8 + position];
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                var mask = 0x80 >> x;
                if ((source[y] & mask) == 0) {
                    context.fillStyle = this.screen.getColorString(paper);
                }
                else {
                    context.fillStyle = this.screen.getColorString(pen);
                }
                context.fillRect(x, y, 1, 1);
            }
        }
        return canvas;
    }

    public printLine(line, paper, pen, writing, updatePosition, inTitle?) {
        if (line == '')
            return;

        var x, y;
        var colorPaper = this.screen.getColorString((this.writing & TextWindow.FLAG_INVERSE) == 0 ? paper : pen);
        var colorPen = this.screen.getColorString((this.writing & TextWindow.FLAG_INVERSE) == 0 ? pen : paper);
        var paperAlpha = this.screen.getColorAlpha((this.writing & TextWindow.FLAG_INVERSE) == 0 ? paper : pen);
        var inkAlpha = this.screen.getColorAlpha((this.writing & TextWindow.FLAG_INVERSE) == 0 ? pen : paper);
        var saveAlpha = this.screen.context.globalAlpha;

        // Erase background
        x = (this.x + (this.xInside + this.xCursor) * this.fontWidth) * this.screen.scale.x;
        y = (this.y + (this.yInside + this.yCursor) * this.fontHeight) * this.screen.scale.y;
        var width = line.length * this.fontWidth * this.screen.scale.x;

        var height = this.fontHeight * this.screen.scale.y;
        this.screen.context.globalCompositeOperation = 'source-over';
        if ((writing & (TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPAPER)) != 0) {
            this.screen.context.fillStyle = colorPaper;
            this.screen.context.globalAlpha = paperAlpha;
            this.screen.context.fillRect(x, y, width, height);
        }
        this.screen.context.globalAlpha = inkAlpha;
        if ((writing & TextWindow.FLAG_UNDER) != 0) {
            this.screen.context.strokeStyle = colorPen;
            this.screen.context.beginPath();
            this.screen.context.moveTo(x, y + height - 1);
            this.screen.context.lineTo(x + width, y + height - 1);
            this.screen.context.stroke();
        }

        if (this.font.fontInformation.type == 'google') {
            y += this.fontHeight * this.screen.scale.y;
            this.screen.context.font = this.fontString;
            this.screen.context.textAlign = 'start';
            this.screen.context.textBaseline = 'bottom';
            this.screen.context.fillStyle = colorPen;
            this.screen.context.imageSmoothingEnabled = false;
            (this.screen.canvas as any).imageRendering = 'pixelated';
            if ((writing & (TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPEN | TextWindow.FLAG_SHADOW)) != 0) {
                if ((writing & TextWindow.FLAG_SHADOW) != 0) {
                    this.screen.context.fillStyle = colorPaper;
                    this.screen.context.fillText(line, x - 1, y - 1);
                    this.screen.context.fillText(line, x, y - 1);
                    this.screen.context.fillText(line, x + 1, y - 1);
                    this.screen.context.fillText(line, x - 1, y);
                    this.screen.context.fillText(line, x + 1, y);
                    this.screen.context.fillText(line, x - 1, y + 1);
                    this.screen.context.fillText(line, x, y + 1);
                    this.screen.context.fillText(line, x + 1, y + 1);
                    this.screen.context.fillStyle = colorPen;
                }
                this.screen.context.fillText(line, x, y);
                x += this.fontWidth * this.screen.scale.x * line.length;
            }
        }
        else if (this.font.fontInformation.type == 'amiga') {
            x = (this.x + (this.xInside + this.xCursor) * this.fontWidth);
            y = (this.y + (this.yInside + this.yCursor) * this.fontHeight);
            this.tvc.fonts.drawAmigaText(this.screen.context, this.screen.scale.x, x, y, line, this.font, this.fontHeight, 'left', 'top', '', colorPen, 1, this.fontWidth);
        }
        this.screen.context.globalAlpha = saveAlpha;

        // Poke in save buffers
        if (!inTitle) {
            var linePapers = '';
            var linePens = '';
            var lineWritings = '';
            for (var l = 0; l < line.length; l++) {
                linePapers += String.fromCharCode(paper + 32);
                linePens += String.fromCharCode(pen + 32);
                lineWritings += String.fromCharCode(writing);
            }
            this.lines[this.yCursor] = this.lines[this.yCursor].substring(0, this.xCursor) + line + this.lines[this.yCursor].substring(this.xCursor + line.length);
            this.linePapers[this.yCursor] = this.linePapers[this.yCursor].substring(0, this.xCursor) + linePapers + this.linePapers[this.yCursor].substring(this.xCursor + line.length);
            this.linePens[this.yCursor] = this.linePens[this.yCursor].substring(0, this.xCursor) + linePens + this.linePens[this.yCursor].substring(this.xCursor + line.length);
            this.lineWritings[this.yCursor] = this.lineWritings[this.yCursor].substring(0, this.xCursor) + lineWritings + this.lineWritings[this.yCursor].substring(this.xCursor + line.length);
        }

        // Update position
        if (updatePosition) {
            this.xCursor += line.length;
            if (this.xCursor >= this.lineWidth) {
                this.xCursor = 0;
                this.yCursor++;
                if (this.yCursor >= this.lineHeight) {
                    if (this.scrollOn)
                        this.scroll({ x: 0, y: -1 }, true);
                    else
                        this.yCursor = 0;
                }
            }
        }

        // Update display
        this.screen.setModified();
    }

    private Borders: int[][] = [
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],        // Border  0
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  1
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0xFF, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0],        // Border  2
        [0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0xFF, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03],
        [0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0],
        [0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03],
        [0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xFF],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF],
        [0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0xFF],
        [0x00, 0x7F, 0x7F, 0x60, 0x6F, 0x6F, 0x6C, 0x6C],        // Border  3
        [0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00],
        [0x00, 0xFE, 0xFE, 0x06, 0xF6, 0xF6, 0x36, 0x36],
        [0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C],
        [0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36],
        [0x6C, 0x6C, 0x6F, 0x6F, 0x60, 0x7F, 0x7F, 0x00],
        [0x00, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00],
        [0x36, 0x36, 0xF6, 0xF6, 0x06, 0xFE, 0xFE, 0x00],
        [0x00, 0x7F, 0x40, 0x57, 0x40, 0x57, 0x54, 0x54],        // Border  4
        [0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00, 0x00],
        [0x00, 0xFE, 0x02, 0xEA, 0x02, 0xEA, 0x2A, 0x2A],
        [0x44, 0x54, 0x54, 0x44, 0x44, 0x54, 0x54, 0x44],
        [0x22, 0x2A, 0x2A, 0x22, 0x22, 0x2A, 0x2A, 0x22],
        [0x54, 0x54, 0x57, 0x40, 0x57, 0x40, 0x7F, 0x00],
        [0x00, 0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00],
        [0x2A, 0x2A, 0xEA, 0x02, 0xEA, 0x02, 0xFE, 0x00],
        [0x00, 0x00, 0x3F, 0x7F, 0x7F, 0x78, 0x70, 0x70],        // Border  5
        [0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0xFC, 0xFE, 0xFE, 0x1E, 0x0E, 0x0E],
        [0x70, 0x70, 0x70, 0x70, 0x70, 0x70, 0x70, 0x70],
        [0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E],
        [0x70, 0x70, 0x70, 0x78, 0x7F, 0x7F, 0x3F, 0x00],
        [0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00],
        [0x0E, 0x0E, 0x0E, 0x1E, 0xFE, 0xFE, 0xFC, 0x00],
        [0x00, 0x7F, 0x40, 0x5F, 0x5F, 0x58, 0x58, 0x58],        // Border  6
        [0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00],
        [0x00, 0xFE, 0x02, 0xFA, 0xFA, 0x1A, 0x1A, 0x1A],
        [0x58, 0x58, 0x58, 0x58, 0x58, 0x58, 0x58, 0x58],
        [0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A],
        [0x58, 0x58, 0x58, 0x5F, 0x5F, 0x40, 0x7F, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0x00],
        [0x1A, 0x1A, 0x1A, 0xFA, 0xFA, 0x02, 0xFE, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  7
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  8
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  9
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  10
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  11
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  12
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  13
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  14
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18],        // Border  15
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18],
        [0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00],
        [0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00]
    ]
}
