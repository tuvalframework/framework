import { TVC } from './TVC';

declare var v;
declare var sourceAdress;
// Memory block class
export class MemoryBlock {
    tvc: TVC;
    buffer: any;
    bufferView: Uint8Array;
    length: number;
    endian: any;
    MemoryBlock: boolean;
    memoryHash: number = undefined as any;
    filename: any;

    public constructor(tvc: TVC, buffer, endian) {
        this.tvc = tvc;
        if (typeof buffer === 'number')
            buffer = new ArrayBuffer(buffer);
        this.buffer = buffer;
        this.bufferView = new Uint8Array(buffer);
        this.length = this.bufferView.byteLength;
        this.endian = typeof endian != 'undefined' ? endian : 'big';
        this.MemoryBlock = true;
    }
    private setLength(newLength) {
        if (newLength !== this.length) {
            if (newLength < 0)
                throw { error: 'illegal_function_call', parameter: newLength };

            var currentBufferView = this.bufferView;
            this.buffer = new ArrayBuffer(newLength);
            this.bufferView = new Uint8Array(this.buffer);
            var l = Math.min(newLength, this.length);
            for (var p = 0; p < l; p++)
                this.bufferView[p] = currentBufferView[p];
            this.length = newLength;
            return true;
        }
        return false;
    };
    private extractString(address, length) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (length < 0)
            throw { error: 'illegal_function_call', parameter: length };
        if (address + length > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: length };
        var result = '';
        for (var l = 0; l < length; l++) {
            var c: any = this.bufferView[address + l];
            if (c == 0)
                break;
            if (c < 32)
                c = ' ';
            result += String.fromCharCode(c);
        }
        return result;
    };
    private extractArrayBuffer(start, end) {
        start = start - Math.floor(start / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        end = end - Math.floor(end / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        var length = end - start;
        if (length < 0 || start + length > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: length };
        var buffer = new ArrayBuffer(length);
        var view = new Uint8Array(buffer);
        for (var l = 0; l < length; l++) {
            view[l] = this.bufferView[start + l];
        }
        return buffer;
    };
    private extractArrayBufferLength(start, length) {
        start = start - Math.floor(start / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (length < 0 || start + length > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: length };
        var buffer = new ArrayBuffer(length);
        var view = new Uint8Array(buffer);
        for (var l = 0; l < length; l++) {
            view[l] = this.bufferView[start + l];
        }
        return buffer;
    };
    private peek(address, signed) {

        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (address > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        if (signed && v >= 0x80)
            return -(0x100 - v);
        return this.bufferView[address];
    }
    private deek(address, signed) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (address + 2 > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        var v;
        if (this.endian == 'big') {
            v = (this.bufferView[address] & 0xFF) << 8 | this.bufferView[address + 1] & 0xFF;
        }
        else {
            v = (this.bufferView[address + 1] & 0xFF) << 8 | this.bufferView[address] & 0xFF;
        }
        if (signed && v >= 0x8000)
            return -(0x10000 - v);
        return v;
    }
    private leek(address, signed) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (address + 4 > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        var v;
        if (this.endian == 'big') {
            v = (this.bufferView[address] & 0xFF) << 24 | (this.bufferView[address + 1] & 0xFF) << 16 | (this.bufferView[address + 2] & 0xFF) << 8 | this.bufferView[address + 3] & 0xFf;
        }
        else {
            v = (this.bufferView[address + 3] & 0xFF) << 24 | (this.bufferView[address + 2] & 0xFF) << 16 | (this.bufferView[address + 1] & 0xFF) << 8 | this.bufferView[address] & 0xFF;
        }
        if (signed && v >= 0x80000000)
            return -(0x100000000 - v);
        return v;
    };
    private poke(address, value) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        value &= 0xFF;
        if (address >= this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        this.bufferView[address] = value;
    };
    private doke(address, value) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        value &= 0xFFFF;
        if (address + 2 > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        if (this.endian == 'big') {
            this.bufferView[address] = (value >> 8) & 0xFF;
            this.bufferView[address + 1] = value & 0xFF;
        }
        else {
            this.bufferView[address] = value & 0xFF;
            this.bufferView[address + 1] = (value & 0xFF) >> 8;
        }
    };
    private loke(address, value) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        value &= 0xFFFFFFFF;
        if (address + 4 > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        if (this.endian == 'big') {
            this.bufferView[address] = (value >> 24) & 0xFF;
            this.bufferView[address + 1] = (value >> 16) & 0xFF;
            this.bufferView[address + 2] = (value >> 8) & 0xFF;
            this.bufferView[address + 3] = value & 0xFF;
        }
        else {
            this.bufferView[address] = value & 0xFF;
            this.bufferView[address + 1] = (value >> 8) & 0xFF;
            this.bufferView[address + 2] = (value >> 16) & 0xFF;
            this.bufferView[address + 3] = (value >> 24) & 0xFF;
        }
    };
    private pokeArrayBuffer(address, buffer) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        var view = new Uint8Array(buffer);
        if (address + view.length > this.bufferView.length)
            throw { error: 'illegal_function_call', parameter: address };
        for (var b = 0; b < view.length; b++)
            this.bufferView[address + b] = view[b];
    };
    private poke$(address, text) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        if (address + text.length > this.bufferView.byteLength)
            throw { error: 'illegal_function_call', parameter: address };
        for (var p = 0; p < text.length; p++)
            this.bufferView[address + p] = text.charCodeAt(p) & 0xFF;
    };
    private peek$(address, length, stop) {
        address = address - Math.floor(address / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        var text = '';
        for (var p = 0; p < length; p++) {
            var c = String.fromCharCode(this.bufferView[address + p]);
            if (c == stop)
                break;
            if (address + p > this.bufferView.byteLength)
                throw { error: 'illegal_function_call', parameter: address };
            text += c;
        }
        return text;
    };
    private fill(start, end, value) {
        start = start - Math.floor(start / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        end = end - Math.floor(end / this.tvc.memoryHashMultiplier) * this.tvc.memoryHashMultiplier;
        var length = end - start;
        if (length < 0 || start + length > this.bufferView.byteLength)
            throw { error: 'illegal_function_call', parameter: length };

        for (var p = 0; p <= length - 4; p += 4)
            this.loke(start + p, value);
        for (; p < length; p++) {
            if (this.endian == 'big') {
                this.poke(start + p, (value & 0xFF000000) >> 24);
                value = value << 8;
            }
            else {
                this.poke(start + p, value & 0xFF);
                value = value >> 8;
            }
        }
    };
    private copyTo(sourceAddress, destinationBlock, destinationAddress, length) {

        if (sourceAdress + length > this.bufferView.byteLength || destinationAddress + length > destinationBlock.bufferView.byteLength)
            throw { error: 'illegal_function_call', parameter: length };
        if (destinationBlock == this) {
            if (destinationAddress < sourceAddress) {
                for (var p = 0; p < length; p++)
                    this.bufferView[destinationAddress + p] = this.bufferView[sourceAddress + p];
            }
            else {
                for (var p = length - 1; p >= 0; p--)
                    this.bufferView[destinationAddress + p] = this.bufferView[sourceAddress + p];
            }
        }
        else {
            for (var p = 0; p < length; p++)
                destinationBlock.bufferView[destinationAddress + p] = this.bufferView[sourceAddress + p];
        }
    };
    private copyFrom(destinationAddress, sourceBlock, sourceAddress, length) {
        if (destinationAddress + length > this.bufferView.byteLength || sourceAddress + length > sourceBlock.bufferView.byteLength)
            throw { error: 'illegal_function_call', parameter: length };
        if (sourceBlock == this) {
            if (destinationAddress < sourceAddress) {
                for (var p = 0; p < length; p++)
                    this.bufferView[destinationAddress + p] = this.bufferView[sourceAddress + p];
            }
            else {
                for (var p = length - 1; p >= 0; p--)
                    this.bufferView[destinationAddress + p] = this.bufferView[sourceAddress + p];
            }
        }
        else {
            for (var p = 0; p < length; p++)
                this.bufferView[destinationAddress + p] = sourceBlock.bufferView[sourceAddress + p];
        }
    };
    private copyArray(address, sourceArray, type, length) {
        length = typeof length == 'undefined' ? sourceArray.length : length;
        switch (type) {
            default:
            case 'byte':
                for (var p = 0; p < length; p++) {
                    if (typeof sourceArray[p] == 'string')
                        this.poke(address + p, sourceArray[p].charCodeAt(0));
                    else
                        this.poke(address + p, sourceArray[p]);
                }
                break; ``
            case 'word':	// TODO
                debugger;
                for (var p = 0; p < length; p++) {
                    if (typeof sourceArray[p] == 'string')
                        this.poke(address + p * 2, sourceArray[p].charCodeAt(0));
                    else
                        this.poke(address + p, sourceArray[p]);
                }
                break;
            case 'dword':	// TODO
                debugger;
                for (var p = 0; p < length; p++)
                    this.loke(address + p * 4, sourceArray[p]);
                break;
        }
    };
    private hunt(start, end, text) {
        var length = end - start;
        if (length < 0)
            throw { error: 'illegal_function_call', parameter: length };
        if (start + text.length > this.bufferView.byteLength)
            return 0;
        for (var i = 0; i < length - text.length; i++) {
            for (var j = 0; j < text.length; j++) {
                if ((this.bufferView[start + i + j] as any) !== (text.charCodeAt(j) & 0xFF))
                    break;
            }
            if (j == text.length)
                return this.memoryHash * this.tvc.memoryHashMultiplier + i;
        }
        return 0;
    }
}