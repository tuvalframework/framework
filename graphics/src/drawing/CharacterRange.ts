    export class CharacterRange {
        private _first: number;
        private _length: number;

        public constructor(first: number, length: number)
        {
            this._first = first;
            this._length = length;
        }

        public get First(): number {
            return this._first;
        }

        public set First(value: number) {
            this._first = value;
        }

        public get Length(): number {
            return this._length;
        }

        public set Length(value: number) {
            this._length = value;
        }

        public equals(cr: CharacterRange): boolean {
            if (!(cr instanceof CharacterRange)) {
                return false;
            }
            return ((this._first === cr.First) && (this._length === cr.Length));
        }
    }