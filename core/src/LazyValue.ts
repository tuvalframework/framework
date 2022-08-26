export class LazyValue<T> {
    public Value: T = null as any;
    public constructor(val: T) {
        this.Value = val;
    }
    public ToString(): string {
        return (this.Value as any).toString();
    }
}

export function lazy<T>(value: any):LazyValue<T> {
    if (value instanceof LazyValue) {
        return value;
    } else {
        return new LazyValue(value);
    }
}