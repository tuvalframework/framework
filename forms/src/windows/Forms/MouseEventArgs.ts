import { MouseButtons } from "./MouseButtons";
import { float } from "@tuval/core";
import { assert } from "@tuval/core";
import { EventArgs } from "@tuval/core";

export class MouseEventArgs extends EventArgs {

    private readonly button: MouseButtons;
    private readonly clicks: number;
    private readonly x: float;
    private readonly y: float;
    private readonly delta: float;
    private readonly htmlEventObject: MouseEvent;

    public constructor(button: MouseButtons, clicks: number, x: float, y: float, delta: float, htmlEventObject?: MouseEvent) {
        super();
        assert((button & (MouseButtons.Left | MouseButtons.None | MouseButtons.Right | MouseButtons.Middle | MouseButtons.XButton1 | MouseButtons.XButton2)) ===
            button, "Invalid information passed into MouseEventArgs constructor!");

        this.button = button;
        this.clicks = clicks;
        this.x = x;
        this.y = y;
        this.delta = delta;
        this.htmlEventObject = htmlEventObject as any;
    }

    /// <include file='doc\MouseEvent.uex' path='docs/doc[@for="MouseEventArgs.Button"]/*' />
    /// <devdoc>
    ///    <para>
    ///       Gets which mouse button was pressed.
    ///    </para>
    /// </devdoc>
    public get Button(): MouseButtons {
        return this.button;
    }

    /// <include file='doc\MouseEvent.uex' path='docs/doc[@for="MouseEventArgs.Clicks"]/*' />
    /// <devdoc>
    ///    <para>
    ///       Gets the
    ///       number of times the mouse
    ///       button was pressed and released.
    ///    </para>
    /// </devdoc>
    public get Clicks(): number {
        return this.clicks;
    }

    /// <include file='doc\MouseEvent.uex' path='docs/doc[@for="MouseEventArgs.X"]/*' />
    /// <devdoc>
    ///    <para>
    ///       Gets the x-coordinate
    ///       of a mouse click.
    ///    </para>
    /// </devdoc>
    public get X(): float {
        return this.x;
    }

    public get Y(): float {
        return this.y;
    }

    public get Delta(): number {
        return this.delta;
    }

    public get Location(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    public get HtmlEventObject(): MouseEvent {
        return this.htmlEventObject;
    }
}