import { float } from "@tuval/core";
import { ClassInfo } from "@tuval/core";
import { GraphicTypes } from "../GDITypes";
    export interface ColorMatrixConfig {
        matrix00: float;
        matrix01: float;
        matrix02: float;
        matrix03: float;
        matrix04: float;
        matrix10: float;
        matrix11: float;
        matrix12: float;
        matrix13: float;
        matrix14: float;
        matrix20: float;
        matrix21: float;
        matrix22: float;
        matrix23: float;
        matrix24: float;
        matrix30: float;
        matrix31: float;
        matrix32: float;
        matrix33: float;
        matrix34: float;
        matrix40: float;
        matrix41: float;
        matrix42: float;
        matrix43: float;
        matrix44: float;
    }

    @ClassInfo({
        fullName: GraphicTypes.ColorMatrix,
        instanceof: [
            GraphicTypes.ColorMatrix
        ]
    })
    export class ColorMatrix {
        private _matrix00: float = 0;
        private _matrix01: float = 0;
        private _matrix02: float = 0;
        private _matrix03: float = 0;
        private _matrix04: float = 0;
        private _matrix10: float = 0;
        private _matrix11: float = 0;
        private _matrix12: float = 0;
        private _matrix13: float = 0;
        private _matrix14: float = 0;
        private _matrix20: float = 0;
        private _matrix21: float = 0;
        private _matrix22: float = 0;
        private _matrix23: float = 0;
        private _matrix24: float = 0;
        private _matrix30: float = 0;
        private _matrix31: float = 0;
        private _matrix32: float = 0;
        private _matrix33: float = 0;
        private _matrix34: float = 0;
        private _matrix40: float = 0;
        private _matrix41: float = 0;
        private _matrix42: float = 0;
        private _matrix43: float = 0;
        private _matrix44: float = 0;

        public get Matrix00(): float {
            return this._matrix00;
        }
        public set Matrix00(value: float) {
            this._matrix00 = value;
        }

        public get Matrix01(): float {
            return this._matrix01;
        }
        public set Matrix01(value: float) {
            this._matrix01 = value;
        }

        public get Matrix02(): float {
            return this._matrix02;
        }
        public set Matrix02(value: float) {
            this._matrix02 = value;
        }

        public get Matrix03(): float {
            return this._matrix03;
        }
        public set Matrix03(value: float) {
            this._matrix03 = value;
        }

        public get Matrix04(): float {
            return this._matrix04;
        }
        public set Matrix04(value: float) {
            this._matrix04 = value;
        }

        public get Matrix10(): float {
            return this._matrix10;
        }
        public set Matrix10(value: float) {
            this._matrix10 = value;
        }

        public get Matrix11(): float {
            return this._matrix11;
        }
        public set Matrix11(value: float) {
            this._matrix11 = value;
        }

        public get Matrix12(): float {
            return this._matrix12;
        }
        public set Matrix12(value: float) {
            this._matrix12 = value;
        }

        public get Matrix13(): float {
            return this._matrix13;
        }
        public set Matrix13(value: float) {
            this._matrix13 = value;
        }

        public get Matrix14(): float {
            return this._matrix14;
        }
        public set Matrix14(value: float) {
            this._matrix14 = value;
        }

        public get Matrix20(): float {
            return this._matrix20;
        }
        public set Matrix20(value: float) {
            this._matrix20 = value;
        }

        public get Matrix21(): float {
            return this._matrix21;
        }
        public set Matrix21(value: float) {
            this._matrix21 = value;
        }

        public get Matrix22(): float {
            return this._matrix22;
        }
        public set Matrix22(value: float) {
            this._matrix22 = value;
        }

        public get Matrix23(): float {
            return this._matrix23;
        }
        public set Matrix23(value: float) {
            this._matrix23 = value;
        }

        public get Matrix24(): float {
            return this._matrix24;
        }
        public set Matrix24(value: float) {
            this._matrix24 = value;
        }

        public get Matrix30(): float {
            return this._matrix30;
        }
        public set Matrix30(value: float) {
            this._matrix30 = value;
        }

        public get Matrix31(): float {
            return this._matrix31;
        }
        public set Matrix31(value: float) {
            this._matrix31 = value;
        }

        public get Matrix32(): float {
            return this._matrix32;
        }
        public set Matrix32(value: float) {
            this._matrix32 = value;
        }

        public get Matrix33(): float {
            return this._matrix33;
        }
        public set Matrix33(value: float) {
            this._matrix33 = value;
        }

        public get Matrix34(): float {
            return this._matrix34;
        }
        public set Matrix34(value: float) {
            this._matrix34 = value;
        }

        public get Matrix40(): float {
            return this._matrix40;
        }
        public set Matrix40(value: float) {
            this._matrix40 = value;
        }

        public get Matrix41(): float {
            return this._matrix41;
        }
        public set Matrix41(value: float) {
            this._matrix41 = value;
        }

        public get Matrix42(): float {
            return this._matrix42;
        }
        public set Matrix42(value: float) {
            this._matrix42 = value;
        }

        public get Matrix43(): float {
            return this._matrix43;
        }
        public set Matrix43(value: float) {
            this._matrix43 = value;
        }

        public get Matrix44(): float {
            return this._matrix44;
        }
        public set Matrix44(value: float) {
            this._matrix44 = value;
        }

        public constructor(newColorMatrix: float[][]);
        public constructor(config?: ColorMatrixConfig);
        public constructor(...args: any[]) {
            if (args.length == 0) {
                /*
                 * Setup identity matrix by default
                 */

                this._matrix00 = 1.0;
                //matrix01 = 0.0f;
                //matrix02 = 0.0f;
                //matrix03 = 0.0f;
                //matrix04 = 0.0f;
                //matrix10 = 0.0f;
                this._matrix11 = 1.0;
                //matrix12 = 0.0f;
                //matrix13 = 0.0f;
                //matrix14 = 0.0f;
                //matrix20 = 0.0f;
                //matrix21 = 0.0f;
                this._matrix22 = 1.0;
                // matrix23 = 0.0f;
                // matrix24 = 0.0f;
                // matrix30 = 0.0f;
                //matrix31 = 0.0f;
                // matrix32 = 0.0f;
                this._matrix33 = 1.0;
                // matrix34 = 0.0f;
                // matrix40 = 0.0f;
                // matrix41 = 0.0f;
                // matrix42 = 0.0f;
                // matrix43 = 0.0f;
                this._matrix44 = 1.0;
            } else if (Array.isArray(args[0])) {
                this.setMatrix(args[0]);
            } else {
                const config: ColorMatrixConfig = args[0];
                this.Matrix00 = config.matrix00;
                this.Matrix01 = config.matrix01;
                this.Matrix02 = config.matrix02;
                this.Matrix03 = config.matrix03;
                this.Matrix04 = config.matrix04;
                this.Matrix10 = config.matrix10;
                this.Matrix11 = config.matrix11;
                this.Matrix12 = config.matrix12;
                this.Matrix13 = config.matrix13;
                this.Matrix14 = config.matrix14;
                this.Matrix20 = config.matrix20;
                this.Matrix21 = config.matrix21;
                this.Matrix22 = config.matrix22;
                this.Matrix23 = config.matrix23;
                this.Matrix24 = config.matrix24;
                this.Matrix30 = config.matrix30;
                this.Matrix31 = config.matrix31;
                this.Matrix32 = config.matrix32;
                this.Matrix33 = config.matrix33;
                this.Matrix34 = config.matrix34;
                this.Matrix40 = config.matrix40;
                this.Matrix41 = config.matrix41;
                this.Matrix42 = config.matrix42;
                this.Matrix43 = config.matrix43;
                this.Matrix44 = config.matrix44;
            }
        }



        private setMatrix(newColorMatrix: float[][]): void {
            this._matrix00 = newColorMatrix[0][0];
            this._matrix01 = newColorMatrix[0][1];
            this._matrix02 = newColorMatrix[0][2];
            this._matrix03 = newColorMatrix[0][3];
            this._matrix04 = newColorMatrix[0][4];
            this._matrix10 = newColorMatrix[1][0];
            this._matrix11 = newColorMatrix[1][1];
            this._matrix12 = newColorMatrix[1][2];
            this._matrix13 = newColorMatrix[1][3];
            this._matrix14 = newColorMatrix[1][4];
            this._matrix20 = newColorMatrix[2][0];
            this._matrix21 = newColorMatrix[2][1];
            this._matrix22 = newColorMatrix[2][2];
            this._matrix23 = newColorMatrix[2][3];
            this._matrix24 = newColorMatrix[2][4];
            this._matrix30 = newColorMatrix[3][0];
            this._matrix31 = newColorMatrix[3][1];
            this._matrix32 = newColorMatrix[3][2];
            this._matrix33 = newColorMatrix[3][3];
            this._matrix34 = newColorMatrix[3][4];
            this._matrix40 = newColorMatrix[4][0];
            this._matrix41 = newColorMatrix[4][1];
            this._matrix42 = newColorMatrix[4][2];
            this._matrix43 = newColorMatrix[4][3];
            this._matrix44 = newColorMatrix[4][4];
        }

        private getMatrix(): float[][] {
            const returnMatrix: float[][] = new Array(5);

            for (let i = 0; i < 5; i++)
                returnMatrix[i] = new Array(5);

            returnMatrix[0][0] = this._matrix00;
            returnMatrix[0][1] = this._matrix01;
            returnMatrix[0][2] = this._matrix02;
            returnMatrix[0][3] = this._matrix03;
            returnMatrix[0][4] = this._matrix04;
            returnMatrix[1][0] = this._matrix10;
            returnMatrix[1][1] = this._matrix11;
            returnMatrix[1][2] = this._matrix12;
            returnMatrix[1][3] = this._matrix13;
            returnMatrix[1][4] = this._matrix14;
            returnMatrix[2][0] = this._matrix20;
            returnMatrix[2][1] = this._matrix21;
            returnMatrix[2][2] = this._matrix22;
            returnMatrix[2][3] = this._matrix23;
            returnMatrix[2][4] = this._matrix24;
            returnMatrix[3][0] = this._matrix30;
            returnMatrix[3][1] = this._matrix31;
            returnMatrix[3][2] = this._matrix32;
            returnMatrix[3][3] = this._matrix33;
            returnMatrix[3][4] = this._matrix34;
            returnMatrix[4][0] = this._matrix40;
            returnMatrix[4][1] = this._matrix41;
            returnMatrix[4][2] = this._matrix42;
            returnMatrix[4][3] = this._matrix43;
            returnMatrix[4][4] = this._matrix44;

            return returnMatrix;
        }

        public get(row: number, column: number): float {

            return this.getMatrix()[row][column];

        }

        public set(row: number, column: number, value: float) {
            const tempMatrix: float[][] = this.getMatrix();
            tempMatrix[row][column] = value;
            this.setMatrix(tempMatrix);
        }
    }