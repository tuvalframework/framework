import { CGColor } from "@tuval/cg";
import { float } from "@tuval/core";

    export class ColorBlend {
        public Colors: CGColor[];
        public Positions: float[];
        public constructor(count: number = 1) {
            this.Colors = new Array(count);
            for (let i = 0; i < this.Colors.length; i++) {
                this.Colors[i] = CGColor.Black;
            }
            this.Positions = new Array(count);
            for (let i = 0; i < this.Positions.length; i++) {
                this.Positions[i] = 0;
            }
        }
    }