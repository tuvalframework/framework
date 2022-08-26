import { CGContext2D } from '@tuval/cg';
import { CGColor } from '@tuval/cg';
import { CGAffineTransform, CGPatternTiling } from '@tuval/cg';
import { CGRectangle, CGPattern, CGLineCap } from '@tuval/cg';
import { Brush } from "../Brush";
import { HatchStyle } from "./HatchStyle";
import { Graphics } from "../Graphics";
import { GraphicTypes } from "../../GDITypes";
import { float, ClassInfo } from "@tuval/core";

const HATCH_SIZE: float = 8;
const LINE_WIDTH: float = 1;
const HALF_PIXEL_X: float = 0;
const HALF_PIXEL_Y: float = 0;

const hatches_const: float[][] = [
		/* HatchStyleHorizontal */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleVertical */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleForwardDiagonal */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleBackwardDiagonal */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleCross */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDiagonalCross */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyle05Percent */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyle10Percent */[HATCH_SIZE, HATCH_SIZE - 3.0, LINE_WIDTH],
		/* HatchStyle20Percent */[2.0, 2.0, LINE_WIDTH],
		/* HatchStyle25Percent */[4.0, 2.0, LINE_WIDTH],
		/* HatchStyle30Percent */[4.0, 4.0, LINE_WIDTH],
		/* HatchStyle40Percent */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyle50Percent */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyle60Percent */[4.0, 4.0, LINE_WIDTH],
		/* HatchStyle70Percent */[4.0, 2.0, LINE_WIDTH],
		/* HatchStyle75Percent */[4.0, 4.0, LINE_WIDTH],
		/* HatchStyle80Percent */[HATCH_SIZE, 4.0, LINE_WIDTH],
		/* HatchStyle90Percent */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleLightDownwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH],
		/* HatchStyleLightUpwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH],
		/* HatchStyleDarkDownwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH + 1],
		/* HatchStyleDarkUpwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH + 1],
		/* HatchStyleWideDownwardDiagonal */[(HATCH_SIZE), (HATCH_SIZE), LINE_WIDTH + 2],
		/* HatchStyleWideUpwardDiagonal */[(HATCH_SIZE), (HATCH_SIZE), LINE_WIDTH + 2],
		/* HatchStyleLightVertical */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH],
		/* HatchStyleLightHorizontal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH],
		/* HatchStyleNarrowVertical */[2.0, 2.0, LINE_WIDTH],
		/* HatchStyleNarrowHorizontal */[2.0, 2.0, LINE_WIDTH],
		/* HatchStyleDarkVertical */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH * 2.0],
		/* HatchStyleDarkHorizontal */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH * 2.0],
		/* HatchStyleDashedDownwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDashedUpwardDiagonal */[HATCH_SIZE * 0.5, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDashedHorizontal */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDashedVertical */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleSmallConfetti */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleLargeConfetti */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleZigZag */[HATCH_SIZE, 4.0, LINE_WIDTH],
		/* HatchStyleWave */[HATCH_SIZE, HATCH_SIZE * 0.50, LINE_WIDTH],
		/* HatchStyleDiagonalBrick */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleHorizontalBrick */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleWeave */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStylePlaid */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDivot */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDottedGrid */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleDottedDiamond */[HATCH_SIZE, (HATCH_SIZE), LINE_WIDTH],
		/* HatchStyleShingle */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleTrellis */[4.0, 4.0, LINE_WIDTH],
		/* HatchStyleSphere */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleSmallGrid */[HATCH_SIZE * 0.5, HATCH_SIZE * 0.5, LINE_WIDTH],
		/* HatchStyleSmallCheckerBoard */[4.0, 4.0, LINE_WIDTH],
		/* HatchStyleLargeCheckerBoard */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleOutlinedDiamond */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH],
		/* HatchStyleSolidDiamond */[HATCH_SIZE, HATCH_SIZE, LINE_WIDTH]

];

@ClassInfo({
    fullName: GraphicTypes.HatchBrush,
    instanceof: [
        GraphicTypes.HatchBrush
    ]
})
export class HatchBrush extends Brush {

    private backColor: CGColor = undefined as any;
    private foreColor: CGColor = undefined as any;
    private hatchStyle: HatchStyle = undefined as any;



    private getHatchWidth(hbr: HatchStyle): float {
        return hatches_const[hbr][0];
    }

    private getHatchHeight(hbr: HatchStyle): float {
        return hatches_const[hbr][1];
    }
    private getLineWidth(hbr: HatchStyle): float {
        return hatches_const[hbr][2];
    }
    private drawBackground(context: CGContext2D, color: CGColor, width: float, height: float) {
        context.setFillColor(color);
        context.fillRect(new CGRectangle(HALF_PIXEL_X, HALF_PIXEL_Y, width + HALF_PIXEL_X, height + HALF_PIXEL_Y));
        context.fillPath();
    }

    private initializeContext(context: CGContext2D, size: float, antialias: boolean): void;
    private initializeContext(context: CGContext2D, width: float, height: float, antialias: boolean): void;
    private initializeContext(...args: any[]): void {
        const constext: CGContext2D = args[0];
        if (args.length === 3) {
            this.initializeContext(args[0], args[1], args[1], args[2]);
        } else if (args.length === 4) {
            constext.setShouldAntialias(args[3]);
        }
    }

    public constructor(hatchStyle: HatchStyle, foreColor: CGColor);
    public constructor(hatchStyle: HatchStyle, foreColor: CGColor, backColor: CGColor);
    public constructor(...args: any[]) {
        super();
        if (args.length === 2) {
            this.hatchStyle = args[0];
            this.foreColor = args[1];
            this.backColor = CGColor.Black;
        } else if (args.length === 3) {
            this.hatchStyle = args[0];
            this.foreColor = args[1];
            this.backColor = args[2];
        }
    }

    public get BackgroundColor(): CGColor {
        return this.backColor;
    }

    public get ForegroundColor(): CGColor {
        return this.foreColor;
    }

    public get HatchStyle(): HatchStyle {
        return this.hatchStyle;
    }

    public /*override*/ Clone(): HatchBrush {
        return new HatchBrush(this.hatchStyle, this.foreColor, this.backColor);
    }

    private hatchHorizontal(context: CGContext2D): void {
        const hatchSize: float = this.getHatchWidth(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchSize, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchSize, hatchSize);

        /* draw horizontal line in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        // draw a horizontal line
        context.beginPath();
        context.moveTo(0, 0);
        context.addLineToPoint(hatchSize, 0);
        context.closePath();

        context.strokePath();
    }

    private hatchVertical(context: CGContext2D): void {
        const hatchSize: float = this.getHatchWidth(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchSize, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchSize, hatchSize);

        /* draw horizontal line in the foreground color */
        context.translateCTM(0.5, 0.5);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        //float halfMe = hatchSize / 2.0f;

        // draw a horizontal line
        context.moveTo(0, 0);
        context.addLineToPoint(0, hatchSize);

        context.strokePath();
        context.translateCTM(-0.5, -0.5);
    }

    private hatchGrid(context: CGContext2D): void {
        let hatchSize: float = this.getHatchWidth(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchSize, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchSize, hatchSize);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        hatchSize -= HALF_PIXEL_X;
        let yoffset: float = 0;

        if (this.hatchStyle === HatchStyle.DottedGrid) {
            yoffset = 1;
            const dash: float[] = [1, 1];
            context.setLineDash(2, dash);

        }

        /* draw a horizontal line */
        context.moveTo(0, yoffset);
        context.addLineToPoint(0, hatchSize);
        context.strokePath();
        /* draw a vertical line */
        context.moveTo(0, hatchSize);
        context.addLineToPoint(hatchSize, hatchSize);

        context.strokePath();
    }

    /**
     * Percentage patterns were obtained by creating a screen shot from a windows fill
     * and looking at the patterns at the pixel level.  A little tedious to say the least
     * but they do seem correct and recreate the same pattern from windows to here.
     */
    private hatchPercentage(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);


        /* some patterns require us to reverse the colors */
        switch (this.hatchStyle) {
            case HatchStyle.Percent05:
            case HatchStyle.Percent10:
            case HatchStyle.Percent20:
            case HatchStyle.Percent25:
            case HatchStyle.Percent30:
                this.drawBackground(context, this.backColor, hatchWidth, hatchWidth);
                context.setFillColor(this.foreColor);
                break;
            default:
                this.drawBackground(context, this.foreColor, hatchWidth, hatchWidth);
                context.setFillColor(this.backColor);
                break;
        }

        // create a work rectangle for setting pixels
        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);

        // Only set the pixels for some
        if (this.hatchStyle !== HatchStyle.Percent50 &&
            this.hatchStyle !== HatchStyle.Percent40 &&
            this.hatchStyle !== HatchStyle.Percent30 &&
            this.hatchStyle !== HatchStyle.Percent60) {
            rect.X = 0;
            rect.Y = (hatchHeight / 2.0);
            this.setPixels(context, rect);
            rect.X = hatchWidth / 2.0;
            rect.Y = 0;
            this.setPixels(context, rect);
        }

        // 50 and 40 start out the same with a 50 percent
        if (this.hatchStyle === HatchStyle.Percent50 ||
            this.hatchStyle === HatchStyle.Percent40) {
            let x: number = 0;
            let y: number = 0;

            for (y = 0; y < hatchHeight; y += 2) {
                for (x = 1; x < hatchWidth; x += 2) {
                    rect.X = x;
                    rect.Y = y;
                    this.setPixels(context, rect);
                }
            }
            for (y = 1; y < hatchHeight; y += 2) {
                for (x = 0; x < hatchWidth; x += 2) {
                    rect.X = x;
                    rect.Y = y;
                    this.setPixels(context, rect);
                }
            }

            // Percent40 is a 50 with two more dots set of back color
            // within a set area.  This creates an interesting effect
            // of a double plus sign in opposite corners.
            if (this.hatchStyle === HatchStyle.Percent40) {
                rect.X = 1;
                rect.Y = 1;
                this.setPixels(context, rect);
                rect.X = 5;
                rect.Y = 5;
                this.setPixels(context, rect);
            }

        }

        // Percent30 and Percent60 are really messed up so we will just set some dots
        // to present the pattern.  Percent60 is a 30 with colors reversed, go figure.
        if (this.hatchStyle === HatchStyle.Percent30 ||
            this.hatchStyle === HatchStyle.Percent60) {
            rect.X = 0;
            rect.Y = 0;
            this.setPixels(context, rect);
            rect.X = 2;
            rect.Y = 0;
            this.setPixels(context, rect);
            rect.X = 0;
            rect.Y = 2;
            this.setPixels(context, rect);
            rect.X = 2;
            rect.Y = 2;
            this.setPixels(context, rect);

            rect.X = 1;
            rect.Y = 3;
            this.setPixels(context, rect);

            rect.X = 3;
            rect.Y = 1;
            this.setPixels(context, rect);
        }

    }

    private hatchUpwardDiagonal(context: CGContext2D): void {
        const hatchSize: float = this.getHatchWidth(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);


        if (this.hatchStyle !== HatchStyle.ForwardDiagonal &&
            this.hatchStyle !== HatchStyle.BackwardDiagonal) {
            this.initializeContext(context, hatchSize, false);
        }
        else {
            this.initializeContext(context, hatchSize, true);
        }


        /* draw background */
        this.drawBackground(context, this.backColor, hatchSize, hatchSize);


        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setFillColor(this.foreColor);

        context.setLineWidth(1);
        context.setLineCap(CGLineCap.Square);

        context.moveTo(0, 0);
        context.addLineToPoint(hatchSize, hatchSize);
        /* draw a diagonal line for as many times as linewidth*/
        for (let l = 0; l < lineWidth; l++) {
            /* draw a diagonal line */
            context.moveTo(l, 0);
            context.addLineToPoint(hatchSize, hatchSize - l);

            context.strokePath();
        }

        /**
         * because we are within a rectangular pattern we have to complete the tip of the preceeding line
         * pattern
         */
        for (let k = 1; k < lineWidth; k++) {
            /* draw a diagonal line */
            context.moveTo(0, hatchSize - k);
            context.addLineToPoint(k - 1, hatchSize - 1);

            context.strokePath();
        }

    }

    private hatchDiagonalCross(context: CGContext2D) {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, true);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        //float halfMe = hatchHeight / 2.0f;

        context.moveTo(0, 0);
        context.addLineToPoint(hatchWidth, hatchHeight);
        context.strokePath();

        context.moveTo(hatchWidth, 0);
        context.addLineToPoint(0, hatchHeight);
        context.strokePath();
    }

    /**
     * This is fill of hackish stuff.
     * Thought this was going to be easier but that just did not work out.
     **/
    private hatchSphere(context: CGContext2D): void {
        const hatchSize: float = this.getHatchWidth(this.hatchStyle);
        //var lineWidth = getLineWidth (hatchStyle);

        this.initializeContext(context, hatchSize, false);

        /* draw background in fore ground color*/
        this.drawBackground(context, this.backColor, hatchSize, hatchSize);

        context.setStrokeColor(this.foreColor);
        context.setFillColor(this.foreColor);

        context.setLineWidth(1);
        context.setLineCap(CGLineCap.Square);


        // Initialize work rectangle
        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);

        const quad: float = hatchSize / 2.0;

        // Left lower quad
        rect.Width = quad;
        rect.Height = quad;
        rect.X = 0;
        rect.Y = 0;

        context.strokeRect(rect);

        // right upper quad
        rect.Width = quad;
        rect.Height = quad;
        rect.X = quad;
        rect.Y = quad;

        context.strokeRect(rect);

        // left upper quad
        rect.Width = quad;
        rect.Height = quad;
        rect.X = 0;
        rect.Y = quad + 1;

        context.fillRect(rect);

        // right lower quod
        rect.Width = quad;
        rect.Height = quad;
        rect.X = quad + 1;
        rect.Y = 0;

        context.fillRect(rect);

        // Now we fill in some corner bits with background
        // This is a bad hack but now sure what else to do
        context.setFillColor(this.backColor);

        rect.Height = 1;
        rect.Width = 1;

        rect.X = 0;
        rect.Y = 0;
        this.setPixels(context, rect);

        rect.X = 0;
        rect.Y = quad;
        this.setPixels(context, rect);

        rect.X = 0;
        rect.Y = quad;
        this.setPixels(context, rect);

        rect.X = quad;
        rect.Y = 0;
        this.setPixels(context, rect);

        rect.X = quad;
        rect.Y = quad;
        this.setPixels(context, rect);

        rect.X = quad;
        rect.Y = hatchSize;
        this.setPixels(context, rect);

        rect.X = hatchSize;
        rect.Y = 0;
        this.setPixels(context, rect);

        rect.X = hatchSize;
        rect.Y = quad;
        this.setPixels(context, rect);

        rect.X = hatchSize;
        rect.Y = hatchSize;
        this.setPixels(context, rect);

        // Now for the fake shiny thingys hack
        // Probably could use a line here but it is already
        // so hacky I will just use this.
        rect.X = 5;
        rect.Y = 3;
        this.setPixels(context, rect);

        rect.X = 6;
        rect.Y = 3;
        this.setPixels(context, rect);

        rect.X = 1;
        rect.Y = 7;
        this.setPixels(context, rect);

        rect.X = 2;
        rect.Y = 7;
        this.setPixels(context, rect);
    }

    private hatchDashedDiagonal(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        var lineWidth = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchHeight / 2.0;

        context.moveTo(0, halfMe);
        context.addLineToPoint(hatchWidth, hatchHeight);
        context.strokePath();
    }

    private hatchDashedHorizontal(context: CGContext2D): void {
        let hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        let hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchHeight / 2.0 - 1;
        hatchWidth -= 1;
        hatchHeight -= 1;

        context.moveTo(halfMe + 1, halfMe);
        context.addLineToPoint(hatchWidth, halfMe);
        context.strokePath();

        context.moveTo(0, hatchHeight);
        context.addLineToPoint(halfMe, hatchHeight);
        context.strokePath();

    }

    private hatchConfetti(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        //var lineWidth = getLineWidth (hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw confetti Rectangles in the foreground color */
        context.setFillColor(this.foreColor);

        const rect: CGRectangle = new CGRectangle(0, 0, 2, 2);

        // Do not see a mathematical equation so will just set
        // the same ones as in windows pattern.
        if (this.hatchStyle === HatchStyle.LargeConfetti) {
            this.setPixels(context, rect);

            rect.X = 2;
            rect.Y = 2;
            this.setPixels(context, rect);

            rect.X = 5;
            rect.Y = 1;
            this.setPixels(context, rect);

            rect.X = 6;
            rect.Y = 4;
            this.setPixels(context, rect);

            rect.X = 4;
            rect.Y = 6;
            this.setPixels(context, rect);

            rect.X = 1;
            rect.Y = 5;
            this.setPixels(context, rect);
        }
        else {
            rect.Width = 1;
            rect.Height = 1;

            this.setPixels(context, rect);

            rect.X = 3;
            rect.Y = 1;
            this.setPixels(context, rect);

            rect.X = 6;
            rect.Y = 2;
            this.setPixels(context, rect);

            rect.X = 2;
            rect.Y = 3;
            this.setPixels(context, rect);

            rect.X = 7;
            rect.Y = 4;
            this.setPixels(context, rect);

            rect.X = 4;
            rect.Y = 5;
            this.setPixels(context, rect);

            rect.X = 1;
            rect.Y = 6;
            this.setPixels(context, rect);

            rect.X = 5;
            rect.Y = 7;
            this.setPixels(context, rect);

        }
    }

    private hatchZigZag(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        let hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;
        hatchHeight -= 1;

        context.moveTo(0, 0);
        context.addLineToPoint(halfMe - 1, hatchHeight);
        context.strokePath();

        context.moveTo(halfMe + 1, hatchHeight);
        context.addLineToPoint(hatchWidth, 0);
        context.strokePath();

    }

    private hatchWave(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        //var lineWidth = getLineWidth (hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);

        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);

        // We could maybe draw some arcs here but there are so few pixels
        // that it just is not worth it.
        rect.X = 1;
        this.setPixels(context, rect);
        rect.X = 2;
        this.setPixels(context, rect);

        rect.Y = 1;

        rect.X = 0;
        this.setPixels(context, rect);
        rect.X = 3;
        this.setPixels(context, rect);
        rect.X = 6;
        this.setPixels(context, rect);

        rect.Y = 2;

        rect.X = 4;
        this.setPixels(context, rect);
        rect.X = 5;
        this.setPixels(context, rect);
    }

    private hatchHorizontalBrick(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);

        rect.Y = 3;
        rect.Width = hatchWidth;
        rect.Height = hatchHeight - 4;
        context.strokeRect(rect);

        context.moveTo(hatchWidth / 2.0, 0);
        context.addLineToPoint(hatchWidth / 2.0, 3);
        context.strokePath();
    }

    private hatchDiagonalBrick(context: CGContext2D): void {
        let hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        let hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        hatchHeight -= 1;
        hatchWidth -= 1;

        context.moveTo(0, 0);
        context.addLineToPoint(hatchWidth, hatchHeight);
        context.strokePath();

        context.moveTo(0, hatchHeight);
        context.addLineToPoint(hatchWidth / 2.0, hatchHeight / 2.0);
        context.strokePath();
    }

    private hatchWeave(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);

        /* draw lines in the foreground color */
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfWidth: float = hatchWidth / 2.0;
        const halfHeight: float = hatchHeight / 2.0;

        //CGRect rect = new CGRect (0,0,1,1);


        // Add upward diagonals
        context.moveTo(0, 0);
        context.addLineToPoint(halfWidth, halfHeight);
        context.strokePath();

        context.moveTo(0, halfHeight);
        context.addLineToPoint(halfWidth - 1, hatchHeight - 1);
        context.strokePath();

        context.moveTo(halfWidth, 0);
        context.addLineToPoint(6, 2);
        context.strokePath();

        //			context.MoveTo(0, 4);
        //			context.AddLineToPoint(2, 2);
        //			context.StrokePath();

        context.moveTo(2, 6);
        context.addLineToPoint(7, 1);
        context.strokePath();

    }

    private hatchTrellis(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        //var lineWidth = getLineWidth (hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.foreColor, hatchWidth, hatchHeight);

        context.setFillColor(this.backColor);

        const rect: CGRectangle = new CGRectangle(0, 0, 2, 1);
        this.setPixels(context, rect);

        rect.X = hatchWidth / 2.0;
        rect.Y = hatchHeight / 2.0;
        this.setPixels(context, rect);
    }

    private hatchCheckered(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        context.setFillColor(this.foreColor);

        const rect: CGRectangle = new CGRectangle(0, 0, hatchWidth / 2.0, hatchHeight / 2.0);
        this.setPixels(context, rect);

        rect.X = hatchWidth / 2.0;
        rect.Y = hatchHeight / 2.0;
        this.setPixels(context, rect);
    }

    private hatchOutlinedDiamond(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        // this is really just two diagonal lines from each corner too
        // their opposite corners.
        context.moveTo(0, 0);
        context.addLineToPoint(hatchWidth, hatchHeight);
        context.strokePath();
        context.moveTo(1, hatchHeight);
        context.addLineToPoint(hatchWidth, 1);
        context.strokePath();
    }

    private hatchSolidDiamond(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;

        // We will paint two triangles from corners meeting in the middle
        // make sure to offset by half pixels so that the point is actually a point.
        context.moveTo(-HALF_PIXEL_X, HALF_PIXEL_Y);
        context.addLineToPoint(2 + HALF_PIXEL_X, halfMe - HALF_PIXEL_Y);
        context.addLineToPoint(-HALF_PIXEL_X, hatchHeight - (1.0 + HALF_PIXEL_Y));
        context.closePath();
        context.fillPath();

        // now we do the right one
        context.moveTo(hatchWidth, HALF_PIXEL_Y);
        context.addLineToPoint(halfMe + HALF_PIXEL_X, halfMe - HALF_PIXEL_Y);
        context.addLineToPoint(hatchWidth, hatchHeight - (1.0 + HALF_PIXEL_Y));
        context.closePath();
        context.fillPath();

    }

    private hatchDottedDiamond(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;
        const quarter: float = halfMe / 2.0;

        // this is really just 6 dots that when tiled will
        // create the effect we are looking for
        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);
        this.setPixels(context, rect);

        rect.Y = halfMe;
        this.setPixels(context, rect);

        rect.X = halfMe;
        this.setPixels(context, rect);

        rect.Y = 0;
        this.setPixels(context, rect);

        rect.X = quarter;
        rect.Y = quarter;
        this.setPixels(context, rect);

        rect.X = halfMe + quarter;
        rect.Y = halfMe + quarter;
        this.setPixels(context, rect);
    }


    private hatchShingle(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;

        // We are basically going to draw a lamda sign

        // Draw base
        context.moveTo(0, 0);
        context.addLineToPoint(halfMe, halfMe - HALF_PIXEL_Y);
        context.addLineToPoint(hatchWidth, HALF_PIXEL_Y);
        context.strokePath();

        // draw the first part of tail
        context.moveTo(halfMe + HALF_PIXEL_X, halfMe);
        context.addLineToPoint(halfMe + HALF_PIXEL_X, halfMe + 1);
        context.strokePath();

        // now the last curl on the tail
        const rect: CGRectangle = new CGRectangle(1, hatchHeight - 1, 1, 1);
        this.setPixels(context, rect);

        rect.X += 1;
        this.setPixels(context, rect);

        rect.X += 1;
        rect.Y -= 1;
        this.setPixels(context, rect);

    }

    private hatchDivot(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;

        // draw a little wirly thingy
        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);
        this.setPixels(context, rect);

        rect.X += 1;
        rect.Y += 1;
        this.setPixels(context, rect);

        rect.X -= 1;
        rect.Y += 1;
        this.setPixels(context, rect);

        // now top one
        rect.X = halfMe;// + HALF_PIXEL_X;
        rect.Y = halfMe;// + HALF_PIXEL_Y;
        this.setPixels(context, rect);

        rect.X -= 1;
        rect.Y += 1;
        this.setPixels(context, rect);

        rect.X += 1;
        rect.Y += 1;
        this.setPixels(context, rect);

    }

    private hatchPlaid(context: CGContext2D): void {
        const hatchWidth: float = this.getHatchWidth(this.hatchStyle);
        const hatchHeight: float = this.getHatchHeight(this.hatchStyle);
        const lineWidth: float = this.getLineWidth(this.hatchStyle);

        this.initializeContext(context, hatchHeight, false);

        /* draw background */
        this.drawBackground(context, this.backColor, hatchWidth, hatchHeight);

        /* draw lines in the foreground color */
        context.setFillColor(this.foreColor);
        context.setStrokeColor(this.foreColor);
        context.setLineWidth(lineWidth);
        context.setLineCap(CGLineCap.Square);

        const halfMe: float = hatchWidth / 2.0;
        const rect: CGRectangle = new CGRectangle(0, 0, 1, 1);

        // fraw the alternating pattern for half of area
        let x = 0;
        let y = 0;

        for (y = 0; y < halfMe; y += 2) {
            for (x = 1; x < hatchWidth; x += 2) {
                rect.X = x;
                rect.Y = y;
                this.setPixels(context, rect);
            }
        }
        for (y = 1; y < halfMe; y += 2) {
            for (x = 0; x < hatchWidth; x += 2) {
                rect.X = x;
                rect.Y = y;
                this.setPixels(context, rect);
            }
        }

        // draw a square
        rect.X = 0;
        rect.Y = halfMe;
        rect.Width = halfMe;
        rect.Height = halfMe;
        this.setPixels(context, rect);
    }




    private setPixels(context: CGContext2D, x: float, y: float, size?: float): void;
    private setPixels(context: CGContext2D, rect: CGRectangle): void;
    private setPixels(...args: any[]): void {
        const context: CGContext2D = args[0];
        if (args.length === 3) {
            this.setPixels(context, new CGRectangle(args[1], args[2], 1.0, 1.0));
        } else if (args.length === 4) {
            this.setPixels(context, new CGRectangle(args[1], args[2], args[3], args[3]));
        } else if (args.length === 2) {
            context.fillRect(args[1]);
        }
    }

    // Purple poka dots test
    private drawPolkaDotPattern(context: CGContext2D): void {
        context.setFillColor(CGColor.Purple);
        context.fillEllipseInRect(new CGRectangle(4, 4, 8, 8));
    }

    public /*internal*/ /*override*/ setup(graphics: Graphics, fill: boolean): void {

        // if this is the same as the last that was set then return
        if (graphics.LastBrush === this)
            return;

        // obtain our width and height so we can set the pattern rectangle
        const hatch_width: float = this.getHatchWidth(this.hatchStyle);
        const hatch_height: float = this.getHatchHeight(this.hatchStyle);

        //choose the pattern to be filled based on the currentPattern selected
        /* var patternSpace = CGColorSpace.CreatePattern(null);
        graphics.context.SetFillColorSpace(patternSpace);
        graphics.context.SetStrokeColorSpace (patternSpace);
        patternSpace.Dispose(); */

        // Pattern default work variables
        var patternRect = new CGRectangle(HALF_PIXEL_X, HALF_PIXEL_Y, hatch_width + HALF_PIXEL_X, hatch_height + HALF_PIXEL_Y);
        var patternTransform = CGAffineTransform.MakeIdentity();

        // Since all the patterns were developed with MonoMac on Mac OS the coordinate system is
        // defaulted to the lower left corner being 0,0 which means for MonoTouch and any view
        // that is flipped we need to flip it again.  Yep should have thought about it to begin with
        // will look into changing it later if need be.

        if ((<any>graphics).isFlipped) {
            patternTransform = new CGAffineTransform(1, 0, 0, -1, 0, hatch_height);
        }

        // DrawPattern callback which will be set depending on hatch style
        //CGPattern.DrawPattern drawPattern;
        let drawPattern: (context: CGContext2D) => void;

        switch (this.hatchStyle) {
            case HatchStyle.Horizontal:
            case HatchStyle.LightHorizontal:
            case HatchStyle.NarrowHorizontal:
            case HatchStyle.DarkHorizontal:
                drawPattern = this.hatchHorizontal;
                break;
            case HatchStyle.Vertical:
                patternTransform.translate(8, 0);
                patternTransform.rotate(90 * Math.PI / 180);
                drawPattern = this.hatchHorizontal;
                break;
            case HatchStyle.LightVertical:
            case HatchStyle.NarrowVertical:
            case HatchStyle.DarkVertical:
                patternTransform.translate(4, 0);
                patternTransform.rotate(90 * Math.PI / 180);
                drawPattern = this.hatchHorizontal;
                break;
            case HatchStyle.ForwardDiagonal:
            case HatchStyle.WideDownwardDiagonal:
                patternTransform.translate(8, 0);
                patternTransform.scale(-1, 1);
                drawPattern = this.hatchUpwardDiagonal;
                break;
            case HatchStyle.LightDownwardDiagonal:
            case HatchStyle.DarkDownwardDiagonal:
                // We will flip the x-axis here
                patternTransform.translate(4, 0);
                patternTransform.scale(-1, 1);
                drawPattern = this.hatchUpwardDiagonal;
                break;
            case HatchStyle.BackwardDiagonal:
            case HatchStyle.LightUpwardDiagonal:
            case HatchStyle.DarkUpwardDiagonal:
            case HatchStyle.WideUpwardDiagonal:
                drawPattern = this.hatchUpwardDiagonal;
                break;
            case HatchStyle.LargeGrid:
            case HatchStyle.SmallGrid:
            case HatchStyle.DottedGrid:
                drawPattern = this.hatchGrid;
                break;
            case HatchStyle.DiagonalCross:
                drawPattern = this.hatchDiagonalCross;
                break;
            case HatchStyle.Percent05:
            case HatchStyle.Percent10:
            case HatchStyle.Percent20:
            case HatchStyle.Percent25:
            case HatchStyle.Percent30:
            case HatchStyle.Percent40:
            case HatchStyle.Percent50:
            case HatchStyle.Percent60:
            case HatchStyle.Percent70:
            case HatchStyle.Percent75:
            case HatchStyle.Percent80:
            case HatchStyle.Percent90:
                drawPattern = this.hatchPercentage;
                break;
            case HatchStyle.Sphere:
                drawPattern = this.hatchSphere;
                break;
            case HatchStyle.DashedDownwardDiagonal:
                patternTransform.translate(4, 0);
                patternTransform.scale(-1, 1);
                drawPattern = this.hatchDashedDiagonal;
                break;
            case HatchStyle.DashedUpwardDiagonal:
                drawPattern = this.hatchDashedDiagonal;
                break;
            case HatchStyle.DashedHorizontal:
                drawPattern = this.hatchDashedHorizontal;
                break;
            case HatchStyle.DashedVertical:
                patternTransform.translate(-4, 0);
                patternTransform.rotate(-90 * Math.PI / 180);
                drawPattern = this.hatchDashedHorizontal;
                break;
            case HatchStyle.LargeConfetti:
            case HatchStyle.SmallConfetti:
                drawPattern = this.hatchConfetti;
                break;
            case HatchStyle.ZigZag:
                drawPattern = this.hatchZigZag;
                break;
            case HatchStyle.Wave:
                drawPattern = this.hatchWave;
                break;
            case HatchStyle.HorizontalBrick:
                drawPattern = this.hatchHorizontalBrick;
                break;
            case HatchStyle.DiagonalBrick:
                drawPattern = this.hatchDiagonalBrick;
                break;
            //			case HatchStyle.Weave:
            //				drawPattern = HatchWeave;
            //				break;
            case HatchStyle.Trellis:
                drawPattern = this.hatchTrellis;
                break;
            case HatchStyle.LargeCheckerBoard:
            case HatchStyle.SmallCheckerBoard:
                drawPattern = this.hatchCheckered;
                break;
            case HatchStyle.OutlinedDiamond:
                drawPattern = this.hatchOutlinedDiamond;
                break;
            case HatchStyle.SolidDiamond:
                drawPattern = this.hatchSolidDiamond;
                break;
            case HatchStyle.DottedDiamond:
                drawPattern = this.hatchDottedDiamond;
                break;
            case HatchStyle.Divot:
                drawPattern = this.hatchDivot;
                break;
            case HatchStyle.Shingle:
                drawPattern = this.hatchShingle;
                break;
            case HatchStyle.Plaid:
                drawPattern = this.hatchPlaid;
                break;
            default:
                drawPattern = this.drawPolkaDotPattern;
                break;
        }

        //set the pattern as the Current Context’s fill pattern
        var pattern = new CGPattern(patternRect,
            patternTransform,
            hatch_width, hatch_height,
            CGPatternTiling.NoDistortion,
            true, drawPattern.bind(this) as any);
        //we dont need to set any color, as the pattern cell itself has chosen its own color
        const aone: float[] = [1];
        graphics.renderer.setFillPattern(pattern, aone);
        graphics.renderer.setStrokePattern(pattern, aone);

        graphics.LastBrush = this;
        // I am setting this to be used for Text coloring in DrawString
        graphics.LastBrushColor = this.foreColor;
    }

}
