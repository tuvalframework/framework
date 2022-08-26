import { AMAL } from "./AMAL";
import { TVC } from "./TVC";
import { Utilities } from "./Utilities";


export class AMALChannel {
    tvc: TVC;
    amal: AMAL;
    extra: any;
    utilities: Utilities;
    code: any;
    number: any;
    activeChannel: null;
    waitInstructions: { move: (args: any) => void; move_wait: (slopeX: any, slopeY: any, steps: any) => void; };
    script: HTMLScriptElement;
    amalProgram: any;
    wait: boolean = undefined as any;
    positionMain: number = undefined as any;
    registers: any;
    position: number = undefined as any;
    waiting: any;
    onOff: boolean = undefined as any;
    freeze: boolean = undefined as any;
    moveCounter: number = undefined as any;
    animCounter: number = undefined as any;
    moveDeltaX: number = undefined as any;
    moveDeltaY: number = undefined as any;
    animPosition: any;
    animFrames: any;
    animRepeatCounter: number = undefined as any;
    toUpdate: number = undefined as any;
    previousTime: number = undefined as any;
    timeCheckCounter: number = undefined as any;
    loopCounter: number = undefined as any;
    maxLoopTime: number = undefined as any;
    collisions: any;
    public constructor(tvc: TVC, amal: AMAL, code, name, number, callback, extra) {
        this.tvc = tvc;
        this.amal = amal;
        this.extra = extra;
        this.utilities = amal.utilities;
        this.code = code;
        this.number = number;
        this.activeChannel = null;
        this.waitInstructions =
        {
            move: this.move,
            move_wait: this.move_wait,
        };
        this.reset();

        // Save and load code as blob
        code = this.utilities.replaceStringInText(code, '%$NAME', name);
        this.script = document.createElement('script');
        this.script.textContent = code;
        document.body.appendChild(this.script);

        var self = this;
        var handle = setInterval(function () {
            if (typeof window[name] != 'undefined') {
                clearInterval(handle);
                self.amalProgram = new (window[name] as any)(self.tvc, self);
                self.wait = false;
                self.positionMain = 0;
                callback(true, {}, extra);
            }
        }, 1);
    }

    private reset() {
        this.registers =
        {
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            'x': 0,
            'y': 0,
            'a': 0
        };
        this.position = 0;
        this.waiting = null as any;
        this.onOff = false;
        this.freeze = false;
        this.moveCounter = 0;
        this.animCounter = 0;
        this.wait = false;
        this.positionMain = 0;
    }
    private destroy() {
        if (this.script)
            document.body.removeChild(this.script);
    }
    private run() {

    }
    private update() {
        var toUpdate = 0;
        var channel = this.tvc.getAnimationChannel(this.number);
        var channelObject;
        if (channel) {
            channelObject = channel.get_this(this.number);
            if (channelObject) {
                // Grab the coordinates
                var x = channelObject.get_x(channel.channelType, '#update');
                if (typeof x != 'undefined')
                    this.registers.x = x;
                var y = channelObject.get_y(channel.channelType, '#update');
                if (typeof y != 'undefined')
                    this.registers.y = y;
            }
        }
        if (channelObject && !this.freeze) {
            this.updateBlocks(this.amalProgram, this.amalProgram.blocksAutotest, 0);
            if (!this.wait)
                this.positionMain = this.updateBlocks(this.amalProgram, this.amalProgram.blocks, this.positionMain);

            if (this.moveCounter) {
                this.registers.x += this.moveDeltaX;
                this.registers.y += this.moveDeltaY;
                this.moveCounter--;
                toUpdate |= 0b011;
            }
            if (this.animCounter > 0) {
                this.animCounter--;
                if (this.animCounter == 0) {
                    var stop = false;
                    this.animPosition++;
                    if (this.animPosition >= this.animFrames.length) {
                        this.animPosition = 0;
                        if (this.animRepeatCounter > 0) {
                            this.animRepeatCounter--;
                            if (this.animRepeatCounter == 0)
                                stop = true
                        }
                    }
                    if (!stop) {
                        this.registers.a = this.animFrames[this.animPosition].i;
                        this.animCounter = this.animFrames[this.animPosition].t;
                        toUpdate |= 0b100;
                    }
                }
            }
            toUpdate |= this.toUpdate;
            this.toUpdate = 0;
            if (toUpdate) {
                if (toUpdate & 0b001)
                    channelObject.set_x(this.registers.x);
                if (toUpdate & 0b010)
                    channelObject.set_y(this.registers.y);
                if (toUpdate & 0b100)
                    channelObject.set_image(this.registers.a);
            }
        }
    };
    private updateBlocks(section, blocks, position) {
        if (position >= blocks.length)
            return;

        var time = new Date().getTime();
        this.previousTime = time;

        this.timeCheckCounter = 100;		// Should be enough!
        this.loopCounter = this.timeCheckCounter;
        this.maxLoopTime = 1;				// One MS max per script!
        var quit = false;
        let ret;
        while (!quit) {
            while (!quit && this.loopCounter > 0) {
                if (this.waiting) {
                    this.waiting.call(this);
                    if (this.waiting)
                        break;
                }
                do {
                    ret = blocks[position++].call(section);
                } while (!ret);

                switch (ret.type) {
                    // End!
                    case 0:
                        if (blocks == this.amalProgram.blocks)
                            this.wait = true;
                        quit = true;
                        break;

                    // Goto
                    case 1:
                        position = ret.label;
                        break;

                    // Blocking instruction
                    case 2:
                        this.waiting = this.waitInstructions[ret.instruction + '_wait'];
                        this.waitInstructions[ret.instruction].call(this, ret.args);
                        break;

                    // Blocking function
                    case 3:
                        this.waiting = this.waitInstructions[ret.instruction + '_wait'];
                        this.waitInstructions[ret.instruction].call(this, ret.result, ret.args);
                        break;

                    // Next
                    case 4:
                        position = ret.label;
                        quit = true;
                        break;
                }
                this.loopCounter--;
            }
            if (quit || this.waiting)
                break;

            // Check time in loop
            this.loopCounter = this.timeCheckCounter;
            if (new Date().getTime() - time >= this.maxLoopTime)
                break;
        }
        return position;
    }
    private move(args) {
        if (args[2] <= 0)
            args[2] = 1;
        this.moveDeltaX = args[0] / args[2];
        this.moveDeltaY = args[1] / args[2];
        this.moveCounter = args[2];
    }

    private move_wait(slopeX, slopeY, steps) {
        if (this.moveCounter == 0) {
            this.waiting = null;
        }
    }

    private anim(repeat, frames) {
        this.animFrames = frames;
        this.animPosition = 0;
        this.animRepeatCounter = repeat;
        this.registers.a = this.animFrames[0].i;
        this.animCounter = this.animFrames[0].t;
    }

    private play(index) {
        console.log('Play instruction not implemented');
    }

    private direct(label) {
        this.positionMain = label;
        this.wait = false;
        this.waiting = false;
    }

    private bobCol(number, start, end) {
        this.collisions = this.tvc.sprites.bobCol(number, this.extra, start, end);
    }
    private spriteCol(number, start, end) {
        this.collisions = this.tvc.sprites.spriteCol(number, start, end);
    }

    private z(mask) {
        var value = this.tvc.rnd(65536);
        if (typeof mask != 'undefined')
            value &= mask;
        return value;
    }
    private joystick(number) {
    }
    private setAMAL(number) {
    }
}