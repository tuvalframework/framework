import { EventArgs } from "@tuval/core";
import { DragDropEffects } from "./DragDropEffects";
import { IDataObject } from "./IDataObject";
import { float } from "@tuval/core";

export class DragEventArgs extends EventArgs {
    private myAllowedEffect: DragDropEffects;
    private myData: IDataObject;
    private myEffect: DragDropEffects;
    private myKeyState: number;
    private myX: float;
    private myY: float;

    public get AllowedEffect(): DragDropEffects {
        return this.myAllowedEffect;
    }
    public get Data(): IDataObject {
        return this.myData;
    }
    public get Effect(): DragDropEffects {
        return this.myEffect;
    }
    public set Effect(value: DragDropEffects) {
        this.myEffect = value;
    }
    public get KeyState(): number {
        return this.myKeyState;
    }
    public get X(): number {
        return this.myX;
    }
    public get Y(): number {
        return this.myY;
    }

    public constructor(data: IDataObject, keyState: number, x: float, y: float, allowedEffect: DragDropEffects, effect: DragDropEffects) {
        super();
        this.myData = data;
        this.myKeyState = keyState;
        this.myX = x;
        this.myY = y;
        this.myAllowedEffect = allowedEffect;
        this.myEffect = effect;
    }

}