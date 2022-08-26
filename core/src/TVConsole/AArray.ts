import { TVC } from './TVC';

// TVC Array class
export class AArray {
    tvc: TVC;
    defaultValue: any;
    oneBased: any;
    array: any;
    dimensions: any;
    public constructor(tvc: TVC, defaultValue, oneBased) {
        this.tvc = tvc;
        this.defaultValue = defaultValue;
        this.oneBased = oneBased;
    }
    private dim(dimensions) {
        if (typeof this.array != 'undefined') {
            this.tvc.error = 10;
            return;
        }
        var self = this;
        this.dimensions = dimensions;
        this.array = createArray(0);
        function createArray(d) {
            var arr: any[] = [];
            if (d == dimensions.length - 1) {
                for (var dd = 0; dd <= dimensions[d]; dd++)
                    arr[dd] = self.defaultValue;
            }
            else {
                for (var dd = 0; dd <= dimensions[d]; dd++)
                    arr[dd] = createArray(d + 1);
            }
            return arr;
        }
    }
    private getValue(dimensions) {
        var obj = this.getVariable(dimensions);
        return obj.array[obj.pointer];
    }
    private setValue(dimensions, value) {
        var obj = this.getVariable(dimensions);
        obj.array[obj.pointer] = value;
    }
    private sort(dimensions) {
        var obj = this.getVariable(dimensions);
        if (typeof this.defaultValue == 'string')
            obj.array = obj.array.sort();
        else {
            obj.array = obj.array.sort(function (a, b) {
                return a - b;
            });
        }
    }
    private match(dimensions, value) {
        if (dimensions.length > 1)
            throw { error: 'illegal_function_call', parameter: '(too many dimensions: ' + dimensions.length + ')' };
        var arr = this.getVariable(dimensions).array;
        for (var d = 0; d < arr.length; d++) {
            if (arr[d] == value) {
                return d;
            }
        }
        return -1;
    }
    private inc(dimensions) {
        var obj = this.getVariable(dimensions);
        obj.array[obj.pointer]++;
    }
    private dec(dimensions) {
        var obj = this.getVariable(dimensions);
        obj.array[obj.pointer]--;
    }
    private read(dimensions, value) {
        var obj = this.getVariable(dimensions);
        obj.array[obj.pointer]--;
    }
    private getLength(dimension) {
        dimension = typeof dimension == 'undefined' ? 0 : dimension;
        if (typeof this.array == 'undefined')
            throw 'non_dimensionned_array';
        if (dimension >= this.dimensions.length)
            throw { error: 'illegal_function_call', parameter: dimension };
        return this.dimensions[dimension];
    }
    private getVariable(dimensions) {
        if (typeof this.array == 'undefined')
            throw 'non_dimensionned_array';
        var pArr = this.array;
        for (var d = 0; d < this.dimensions.length - 1; d++) {
            dd = dimensions[d] - this.oneBased;
            if (dd < 0 || dd > this.dimensions[d])
                throw { error: 'illegal_function_call', parameter: dd };
            pArr = pArr[dd];
        }
        var dd = dimensions[d] - this.oneBased;
        if (dd < 0 || dd > this.dimensions[d]) {
            throw { error: 'illegal_function_call', parameter: dd };
        }
        return { array: pArr, pointer: dd };
    }
}