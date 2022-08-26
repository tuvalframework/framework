import { Context } from '../Context/Context';
import { UnicodeEncoding } from './UnicodeEncoding';
import { UTF32Encoding } from './UTF32Encoding';
import { UTF8Encoding } from './UTF8Encoding';
import { ASCIIEncoding } from './ASCIIEncoding';


export * from './Base64';
export * from './Encoding';
export * from './ASCIIEncoding';


export const EncodingModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    UTF8Encoding: ['value', UTF8Encoding],
    UTF32Encoding: ['value', UTF32Encoding],
    UnicodeEncoding: ['value', UnicodeEncoding],
    ASCIIEncoding: ['value', ASCIIEncoding]
}

Context.Current.addModules([EncodingModule]);

// Encoding içindeki static alanları doldurduğu için import ediyoruz.
import './EncoderReplacementFallback';
import './EncoderExceptionFallback';
import './DecoderReplacementFallback';
import './DecoderExceptionFallback';

