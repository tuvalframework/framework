import { CGRectangle } from '@tuval/cg';
import { Screen } from '@tuval/core';
import { Brush } from '../drawing/Brush';
import { Graphics } from '../drawing/Graphics';
import { Pen } from '../drawing/Pen';
import { GuiTVC } from './GuiTVC';
export class GuiScreen extends Screen {
    private graphics: Graphics = null as any;
    public constructor(tvc: GuiTVC, args: any, tags: any) {
        super(tvc, args, tags);
        this.graphics = new Graphics(this.context);
    }

    public DrawLine(pen: Pen, rect: CGRectangle) {
        this.startDrawing()
        this.graphics.DrawLine(pen, rect.X, rect.Y, rect.Right, rect.Bottom);
        this.endDrawing();
        this.grPosition.x = rect.X + rect.Width;
        this.grPosition.y = rect.Y + rect.Height;
    }
    public DrawRectangle(pen: Pen, rect: CGRectangle) {
        this.startDrawing()
        this.graphics.DrawRectangle(pen, rect);
        this.endDrawing();
        this.grPosition.x = rect.X + rect.Width;
        this.grPosition.y = rect.Y + rect.Height;
    }
    public FillRectangle(brush: Brush, rect: CGRectangle) {
        this.startDrawing()
        this.graphics.FillRectangle(brush, rect);
        this.endDrawing();
        this.grPosition.x = rect.X + rect.Width;
        this.grPosition.y = rect.Y + rect.Height;
    }
    public DrawEllipse(pen: Pen, rect: CGRectangle) {
        this.startDrawing()
        this.graphics.DrawEllipse(pen, rect);
        this.endDrawing();
        this.grPosition.x = rect.X + rect.Width;
        this.grPosition.y = rect.Y + rect.Height;
    }
    public FillEllipse(brush: Brush, rect: CGRectangle) {
        this.startDrawing()
        this.graphics.FillEllipse(brush, rect);
        this.endDrawing();
        this.grPosition.x = rect.X + rect.Width;
        this.grPosition.y = rect.Y + rect.Height;
    }
}