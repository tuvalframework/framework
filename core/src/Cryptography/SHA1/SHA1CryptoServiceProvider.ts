import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SHA1 } from "./SHA1";
import { SHA1Internal } from "./SHA1Internal";
import { ByteArray, int } from '../../float';

export class SHA1CryptoServiceProvider extends SHA1 {

    private sha: SHA1Internal = null as any;

    public constructor() {
        super();
        this.sha = new SHA1Internal();
    }


    @Override
    protected dispose(disposing: boolean): void {
        // nothing new to do (managed implementation)
        super.dispose(disposing);
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