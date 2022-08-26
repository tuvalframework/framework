import { float } from "@tuval/core";

    export class Blend {
        public Factors: float[];
        public Positions: float[];
        public constructor(count: number = 1) {
            this.Factors = new Array(count);
            this.Positions = new Array(count);
        }
    }