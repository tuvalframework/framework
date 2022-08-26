
export class Cursor {
    private myName: string = '';
    public static Position: { x: number, y: number };
    public static Current: Cursor;
    public static Clip: { x: number, y: number, width: number, height: number };
    public get Name(): string {
        return this.myName;
    }
    public constructor(name: string) {
        this.myName = name;
    }
}