import { int, IntPtr, float } from '@tuval/core';
import { PixelFormat } from './PixelFormat';

export class BitmapData {
    private width: int = 0;
    private height: int = 0;
    private stride: int = 0;
    private pixel_format: PixelFormat = 0; // int
    private scan0: IntPtr = IntPtr.Zero;
    private reserved: int = 0;

    // *** Warning ***	don't depend on those fields in managed
    //			code as they won't exists when using MS
    //			GDI+
    private palette: IntPtr = IntPtr.Zero;
    private property_count: int = 0;
    private property: IntPtr = IntPtr.Zero;
    private dpi_horz: float = 0;
    private dpi_vert: float = 0;
    private image_flags: int = 0;
    private left: int = 0;
    private top: int = 0;
    private x: int = 0;
    private y: int = 0;
    private transparent: int = 0;
    // *** Warning ***

    public get Height(): int {
        return this.height;
    }

    public set Height(value: int) {
        this.height = value;
    }

    public get Width(): int {
        return this.width;
    }

    public set Width(value: int) {
        this.width = value;
    }


    public get PixelFormat(): PixelFormat {
        return this.pixel_format;
    }

    public set PixelFormat(value: PixelFormat) {
        this.pixel_format = value;
    }

    public get Reserved(): int {
        return this.reserved;
    }

    public set Reserved(value: int) {
        this.reserved = value;
    }

    public get Scan0(): IntPtr {
        return this.scan0;
    }

    public set Scan0(value: IntPtr) {
        this.scan0 = value;
    }

    public get Stride(): int {
        return this.stride;
    }

    public set Stride(value: int) {
        this.stride = value;
    }
}