interface Int16Array {
    toString(): string;
}

Int16Array.prototype.toString = function (): string {
    let result = '';
    for (let i = 0; i < this.length; i++) {
        result += String.fromCharCode(this[i]);
    }
    return result;
}