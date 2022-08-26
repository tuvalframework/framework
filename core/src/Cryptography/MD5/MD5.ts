import { Context } from "../../Context/Context";
import { HashAlgorithm } from "../HashAlgorithm";

export abstract class MD5 extends HashAlgorithm {

    // Why is it protected when others abstract hash classes are public ?
    protected constructor() {
        super();
        this.HashSizeValue = 128;
    }

    public static Create(): MD5 {

        return Context.Current.get('MD5CryptoServiceProvider');
    }

    /* public static new MD5 Create (string algName)
        {
        return (MD5)CryptoConfig.CreateFromName (algName);
        }
    } */
}