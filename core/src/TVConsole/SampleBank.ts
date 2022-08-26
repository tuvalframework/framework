import { TVCContext } from "./TVCContext";
import { TVC } from './TVC';
import { Banks } from "./Banks";
import { Utilities } from './Utilities';

export class SampleBank {
    tvc: TVC;
    banks: Banks;
    utilities: Utilities;
    options: any;
    domain: any;
    type: any;
    path: any;
    context: TVCContext;
    public constructor(tvc: TVC, soundList, soundTypesList, options) {
        this.tvc = tvc;
        this.banks = tvc.Banks;
        this.utilities = tvc.utilities;
        this.options = options;
        this.domain = options.domain;
        this.type = options.type;
        this.path = options.path;
        this.context = new TVCContext(this.tvc, this.domain, {});
        if (soundList)
            this.loadList(soundList, soundTypesList, options.tags);
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
    private loadList(soundList, soundTypesList, tags) {
        var self = this;
        tags = typeof tags == 'undefined' ? '' : tags;
        var indexMap = [];
        for (var i = 0; i < soundList.length; i++) {
            var element = soundList[i];
            var infos: any = this.context.getElementInfosFromFilename(this.domain, element.a, this.type, i + 1, indexMap);
            infos.path = './resources/' + this.path + '/' + element.a;
            infos.filename = element.b;
            this.tvc.loadingMax++;
            this.utilities.loadMultipleUnlockedSound(infos.path, this.banks.numberOfSoundsToPreload, {}, function (response, soundsLoaded, extra) {
                if (response) {
                    var sound =
                    {
                        name: extra.name,
                        filename: extra.filename,
                        path: extra.path,
                        sounds: soundsLoaded,
                    };
                    self.context.setElement(this.domain, sound, extra.index, true);
                    if (typeof tags != 'undefined')
                        self.setTags(extra.index, tags);
                }
                self.tvc.loadingCount++;
            }, infos);
        }
    }
    private load(index, name, path, type, tags) {
        // TODO
    }

    private addSound(index, name, arrayBuffer, tags, callback, extra) {
        this.add(index, name, tags);
        callback(true, null, extra);
        /*
        var self = this;
        var buffer = new ArrayBuffer( );
        var sound = new Howl( { src: [] } );
        sound.on( "load", function()
        {
            self.tvc.loadingCount++;
        } );
        sound.on( "loaderror", function()
        {
            self.tvc.loadingCount++;
        } );
        this.setElement( index, sound, tags );
        */
    };
    private add(index, name, tags) {
        if (typeof name == 'undefined') {
            if (typeof index == 'string')
                name = index;
            else
                name = 'sound#' + index;
        }
        var sample =
        {
            name: name,
            filename: '',
            sounds: []
        }
        this.context.setElement(this.domain, sample, index, true);
        if (typeof tags != 'undefined')
            this.setTags(index, tags);
        return sample;
    };
    private addRange(first, last, tags) {
        last = typeof last == 'undefined' ? first + 1 : last;
        if (last < first || first < 0 || last < 0)
            throw { error: 'illegal_function_call', parameters: [first, last] };
        var result: any[] = [];
        for (var index = first; index < last; index++) {
            var sample =
            {
                name: 'sound#' + index,
                filename: '',
                sounds: []
            }
            result.push(sample);
            //for ( var i = 0; i < this.banks.numberOfSoundsToPreload; i++ )
            //	sample.sounds[ i ] = new p5.SoundFile();
            this.context.setElement(this.domain, sample, index, true);
            this.setTags(index, tags);
        }
        return result;
    };
    private setElement(index, sound, tags) {
        this.context.getElement(this.domain, index, 'sound_not_defined').sounds = [sound];
        this.setTags(index, tags);
    };
    private getElement(index) {
        return this.context.getElement(this.domain, index, 'sound_not_defined');
    };
    private getLength() {
        return this.context.getNumberOfElements(this.domain);
    };
    private setLength() {
        throw 'illegal_function_call';
    };
    private reset() {
        return this.context.reset(this.domain);
    };
    private delete(index) {
        return this.context.deleteElement(this.domain, index);
    };
    private deleteRange(first, last) {
        return this.context.deleteRange(this.domain, first, last);
    };
    private setTags(index, tags) {
    };
    private erase(index) {
    }
}
