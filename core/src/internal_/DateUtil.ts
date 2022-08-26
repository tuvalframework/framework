import { double } from "../float";
import { Exception } from '../Exception';

/**
 * Simple Helper class to return Date.now.
 */
export class DateUtil {
    /**
     * Returns the numeric value corresponding to the current time - the number
     * of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
     */
    public static now(): double {
        // IE8 does not have Date.now
        // when removing IE8 support we change this to Date.now()
        // Date.now vs Date.getTime() performance comparison:
        // http://jsperf.com/date-now-vs-new-date/8
       /*  if (Date.now) { return Date.now(); }
        return (new Date()).getTime(); */
        throw new Exception('');
    }
}