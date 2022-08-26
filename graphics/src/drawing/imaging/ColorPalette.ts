import { CGColor } from '@tuval/cg';
import { int, New, Marshal, IntPtr, IntArray } from '@tuval/core';
import { GdiColorPalette } from '../gdipStructs';
export class ColorPalette {
    // 0x1: the color values in the array contain alpha information
    // 0x2: the color values are grayscale values.
    // 0x4: the colors in the array are halftone values.

    private flags: int = 0;
    private entries: CGColor[] = null as any;

    //
    // There is no public constructor, this will be used somewhere in the
    // drawing code
    //
    public /* internal */ constructor();
    public /* internal */ constructor(flags: int, colors: CGColor[]);
    public /* internal */ constructor(...args: any[]) {
        if (arguments.length === 0) {
            this.entries = New.Array(0);
        } else if (args.length === 2) {
            const flags: int = args[0];
            const colors: CGColor[] = args[1];
            this.flags = flags;
            this.entries = colors;
        }
    }


    public get Entries(): CGColor[] {
        return this.entries;
    }

    public get Flags(): int {
        return this.flags;
    }
    /* Caller should call FreeHGlobal*/
    public /* internal */  getGDIPalette(): IntPtr {
        const palette: GdiColorPalette = new GdiColorPalette();
        const entries: CGColor[] = this.Entries;
        let entry: int = 0;
        let size: int = Marshal.SizeOf(palette) + (Marshal.SizeOf(entry) * entries.length);
        const lfBuffer: IntPtr = Marshal.AllocHGlobal(size);

        palette.Flags = this.Flags;
        palette.Count = entries.length;

        const values: IntArray = New.IntArray(palette.Count);

        for (let i: int = 0; i < values.length; i++) {
            values[i] = entries[i].toInt();
        }

        Marshal.StructureToPtr(palette, lfBuffer, false);
        Marshal.Copy(values, 0, new IntPtr(lfBuffer.ToInt64() + Marshal.SizeOf(palette)), values.length);

        return lfBuffer;
    }

    public /* internal */  setFromGDIPalette(palette: IntPtr): void {
        let ptr: IntPtr = palette;
        let cnt: int, color: int;
        let offset: int;

        this.flags = Marshal.ReadInt32(ptr, 0);
        ptr = new IntPtr(ptr.ToInt64() + 4);
        cnt = Marshal.ReadInt32(ptr, 0);
        ptr = new IntPtr(ptr.ToInt64() + 4);

        this.entries = New.Array(cnt);

        offset = 0;
        for (let i: int = 0; i < cnt; i++) {
            const R = Marshal.ReadByte(ptr, offset++);
            const G = Marshal.ReadByte(ptr, offset++);
            const B = Marshal.ReadByte(ptr, offset++);
            this.entries[i] = CGColor.FromRgba(R, G, B);
            // offset += 4;
        }
    }
}