import { TVC } from './TVC';
import { DataBank } from './DataBank';
import { ImageBank } from './ImageBank';
import { SampleBank } from './SampleBank';
import { Utilities } from './Utilities';
export class Banks {
    tvc: TVC;
    utilities: Utilities;
    manifest: any;
    banks: any[];
    quickBanks: any;
    numberOfSoundsToPreload: any;
    soundPoolSize: any;
    numberOfReserves: number;
    collisionPrecision: any;
    domain: any;
    public constructor(tvc: TVC) {
        this.tvc = tvc;
        this.tvc.Banks = this;
        this.utilities = tvc.utilities;
        this.manifest = tvc.manifest;
        this.banks = [];
        this.quickBanks = {};
        this.numberOfSoundsToPreload = typeof this.tvc.manifest.sounds.numberOfSoundsToPreload == 'undefined' ? 4 : this.tvc.manifest.sounds.numberOfSoundsToPreload;
        this.soundPoolSize = this.tvc.manifest.sounds.soundPoolSize;
        this.numberOfReserves = 0;
        this.collisionPrecision = this.tvc.manifest.sprites.collisionPrecision;

        this.banks[1] = {};
        this.banks[2] = {};
        this.banks[3] = {};
        this.quickBanks["application"] = {};
        this.banks[1]['application'] = new ImageBank(this.tvc, [], ["#000000", "#FFFFFF", "#000000", "#222222", "#FF0000", "#00FF00", "#0000FF", "#666666", "#555555", "#333333", "#773333", "#337733", "#777733", "#333377", "#773377", "#337777", "#000000", "#EECC88", "#CC6600", "#EEAA00", "#2277FF", "#4499DD", "#55AAEE", "#AADDFF", "#BBDDFF", "#CCEEFF", "#FFFFFF", "#440088", "#AA00EE", "#EE00EE", "#EE0088", "#EEEEEE"], { hotSpots: [], alpha: false, domain: 'images', type: 'images', path: '1.images' });
        this.banks[2]['application'] = new ImageBank(this.tvc, [], ["#000000", "#FFFFFF", "#000000", "#222222", "#FF0000", "#00FF00", "#0000FF", "#666666", "#555555", "#333333", "#773333", "#337733", "#777733", "#333377", "#773377", "#337777", "#000000", "#EECC88", "#CC6600", "#EEAA00", "#2277FF", "#4499DD", "#55AAEE", "#AADDFF", "#BBDDFF", "#CCEEFF", "#FFFFFF", "#440088", "#AA00EE", "#EE00EE", "#EE0088", "#EEEEEE"], { hotSpots: [], alpha: false, domain: 'icons', type: 'icons', path: '2.icons' });
        this.banks[3]['application'] = new DataBank(this.tvc, [], 0, { domain: 'musics', type: 'musics', path: '3.musics' });


        // Poke the indexes and reservation numbers.
        for (var b = 0; b < this.banks.length; b++) {
            if (this.banks[b]) {
                for (var c in this.banks[b]) {
                    var bank = this.banks[b][c];
                    if (bank) {
                        bank.index = b;
                        bank.reserveNumber = this.numberOfReserves++;
                    }
                }
            }
        }
    }


    private reserve(number, type, length, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        if (number < 0)
            throw { error: 'illegal_function_call', parameter: number };
        if (!this.manifest.unlimitedBanks && number > 16)
            throw { error: 'illegal_function_call', parameter: number };

        var length = typeof length == 'undefined' ? 0 : length;
        if (length < 0)
            throw { error: 'illegal_function_call', parameter: length };
        if (!type || type == '')
            throw { error: 'illegal_function_call', parameter: type };

        var bank = this.banks[number];
        if (!bank)
            this.banks[number] = {};
        type = type.toLowerCase();
        var bank, copyBlock = false;
        switch (type) {
            case 'images':
                bank = new ImageBank(this.tvc, [], this.tvc.manifest.default.screen.palette, { domain: type, type: type });
                break;
            case 'icons':
                bank = new ImageBank(this.tvc, [], this.tvc.manifest.default.screen.palette, { domain: type, type: type });
                break;
            case 'musics':
                bank = new SampleBank(this.tvc, [], [], { domain: type, type: type });
                break;
            case 'samples':
                bank = new SampleBank(this.tvc, [], [], { domain: type, type: type });
                break;
            case 'picpac':
            case 'amal':
                bank = new DataBank(this.tvc, undefined, 0, { domain: type, type: type });
                break;
            case 'work':
            case 'tracker':
            case 'data':
            default:
                bank = new DataBank(this.tvc, undefined, length, { domain: type, type: type });
                copyBlock = true;
                break;
        }
        bank.reserveNumber = this.numberOfReserves++;
        bank.index = number;
        this.banks[number][contextName] = bank;
        this.quickBanks[contextName] = {};
        return bank;
    };
    private erase(bankIndex, noError, contextName?) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        if (bankIndex < 1 || (!this.tvc.unlimitedBanks && bankIndex > 16)) {
            if (!noError)
                throw { error: 'illegal_function_call', parameter: bankIndex };
            return;
        }

        if (!this.banks[bankIndex] || !this.banks[bankIndex][contextName]) {
            if (!noError)
                throw 'bank_not_reserved';
            return;
        }
        this.getBank(bankIndex, contextName).erase();
        this.banks[bankIndex] = this.utilities.cleanObject(this.banks[bankIndex], contextName);
        this.quickBanks[contextName] = {};
    };
    private eraseTemp(bankIndex, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        for (var b = 0; b < this.banks.length; b++) {
            if (this.banks[b] && this.banks[b][contextName]) {
                var bank = this.banks[b][contextName];
                if (bank.isType('work')) {
                    this.erase(b, contextName);
                    this.updateBank(null, b, contextName);
                }
            }
        }
    };
    private eraseAll(bankIndex, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        for (var b = 0; b < this.banks.length; b++) {
            if (this.banks[b] && this.banks[b][contextName]) {
                this.erase(b, contextName);
                this.updateBank(null, b, contextName);
            }
        }
    };
    private updateBank(bank, bankIndex, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        this.tvc.screensContext.parseAll(contextName, function (screen) {
            screen.updateBank(bank, bankIndex, contextName)
        });
        if (this.tvc.sprites) {
            this.tvc.sprites.updateBank(bank, bankIndex, contextName);
        }
    }

    private bankShrink(bankIndex, newLength, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        var bank = this.getBank(bankIndex, contextName);
        bank.setLength(newLength);
        this.updateBank(bank, bankIndex, contextName);
    }

    private bankSwap(bankIndex1, bankIndex2, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;

        if (bankIndex1 < 1 || bankIndex2 < 1 || typeof bankIndex1 == 'undefined' || typeof bankIndex2 == 'undefined')
            throw { error: 'illegal_function_call', parameters: [bankIndex1, bankIndex2] };
        if (!this.manifest.unlimitedBanks && (bankIndex1 > 16 || bankIndex2 > 16))
            throw { error: 'illegal_function_call', parameters: [bankIndex1, bankIndex2] };

        if (!this.banks[bankIndex1][contextName] || !this.banks[bankIndex2][contextName])
            throw 'bank_not_reserved';

        // Swap!
        var bank1 = this.banks[bankIndex1][contextName];
        var bank2 = this.banks[bankIndex2][contextName];
        this.banks[bankIndex1][contextName] = bank2;
        this.banks[bankIndex2][contextName] = bank1;
        bank2.index = bankIndex1;
        bank1.index = bankIndex2;

        // Update banks
        this.quickBanks[contextName] = {};
        this.updateBank(bank1, bank1.index, contextName);
        this.updateBank(bank2, bank2.index, contextName);
    }

    public getBank(bankIndex, contextName?, bankType?, throwError = true) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        try {
            if (typeof bankIndex == 'undefined') {
                if (typeof bankType == 'undefined')
                    throw { error: 'illegal_function_call', parameter: '' };
                if (bankType == 'images' || bankType == 'icons' || bankType == 'musics' || bankType == 'samples' || bankType == 'amal') {
                    if (this.quickBanks[contextName] && this.quickBanks[contextName][bankType])
                        return this.quickBanks[contextName][bankType];
                    for (var b = 0; b < this.banks.length; b++) {
                        if (this.banks[b]) {
                            var bank = this.banks[b][contextName];
                            if (bank && bank.isType(bankType)) {
                                this.quickBanks[contextName][bankType] = bank;
                                return bank;
                            }
                        }
                    }
                }
                throw 'bank_not_reserved';
            }
            if (bankIndex < 1)
                throw { error: 'illegal_function_call', parameter: bankIndex };
            if (!this.tvc.unlimitedBanks && bankIndex > 16)
                throw { error: 'illegal_function_call', parameter: bankIndex };

            if (!this.banks[bankIndex])
                throw 'bank_not_reserved';
            var bank = this.banks[bankIndex][contextName];
            if (!bank)
                throw 'bank_not_reserved';
            if (bankType && !bank.isType(bankType))
                throw 'bank_type_mismatch';
        }
        catch (err) {
            if (throwError)
                throw err;
            return undefined;
        }
        return bank;
    }

    private getBankElement(bankIndex, elementNumber, contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        return this.getBank(bankIndex, contextName).getElement(elementNumber);
    }

    public getStart(bankIndex, contextName?, elementNumber?) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        elementNumber = typeof elementNumber == 'undefined' ? 1 : elementNumber;
        var bank = this.getBank(bankIndex, contextName);
        if (bank.type == 'tracker' || bank.type == 'data' || bank.type == 'work')
            return bank.getElement(elementNumber).memoryHash * this.tvc.memoryHashMultiplier;
        throw 'bank_type_mismatch';
    }

    public getLength(bankIndex, contextName?) {
        var bank = this.getBank(bankIndex, contextName, undefined, false);
        if (!bank)
            return 0;
        return bank.getLength();
    }

    private listBank(contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        for (var b = 0; b < this.banks.length; b++) {
            if (this.banks[b]) {
                var bank = this.banks[b][contextName];
                if (bank && bank.getLength()) {
                    this.tvc.currentScreen.currentTextWindow.printUsing('###', [b], false);
                    this.tvc.currentScreen.currentTextWindow.print(' - ', false);
                    this.tvc.currentScreen.currentTextWindow.printUsing('~~~~~~~~~~~~~~~~~ L: ', [bank.domain], false);
                    this.tvc.currentScreen.currentTextWindow.print('' + bank.getLength(), true);
                }
            }
        }
    }

    private loadFileToBank(pathOrDescriptor, bankIndex, bankType, options, callback, extra) {
        options = typeof options == 'undefined' ? options : {};
        var contextName = typeof options.contextName == 'undefined' ? this.tvc.currentContextName : options.contextName;

        var descriptor;
        if (typeof pathOrDescriptor == 'string') {
            descriptor = this.tvc.filesystem.getFile(pathOrDescriptor, { noErrors: true });
            if (descriptor.error)
                callback(false, descriptor.error, extra);
        }
        else {
            descriptor = pathOrDescriptor;
        }

        var self = this;
        this.tvc.filesystem.loadFile(descriptor, { binary: true }, function (response, arrayBuffer, extra) {
            if (response) {
                var block = self.tvc.allocMemoryBlock(arrayBuffer, 'big');
                var bank = self.tvc.Banks.reserve(bankIndex, bankType, block.length, contextName);
                var elementIndex = typeof options.elementIndex == 'undefined' ? 1 : options.elementIndex;
                if (elementIndex < 0) {
                    callback(false, 'illegal_function_call', extra);
                    return;
                }
                block.filename = descriptor.name;
                bank.setElement(elementIndex, block);
                callback(true, bank, extra);
            }
            else {
                callback(false, 'cannot_load_file', extra);
            }
        }, extra);
    };

    ///////////////////////////////////////////////////////////////////////////
    // IMAGE / ICONS BANK
    ///////////////////////////////////////////////////////////////////////////
    public getImage(bankName, index, contextName, bankIndex?) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        return this.getBank(bankIndex, contextName, bankName).getElement(index);
    };
    private setImageHotSpot(bankName, index, position, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.getBank(bankIndex, contextName, bankName).setHotSpot(index, position);
    };
    private getImageHotSpot(bankName, index, position, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        return this.getBank(bankIndex, contextName, bankName).getHotSpot(index, position);
    }

    public insertImage(bankName, index, name, tags, contextName, bankIndex, canvas, hotSpot?) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        const bank = this.getBank(bankIndex, contextName, bankName);
        bank.add(index, name, tags);
        if (canvas)
            bank.setElement(index, canvas, hotSpot);
    }

    private insertImageRange(bankName, first, last, tags, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.getBank(bankIndex, contextName, bankName).addRange(first, last, tags);
    };
    private insertImageFromArray(bankName, arrayIndex, arrayNames, tags, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, bankName);
        arrayNames = typeof arrayNames == 'undefined' ? {} : arrayNames;
        for (var i in arrayIndex)
            bank.add(arrayIndex[i], arrayNames[i], tags);
    }
    private setImageCanvas(bankName, index, canvas, tags, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.getBank(bankIndex, contextName, bankName).getElement(index).setElement(canvas);
    }
    private deleteImage(bankName, index, contextName, _contextName) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(index, contextName, bankName);
        if (typeof index == 'undefined')
            bank.reset();
        else
            bank.delete(index);
    }
    private deleteImageRange(bankName, first, last, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, bankName);
        if (typeof first == 'undefined' && typeof last == 'undefined')
            bank.reset();
        else {
            last = typeof last != 'undefined' ? last : first + 1;
            bank.deleteRange(first, last);
        }
    }
    private deleteImagesFromArray(bankName, _array, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, bankName);
        for (var i in _array)
            bank.delete(_array[i]);
    }
    private getImagePalette(bankName, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        return this.getBank(bankIndex, contextName, bankName).getPalette();
    };
    private processMask(bankName, index, onOff, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, bankName);
        var from = onOff ? { r: 0, g: 0, b: 0, a: 255 } : { r: 0, g: 0, b: 0, a: 0 };
        var to = onOff ? { r: 0, g: 0, b: 0, a: 0 } : { r: 0, g: 0, b: 0, a: 255 };
        if (typeof index != 'undefined') {
            var element = bank.getElement(index);
            var canvas = element.getCanvas();
            var context = canvas.getContext('2d');
            this.utilities.remapBlock(context, [from], [to], { x: 0, y: 0, width: canvas.width, height: canvas.height });
        }
        else {
            var self = this;
            bank.context.parseAll(contextName, function (element) {
                var canvas = element.getCanvas();
                var context = canvas.getContext('2d');
                self.utilities.remapBlock(context, [from], [to], { x: 0, y: 0, width: canvas.width, height: canvas.height });
            });
        }
    }




    //////////////////////////////////////////////////////////////////////////
    //
    // SOUND BANK
    //
    //////////////////////////////////////////////////////////////////////////
    private getSound(index, callback, extra, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, 'samples');
        var sample = bank.getElement(index);

        // TODO!
        if (!sample.sounds.playing)
            callback(false, null, extra);

        // A free sound?
        var sound;
        for (var s = 0; s < sample.sounds.length; s++) {
            sound = sample.sounds[s];
            if (sound && !sound.playing()) {
                callback(true, sound, extra);
                return;
            }
        }

        // Load a new one?
        if (sample.sounds.length < this.soundPoolSize && sample.filename) {
            this.utilities.loadUnlockedSound(sample.pathname, { keepSource: true }, function (response, soundLoaded, number) {
                if (response) {
                    //for ( var i = 0; i < this.banks.numberOfSoundsToPreload; i++ )
                    //	sample.sounds[ i ] = new p5.SoundFile();
                    sample.sounds.push(soundLoaded);
                    callback(true, soundLoaded, extra);
                    return;
                }
                callback(false, null, extra);
            }, s);
            return;
        }
        callback(false, null, extra);
    }
    private insertSample(index, name, tags, sample, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, 'samples');
        bank.add(index, name, tags);
        if (typeof sample != 'undefined')
            bank.setElement(index, sample, tags);
    }
    private insertSampleRange(first, last, tags, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.getBank(bankIndex, contextName, 'samples').addRange(first, last, tags);
    }
    private deleteSample(index, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        this.getBank(bankIndex, contextName, 'samples').delete(index);
    }
    private deleteSampleRange(first, last, contextName, bankIndex) {
        contextName = typeof contextName == 'undefined' ? this.tvc.currentContextName : contextName;
        var bank = this.getBank(bankIndex, contextName, 'samples');
        if (typeof first == 'undefined' && typeof last == 'undefined') {
            bank.reset(this.domain);
        }
        else {
            last = typeof last != 'undefined' ? last : first + 1;
            bank.deleteRange(first, last);
        }
    }
}


