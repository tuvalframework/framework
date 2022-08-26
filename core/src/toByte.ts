const buffer: Uint8Array = new Uint8Array(1);
export function toByte(value: number): number {
    buffer[0] = value;
    return buffer[0];
}