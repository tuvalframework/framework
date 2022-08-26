import { IContext2D } from './IContext2D';
import { CGRectangle } from "./CGRectangle";
import { CGAffineTransform } from "./CGAffineTransform";
import { WrapMode } from "./WrapMode";
import { float, ArgumentNullException, ClassInfo } from "@tuval/core";
import { CoreGraphicTypes } from './types';

    export type DrawPattern = (ctx: IContext2D) => void;
    export type ProcessImageFunc = (ctx: IContext2D) => IContext2D;
    export enum CGPatternTiling {
        NoDistortion,
        ConstantSpacingMinimalDistortion,
        ConstantSpacing
    }

    @ClassInfo({
        fullName: CoreGraphicTypes.CGPattern,
        instanceof: [
            CoreGraphicTypes.CGPattern
        ]
    })
    export class CGPattern {
        public constructor(public bounds: CGRectangle,
            public matrix: CGAffineTransform,
            public xStep: float,
            public yStep: float,
            public tiling: CGPatternTiling,
            public isColored: boolean,
            public drawPattern: DrawPattern,
            public wrapMode: WrapMode = WrapMode.Tile,
            public processImageFunc?:ProcessImageFunc
            ) {
            if (drawPattern == null) {
                throw new ArgumentNullException("drawPattern");
            }
        }
    }