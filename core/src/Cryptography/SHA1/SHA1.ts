import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { HashAlgorithm } from "../HashAlgorithm";

export abstract class SHA1 extends HashAlgorithm {

    protected constructor() {
        super();
        this.HashSizeValue = 160;
    }

    public static  Create():SHA1 {
			//return new System.Security.Cryptography.SHA1CryptoServiceProvider ();
              //return new DESCryptoServiceProvider();
        const sha1 = Context.Current.get('SHA1');
        if (sha1 != null) {
            return new sha1();
        }
        throw new Exception('No provider for SHA1');
    }

}