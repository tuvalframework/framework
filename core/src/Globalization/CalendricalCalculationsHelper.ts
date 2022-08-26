/*@******************************************************************************************************************************
*                                                                                                                               *
* ████████╗██╗   ██╗██╗   ██╗ █████╗ ██╗         ███████╗██████╗  █████╗ ███╗   ███╗███████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗ *
* ╚══██╔══╝██║   ██║██║   ██║██╔══██╗██║         ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝ *
*    ██║   ██║   ██║██║   ██║███████║██║         █████╗  ██████╔╝███████║██╔████╔██║█████╗  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝  *
*    ██║   ██║   ██║╚██╗ ██╔╝██╔══██║██║         ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██║███╗██║██║   ██║██╔══██╗██╔═██╗  *
*    ██║   ╚██████╔╝ ╚████╔╝ ██║  ██║███████╗    ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗ *
*    ╚═╝    ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ *
*                                                                                                                               *
*                                                                                                                               *
* This file is part of Tuval Framework.                                                                                         *
* Copyright (c) Tuvalsoft 2018 All rights reserved.                                                                             *
*                                                                                                                               *
* Licensed under the GNU General Public License v3.0.                                                                           *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                                                                    *
* Created By Selim TAN in 2021                                                                                                  *
******************************************************************************************************************************@*/

import { float, FloatArray, int, long, IntArray, New } from '../float';
import { DateTime } from '../Time/__DateTime';
import { GregorianCalendar } from './GregorianCalendar';
import { Convert } from '../convert';
import { Int32 } from '../Int32';
import { foreach, BREAK } from '../foreach';

enum CorrectionAlgorithm {
    Default,
    Year1988to2019,
    Year1900to1987,
    Year1800to1899,
    Year1700to1799,
    Year1620to1699
}

class EphemerisCorrectionAlgorithmMap {
    public constructor(year: int, algorithm: CorrectionAlgorithm) {
        this._lowestYear = year;
        this._algorithm = algorithm;
    }

    public /* internal */  _lowestYear: int;
    public /* internal */  _algorithm: CorrectionAlgorithm;
}

export class CalendricalCalculationsHelper {
    private static readonly FullCircleOfArc: float = 360.0; // 360.0;
    private static readonly HalfCircleOfArc: int = 180;
    private static readonly TwelveHours: float = 0.5; // half a day
    private static readonly Noon2000Jan01: float = 730120.5;
    public /* internal */ static readonly MeanTropicalYearInDays: float = 365.242189;
    public static readonly MeanSpeedOfSun: float = CalendricalCalculationsHelper.MeanTropicalYearInDays / CalendricalCalculationsHelper.FullCircleOfArc;
    private static readonly LongitudeSpring: float = 0.0;
    private static readonly TwoDegreesAfterSpring: float = 2.0;
    private static readonly SecondsPerDay: int = 24 * 60 * 60; // 24 hours * 60 minutes * 60 seconds

    private static readonly DaysInUniformLengthCentury: int = 36525;
    private static readonly SecondsPerMinute: int = 60;
    private static readonly MinutesPerDegree: int = 60;



    private static RadiansFromDegrees(degree: float): float {
        return degree * Math.PI / 180;
    }

    private static SinOfDegree(degree: float): float {
        return Math.sin(CalendricalCalculationsHelper.RadiansFromDegrees(degree));
    }

    private static CosOfDegree(degree: float): float {
        return Math.cos(CalendricalCalculationsHelper.RadiansFromDegrees(degree));
    }
    private static TanOfDegree(degree: float): float {
        return Math.tan(CalendricalCalculationsHelper.RadiansFromDegrees(degree));
    }

    private static Angle(degrees: int, minutes: int, seconds: float): float {
        return ((seconds / CalendricalCalculationsHelper.SecondsPerMinute + minutes) / CalendricalCalculationsHelper.MinutesPerDegree) + degrees;
    }

    private static Obliquity(julianCenturies: float): float {
        return CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.Coefficients, julianCenturies);
    }

    public /* internal */ static GetNumberOfDays(date: DateTime): long {
        return date.Ticks.div(GregorianCalendar.TicksPerDay);
    }

    private static GetGregorianYear(numberOfDays: float): int {
        return new DateTime(Convert.ToLong(Math.min((Math.floor(numberOfDays) * GregorianCalendar.TicksPerDay.toNumber()), DateTime.MaxValue.Ticks.toNumber()))).Year;
    }

    private static EphemerisCorrectionTable: EphemerisCorrectionAlgorithmMap[] =
        // lowest year that starts algorithm, algorithm to use
        [
            new EphemerisCorrectionAlgorithmMap(2020, CorrectionAlgorithm.Default),
            new EphemerisCorrectionAlgorithmMap(1988, CorrectionAlgorithm.Year1988to2019),
            new EphemerisCorrectionAlgorithmMap(1900, CorrectionAlgorithm.Year1900to1987),
            new EphemerisCorrectionAlgorithmMap(1800, CorrectionAlgorithm.Year1800to1899),
            new EphemerisCorrectionAlgorithmMap(1700, CorrectionAlgorithm.Year1700to1799),
            new EphemerisCorrectionAlgorithmMap(1620, CorrectionAlgorithm.Year1620to1699),
            new EphemerisCorrectionAlgorithmMap(Int32.MinValue, CorrectionAlgorithm.Default) // default must be last
        ];

    public static Reminder(divisor: float, dividend: float): float {
        const whole: float = Math.floor(divisor / dividend);
        return divisor - (dividend * whole);
    }

    public static NormalizeLongitude(longitude: float): float {
        longitude = CalendricalCalculationsHelper.Reminder(longitude, CalendricalCalculationsHelper.FullCircleOfArc);
        if (longitude < 0) {
            longitude += CalendricalCalculationsHelper.FullCircleOfArc;
        }
        return longitude;
    }

    public static  AsDayFraction(longitude: float): float {
        return longitude / CalendricalCalculationsHelper.FullCircleOfArc;
    }

    private static PolynomialSum(coefficients: FloatArray, indeterminate: float): float {
        let sum: float = coefficients[0];
        let indeterminateRaised: float = 1;
        for (let i: int = 1; i < coefficients.length; i++) {
            indeterminateRaised *= indeterminate;
            sum += (coefficients[i] * indeterminateRaised);
        }

        return sum;
    }

    private static CenturiesFrom1900(gregorianYear: int): float {
        const july1stOfYear: long = CalendricalCalculationsHelper.GetNumberOfDays(new DateTime(gregorianYear, 7, 1));
        return (july1stOfYear.sub(CalendricalCalculationsHelper.StartOf1900Century)).toNumber() / CalendricalCalculationsHelper.DaysInUniformLengthCentury;
    }

    // the following formulas defines a polynomial function which gives us the amount that the earth is slowing down for specific year ranges
    private static DefaultEphemerisCorrection(gregorianYear: int): float {
        //Contract.Assert(gregorianYear < 1620 || 2020 <= gregorianYear);
        const january1stOfYear: long = CalendricalCalculationsHelper.GetNumberOfDays(new DateTime(gregorianYear, 1, 1));
        const daysSinceStartOf1810: long = january1stOfYear.sub(CalendricalCalculationsHelper.StartOf1810);
        const x: float = CalendricalCalculationsHelper.TwelveHours + daysSinceStartOf1810.toNumber();
        return ((Math.pow(x, 2) / 41048480) - 15) / CalendricalCalculationsHelper.SecondsPerDay;
    }

    private static EphemerisCorrection1988to2019(gregorianYear: int): float {
        //Contract.Assert(1988 <= gregorianYear && gregorianYear <= 2019);
        return (gregorianYear - 1933) / CalendricalCalculationsHelper.SecondsPerDay;
    }

    private static EphemerisCorrection1900to1987(gregorianYear: int): float {
        //Contract.Assert(1900 <= gregorianYear && gregorianYear <= 1987);
        const centuriesFrom1900: float = CalendricalCalculationsHelper.CenturiesFrom1900(gregorianYear);
        return CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.Coefficients1900to1987, centuriesFrom1900);
    }

    private static EphemerisCorrection1800to1899(gregorianYear: int): float {
        //Contract.Assert(1800 <= gregorianYear && gregorianYear <= 1899);
        const centuriesFrom1900: float = CalendricalCalculationsHelper.CenturiesFrom1900(gregorianYear);
        return CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.Coefficients1800to1899, centuriesFrom1900);
    }

    private static EphemerisCorrection1700to1799(gregorianYear: int): float {
        //Contract.Assert(1700 <= gregorianYear && gregorianYear <= 1799);
        const yearsSince1700: float = gregorianYear - 1700;
        return CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.Coefficients1700to1799, yearsSince1700) / CalendricalCalculationsHelper.SecondsPerDay;
    }

    private static EphemerisCorrection1620to1699(gregorianYear: int): float {
        //Contract.Assert(1620 <= gregorianYear && gregorianYear <= 1699);
        const yearsSince1600: int = gregorianYear - 1600;
        return CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.Coefficients1620to1699, yearsSince1600) / CalendricalCalculationsHelper.SecondsPerDay;
    }

    // ephemeris-correction: correction to account for the slowing down of the rotation of the earth
    private static EphemerisCorrection(time: float): float {
        const year: int = CalendricalCalculationsHelper.GetGregorianYear(time);
        foreach(CalendricalCalculationsHelper.EphemerisCorrectionTable, (map: EphemerisCorrectionAlgorithmMap) => {
            if (map._lowestYear <= year) {
                switch (map._algorithm) {
                    case CorrectionAlgorithm.Default: return CalendricalCalculationsHelper.DefaultEphemerisCorrection(year);
                    case CorrectionAlgorithm.Year1988to2019: return CalendricalCalculationsHelper.EphemerisCorrection1988to2019(year);
                    case CorrectionAlgorithm.Year1900to1987: return CalendricalCalculationsHelper.EphemerisCorrection1900to1987(year);
                    case CorrectionAlgorithm.Year1800to1899: return CalendricalCalculationsHelper.EphemerisCorrection1800to1899(year);
                    case CorrectionAlgorithm.Year1700to1799: return CalendricalCalculationsHelper.EphemerisCorrection1700to1799(year);
                    case CorrectionAlgorithm.Year1620to1699: return CalendricalCalculationsHelper.EphemerisCorrection1620to1699(year);
                }

                return BREAK; // break the loop and assert eventually
            }
        });
        //Contract.Assert(false, "Not expected to come here");
        return CalendricalCalculationsHelper.DefaultEphemerisCorrection(year);
    }

    public static JulianCenturies(moment: float): float {
        const dynamicalMoment: float = moment + CalendricalCalculationsHelper.EphemerisCorrection(moment);
        return (dynamicalMoment - CalendricalCalculationsHelper.Noon2000Jan01) / CalendricalCalculationsHelper.DaysInUniformLengthCentury;
    }

    private static IsNegative(value: float): boolean {
        return Math.sign(value) === -1;
    }

    private static CopySign(value: float, sign: float): float {
        return (CalendricalCalculationsHelper.IsNegative(value) === CalendricalCalculationsHelper.IsNegative(sign)) ? value : -value;
    }

    // equation-of-time; approximate the difference between apparent solar time and mean solar time
    // formal definition is EOT = GHA - GMHA
    // GHA is the Greenwich Hour Angle of the apparent (actual) Sun
    // GMHA is the Greenwich Mean Hour Angle of the mean (fictitious) Sun
    // http://www.esrl.noaa.gov/gmd/grad/solcalc/
    // http://en.wikipedia.org/wiki/Equation_of_time
    private static EquationOfTime(time: float): float {
        const julianCenturies: float = CalendricalCalculationsHelper.JulianCenturies(time);
        const lambda: float = CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.LambdaCoefficients, julianCenturies);
        const anomaly: float = CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.AnomalyCoefficients, julianCenturies);
        const eccentricity: float = CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.EccentricityCoefficients, julianCenturies);

        const epsilon: float = CalendricalCalculationsHelper.Obliquity(julianCenturies);
        const tanHalfEpsilon: float = CalendricalCalculationsHelper.TanOfDegree(epsilon / 2);
        const y: float = tanHalfEpsilon * tanHalfEpsilon;

        const dividend: float = ((y * CalendricalCalculationsHelper.SinOfDegree(2 * lambda))
            - (2 * eccentricity * CalendricalCalculationsHelper.SinOfDegree(anomaly))
            + (4 * eccentricity * y * CalendricalCalculationsHelper.SinOfDegree(anomaly) * CalendricalCalculationsHelper.CosOfDegree(2 * lambda))
            - (0.5 * Math.pow(y, 2) * CalendricalCalculationsHelper.SinOfDegree(4 * lambda))
            - (1.25 * Math.pow(eccentricity, 2) * CalendricalCalculationsHelper.SinOfDegree(2 * anomaly)));
        const divisor: float = 2 * Math.PI;
        const equation: float = dividend / divisor;

        // approximation of equation of time is not valid for dates that are many millennia in the past or future
        // thus limited to a half day
        return CalendricalCalculationsHelper.CopySign(Math.min(Math.abs(equation), CalendricalCalculationsHelper.TwelveHours), equation);
    }

    private static AsLocalTime(apparentMidday: float, longitude: float): float {
        // slightly inaccurate since equation of time takes mean time not apparent time as its argument, but the difference is negligible
        const universalTime: float = apparentMidday - CalendricalCalculationsHelper.AsDayFraction(longitude);
        return apparentMidday - CalendricalCalculationsHelper.EquationOfTime(universalTime);
    }

    // midday
    public static Midday(date: float, longitude: float): float {
        return CalendricalCalculationsHelper.AsLocalTime(date + CalendricalCalculationsHelper.TwelveHours, longitude) - CalendricalCalculationsHelper.AsDayFraction(longitude);
    }

    private static InitLongitude(longitude: float): float {
        return CalendricalCalculationsHelper.NormalizeLongitude(longitude + CalendricalCalculationsHelper.HalfCircleOfArc) - CalendricalCalculationsHelper.HalfCircleOfArc;
    }

    // midday-in-tehran
    public static  MiddayAtPersianObservationSite(date: float): float {
        return CalendricalCalculationsHelper.Midday(date, CalendricalCalculationsHelper.InitLongitude(52.5)); // 52.5 degrees east - longitude of UTC+3:30 which defines Iranian Standard Time
    }

    private static PeriodicTerm(julianCenturies: float, x: int, y: float, z: float): float {
        return x * CalendricalCalculationsHelper.SinOfDegree(y + z * julianCenturies);
    }

    private static SumLongSequenceOfPeriodicTerms(julianCenturies: float): float {
        let sum: float = 0.0;
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 403406, 270.54861, 0.9287892);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 195207, 340.19128, 35999.1376958);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 119433, 63.91854, 35999.4089666);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 112392, 331.2622, 35998.7287385);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 3891, 317.843, 71998.20261);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 2819, 86.631, 71998.4403);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 1721, 240.052, 36000.35726);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 660, 310.26, 71997.4812);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 350, 247.23, 32964.4678);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 334, 260.87, -19.441);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 314, 297.82, 445267.1117);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 268, 343.14, 45036.884);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 242, 166.79, 3.1008);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 234, 81.53, 22518.4434);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 158, 3.5, -19.9739);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 132, 132.75, 65928.9345);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 129, 182.95, 9038.0293);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 114, 162.03, 3034.7684);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 99, 29.8, 33718.148);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 93, 266.4, 3034.448);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 86, 249.2, -2280.773);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 78, 157.6, 29929.992);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 72, 257.8, 31556.493);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 68, 185.1, 149.588);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 64, 69.9, 9037.75);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 46, 8.0, 107997.405);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 38, 197.1, -4444.176);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 37, 250.4, 151.771);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 32, 65.3, 67555.316);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 29, 162.7, 31556.08);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 28, 341.5, -4561.54);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 27, 291.6, 107996.706);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 27, 98.5, 1221.655);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 25, 146.7, 62894.167);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 24, 110.0, 31437.369);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 21, 5.2, 14578.298);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 21, 342.6, -31931.757);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 20, 230.9, 34777.243);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 18, 256.1, 1221.999);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 17, 45.3, 62894.511);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 14, 242.9, -4442.039);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 13, 115.2, 107997.909);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 13, 151.8, 119.066);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 13, 285.3, 16859.071);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 12, 53.3, -4.578);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 10, 126.6, 26895.292);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 10, 205.7, -39.127);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 10, 85.9, 12297.536);
        sum += CalendricalCalculationsHelper.PeriodicTerm(julianCenturies, 10, 146.1, 90073.778);
        return sum;
    }

    private static Aberration(julianCenturies: float): float {
        return (0.0000974 * CalendricalCalculationsHelper.CosOfDegree(177.63 + (35999.01848 * julianCenturies))) - 0.005575;
    }

    private static Nutation(julianCenturies: float): float {
        let a: float = CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.CoefficientsA, julianCenturies);
        let b: float = CalendricalCalculationsHelper.PolynomialSum(CalendricalCalculationsHelper.CoefficientsB, julianCenturies);
        return (-0.004778 * CalendricalCalculationsHelper.SinOfDegree(a)) - (0.0003667 * CalendricalCalculationsHelper.SinOfDegree(b));
    }

    public static Compute(time: float): float {
        const julianCenturies: float = CalendricalCalculationsHelper.JulianCenturies(time);
        const lambda: float = 282.7771834
            + (36000.76953744 * julianCenturies)
            + (0.000005729577951308232 * CalendricalCalculationsHelper.SumLongSequenceOfPeriodicTerms(julianCenturies));

        const longitude: float = lambda + CalendricalCalculationsHelper.Aberration(julianCenturies) + CalendricalCalculationsHelper.Nutation(julianCenturies);
        return CalendricalCalculationsHelper.InitLongitude(longitude);
    }

    public static AsSeason(longitude: float): float {
        return (longitude < 0) ? (longitude + CalendricalCalculationsHelper.FullCircleOfArc) : longitude;
    }

    private static EstimatePrior(longitude: float, time: float): float {
        const timeSunLastAtLongitude: float = time - (CalendricalCalculationsHelper.MeanSpeedOfSun * CalendricalCalculationsHelper.AsSeason(CalendricalCalculationsHelper.InitLongitude(CalendricalCalculationsHelper.Compute(time) - longitude)));
        const longitudeErrorDelta: float = CalendricalCalculationsHelper.InitLongitude(CalendricalCalculationsHelper.Compute(timeSunLastAtLongitude) - longitude);
        return Math.min(time, timeSunLastAtLongitude - (CalendricalCalculationsHelper.MeanSpeedOfSun * longitudeErrorDelta));
    }

    // persian-new-year-on-or-before
    //  number of days is the absolute date. The absolute date is the number of days from January 1st, 1 A.D.
    //  1/1/0001 is absolute date 1.
    public /* internal */ static PersianNewYearOnOrBefore(numberOfDays: float): float {
        const date: float = numberOfDays;

        const approx: float = CalendricalCalculationsHelper.EstimatePrior(CalendricalCalculationsHelper.LongitudeSpring, CalendricalCalculationsHelper.MiddayAtPersianObservationSite(date));
        const lowerBoundNewYearDay: float = Math.floor(approx) - 1;
        const upperBoundNewYearDay: float = lowerBoundNewYearDay + 3; // estimate is generally within a day of the actual occurrance (at the limits, the error expands, since the calculations rely on the mean tropical year which changes...)
        let day: float = lowerBoundNewYearDay;
        for (; day != upperBoundNewYearDay; ++day) {
            const midday: float = CalendricalCalculationsHelper.MiddayAtPersianObservationSite(day);
            const l: float = CalendricalCalculationsHelper.Compute(midday);
            if ((CalendricalCalculationsHelper.LongitudeSpring <= l) && (l <= CalendricalCalculationsHelper.TwoDegreesAfterSpring)) {
                break;
            }
        }
        // Contract.Assert(day != upperBoundNewYearDay);

        return day - 1;
    }

    private static StartOf1810: long = CalendricalCalculationsHelper.GetNumberOfDays(new DateTime(1810, 1, 1));
    private static StartOf1900Century: long = CalendricalCalculationsHelper.GetNumberOfDays(new DateTime(1900, 1, 1));

    private static Coefficients1900to1987: FloatArray = New.FloatArray([-0.00002, 0.000297, 0.025184, -0.181133, 0.553040, -0.861938, 0.677066, -0.212591]);
    private static Coefficients1800to1899: FloatArray = New.FloatArray([-0.000009, 0.003844, 0.083563, 0.865736, 4.867575, 15.845535, 31.332267, 38.291999, 28.316289, 11.636204, 2.043794]);
    private static Coefficients1700to1799: FloatArray = New.FloatArray([8.118780842, -0.005092142, 0.003336121, -0.0000266484]);
    private static Coefficients1620to1699: FloatArray = New.FloatArray([196.58333, -4.0675, 0.0219167]);
    private static LambdaCoefficients: FloatArray = New.FloatArray([280.46645, 36000.76983, 0.0003032]);
    private static AnomalyCoefficients: FloatArray = New.FloatArray([357.52910, 35999.05030, -0.0001559, -0.00000048]);
    private static EccentricityCoefficients: FloatArray = New.FloatArray([0.016708617, -0.000042037, -0.0000001236]);
    private static Coefficients: FloatArray = New.FloatArray([CalendricalCalculationsHelper.Angle(23, 26, 21.448), CalendricalCalculationsHelper.Angle(0, 0, -46.8150), CalendricalCalculationsHelper.Angle(0, 0, -0.00059), CalendricalCalculationsHelper.Angle(0, 0, 0.001813)]);
    private static CoefficientsA: FloatArray = New.FloatArray([124.90, -1934.134, 0.002063]);
    private static CoefficientsB: FloatArray = New.FloatArray([201.11, 72001.5377, 0.00057]);
}