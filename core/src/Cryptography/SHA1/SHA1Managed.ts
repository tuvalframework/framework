import { ByteArray, int } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SHA1 } from "./SHA1";
import { SHA1Internal } from "./SHA1Internal";

export class SHA1Managed extends SHA1 {
    private sha: SHA1Internal;

    public constructor() {
        super();
        this.sha = new SHA1Internal();
    }

    @Override
    protected HashCore(rgb: ByteArray, ibStart: int, cbSize: int): void {
        this.State = 1;
        this.sha.HashCore(rgb, ibStart, cbSize);
    }

    @Override
    protected HashFinal(): ByteArray {
        this.State = 0;
        return this.sha.HashFinal();
    }

    @Override
    public Initialize(): void {
        this.sha.Initialize();
    }
}