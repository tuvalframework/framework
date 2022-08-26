import { TVC } from './TVC';

////////////////////////////////////////////////////////////////////////////
//
// Context management: tvc-3 here we come -> will drive everything!
//
////////////////////////////////////////////////////////////////////////////
export class TVCContext {
    tvc: TVC;
    options: any;
    domain: any;
    contexts: any;
    list: any;
    listNames: any;
    listSorted: any[];
    listSortedInContext: any
    numberOfElements: number;
    numberOfElementsInContext: any;
    firstIndex: any;
    flatList: any;
    lastIndex: any;
    indexSorted: any;
    public constructor(tvc:TVC, domain, options) {
        this.tvc = tvc;
        this.options = options;
        this.domain = domain;
        this.contexts = {};
        this.list = {};
        this.listNames = {};
        this.listSorted = [];
        this.listSortedInContext = {};
        this.numberOfElements = 0;
        this.numberOfElementsInContext = {};
        if (domain)
            this.addContext(domain);
    }

    public addContext(contextName) {
        if (!this.contexts[contextName]) {
            this.numberOfElementsInContext[contextName] = 0;
            if (this.options.sorted)
                this.listSortedInContext[contextName] = [];
            this.contexts[contextName] = true;
        }
    };
    public reset(contextName) {
        if (contextName) {
            var temp = {};
            var count = 0;
            for (var i in this.list) {
                if (this.list[i].contextName != contextName) {
                    temp[i] = this.list[i];
                    count++;
                }
            }
            this.list = temp;
            this.numberOfElements = count;

            temp = {};
            count = 0;
            for (var i in this.listNames) {
                if (this.listNames[i].contextName != contextName) {
                    temp[i] = this.listNames[i];
                    count++;
                }
            }
            this.listNames = temp;

            this.numberOfElementsInContext[contextName] = 0;

            if (this.options.sorted) {
                const temp: any[] = [];
                for (let i = 0; i < this.listSorted.length; i++) {
                    if (this.listSorted[i].contextName != contextName)
                        temp.push(this.list[i]);
                }
                this.listSorted = temp;
                this.listSortedInContext[contextName] = [];
            }
        }
        else {
            this.list = {};
            this.listNames = {};
            this.numberOfElements = 0;
            for (var name in this.contexts) {
                this.numberOfElementsInContext[name] = 0;
                if (this.options.sorted)
                    this.listSortedInContext[name] = [];
            }
        }
    }
    public getElementInfosFromFilename(contextName, filename, type, index?, indexMap?) {
        var newIndex, name;
        var firstDot = filename.indexOf('.');
        if (firstDot >= 0) {
            newIndex = parseInt(filename.substring(0, firstDot));
            if (!isNaN(newIndex)) {
                var lastDot = filename.lastIndexOf('.');
                if (lastDot >= firstDot) {
                    name = filename.substring(firstDot + 1, lastDot);
                    index = newIndex;
                }
            }
            else {
                newIndex = undefined;
            }
        }
        if (typeof name == 'undefined') {
            if (firstDot >= 0)
                name = filename.substring(0, firstDot);
            else
                name = filename;
        }
        if (typeof newIndex == 'undefined') {
            if (typeof index == 'undefined')
                index = this.getFreeIndex(contextName, indexMap)
        }
        return { name: name, index: index };
    };
    private getFreeIndex(contextName, indexMap) {
        contextName = contextName ? contextName : this.domain;
        for (var index = 1; index < 1000000; index++) {
            if (!this.list[contextName + ':' + index]) {
                if (indexMap && !indexMap[index]) {
                    indexMap[index] = true;
                    return index;
                }
            }
        }
        return -1;
    }

    public getElement(contextName, index, errorString?) {
        if (typeof index == 'number') {
            if (index < 0)
                throw { error: 'illegal_function_call', parameter: index };

            contextName = contextName ? contextName : this.domain;
            var contextIndex = contextName + ':' + index;
            if (this.list[contextIndex])
                return this.list[contextIndex];
        }
        else {
            contextName = contextName ? contextName : this.domain;
            var contextIndex = contextName + ':' + index;
            if (this.listNames[contextIndex])
                return this.listNames[contextIndex];
        }
        if (errorString)
            throw errorString;
        return null;
    };
    private getProperty(contextName, index, propertyName, errorString) {
        var element = this.getElement(contextName, index, errorString);
        if (element)
            return element[propertyName];
        return undefined;
    };
    private setProperty(contextName, index, propertyName, value, errorString) {
        var element = this.getElement(contextName, index, errorString);
        if (element)
            element[propertyName] = value;
        return element;
    };
    private setRangeProperties(contextName, first, last, propertyName, value, errorString) {
        first = typeof first == 'undefined' ? 0 : first;
        if (typeof last == 'undefined') {
            if (first == 0) {
                this.reset(contextName);
                return;
            }
            last = this.getNumberOfElements(contextName);
        }
        if (typeof first == 'number' && typeof last == 'number') {
            if (last < first)
                throw { error: 'illegal_function_call', parameter: '' };

                let index;
            for (var count = first; count < last; count++) {
                var element = this.getElement(contextName, index, errorString);
                if (element)
                    element[propertyName] = value;
            }
            return;
        }
        throw 'type_mismatch';

    }
    public setElement(contextName, element, index, replace = true, errorString = 'internal_error') {
        if (typeof index == 'number' && index < 0)
            throw { error: 'illegal_function_call', parameter: index };

        contextName = contextName ? contextName : this.domain;
        if (typeof index == 'undefined')
            index = (this as any).getLastIndex(contextName);
        var contextIndex = contextName + ':' + index;
        var contextIndexName;
        if (element.name)
            contextIndexName = contextName + ':' + element.name;
        else if (typeof index == 'string') {
            element.name = index;
            contextIndexName = contextName + ':' + index;
        }
        else {
            element.name = 'item_' + Math.random() * 1000000;
            contextIndexName = contextName + ':' + element.name;
        }
        if (this.list[contextIndex]) {
            if (!replace) {
                if (errorString && errorString != '') throw errorString;
                console.log('TVCContext:setElement failed.');
                return -1;
            }
            this.deleteElement(contextName, index);
        }

        // Insert data into element
        element.index = index;
        element.indexIsNumber = (typeof index == 'number');
        element.contextIndex = contextIndex;
        element.contextIndexName = contextIndexName;
        element.contextName = contextName;
        this.list[contextIndex] = element;
        this.listNames[contextIndexName] = element;
        this.numberOfElements++;
        this.numberOfElementsInContext[contextName]++;

        // Position in sorted list
        if (this.options.sorted) {
            element.indexSorted = this.listSorted.length;
            this.listSorted.push(element);
            element.indexSortedInContext = this.listSortedInContext[contextName].length;
            this.listSortedInContext[contextName].push(element);
        }
        return index;
    }
    public addElement(contextName, element, errorString = 'internal_error') {
        var index = this.numberOfElementsInContext[contextName];
        this.setElement(contextName, element, this.numberOfElementsInContext[contextName], false, errorString);
        return index;
    }

    public deleteElement(contextName, index?, errorString?) {
        if (typeof index == 'number' && index < 0)
            throw { error: 'illegal_function_call', parameter: index };
        contextName = contextName ? contextName : this.domain;
        var contextIndex, contextIndexName;

        if (this.tvc.utilities.isObject(index)) {
            var found;
            for (var e in this.list) {
                if (this.list[e] == index)
                    found = this.list[e];
            }
            if (found) {
                contextIndex = contextName + ':' + found.index;
                contextIndexName = contextName + ':' + this.list[contextIndex].name;
            }
            else {
                if (errorString) throw errorString;
                return;
            }
        }
        else if (typeof index == 'string') {
            contextIndexName = contextName + ':' + index;
            if (!this.listNames[contextIndexName]) {
                if (errorString) throw errorString;
                return;
            }
            contextIndex = contextName + ':' + this.listNames[contextIndexName].index;
        }
        else {
            contextIndex = contextName + ':' + index;
            if (!this.list[contextIndex]) {
                if (errorString) throw errorString;
                return;
            }
            contextIndexName = contextName + ':' + this.list[contextIndex].name;
        }
        var element = this.list[contextIndex];
        if (!element) {
            if (errorString) throw errorString;
            return;
        }
        this.list = this.tvc.utilities.cleanObject(this.list, contextIndex);
        this.listNames = this.tvc.utilities.cleanObject(this.listNames, contextIndexName);

        if (this.options.sorted) {
            this.listSorted.splice(element.indexSorted, 1);
            this.listSortedInContext[contextName].splice(element.indexSortedInContext, 1);
            for (var i = 0; i < this.listSortedInContext[contextName].length; i++)
                this.listSortedInContext[contextName][i].indexSortedInContext = i;
            for (var i = 0; i < this.listSorted.length; i++)
                this.listSorted[i].indexSorted = i;
        }
        this.numberOfElements--;
        this.numberOfElementsInContext[contextName]--;
    }

    public deleteRange(contextName, first?, last?) {
        first = typeof first == 'undefined' ? 0 : first;
        if (typeof last == 'undefined') {
            if (typeof first == 'number' && first == 0) {
                this.reset(contextName);
                return;
            }
            last = this.getNumberOfElements();
        }
        if (typeof first == 'number' && typeof last == 'number') {
            if (last < first)
                throw { error: 'illegal_function_call', parameter: '' };

            for (var count = first; count < last; count++)
                this.deleteElement(contextName, count);
            return;
        }
        throw 'type_mismatch';
    }
    public isAny(contextName?) {
        if (contextName)
            return this.numberOfElementsInContext[contextName] > 0;
        return this.numberOfElements > 0;
    }

    public getNumberOfElements(contextName?) {
        if (contextName)
            return this.numberOfElementsInContext[contextName];
        return this.numberOfElements;
    }
    public getHighestElementIndex(contextName) {
        var higher = -1;
        for (var i in this.list) {
            if (this.list[i].indexIsNumber) {
                higher = Math.max(higher, this.list[i].index);
            }
        }
        return higher >= 0 ? higher : undefined;
    }

    public  getLowestElementIndex(contextName) {
        var lower = 999999999;
        for (var i in this.list) {
            if (this.list[i].indexIsNumber) {
                lower = Math.min(lower, this.list[i].index);
            }
        }
        return lower != 999999999 ? lower : undefined;
    }

    public getFirstElement(contextName?) {
        if (this.options.sorted) {
            var element = null;
            if (contextName && this.listSortedInContext[contextName].length > 0) {
                element = this.listSortedInContext[contextName][0];
                this.firstIndex = element ? (element as any).indexSortedInContext : undefined;
            }
            else if (this.listSorted.length > 0) {
                element = this.listSorted[0];
                this.firstIndex = element ? (element as any).indexSorted : undefined;
            }
            return element;
        }
        else {
            this.flatList = this.tvc.utilities.flattenObject(this.list);
            this.firstIndex = 0;
            return this.flatList[this.firstIndex];
        }
    }
    public getLastElement(contextName) {
        if (this.options.sorted) {
            var element: any = null;
            if (contextName && this.listSortedInContext[contextName].length > 0) {
                element = this.listSortedInContext[contextName][this.listSortedInContext[contextName].length - 1];
                this.lastIndex = element ? element.indexSortedInContext : undefined;
            }
            else if (this.listSorted.length > 0) {
                element = this.listSorted[this.listSorted.length - 1];
                this.lastIndex = element ? this.indexSorted : undefined;
            }
            return element;
        }
        else {
            this.flatList = this.tvc.utilities.flattenObject(this.list);
            this.lastIndex = this.flatList.length - 1;
            return this.flatList[this.lastIndex];
        }
    }

    public getNextElement(contextName?) {
        if (typeof this.firstIndex == 'undefined')
            return null;

        if (this.options.sorted) {
            if (contextName && this.firstIndex < this.listSortedInContext[contextName].length - 1)
                return this.listSortedInContext[contextName][++this.firstIndex];
            else if (this.firstIndex < this.listSorted.length - 1)
                return this.listSorted[++this.firstIndex];
        }
        else if (this.firstIndex < this.flatList.length - 1) {
            return this.flatList[++this.firstIndex];
        }
        this.firstIndex = undefined;
        return null;
    }

    public getPreviousElement(contextName) {
        if (!this.lastIndex)
            return null;

        if (this.lastIndex > 0) {
            if (this.options.sorted) {
                if (contextName)
                    return this.listSortedInContext[contextName][--this.lastIndex];
                else
                    return this.listSorted[--this.lastIndex];
            }
            else {
                return this.flatList[--this.lastIndex];
            }
        }
        this.lastIndex = undefined;
        return null;
    }

    public sort(contextName, sortFunction) {
        if (typeof sortFunction == 'undefined')
            sortFunction = sortIndex;
        if (contextName) {
            this.listSortedInContext[contextName].sort(sortFunction);
            for (var i = 0; i < this.listSortedInContext[contextName].length; i++)
                this.listSortedInContext[contextName][i].indexSortedInContext = i;
        }
        this.listSorted.sort(sortFunction);
        for (var i = 0; i < this.listSorted.length; i++)
            this.listSorted[i].indexSorted = i;

        function sortIndex(a, b) {
            if (a.indexIsNumber && b.indexIsNumber) {
                if (a.index < b.index) return -1;
                if (a.index > b.index) return 1;
                return 0;
            }
            return 0;
        }
    }

    public parseSorted(contextName, sortFunction, callback, extra?) {
        if (typeof sortFunction == 'undefined')
            sortFunction = sortIndex;

        var sorted: any = [];
        for (var i in this.list)
            sorted.push(this.list[i]);
        sorted.sort(sortFunction);
        for (let i = 0; i < sorted.length; i++)
            callback(sorted[i], extra);

        function sortIndex(a, b) {
            if (a.indexIsNumber && b.indexIsNumber) {
                if (a.index < b.index) return -1;
                if (a.index > b.index) return 1;
                return 0;
            }
            return 0;
        }
    }
    public parseAll(contextName, callback, extra?) {
        if (this.options.sorted) {
            if (contextName) {
                for (var index = 0; index < this.listSortedInContext[contextName].length; index++)
                    callback(this.listSortedInContext[contextName][index], extra);
            }
            else {
                for (var index = 0; index < this.listSorted.length; index++)
                    callback(this.listSorted[index], extra);
            }
        }
        else {
            for (let index in this.list)
                callback(this.list[index], extra);
        }
    }
    private moveToStart(contextName, element) {
        if (this.options.sorted) {
            if (contextName) {
                this.listSortedInContext[contextName].splice(element.indexSortedInContext, 1);
                this.listSortedInContext[contextName].unshift(element);
                for (var i = 0; i < this.listSortedInContext[contextName].length; i++)
                    this.listSortedInContext[contextName][i].indexSortedInContext = i;
            }
            this.listSorted.splice(element.indexSorted, 1);
            this.listSorted.unshift(element);
            for (var i = 0; i < this.listSorted.length; i++)
                this.listSorted[i].indexSorted = i;
        }
    };
    private moveToEnd(contextName, element) {
        if (this.options.sorted) {
            if (contextName) {
                this.listSortedInContext[contextName].splice(element.indexSortedInContext, 1);
                this.listSortedInContext[contextName].push(element);
                for (var i = 0; i < this.listSortedInContext[contextName].length; i++)
                    this.listSortedInContext[contextName][i].indexSortedInContext = i;
            }
            this.listSorted.splice(element.indexSorted, 1);
            this.listSorted.push(element);
            for (var i = 0; i < this.listSorted.length; i++)
                this.listSorted[i].indexSorted = i;
        }
    };
    private moveAfter(contextName, source, destination) {
        if (this.options.sorted) {
            if (contextName) {
                this.listSortedInContext[contextName].splice(source.indexSortedInContext, 1);
                if (source.indexSortedInContext < destination.indexSortedInContext)
                    this.listSortedInContext[contextName].splice(destination.indexSortedInContext, 0, source);
                else
                    this.listSortedInContext[contextName].splice(destination.indexSortedInContext + 1, 0, source);
                for (var i = 0; i < this.listSortedInContext[contextName].length; i++)
                    this.listSortedInContext[contextName][i].indexSortedInContext = i;
            }
            this.listSorted[contextName].splice(source.indexSorted, 1);
            if (source.indexSorted < destination.indexSorted)
                this.listSorted[contextName].splice(destination.indexSorted, 0, source);
            else
                this.listSorted[contextName].splice(destination.indexSorted + 1, 0, source);
            for (var i = 0; i < this.listSorted.length; i++)
                this.listSorted[i].indexSorted = i;
        }
    }
    public  moveBefore(contextName, source, destination) {
        if (this.options.sorted) {
            var result: any[] = [];
            if (contextName) {
                for (var i = 0; i < this.listSortedInContext[contextName].length; i++) {
                    var element = this.listSortedInContext[contextName][i];
                    if (element == destination) {
                        source.indexSortedInContext = result.length;
                        result.push(source);
                        destination.indexSortedInContext = result.length;
                        result.push(destination);
                    }
                    else if (element != source) {
                        element.indexSortedInContext = result.length;
                        result.push(source);
                    }
                }
                this.listSortedInContext[contextName] = result;
                result = [];
            }
            for (var i = 0; i < this.listSorted.length; i++) {
                var element = this.listSorted[i];
                if (element == destination) {
                    source.indexSorted = result.length;
                    result.push(source);
                    destination.indexSorted = result.length;
                    result.push(destination);
                }
                else if (element != source) {
                    element.indexSorted = result.length;
                    result.push(source);
                }
            }
            this.listSorted = result;
        }
    }

}