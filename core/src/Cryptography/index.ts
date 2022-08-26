import { Context } from '../Context/Context';
import { AesManaged } from './Aes/AesManaged';
import { MyAesCryptoServiceProvider } from './Aes/MyAesCryptoServiceProvider';
import { DESCryptoServiceProvider } from './DES/DESCryptoServiceProvider';
import { HMACSHA1 } from './HMAC/HMACSHA1';
import { MD5CryptoServiceProvider } from './MD5/MD5CryptoServiceProvider';
import { RC2CryptoServiceProvider } from './RC2/RC2CryptoServiceProvider';
import { RijndaelManaged } from './Rijndael/RijndaelManaged';
import { RNGCryptoServiceProvider } from './RNGCryptoServiceProvider';
import { SHA1CryptoServiceProvider } from './SHA1/SHA1CryptoServiceProvider';
import { SHA256Managed } from './SHA256/SHA256Managed';
import { SHA384Managed } from './SHA384/SHA384Managed';
import { SHA512Managed } from './SHA512/SHA512Managed';
import { TripleDESCryptoServiceProvider } from './TripleDES/TripleDESCryptoServiceProvider';
export * from './Aes/AesImpl';
export * from './Aes/AESprng';
export * from './Aes/Aes';
export * from './Aes/MyAes';
export * from './CryptoStream';
export * from './MD5/MD5';
export * from './DES/DES';
export * from './TripleDES/TripleDES';
export * from './RC2/RC2';
export * from './SHA1/SHA1';
export * from './SHA256/SHA256';
export * from './SHA384/SHA384';
export * from './SHA512/SHA512';
export * from './HMAC/HMAC';
export * from './HMAC/HMACMD5';
export * from './HMAC/HMACSHA1';
export * from './HMAC/HMACSHA256';
export * from './HMAC/HMACSHA384';
export * from './HMAC/HMACSHA512';

export const CryptographyModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    AES: ['value', AesManaged],
    Rijndael: ['value', RijndaelManaged],
    RandomNumberGenerator: ['value', RNGCryptoServiceProvider],
    MD5: ['value', MD5CryptoServiceProvider],
    MYAES: ['value', MyAesCryptoServiceProvider],
    DES: ['value', DESCryptoServiceProvider],
    TripleDES: ['value', TripleDESCryptoServiceProvider],
    RC2: ['value', RC2CryptoServiceProvider],
    SHA1: ['value', SHA1CryptoServiceProvider],
    SHA256: ['value', SHA256Managed],
    SHA384: ['value', SHA384Managed],
    SHA512: ['value', SHA512Managed],
    HMACSHA1: ['value', HMACSHA1]
}

Context.Current.addModules([CryptographyModule]);