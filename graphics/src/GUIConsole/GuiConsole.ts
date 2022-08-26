import { CGRectangle } from "@tuval/cg";
import { TextConsole, int, LazyValue, is, lazy, NotImplementedException } from '@tuval/core';
import { Virtual } from "@tuval/core";
import { Brush } from "../drawing/Brush";
import { Pen } from "../drawing/Pen";
import { ClsCommand } from "./Commands/ClsCommand";
import { DrawCommand } from "./Commands/DrawCommand";
import { DrawLineConsoleCommand } from "./Commands/DrawLineConsoleCommand";
import { DrawRectangleConsoleCommand } from "./Commands/DrawRectangleConsoleCommand";
import { EllipseCommand } from "./Commands/EllipseCommand";
import { FillRectangleConsoleCommand } from "./Commands/FillRectangleConsoleCommand";
import { GuiTVC } from "./GuiTVC";
import { DrawEllipseCommand } from './Commands/DrawEllipseCommand';
import { FillEllipseCommand } from './Commands/FillEllipseCommand';
import { ScreenOpenCommand } from './Commands/ScreenOpenCommand';
import { SetTransparentCommand } from './Commands/SetTransparent';
import { ScreenCommand } from "./Commands/ScreenCommand";
import { ScreenToFrontCommand } from './Commands/ScreenToFrontCommand';
import { ScreenCenterCommand } from './Commands/ScreenCenter';
import { ScreenCloseCommand } from "./Commands/ScreenClose";
import { LoadImageCommand } from './Commands/LoadImageCommand';
import { PasteBobCommand } from './Commands/PasteBobCommand';
import { ScreenOffsetCommand } from "./Commands/ScreenOffsetCommand";
import { ScreenDisplayCommand } from "./Commands/ScreenDisplay";
import { ScreenScaleCommand } from './Commands/ScreenScaleCommand';

type Lazy<T> = T | LazyValue<T>;
export class GuiConsole<T extends GuiTVC> extends TextConsole<T> {
    @Virtual
    public CreateTVC(canvas: HTMLCanvasElement, options: any): T {
        return new GuiTVC(this.Canvas, options) as any;
    }

    public DrawLine(pen: Pen | LazyValue<Pen>, x1: int | LazyValue<int>, y1: int | LazyValue<int>, x2: int | LazyValue<int>, y2: int | LazyValue<int>): void {
        this.m_CurrentQueue.Enqueue(new DrawLineConsoleCommand(this, lazy(pen as any), lazy(x1 as any), lazy(y1 as any), lazy(x2 as any), lazy(y2 as any)));
    }


    public DrawRectangle(pen: Pen | LazyValue<Pen>, rect: CGRectangle | LazyValue<CGRectangle>): void {
        this.m_CurrentQueue.Enqueue(new DrawRectangleConsoleCommand(this, lazy(pen as any), lazy(rect as any)));
    }

    public FillRectangle(brush: Brush | LazyValue<Pen>, rect: CGRectangle | LazyValue<CGRectangle>): void {
        this.m_CurrentQueue.Enqueue(new FillRectangleConsoleCommand(this, lazy(brush as any), lazy(rect as any)));
    }

    public DrawEllipse(pen: Pen | LazyValue<Pen>, rect: CGRectangle | LazyValue<CGRectangle>): void {
        this.m_CurrentQueue.Enqueue(new DrawEllipseCommand(this, lazy(pen as any), lazy(rect as any)));
    }

    public FillEllipse(brush: Brush | LazyValue<Pen>, rect: CGRectangle | LazyValue<CGRectangle>): void {
        this.m_CurrentQueue.Enqueue(new FillEllipseCommand(this, lazy(brush as any), lazy(rect as any)));
    }

    /**
     * Clear an area of the current screen
     * @param ink The index of the color in the palette to clear with
     * @param x The horizontal coordinate of the top-left pixel of the rectangle to clear
     * @param y The vertical coordinate of the top-left pixel of the rectangle to clear
     * @param width The horizontal coordinate of the bottom-right pixel of the rectangle to clear
     * @param height The vertical coordinate of the bottom-right pixel of the rectangle to clear
     */
    public Cls(ink: Lazy<int>, x: Lazy<int>, y: Lazy<int>, width: Lazy<int>, height: Lazy<int>): void {
        this.m_CurrentQueue.Enqueue(new ClsCommand(this, lazy(ink as any), lazy(x as any), lazy(y as any), lazy(width as any), lazy(height as any)));
    }

    /**
     * Draw a line with the current Ink from the last graphical position
     * @param x The horizontal coordinate of the point
     * @param y  The vertical coordinate of the point
     * @param width width of line
     * @param height height of line
     */
    public Draw(x: Lazy<int>, y: Lazy<int>, width: Lazy<int>, height: Lazy<int>): void {
        this.m_CurrentQueue.Enqueue(new DrawCommand(this, lazy(x as any), lazy(y as any), lazy(width as any), lazy(height as any)));
    }

    /**
     * Draw an ellipse with the current Ink in the current screen
     * @param x The horizontal coordinate of the center of the ellipse
     * @param y The vertical coordinate of the center of the ellipse
     * @param xRadius The horizontal radius in pixels
     * @param yRadius The vertical radius in pixels
     */
    public Ellipse(x: Lazy<int>, y: Lazy<int>, xRadius: Lazy<int>, yRadius: Lazy<int>): void {
        this.m_CurrentQueue.Enqueue(new EllipseCommand(this, lazy(x as any), lazy(y as any), lazy(xRadius as any), lazy(yRadius as any)));
    }

    /**
     * Mouse Commands
     */
    public get MouseX(): int {
        return this.tvc.GetXMouse();
    }
    public get MouseY(): int {
        return this.tvc.GetYMouse();
    }

    public get MouseKey(): int {
        return this.tvc.mouseButtons;
    }
    public HideMouse(): void {
        (this.tvc as any).showMouse(false);;
    }
    public ShowMouse(): void {
        (this.tvc as any).showMouse(true);;
    }

    /**
     * Screen Commands
     */

    /**
     * Open a new screen
     * @param index The index of the screen to open. Any existing screen will be replaced by the new one
     * @param width The width of the screen in pixels
     * @param height The height of the screen in pixels
     * @param numberOfColor The number of colors of the palette (optional)
     * @param pixelMode Lowres, Hires, Laced or any combination
     * @param columns Number of columns in the text window associated with the screen
     * @param lines Number of lines in the text window associated with the screen
     * @param tags$ List of eventual tags
     */
    public ScreenOpen(index: LazyValue<int>,
        width: LazyValue<int>,
        height: LazyValue<int>,
        numberOfColor: LazyValue<int> = lazy(32),
        pixelMode: LazyValue<int> = lazy(0),
        columns: LazyValue<int> = lazy(undefined),
        lines: LazyValue<int> = lazy(undefined),
        tags$: LazyValue<int> = lazy(undefined)): void {
        this.m_CurrentQueue.Enqueue(new ScreenOpenCommand(this, lazy(index), lazy(width), lazy(height), lazy(numberOfColor), lazy(pixelMode), lazy(columns), lazy(lines), lazy(tags$)));
    }

    /**
     * Destroys the current screen or a given screen
     * @param index The index of the screen to destroy, if ommited will destroy the current screen
     */
    public ScreenClose(index: LazyValue<int>, tags$: LazyValue<int> = lazy(undefined)) {
        this.m_CurrentQueue.Enqueue(new ScreenCloseCommand(this, lazy(index)));
    }

    /**
     * Create an exact and synchronized copy of the current screen that can be displayed at another position and Z-order.
     * Both screen share the same internal pixel buffers. Graphical operations are fobidden in the cloned screen
     * @param index The index of the screen to create, will replace an existing screen
     */
    public ScreenClone(index?: LazyValue<int>) {
        throw new NotImplementedException('');
    }

    /**
     * Make a screen disappear from display. The screen will remain active and drawing operation are still possible after this instruction
     * @param index The index of the screen, if ommited the instruction closes the current screen
     */
    public ScreenHide(index?: int) {

    }

    public SetTransparent(index: int | LazyValue<int>) {
        this.m_CurrentQueue.Enqueue(new SetTransparentCommand(this, lazy(index)));
    }

    public Screen(index: int | LazyValue<int>) {
        this.m_CurrentQueue.Enqueue(new ScreenCommand(this, lazy(index)));
    }

    public ScreenToFront(index: int | LazyValue<int>) {
        this.m_CurrentQueue.Enqueue(new ScreenToFrontCommand(this, lazy(index)));
    }
    public ScreenCenter(index: int | LazyValue<int>, centerX: LazyValue<boolean>, centerY: LazyValue<int>) {
        this.m_CurrentQueue.Enqueue(new ScreenCenterCommand(this, lazy(index), lazy(centerX), lazy(centerY)));
    }

    public ScreenWidth(index?: int): int {
        if (index === undefined) {
            return (this.tvc as any).fp2Int((this.tvc as any).currentScreen.dimension.width);
        } else {
            return (this.tvc as any).fp2Int((this.tvc as any).getScreen(index).dimension.width);
        }
    }

    public ScreenHeight(index?: int): int {
        if (index === undefined) {
            return (this.tvc as any).fp2Int((this.tvc as any).currentScreen.dimension.height);
        } else {
            return (this.tvc as any).fp2Int((this.tvc as any).getScreen(index).dimension.height);
        }
    }
    public ScreenOffset(index: int, xOffset: int, yOffset: int): this {
        this.m_CurrentQueue.Enqueue(new ScreenOffsetCommand(this, lazy(index), lazy(xOffset), lazy(yOffset)));
        return this;
    }

    public ScreenDisplay(index: int, x: int, y: int, width?: int, height?: int): this {
        this.m_CurrentQueue.Enqueue(new ScreenDisplayCommand(this,lazy(index), lazy(x), lazy(y), lazy(width), lazy(height)));
        return this;
    }

    public ScreenScale(index: int, xScale: int, yScale: int): this {
        this.m_CurrentQueue.Enqueue(new ScreenScaleCommand(this, lazy(index), lazy(xScale), lazy(yScale)));
        return this;
    }

    //--------------------------------------------------------------------

    public LoadImage(path: string): void {
        this.m_CurrentQueue.Enqueue(new LoadImageCommand(this, path, 0));
    }
    public PasteBob(x: int, y: int, index: int): void {
        this.m_CurrentQueue.Enqueue(new PasteBobCommand(this, lazy(x), lazy(y), lazy(index)));
    }
}