//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

import { hooks as _moment, setHookCallback } from './lib/utils/hooks';

(_moment as any).version = '2.29.1';

import {
    min,
    max,
    now,
    isMoment,
    momentPrototype as fn,
    createUTC as utc,
    createUnix as unix,
    createLocal as local,
    createInvalid as invalid,
    createInZone as parseZone,
} from './lib/moment/moment';

import { getCalendarFormat } from './lib/moment/calendar';

import {
    defineLocale,
    updateLocale,
    getSetGlobalLocale as locale,
    getLocale as localeData,
    listLocales as locales,
    listMonths as months,
    listMonthsShort as monthsShort,
    listWeekdays as weekdays,
    listWeekdaysMin as weekdaysMin,
    listWeekdaysShort as weekdaysShort,
} from './lib/locale/locale_me';

import {
    isDuration,
    createDuration as duration,
    getSetRelativeTimeRounding as relativeTimeRounding,
    getSetRelativeTimeThreshold as relativeTimeThreshold,
} from './lib/_duration/duration';

import { normalizeUnits } from './lib/units/units';

import isDate from './lib/utils/is-date';

setHookCallback(local);

(_moment as any).fn = fn;
(_moment as any).min = min;
(_moment as any).max = max;
(_moment as any).now = now;
(_moment as any).utc = utc;
(_moment as any).unix = unix;
(_moment as any).months = months;
(_moment as any).isDate = isDate;
(_moment as any).locale = locale;
(_moment as any).invalid = invalid;
(_moment as any).duration = duration;
(_moment as any).isMoment = isMoment;
(_moment as any).weekdays = weekdays;
(_moment as any).parseZone = parseZone;
(_moment as any).localeData = localeData;
(_moment as any).isDuration = isDuration;
(_moment as any).monthsShort = monthsShort;
(_moment as any).weekdaysMin = weekdaysMin;
(_moment as any).defineLocale = defineLocale;
(_moment as any).updateLocale = updateLocale;
(_moment as any).locales = locales;
(_moment as any).weekdaysShort = weekdaysShort;
(_moment as any).normalizeUnits = normalizeUnits;
(_moment as any).relativeTimeRounding = relativeTimeRounding;
(_moment as any).relativeTimeThreshold = relativeTimeThreshold;
(_moment as any).calendarFormat = getCalendarFormat;
(_moment as any).prototype = fn;

// currently HTML5 input type only supports 24-hour formats
(_moment as any).HTML5_FMT = {
    DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
    DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
    DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
    DATE: 'YYYY-MM-DD', // <input type="date" />
    TIME: 'HH:mm', // <input type="time" />
    TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
    TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
    WEEK: 'GGGG-[W]WW', // <input type="week" />
    MONTH: 'YYYY-MM', // <input type="month" />
};

const moment: any = _moment;
export {moment} ;
