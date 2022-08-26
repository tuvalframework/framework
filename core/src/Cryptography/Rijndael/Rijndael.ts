import { KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";
import { Context } from '../../Context/Context';
import { Exception } from '../../Exception';
import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";
import { System } from "../../SystemTypes";


@ClassInfo({
    fullName: System.Types.Cryptography.Rijndael,
    instanceof: [
        System.Types.Cryptography.Rijndael
    ]
})
export abstract class Rijndael extends SymmetricAlgorithm
    {
        private static   s_legalBlockSizes:KeySizes[] = [ new KeySizes(128, 256, 64)];
        private static   s_legalKeySizes:KeySizes[] = [new KeySizes(128, 256, 64)];

        //
        // protected constructors
        //

        protected constructor() {
            super();
            this.KeySizeValue = 256;
            this.BlockSizeValue = 128;
            this.FeedbackSizeValue = this.BlockSizeValue;
            this.LegalBlockSizesValue = Rijndael.s_legalBlockSizes;
            this.LegalKeySizesValue = Rijndael.s_legalKeySizes;
        }

        //
        // public methods
        //

        public static  Create():Rijndael {
          const rj =  Context.Current.get('Rijndael');
          if (rj != null) {
              return new rj();
          }
          throw new Exception('No provider for Rijndael');
        }
    }