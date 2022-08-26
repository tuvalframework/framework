import { AMALChannel } from './AMALChannel';
import { TVC } from './TVC';
import { Utilities } from './Utilities';

export class AMAL {
    tvc: TVC;
    utilities: Utilities;
    channels: any[];
    numberOfChannels: number;
    handle: boolean;
    isSynchro: boolean;
    private registers: any;
    callback: any;
    extra: any;
    public constructor(tvc: TVC) {
        this.tvc = tvc;
        this.utilities = tvc.utilities;
        this.channels = [];
        this.numberOfChannels = 0;
        this.handle = false;
        this.isSynchro = true;

        this.registers =
        {
            'A': 0,
            'B': 0,
            'C': 0,
            'D': 0,
            'E': 0,
            'F': 0,
            'G': 0,
            'H': 0,
            'I': 0,
            'J': 0,
            'K': 0,
            'L': 0,
            'M': 0,
            'N': 0,
            'O': 0,
            'P': 0,
            'Q': 0,
            'R': 0,
            'S': 0,
            'T': 0,
            'U': 0,
            'V': 0,
            'W': 0,
            'X': 0,
            'Y': 0,
            'Z': 0
        };
    }
    private setSynchro(onOff) {
        this.isSynchro = onOff;
    }
    private synchro() {
        if (!this.isSynchro)
            this.doSynchro();
    }
    public setOnOff(onOff, channelNumber) {
        if (typeof channelNumber == 'undefined') {
            for (var c = 0; c < this.channels.length; c++) {
                if (this.channels[c])
                    this.channels[c].onOff = onOff;
            }
        }
        else {
            if (channelNumber < 0)
                throw { error: 'illegal_function_call', parameter: channelNumber };
            if (!this.channels[channelNumber])
                throw { error: 'channel_not_opened', parameter: channelNumber };
            this.channels[channelNumber].onOff = onOff;
        }
    };
    private freeze(onOff, channelNumber) {
        if (typeof channelNumber == 'undefined') {
            for (var c = 0; c < this.channels.length; c++) {
                if (this.channels[c])
                    this.channels[c].freeze = onOff;
            }
        }
        else {
            if (channelNumber < 0)
                throw { error: 'illegal_function_call', parameter: channelNumber };
            if (!this.channels[channelNumber])
                throw { error: 'channel_not_opened', parameter: channelNumber };
            this.channels[channelNumber].freeze = onOff;
        }
    };
    private getChannel(channelNumber) {
        if (channelNumber < 0)
            throw { error: 'illegal_function_call', parameter: channelNumber };
        return this.channels[channelNumber];
    }

    public runChannel(channel, code, callback, extra?) {
        var channelNumber = channel.channelNumber;
        if (channelNumber < 0)
            throw { error: 'illegal_function_call', parameter: channelNumber };
        if (this.channels[channelNumber]) {
            // Same program already running-> restart channel
            if (code == this.channels[channelNumber].code) {
                this.channels[channelNumber].reset();
                callback(true, null, extra);
                return;
            }
            this.channels[channelNumber].destroy();
            this.channels[channelNumber] = null;
            this.numberOfChannels--;
        }
        var name = 'AMALChannel' + channelNumber;
        this.callback = callback;
        this.extra = extra;

        var self = this;
        this.channels[channelNumber] = new AMALChannel(this.tvc, this, code, name, channelNumber, function (response, data, extra) {
            if (response) {
                callback(true, null, extra);
            }
            else {
                callback(false, null, extra);
            }
        }, extra);
        this.numberOfChannels++;
    };
    public doSynchro() {
        var count = 0;
        for (var c = 0; c < this.channels.length && count < this.numberOfChannels; c++) {
            var channel = this.channels[c];
            if (channel && channel.onOff) {
                if (channel.amalProgram) {
                    channel.update();
                }
                count++;
            }
        }
    };
    private setChannelPosition(channelNumber, x, y, image) {
        if (channelNumber < 0)
            throw { error: 'illegal_function_call', parameter: channelNumber };
        var channel = this.channels[channelNumber];
        if (channel) {
            channel.registers.x = x;
            channel.registers.y = y;
            channel.registers.a = image;
            return true;
        }
        return false;
    };
    private setRegister(value, registerNumber, channelNumber) {
        if (registerNumber < 0)
            throw { error: 'illegal_function_call', parameter: registerNumber };
        if (typeof channelNumber == 'undefined') {
            if (registerNumber > 25)
                throw { error: 'illegal_function_call', parameter: registerNumber };
            this.registers[String.fromCharCode(registerNumber + 65)] = value;
        }
        else {
            if (registerNumber > 10)
                throw { error: 'illegal_function_call', parameter: registerNumber };
            if (this.channels[channelNumber] == null)
                throw { error: 'channel_not_opened', parameter: channelNumber };
            this.channels[channelNumber].registers[registerNumber] = value;
        }
    };
    private getRegister(registerNumber, channelNumber) {
        if (registerNumber < 0)
            throw { error: 'illegal_function_call', parameter: registerNumber };
        if (typeof channelNumber == 'undefined') {
            if (registerNumber > 25)
                throw { error: 'illegal_function_call', parameter: registerNumber };
            return this.registers[String.fromCharCode(registerNumber + 65)];
        }
        else {
            if (registerNumber > 10)
                throw { error: 'illegal_function_call', parameter: registerNumber };
            if (this.channels[channelNumber] == null)
                throw { error: 'channel_not_opened', parameter: channelNumber };
            return this.channels[channelNumber].registers[registerNumber];
        }
        return 0;
    };
    private isChannelAnimated(channelNumber) {
        if (channelNumber < 0)
            throw { error: 'illegal_function_call', parameter: channelNumber };
        if (this.channels[channelNumber])
            return this.channels[channelNumber].animCounter > 0;
        return false;
    };
    private isChannelMoving(channelNumber) {
        if (channelNumber < 0)
            throw { error: 'illegal_function_call', parameter: channelNumber };
        if (this.channels[channelNumber])
            return !this.channels[channelNumber].wait;	//this.channels[ channelNumber ].moveCounter > 0;
        return false;
    };

}
