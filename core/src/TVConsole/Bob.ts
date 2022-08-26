import { TVC } from "./TVC";
import { Screen } from './Screen';

export class Bob {
    tvc: TVC;
    banks: any;
    screen: Screen;
    tags: any;
    className: string;
    vars: any;
    varsUpdated: any;
    private positionDisplay: any;
    private dimensionDisplay: any;
    private scaleDisplay: any;
    private skewDisplay: any;
    private angleDisplay: any;
    private bankIndex: any = undefined;
    private bankReserveNumber: any;
    clipping: null;
    limits: any;
    modifiedCollisions: number;
    collisions: { rectangle: { x1: number; y1: number; x2: number; y2: number; }; rectangleClamp: { x1: number; y1: number; x2: number; y2: number; }; };
    bank: any;
    imageObject: any;
    canvas: any;
    hotSpot: any;
    index: any;
    modified: number = undefined as any;
    toUpdateCollisions: boolean = undefined as any;

    public constructor(tvc: TVC, parent: Screen, tags) {
        this.tvc = tvc;
        this.banks = tvc.Banks;
        this.screen = parent;
        this.tags = tags;
        this.className = 'bob';

        this.vars =
        {
            x: 0,
            y: 0,
            z: 0,
            width: 0,
            height: 0,
            depth: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            skewX: 1,
            skewY: 1,
            skewZ: 1,
            angle: 0,
            image: 0,
            alpha: 1.0,
            visible: true,
            modified: 0,
            cameraX: 0,
            cameraY: 0,
            cameraZ: 0,
            hRev: false,
            vRev: false
        };

        this.varsUpdated = this.tvc.utilities.copyObject(this.vars);

        this.positionDisplay = {};
        this.dimensionDisplay = {};
        this.scaleDisplay = {};
        this.skewDisplay = {};
        this.angleDisplay = {};
        this.bankIndex = undefined;
        this.bankReserveNumber = -1;

        this.clipping = null;
        this.limits = null;
        this.modifiedCollisions = 0;
        this.collisions =
        {
            rectangle: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 },
            rectangleClamp: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 }
        };
        this.tvc.turnIntoObject(this, {}, {},
            {
                setSize: this.setSize
            });
    }

    private get_this(index) {
        return this.tvc.currentScreen.getBob(index, undefined, this.tvc.currentContextName);
    };
    private set(position, image, fromInstruction) {
        var size: any = undefined;
        if (typeof image != 'undefined') {
            if (typeof image == 'number') {
                this.vars.hRev = (image & TVC.HREV) != 0;
                this.vars.vRev = (image & TVC.VREV) != 0;
                image &= ~(TVC.HREV | TVC.VREV);
            }
            else {
                this.vars.hRev = false;
                this.vars.vRev = false;
            }
            this.bank = this.tvc.Banks.getBank(this.bankIndex, this.tvc.currentContextName, 'images');
            this.bankIndex = this.bank.index;
            this.bankReserveNumber = this.bank.reserveNumber;
            this.imageObject = this.bank.getElement(image);
            size = { width: this.imageObject.width, height: this.imageObject.height };
        }
        if (typeof position.x != 'undefined') {
            position.x = this.limits ? Math.max(this.limits.x, Math.min(this.vars.x, this.limits.x + this.limits.width)) : position.x;
        }
        if (typeof position.y != 'undefined') {
            position.y = this.limits ? Math.max(this.limits.y, Math.min(this.vars.y, this.limits.y + this.limits.height)) : position.y;
        }
        /*	if ( typeof position.z != 'undefined' )
            {
            }
        */
        if (size) {
            (this as any).setImage(image, fromInstruction);
            this.setSize(size, fromInstruction);
        }
        (this as any).setPosition(position, fromInstruction);
    }

    private setModified() {
        this.vars.modified++;
        this.modifiedCollisions = -1;
        this.screen.setModified();
    }

    private updateBank(newBank, newBankIndex, contextName) {
        if (this.bankIndex == newBankIndex) {
            if (newBank) {
                if (this.bankReserveNumber != newBank.reserveNumber) {
                    this.bank = newBank;
                    this.bankReserveNumber = newBank.reserveNumber;
                    this.imageObject = newBank.getElement(this.vars.image);
                    if (!this.imageObject)
                        this.destroy();
                    else
                        this.setSize({ width: this.imageObject.width, height: this.imageObject.height });
                }
            }
            else {
                this.destroy();
            }
        }
        return true;
    };
    private destroy(options?) {
        (this.screen as any).destroyBob(this.index);
    }
    private update(options) {
        if (this.vars.modified || options.force) {
            this.vars.modified = 0;
            if (this.imageObject) {
                this.positionDisplay.x = this.vars.x - this.vars.cameraX;
                this.positionDisplay.y = this.vars.y - this.vars.cameraY;
                this.dimensionDisplay.width = this.vars.width;
                this.dimensionDisplay.height = this.vars.height;
                this.scaleDisplay.x = this.vars.scaleX;
                this.scaleDisplay.y = this.vars.scaleY;
                this.skewDisplay.x = this.vars.skewX;
                this.skewDisplay.y = this.vars.skewY;
                this.angleDisplay.z = this.vars.angle;
                this.canvas = this.imageObject.getCanvas(this.vars.hRev, this.vars.vRev);
                this.hotSpot = this.imageObject.getHotSpot(this.vars.hRev, this.vars.vRev);
            }
            return true;
        }
        return false;
    };
    private setSize(dimension, fromInstruction?) {
        if (typeof dimension.width != 'undefined')
            dimension.width *= this.vars.scaleX;
        if (typeof dimension.height != 'undefined')
            dimension.height *= this.vars.scaleY;
        if (typeof dimension.depth != 'undefined')
            dimension.depth *= this.vars.scaleZ;
        this.tvc.setSize.call(this, dimension, fromInstruction);
    };
    private setClipping(rectangle, options) {
        rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
        rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
        rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.screen.width;
        rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.screen.height;
        this.clipping = rectangle;
        this.setModified();
    };
    private setLimits(rectangle, options) {
        rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
        rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
        rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.screen.width;
        rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.screen.height;
        if (this.tvc.platform == 'amiga')
            rectangle.width &= 0xFFFFFFF0;
        //this.limits = rectangle;
        this.clipping = rectangle;
        this.setModified();
    };
    private updateCollisionData() {
        if (this.vars.modified != this.modifiedCollisions) {
            this.modifiedCollisions = this.modified;
            var collisions: any = this.collisions;
            if (this.imageObject) {
                var x1, x2, y1, y2;
                if (this.vars.scaleX >= 0)
                    x1 = this.vars.x - this.imageObject.hotSpotX * this.vars.scaleX;
                else
                    x1 = this.vars.x - (this.imageObject.width - this.imageObject.hotSpotX) * (-this.vars.scaleX);
                x2 = x1 + this.imageObject.width * Math.abs(this.vars.scaleX);

                if (this.vars.scaleY >= 0)
                    y1 = this.vars.y - this.imageObject.hotSpotY * this.vars.scaleY;
                else
                    y1 = this.vars.y - (this.imageObject.height - this.imageObject.hotSpotY) * (-this.vars.scaleY);
                y2 = y1 + this.imageObject.height * Math.abs(this.vars.scaleY);

                var x1Clamp = Math.max(Math.min(x1, this.screen.dimension.width), 0);
                var y1Clamp = Math.max(Math.min(y1, this.screen.dimension.height), 0);
                var x2Clamp = Math.max(Math.min(x2, this.screen.dimension.width), 0);
                var y2Clamp = Math.max(Math.min(y2, this.screen.dimension.height), 0);

                if (x1Clamp != x2Clamp && y1Clamp != y2Clamp) {
                    collisions.rectangle.x1 = x1 * this.screen.renderScale.x + this.screen.vars.x;
                    collisions.rectangle.y1 = y1 * this.screen.renderScale.y + this.screen.vars.y;
                    collisions.rectangle.x2 = x2 * this.screen.renderScale.x + this.screen.vars.x;
                    collisions.rectangle.y2 = y2 * this.screen.renderScale.y + this.screen.vars.y;
                    collisions.rectangleClamp.x1 = x1Clamp * this.screen.renderScale.x + this.screen.vars.x;
                    collisions.rectangleClamp.y1 = y1Clamp * this.screen.renderScale.y + this.screen.vars.y;
                    collisions.rectangleClamp.x2 = x2Clamp * this.screen.renderScale.x + this.screen.vars.x;
                    collisions.rectangleClamp.y2 = y2Clamp * this.screen.renderScale.y + this.screen.vars.y;
                    /*
                    if ( this.angle.z != 0 )
                    {
                        var xCenter = this.position.x * this.screen.renderScale.x + this.screen.position.x;
                        var yCenter = this.position.y * this.screen.renderScale.y + this.screen.position.y;
                        this.utilities.rotateCollisionRectangle( this.collisions.rectangle, { x: xCenter, y: yCenter }, this.angle.z );
                        this.utilities.rotateCollisionRectangle( this.collisions.rectangleClamp, { x: xCenter, y: yCenter }, this.angle.z );
                    }
                    */
                }
            }
            else {
                collisions.rectangle = { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 };
                collisions.rectangleClamp = { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 };
            }
            collisions.xPlus = this.vars.scaleX;
            collisions.yPlus = this.vars.scaleY;
            this.toUpdateCollisions = false;
        }
    }
}
