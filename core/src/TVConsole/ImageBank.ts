import { is } from '../is';
import { TVC } from './TVC';
import { TVCContext } from './TVCContext';
import { Utilities } from './Utilities';
import { TLoader } from '../PreLoad/TLoader';


export class ImageBank {
    tvc: TVC;
    utilities: Utilities;
    palette: any;
    options: any;
    domain: any;
    type: any;
    path: any;
    context: TVCContext;
    collisionMaskAlphaThreshold: any;
    canvas: any;
    canvasRev: any;
    canvasHRev: any;
    canvasVRev: any;
    hotSpotX: any;
    hotSpotY: any;
    collisionMask: any;
    collisionMaskAngle: any;
    collisionMaskPrecision: number = undefined as any;
    width: number = undefined as any;
    height: number = undefined as any;
    collisionMaskWidth: any;
    collisionMaskHeight: any;
    public constructor(tvc: TVC, imageList: string | string[], palette: string[], options: any) {
        this.tvc = tvc;
        this.utilities = tvc.utilities;
        this.palette = palette;
        this.options = options;
        this.domain = options.domain;
        this.type = options.type;
        this.path = options.path;
        this.context = new TVCContext(this.tvc, this.domain, {});
        if (imageList && is.array(imageList)) {
            this.loadList(imageList, options);
        }
        /* if (imageList && is.string(imageList)) {
            this.load(undefined, undefined, imageList);
        } */
    }
    private isType(types) {
        if (typeof types == 'string')
            types = [types];
        for (var t = 0; t < types.length; t++) {
            if (types[t] == this.type)
                return true;
        }
        return false;
    };
    private loadList(imageList, options) {
        var self = this;
        const tags = typeof options.tags == 'undefined' ? '' : options.tags;
        var indexMap = [];
        for (var i = 0; i < imageList.length; i++) {
            this.tvc.loadingMax++;
            var infos: any = this.context.getElementInfosFromFilename(this.domain, imageList[i], 'image', i + 1, indexMap);
            infos.path = './resources/' + this.path + '/' + imageList[i];
            infos.number = i;
            this.utilities.loadUnlockedImage(infos.path, { type: 'image/png' }, function (response, imageLoaded, extra) {
                if (response) {
                    // Calculate transparency?
                    if (!options.alpha)
                        imageLoaded = self.utilities.makeTransparentImage(imageLoaded);

                    // Set color 0 transparent
                    var image =
                    {
                        tvc: self.tvc,
                        name: extra.name,
                        path: extra.path,
                        canvas: imageLoaded,
                        width: imageLoaded.width,
                        height: imageLoaded.height,
                        hotSpotX: 0,
                        hotSpotY: 0,
                        collisionMaskPrecision: self.tvc.manifest.sprites.collisionPrecision,
                        collisionMaskAlphaThreshold: self.tvc.manifest.sprites.collisionAlphaThreshold,
                        getCanvas: self.getImageCanvas,
                        getHotSpot: self.getImageHotSpot,
                        getCollisionMask: self.getCollisionMask
                    };
                    self.context.setElement(this.domain, image, extra.index, true);
                    self.setHotSpot(extra.index, options.hotSpots[extra.number]);
                    self.setTags(extra.index, tags);
                }
                self.tvc.loadingCount++;
            }, infos);
        }
    }
    public load(path, options):Promise<boolean> {
        var self = this;
        const tags = typeof options.tags == 'undefined' ? '' : options.tags;
        var indexMap = [];
            this.tvc.loadingMax++;
            var infos: any = this.context.getElementInfosFromFilename(this.domain, path, 'image', /* i + */ 1, indexMap);
            infos.path = path
            infos.number = 0;

            return new Promise((resolve, reject)=>{
                TLoader.LoadImage(infos.path).then((imageLoaded)=>{
                    const response = true;

                });
                this.utilities.loadImage(infos.path, { type: 'image/png' }, function (response, imageLoaded, extra) {
                    if (response) {
                        // Calculate transparency?
                        if (!options.alpha)
                            imageLoaded = self.utilities.makeTransparentImage(imageLoaded);

                        // Set color 0 transparent
                        var image =
                        {
                            tvc: self.tvc,
                            name: extra.name,
                            path: extra.path,
                            canvas: imageLoaded,
                            width: imageLoaded.width,
                            height: imageLoaded.height,
                            hotSpotX: 0,
                            hotSpotY: 0,
                            collisionMaskPrecision: self.tvc.manifest.sprites.collisionPrecision,
                            collisionMaskAlphaThreshold: self.tvc.manifest.sprites.collisionAlphaThreshold,
                            getCanvas: self.getImageCanvas,
                            getHotSpot: self.getImageHotSpot,
                            getCollisionMask: self.getCollisionMask
                        };
                        self.context.setElement(self.domain, image, extra.index, true);
                        self.setHotSpot(extra.index, options.hotSpots[extra.number]);
                        self.setTags(extra.index, tags);
                        resolve(true);
                    }
                    self.tvc.loadingCount++;
                }, infos);
            });

    }
    public _load(index, name, path, width?, height?, tags?):Promise<boolean> {
        return new Promise((resolve, reject)=>{
            var self = this;
            var infos = this.context.getElementInfosFromFilename(this.domain, path, 'image');
            index = typeof index == 'undefined' ? infos.index : index;
            name = typeof name == 'undefined' ? infos.name : name;
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = typeof width != 'undefined' ? width : (this as any).width;
                canvas.height = typeof height != 'undefined' ? height : (this as any).height;
                var context = canvas.getContext('2d')!;
                context.imageSmoothingEnabled = self.utilities.isTag(tags, ['smooth'])
                context.drawImage(this as any, 0, 0);
                var newImage =
                {
                    tvc: self.tvc,
                    name: name,
                    canvas: canvas,
                    width: canvas.width,
                    height: canvas.height,
                    hotSpotX: 0,
                    hotSpotY: 0,
                    collisionMaskPrecision: self.tvc.manifest.sprites.collisionPrecision,
                    collisionMaskAlphaThreshold: self.tvc.manifest.sprites.collisionAlphaThreshold,
                    getCanvas: self.getImageCanvas,
                    getHotSpot: self.getImageHotSpot,
                    getCollisionMask: self.getCollisionMask
                }
                self.context.setElement((this as any).domain, newImage, index, true);
                self.setTags(index, tags);
                resolve(true);
            };
            image.src = path;
        });

    }

    private add(index, tags) {
        var name;
        if (typeof index == 'string')
            name = index;
        else
            name = 'image#' + index;
        var image =
        {
            tvc: this.tvc,
            name: name,
            canvas: null,
            width: 0,
            height: 0,
            hotSpotX: 0,
            hotSpotY: 0,
            collisionMaskPrecision: this.tvc.manifest.sprites.collisionPrecision,
            collisionMaskAlphaThreshold: this.tvc.manifest.sprites.collisionAlphaThreshold,
            getCanvas: this.getImageCanvas,
            getHotSpot: this.getImageHotSpot,
            getCollisionMask: this.getCollisionMask
        }
        this.context.setElement(this.domain, image, index, true);
        this.setTags(image, tags);
        return image;
    };
    private addRange(first, last, tags) {
        last = typeof last == 'undefined' ? first + 1 : last;
        if (last < first)
            throw { error: 'illegal_function_call', parameters: [first, last] };

        var result: any[] = [];
        for (var count = first; count < last; count++) {
            result.push(this.add(count, tags));
        }
        return result;
    };
    private getImageCanvas(hRev, vRev) {
        if (typeof vRev == 'undefined') {
            vRev = (hRev & 0x4000) != 0;
            hRev = (hRev & 0x8000) != 0;
        }
        var canvas = this.canvas;
        if (canvas) {
            if (hRev || vRev) {
                if (hRev && vRev) {
                    if (!this.canvasRev)
                        this.canvasRev = this.tvc.utilities.flipCanvas(this.canvas, true, true);
                    canvas = this.canvasRev;
                }
                else if (hRev) {
                    if (!this.canvasHRev)
                        this.canvasHRev = this.tvc.utilities.flipCanvas(this.canvas, true, false);
                    canvas = this.canvasHRev;
                }
                else {
                    if (!this.canvasVRev)
                        this.canvasVRev = this.tvc.utilities.flipCanvas(this.canvas, false, true);
                    canvas = this.canvasVRev;
                }
            }
        }
        return canvas;
    };
    private getImageHotSpot(hRev, vRev) {
        if (typeof vRev == 'undefined') {
            vRev = (hRev & 0x4000) != 0;
            hRev = (hRev & 0x8000) != 0;
        }
        return { x: hRev ? this.canvas.width - this.hotSpotX : this.hotSpotX, y: vRev ? this.canvas.height - this.hotSpotY : this.hotSpotY };
    };
    private getCollisionMask(angle) {
        let context;
        // Note: we are in the "image" context ;)
        if (!this.collisionMask || angle != this.collisionMaskAngle) {
            this.collisionMaskAngle = angle;
            if (angle == 0) {
                var width, height;
                if (this.collisionMaskPrecision !== 1) {
                    width = Math.floor(this.width * this.collisionMaskPrecision);
                    height = Math.floor(this.height * this.collisionMaskPrecision);
                    var canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    context = canvas.getContext('2d')!;
                    context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, width, height);
                }
                else {
                    width = this.width;
                    height = this.height;
                    context = this.canvas.getContext('2d')!;
                }
                var dataView = context.getImageData(0, 0, width, height);
                var data = dataView.data;
                var buffer = new Uint8Array(width * height);
                for (var y = 0; y < height; y++) {
                    var offsetView = y * width * 4;
                    var offsetBuffer = y * width;
                    for (let x = 0; x < width; x++) {
                        if (data[offsetView + x * 4 + 3] >= this.collisionMaskAlphaThreshold) {
                            buffer[offsetBuffer + x] = 1;
                        }
                    }
                }
                this.collisionMask = buffer;
                this.collisionMaskWidth = width;
                this.collisionMaskHeight = height;
            }
            else {
                console.log('TODO!');
            }
        }
        return { mask: this.collisionMask, width: this.collisionMaskWidth, height: this.collisionMaskHeight, precision: this.collisionMaskPrecision };
    };
    private getLength() {
        return this.context.getNumberOfElements(this.domain);
    };
    private setLength() {
        throw 'illegal_function_call';
    };
    private setElement(index, canvas, hotSpot, tags) {
        var image = this.context.getElement(this.domain, index, 'image_not_defined');
        image.canvas = canvas;
        if ((window as any).application.tvc.manifest.platform == 'amiga') {
            var ctx = image.canvas.getContext('2d');
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            image.canvas.imageSmoothEnabled = false;
        }
        image.width = canvas.width;
        image.height = canvas.height;
        image.canvasRev = null;
        image.canvasHRev = null;
        image.canvasVRev = null;
        if (hotSpot) {
            image.hotSpotX = hotSpot.x;
            image.hotSpotY = hotSpot.y;
        }
    };
    private getElement(index) {
        var image = this.context.getElement(this.domain, index, 'image_not_defined');
        if (image && image.canvas)
            return image;
        throw 'image_not_defined';
    };
    private getPalette() {
        return this.palette;
    };
    private setPalette(palette) {
        this.palette = palette;
    };
    private reset() {
        this.context.reset(this.domain);
    };
    private delete(index) {
        this.context.deleteElement(this.domain, index);
    };
    private deleteRange(first, last) {
        this.context.deleteRange(this.domain, first, last);
    };
    private setTags(index, tags) {
        if (tags) {
            var image = this.context.getElement(this.domain, index, 'image_not_defined');
            if (this.utilities.isTag(tags, ['hotSpotX', 'hotSpotY'])) {
                var x = this.utilities.getTagParameter(tags, 'hotSpotX');
                if (typeof x == 'string') {
                    switch (x) {
                        case 'left':
                            image.hotSpotX = 0;
                            break;
                        case 'center':
                            image.hotSpotX = image.width / 2;
                            break;
                        case 'right':
                            image.hotSpotX = image.width;
                            break;
                    }
                }
                else if (typeof x == 'number') {
                    image.hotSpotX = x;
                }

                var y = this.utilities.getTagParameter(tags, 'hotSpotY');
                if (typeof y == 'string') {
                    switch (y) {
                        case 'top':
                            image.hotSpotY = 0;
                            break;
                        case 'middle':
                            image.hotSpotY = image.height / 2;
                            break;
                        case 'bottom':
                            image.hotSpotY = image.height;
                            break;
                    }
                }
                else if (typeof y == 'number') {
                    image.hotSpotY = y;
                }
            }
        }
    };
    private getHotSpot(index, position) {
        var image = this.context.getElement(this.domain, index, 'image_not_defined');
        if (position.toLowerCase() == 'y')
            return image.hotSpotX;
        return image.hotSpotY;
    };
    private setHotSpot(index, position) {
        var image = this.context.getElement(this.domain, index, 'image_not_defined');
        if (position.x == 'mask') {
            switch ((position.y & 0x70) >> 4) {
                case 0:
                    image.hotSpotX = 0;
                    break;
                case 1:
                    image.hotSpotX = image.width / 2;
                    break;
                case 2:
                    image.hotSpotX = image.width;
                    break;
            }
            switch (position.y & 0x07) {
                case 0:
                    image.hotSpotY = 0;
                    break;
                case 1:
                    image.hotSpotY = image.height / 2;
                    break;
                case 2:
                    image.hotSpotY = image.height;
                    break;
            }
        }
        else {
            if (typeof position.x != 'undefined')
                image.hotSpotX = position.x;
            if (typeof position.y != 'undefined')
                image.hotSpotY = position.y;
        }
    };
    private erase(index) {
    }
}