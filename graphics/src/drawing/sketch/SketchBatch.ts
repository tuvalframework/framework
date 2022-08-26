import { SketchGraphics } from "./SketchGraphics";

interface ISketchCommand {
    exec(sg: SketchGraphics, data?: any): void;
}

export class SketchBatch {
    protected m_instructions: ISketchCommand[] = [];
    public command: ISketchCommand = undefined as any;
    protected m_dirty: boolean = false;
    public append(command: ISketchCommand, clean?: boolean): void {
        this.m_instructions.push(command);
        this.command = command;
        if (!clean) {
            this.m_dirty = true;
        }
    }
    public fill(color: string) {
        this.append(new Fill(color));
    }
    public rect(x: number, y: number, w: number, h: number) {
        this.append(new Rect(x, y, w, h));
    }
    public translate(x: number, y: number) {
        this.append(new Translate(x, y));
    }
    public draw(sg: SketchGraphics, data?: any): void {
        let instr = this.m_instructions;
        //const l = instr.length;
        for (let i = 0; i < instr.length; i++) {
            instr[i].exec(sg, data);
        }
    }

    public clear(): void {
        this.m_instructions.length = 0;
        this.m_dirty = false;
    }

}

class Fill implements ISketchCommand {
    private m_color: string;
    public exec: (sg: SketchGraphics) => void;
    constructor(color: string) {
        this.m_color = color;
        this.exec = (sg: SketchGraphics) => {
            sg.fill(color);
        }
    }
}

class Rect implements ISketchCommand {
    public exec: (sg: SketchGraphics) => void;
    constructor(x: number, y: number, w: number, h: number) {
        this.exec = (sg: SketchGraphics) => {
            sg.rect(x, y, w, h);
        }
    }


}
class Translate implements ISketchCommand {
    public exec: (sg: SketchGraphics) => void;
    constructor(x: number, y: number) {
        this.exec = (sg: SketchGraphics) => {
            sg.translate(x, y);
        }
    }
}