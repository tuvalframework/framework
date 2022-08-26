import { TVC } from './TVC';
import { TVCContext } from './TVCContext';

export class DataBank {
    tvc: TVC;
    banks: any;
    utilities: any;
    options: any;
    domain: any;
    type: any;
    path: any;
    context: TVCContext;
    public constructor(tvc: TVC, loadList, length, options) {
        this.tvc = tvc;
        this.banks = tvc.Banks;
        this.utilities = tvc.utilities;
        this.options = options;
        this.domain = options.domain;
        this.type = options.type;
        this.path = options.path;
        this.context = new TVCContext(this.tvc, this.domain, {});
        if (loadList)
            this.loadList(loadList, options.tags);
        else if (length > 0)
            this.context.setElement(this.domain, this.tvc.allocMemoryBlock(length, this.tvc.endian), 1, true);
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
    private getElement(index?) {
        var element;
        if (!index)
            element = this.context.getElement(this.domain, 1);
        else
            element = this.context.getElement(this.domain, index, 'bank_element_not_defined');
        if (element.tvc)
            return element;
        throw 'bank_element_not_defined';
    };
    private loadList(loadList, tags) {
        var self = this;
        tags = typeof tags == 'undefined' ? '' : tags;
        var indexMap = [];
        for (var i = 0; i < loadList.length; i++) {
            var element = loadList[i];
            var infos: any = this.context.getElementInfosFromFilename(this.domain, element.a, this.type, i + 1, indexMap);
            infos.path = './resources/' + this.path + '/' + element.a;
            infos.filename = element.b;
            this.utilities.loadUnlockedBankElement(infos.path, infos, function (response, data, extra) {
                if (response) {
                    var block: any = self.tvc.allocMemoryBlock(data, self.tvc.endian);
                    block.path = extra.path;
                    block.name = extra.name;
                    block.filename = extra.filename;
                    self.context.setElement(self.domain, block, extra.index, true);
                }
            }, infos);
        }
    }
    private save(path, tags) {
        var start = this.getElement();
        this.tvc.filesystem.saveBinary(path, {}, function (response, data, extra) {
            (self as any).load_done = true;
            if (!response)
                throw data;
        });
    }
    private add(index, name) {
        if (typeof name == 'undefined') {
            name = typeof index == 'string' ? index : this.domain + '#' + index;
        }
        this.context.setElement(this.domain, { name: name }, index, true);
    }
    private addRange(first, last, tags) {
        last = typeof last == 'undefined' ? first + 1 : last;
        if (last < first || first < 0 || last < 0)
            throw { error: 'illegal_function_call', parameters: [first, last] };
        for (var index = first; index < last; index++) {
            this.context.setElement(this.domain, { name: this.domain + '#' + index }, index, true);
        }
    }
    private setElement(index, block, tags) {
        this.context.setElement(this.domain, block, index, true);
    }
    private erase() {
        for (var block = this.context.getFirstElement(this.domain); block != null; block = this.context.getNextElement(this.domain))
            this.tvc.freeMemoryBlock(block);
    }
    private delete(index) {
        return this.context.deleteElement(this.domain, index);
    }

    private deleteRange(first, last) {
        return this.context.deleteRange(this.domain, first, last);
    }

    private getLength(index) {
        if (this.type == 'tracker') {
            if (typeof index == 'undefined')
                return this.context.numberOfElements;
            else
                return this.getElement(index).length;
        }
        var element = this.context.getElement(this.domain, 1);
        if (element && element.tvc)
            return element.length;
        return this.context.numberOfElements;
    }
    private setLength(newLength) {
        if (this.type == 'tracker')
            throw 'illegal_function_call';
        var element = this.context.getElement(this.domain, 1);

        // If MemoryBlock
        if (element && element.tvc) {
            element.setLength(newLength);
            return;
        }
        throw 'illegal_function_call';
    }
    private setTags(index, tags) {
    }
}
