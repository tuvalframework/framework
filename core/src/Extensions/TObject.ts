import { InvalidOperationException } from '../Exceptions/InvalidOperationException';
import { System } from '../SystemTypes';
import { int } from '../float';
import { clone } from '../clone';
import { ClassInfo, Override } from '../Reflection/Decorators/ClassInfo';
import { Type } from '../Reflection';
import { IDisposable } from '../Disposable';

const EMPTY = '', TRUE = 'true', FALSE = 'false';

@ClassInfo({
    fullName: System.Types.TObject,
    instanceof: [
        System.Types.TObject,
        System.Types.Disposable.IDisposable
    ]
})
export abstract class TObject implements IDisposable {

    /**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
    public static Assign(target: any, ...others: any[]) {
        return Object.assign(target, ...others);
    }
    public static ToString(value: any, defaultForUnknown?: string): string {
        const v = value;
        if (typeof v === 'string') {
            return v;
        } else if (typeof v === 'boolean') {
            return v ? TRUE : FALSE;
        } else if (typeof v === 'number') {
            return EMPTY + v;
        } else {
            if (v == null)
                return v;

            /* if (is.typeof<ISerializable>(v, System.Runtime.Serialization.ISerializable)) {
                return v.serialize();
            } else*/
            if (defaultForUnknown != null) {
                return defaultForUnknown;
            }

            const ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
            ex.data['value'] = v;
            throw ex;
        }
    }

    public ToString(): string {
        return TObject.ToString(this);
    }

    private toString(): string {
        if ('ToString' in this) {
            return this['ToString']();
        } else {
            return TObject.ToString(this);
        }
    }

    protected Finalize(): void {
    }

    public Equals<T>(obj: T): boolean {
        return (this as any) === obj;
    }
    public static Equals(value: any, obj: any): boolean {
        return value === obj;
    }
    public GetHashCode(): int {
        const str = this.ToString();

        let h: number = (this as any).hash || 0;
        if (h === 0 && str.length > 0) {

            for (let i = 0; i < str.length; i++) {
                h = 31 * h + str.charCodeAt(i);
            }
            (this as any).hash = h;
        }
        return h;
    }
    public static GetHashCode(value?: any): int {
        const str = value == null ? this.toString() : value.toString();

        let h: number = (this as any).hash || 0;
        if (h === 0 && str.length > 0) {

            for (let i = 0; i < str.length; i++) {
                h = 31 * h + str.charCodeAt(i);
            }
            (this as any).hash = h;
        }
        return h;
    }

    protected MemberwiseClone<T>(): T {
        return clone(this) as any;
    }

    public GetType(): Type {
        if (typeof this['GetTypeInternal'] === 'function') {
            return (this as any).GetTypeInternal();
        } else {
            throw new Error('Class has not CLassInfo Attribute.');
        }
    }
    public Dispose(): void {
        this.dispose(true);
    }
    protected abstract dispose(disposing: boolean): void;
}