import { TModule } from "./Module";
import { int } from '../float';
import { is } from "../is";

export class CanvasModule extends TModule {
    private m_Canvas: HTMLCanvasElement = null as any;
    public get Canvas(): HTMLCanvasElement {
        return this.m_Canvas;
    }
    private m_Context2D: CanvasRenderingContext2D = null as any;
    public get Context2D(): CanvasRenderingContext2D {
        return this.m_Context2D;
    }

    public constructor(width: int, height: int, silence: boolean = false, fullscreen: boolean = true, parent?: any) {
        super();

        /// #if WEB
        this.m_Canvas = this.Browser.CreateCanvas(width, height);
        this.m_Context2D = this.Canvas.getContext('2d')!;
        //this.m_Canvas.id = canvasId;
        if (!silence && fullscreen) {
            const body = document.getElementsByTagName("body")[0];
            this.removeAllChildNodes(body);
            body.appendChild(this.m_Canvas);
        } else if (!silence && parent != null) {
            if (is.string(parent)) {
                parent = document.getElementById(parent);
            }
            parent!.appendChild(this.m_Canvas);
        }

        /// #endif
    }

    private removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}