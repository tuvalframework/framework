export * from './CultureInfo';
import { Context } from '../Context';
import { TimeZoneInfo } from '../TimeZoneInfo';
import { CultureInfo } from './CultureInfo';
import { GregorianCalendar } from './GregorianCalendar';
import { TaiwanCalendar } from './TaiwanCalendar';

export const GlobalizationModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    TimeZoneInfo: ['value', TimeZoneInfo],
    TaiwanCalendar: ['value', TaiwanCalendar],
    GregorianCalendar: ['value', GregorianCalendar],
    CultureInfo: ['value', CultureInfo]
}

Context.Current.addModules([GlobalizationModule]);