import { CGPoint } from '@tuval/cg';
import { Pen } from "../Pen";
import { Brush } from "../Brush";
import { Matrix } from "./Matrix";
import { GraphicsUnit } from "../GraphicsUnit";
import { SmoothingMode } from "../SmoothingMode";
import { Region } from "../Region";
import { float } from "@tuval/core";

    export class GraphicsState {

        // TODO: set the rest of the states
        // These are just off the top of my head for right now as am sure there are
        // many more
        public lastPen: Pen = undefined as any;
        public lastBrush: Brush = undefined as any;
        public model: Matrix = undefined as any;
        public view: Matrix = undefined as any;
        public renderingOrigin: CGPoint =  undefined as any;
        public pageUnit: GraphicsUnit = undefined as any;
        public pageScale: float= undefined as any;
        public smoothingMode: SmoothingMode= undefined as any;
        public clipRegion: Region= undefined as any;
    }