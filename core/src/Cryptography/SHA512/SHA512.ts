import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { HashAlgorithm } from "../HashAlgorithm";

export abstract class SHA512 extends HashAlgorithm {

    protected constructor() {
        super();
        this.HashSizeValue = 512;
    }

    public static Create(): SHA512 {
        const sha1 = Context.Current.get('SHA512');
        if (sha1 != null) {
            return new sha1();
        }
        throw new Exception('No provider for SHA512');
    }
}