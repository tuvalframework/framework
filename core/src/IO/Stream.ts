import './../Reflection/ClassType';
import { byte } from '../byte';
import { ByteArray, int, long, New } from '../float';
import { ClassInfo, Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { System } from '../SystemTypes';
import { TObject } from './../Extensions/TObject';
import { SeekOrigin } from './SeekOrigin';
import { Convert } from '../convert';
import { IDisposable } from '../Disposable';



@ClassInfo({
    fullName: System.Types.IO.Stream,
    instanceof: [
        System.Types.IO.Stream,
        System.Types.Disposable.IDisposable
    ]
})
export abstract class Stream extends TObject implements IDisposable {
    protected dispose(disposing: boolean): void {
        // Note: Never change this to call other virtual methods on Stream
        // like Write, since the state on subclasses has already been
        // torn down.  This is the last code to run on cleanup for a stream.
    }
    public static readonly Null: Stream;

    protected abstract Get_CanRead(): boolean;
    public get CanRead(): boolean {
        return this.Get_CanRead();
    }

    protected abstract Get_CanSeek(): boolean;
    public get CanSeek(): boolean {
        return this.Get_CanSeek();
    }

    protected abstract Get_CanWrite(): boolean;
    public get CanWrite(): boolean {
        return this.Get_CanWrite();
    }

    protected abstract Get_Length(): int;
    public get Length(): int {
        return this.Get_Length();
    }


    protected abstract Get_Position(): int;
    public get Position(): int {
        return this.Get_Position();
    }

    protected abstract Set_Position(value: int);
    public set Position(value: int) {
        this.Set_Position(value);
    }

    public static StaticConstructor() {
        (Stream as any).Null = new NullStream();
    }

    protected Stream() {
    }

    @Virtual
    public Close(): void {
    }

    public abstract Flush(): void;

    public abstract Read(buffer: ByteArray, offset: int, count: int): int;

    @Virtual
    public ReadByte(): int {
        const numArray: ByteArray = New.ByteArray(1);
        if (this.Read(numArray, 0, 1) === 0) {
            return -1;
        }
        return numArray[0];
    }

    public abstract Seek(offset: int, origin: SeekOrigin): int;

    public abstract SetLength(value: int): void;

    @Override
    public Dispose(): void {
        this.Close();
    }

    public abstract Write(buffer: ByteArray, offset: int, count: int): void;

    @Virtual
    public WriteByte(value: byte): void {
        this.Write(New.ByteArray(value), 0, 1);
    }
}



class NullStream extends Stream {
    protected Get_CanRead(): boolean {
        return true;
    }

    protected Get_CanSeek(): boolean {
        return true;
    }

    protected Get_CanWrite(): boolean {
        return true;
    }

    protected Get_Length(): int {
        return 0;
    }

    protected Get_Position(): int {
        return 0;
    }
    protected Set_Position(value: int) {
    }


    public constructor() {
        super();
    }

    @Override
    public Close(): void {
    }

    @Override
    public Flush(): void {
    }

    @Override
    public Read(buffer: ByteArray, offset: int, count: int): int {
        return 0;
    }

    @Override
    public Seek(offset: int, origin: SeekOrigin): int {
        return 0;
    }

    @Override
    public SetLength(length: int): void {
    }

    @Override
    public Write(buffer: ByteArray, offset: int, count: int): void {
    }
}

Stream.StaticConstructor();