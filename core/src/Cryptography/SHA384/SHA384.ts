import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { HashAlgorithm } from "../HashAlgorithm";

export abstract class SHA384 extends HashAlgorithm {

    protected constructor() {
        super();
        this.HashSizeValue = 384;
    }

    public static Create(): SHA384 {
        const sha1 = Context.Current.get('SHA384');
        if (sha1 != null) {
            return new sha1();
        }
        throw new Exception('No provider for SHA384');
    }


}