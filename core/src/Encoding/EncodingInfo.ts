import { int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { Encoding } from "./Encoding";
import { TObject } from '../Extensions/TObject';

export class EncodingInfo extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    private readonly codepage: int = 0;
    private encoding: Encoding = null as any;

    public/* internal */ constructor(cp: int) {
        super();
        this.codepage = cp;
    }

    public get CodePage(): int {
        return this.codepage;
    }

    public get DisplayName(): string {
        return this.Name;
    }

    public get Name(): string {
        if (this.encoding == null)
            this.encoding = this.GetEncoding();
        return this.encoding.WebName;
    }

    @Override
    public Equals<EncodingInfo>(value: EncodingInfo): boolean {
        const ei: EncodingInfo = value as EncodingInfo;
        return ei != null &&
            (ei as any).codepage === this.codepage;
    }

    @Override
    public GetHashCode(): int {
        return this.codepage;
    }

    public GetEncoding(): Encoding {
        return Encoding.GetEncoding(this.codepage);
    }
}