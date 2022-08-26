import { byte } from "../byte";
import { char, int, ByteArray, IntArray } from '../float';
import { malloc } from "../IO";
import { IntPtr } from './IntPtr';
import { free, HeapBuffer, HEAPU8 } from './../IO/Internals/Memory';
import { UMP } from "../IO/Buffer/TStruct";
import { Type } from "../Reflection/Type";
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { TBuffer } from '../IO/Buffer/TBuffer';


export class Marshal {

    public static get Heap8(): Uint8Array {
        return HEAPU8;
    }
    /**
     * Allocates memory from the unmanaged memory of the process by using the specified number of bytes.
     * @param cb
     */
    public static AllocHGlobal(cb: int): IntPtr {
        const ptr = malloc(cb);
        for (let i = 0; i < cb; i++) {
            HeapBuffer.seek(ptr + i);
            HeapBuffer.writeByte(0);
        }
        return new IntPtr(ptr);
    }
    public static FreeHGlobal(hglobal: IntPtr): void {
        free(hglobal.ToInt32());
    }
    public static ReadByte(ptr: IntPtr, ofs: int): byte {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        return HeapBuffer.readByte();
    }
    public static WriteByte(ptr: IntPtr, ofs: int, val: byte): void {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        HeapBuffer.writeByte(val);
    }
    public static ReadInt16(ptr: IntPtr, ofs: int): byte {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        return HeapBuffer.readInt16();
    }
    public static WriteInt16(ptr: IntPtr, ofs: int, val: char): void {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        HeapBuffer.writeInt16(val);
    }
    public static ReadInt32(ptr: IntPtr, ofs: int): byte {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        return HeapBuffer.readInt32();
    }
    public static WriteInt32(ptr: IntPtr, ofs: int, val: int): void {
        HeapBuffer.seek(ptr.ToInt32() + ofs);
        HeapBuffer.writeInt32(val);
    }
    public static SizeOf(structure: any): int {
        if (structure.__SIZE__) {
            return structure.__SIZE__;
        } else if (structure.prototype.__SIZE__) {
            return structure.prototype.__SIZE__;
        }
        return 0;
    }
    public static StructureToPtr<T extends UMP>(structure: T, ptr: IntPtr, fDeleteOld: boolean): void {
        (structure as any).StructureToPtr(ptr.ToInt32());
    }
    public static PtrToStructure<T extends UMP>(ptr: IntPtr, type: Type): T {
        if (type != null) {
            const t: any = type;
            const structure: T = new t.target();
            (structure as any).PtrToStructure(ptr.ToInt32());
            return structure;
        }
        return null as any;//(structure as any).PtrToStructure(ptr.ToInt32());
    }

    public static PtrToStringUni(ptr: IntPtr): string {
        throw new NotImplementedException('');
    }

    public static Copy(buffer: IntArray, index: int, ptr: IntPtr, size: int);
    public static Copy(buffer: ByteArray, index: int, ptr: IntPtr, size: int);
    public static Copy(ptr: IntPtr, buffer: ByteArray, index: int, size: int);
    public static Copy(ptr: IntPtr, buffer: IntArray, index: int, size: int);
    public static Copy(ptr: IntPtr, buffer: ByteArray, index: int, size: int);
    public static Copy(...args: any[]) {
        throw new NotImplementedException('');
    }

    public static GetBufferFromPointer(ptr: IntPtr): TBuffer {
        return new TBuffer(Marshal.Heap8, { offset: ptr.ToInt32() });
    }
}