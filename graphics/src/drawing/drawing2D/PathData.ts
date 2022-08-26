import { CGPoint } from '@tuval/cg';
import { byte } from "@tuval/core";

    export class PathData {
        public Points: CGPoint[];
        public Types: byte[];
        constructor(points: CGPoint[], types: byte[]) {
            this.Points = points;
            this.Types = types;
        }
    }