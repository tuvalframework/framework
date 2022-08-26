
//
// DateTime uses TimeZoneInfo under the hood for IsDaylightSavingTime, IsAmbiguousTime, and GetUtcOffset.
// These TimeZoneInfo APIs can throw ArgumentException when an Invalid-Time is passed in.  To avoid this
// unwanted behavior in DateTime public APIs, DateTime internally passes the
// TimeZoneInfoOptions.NoThrowOnInvalidTime flag to internal TimeZoneInfo APIs.
//
// In the future we can consider exposing similar options on the public TimeZoneInfo APIs if there is enough
// demand for this alternate behavior.

declare var UnsafeNativeMethods, Win32Native, Registry;

const  TIME_ZONE_ID_INVALID:int = -1;
const  TIME_ZONE_ID_UNKNOWN:int = 0;
const  TIME_ZONE_ID_STANDARD:int = 1;
const  TIME_ZONE_ID_DAYLIGHT:int = 2;

type RegistryKey = any;
import { byte } from "./byte";
import { Dictionary } from "./Collections/Generic/Dictionary";
import { List } from "./Collections/Generic/List";
import { Convert } from "./convert";
import { DateTimeKind } from "./DateTimeKind";
import { Environment } from "./Environment";
import { ArgumentException } from "./Exceptions/ArgumentException";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "./Exceptions/ArgumentOutOfRangeException";
import { TArray } from "./Extensions/TArray";
import { int, long, New } from "./float";
import { DaylightTimeStruct } from "./Globalization/DaylightTime";
import { IEquatable } from "./IEquatable";
import { Out } from "./Out";
import { Override } from "./Reflection/Decorators/ClassInfo";
import { IDeserializationCallback } from "./Serialization/IDeserializationCallback";
import { ISerializable } from "./serialization_/ISerializable";
import { StringComparison } from "./Text/StringComparison";
import { TString } from "./Text/TString";
import { DayOfWeek } from "./Time/DayOfWeek";
import { DateTime } from "./Time/__DateTime";
import { TimeSpan } from "./Timespan";
import { ReadOnlyCollection } from './Collections/Generic/ReadOnlyCollection';
import { DateTimeOffset } from "./DateTimeOffset";
import { Exception } from "./Exception";
import { is } from "./is";
import { System } from './SystemTypes';
import { InvalidTimeZoneException } from './Exceptions/InvalidTimeZoneException';
import { foreach } from "./foreach";
import { TimeZoneNotFoundException } from "./Exceptions/TimeZoneNotFoundException";
import { SecurityException } from "./Exceptions/SecurityException";
import { IComparer } from './Collections/IComparer';

export const TimeZones = {
	'Afghanistan Standard Time':
	{
			DisplayName: "(UTC+04:30) Kabul",
			Dlt: 'Afghanistan Daylight Time',
			Std: 'Afghanistan Standard Time',
			TZI:
			{
					Bias: -270,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Alaskan Standard Time':
	{
			DisplayName: "(UTC-09:00) Alaska",
			Dlt: 'Alaskan Daylight Time',
			Std: 'Alaskan Standard Time',
			TZI:
			{
					Bias: 540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Aleutian Standard Time':
	{
			DisplayName: "(UTC-10:00) Aleutian Islands",
			Dlt: 'Aleutian Daylight Time',
			Std: 'Aleutian Standard Time',
			TZI:
			{
					Bias: 600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Altai Standard Time':
	{
			DisplayName: "(UTC+07:00) Barnaul, Gorno-Altaysk",
			Dlt: 'Altai Daylight Time',
			Std: 'Altai Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Arab Standard Time':
	{
			DisplayName: "(UTC+03:00) Kuwait, Riyadh",
			Dlt: 'Arab Daylight Time',
			Std: 'Arab Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Arabian Standard Time':
	{
			DisplayName: "(UTC+04:00) Abu Dhabi, Muscat",
			Dlt: 'Arabian Daylight Time',
			Std: 'Arabian Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Arabic Standard Time':
	{
			DisplayName: "(UTC+03:00) Baghdad",
			Dlt: 'Arabic Daylight Time',
			Std: 'Arabic Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2008,
					2004: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 5,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 1,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Argentina Standard Time':
	{
			DisplayName: "(UTC-03:00) City of Buenos Aires",
			Dlt: 'Argentina Daylight Time',
			Std: 'Argentina Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2010,
					2006: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Astrakhan Standard Time':
	{
			DisplayName: "(UTC+04:00) Astrakhan, Ulyanovsk",
			Dlt: 'Astrakhan Daylight Time',
			Std: 'Astrakhan Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Atlantic Standard Time':
	{
			DisplayName: "(UTC-04:00) Atlantic Time (Canada)",
			Dlt: 'Atlantic Daylight Time',
			Std: 'Atlantic Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'AUS Central Standard Time':
	{
			DisplayName: "(UTC+09:30) Darwin",
			Dlt: 'AUS Central Daylight Time',
			Std: 'AUS Central Standard Time',
			TZI:
			{
					Bias: -570,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Aus Central W. Standard Time':
	{
			DisplayName: "(UTC+08:45) Eucla",
			Dlt: 'Aus Central W. Daylight Time',
			Std: 'Aus Central W. Standard Time',
			TZI:
			{
					Bias: -525,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'AUS Eastern Standard Time':
	{
			DisplayName: "(UTC+10:00) Canberra, Melbourne, Sydney",
			Dlt: 'AUS Eastern Daylight Time',
			Std: 'AUS Eastern Standard Time',
			TZI:
			{
					Bias: -600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2008,
					2007: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Azerbaijan Standard Time':
	{
			DisplayName: "(UTC+04:00) Baku",
			Dlt: 'Azerbaijan Daylight Time',
			Std: 'Azerbaijan Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2015,
					LastEntry: 2016,
					2015: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 5,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Azores Standard Time':
	{
			DisplayName: "(UTC-01:00) Azores",
			Dlt: 'Azores Daylight Time',
			Std: 'Azores Standard Time',
			TZI:
			{
					Bias: 60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 1,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Bahia Standard Time':
	{
			DisplayName: "(UTC-03:00) Salvador",
			Dlt: 'Bahia Daylight Time',
			Std: 'Bahia Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2013,
					2010: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Bangladesh Standard Time':
	{
			DisplayName: "(UTC+06:00) Dhaka",
			Dlt: 'Bangladesh Daylight Time',
			Std: 'Bangladesh Standard Time',
			TZI:
			{
					Bias: -360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2008,
					LastEntry: 2010,
					2008: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 6,
									DayOfWeek: 5,
									Day: 3,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Belarus Standard Time':
	{
			DisplayName: "(UTC+03:00) Minsk",
			Dlt: 'Belarus Daylight Time',
			Std: 'Belarus Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2012,
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Bougainville Standard Time':
	{
			DisplayName: "(UTC+11:00) Bougainville Island",
			Dlt: 'Bougainville Daylight Time',
			Std: 'Bougainville Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2013,
					LastEntry: 2015,
					2013: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Canada Central Standard Time':
	{
			DisplayName: "(UTC-06:00) Saskatchewan",
			Dlt: 'Canada Central Daylight Time',
			Std: 'Canada Central Standard Time',
			TZI:
			{
					Bias: 360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Cape Verde Standard Time':
	{
			DisplayName: "(UTC-01:00) Cabo Verde Is.",
			Dlt: 'Cabo Verde Daylight Time',
			Std: 'Cabo Verde Standard Time',
			TZI:
			{
					Bias: 60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Caucasus Standard Time':
	{
			DisplayName: "(UTC+04:00) Yerevan",
			Dlt: 'Caucasus Daylight Time',
			Std: 'Caucasus Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2011,
					LastEntry: 2012,
					2011: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Cen. Australia Standard Time':
	{
			DisplayName: "(UTC+09:30) Adelaide",
			Dlt: 'Cen. Australia Daylight Time',
			Std: 'Cen. Australia Standard Time',
			TZI:
			{
					Bias: -570,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2008,
					2007: {
							Bias: -570,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -570,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Central America Standard Time':
	{
			DisplayName: "(UTC-06:00) Central America",
			Dlt: 'Central America Daylight Time',
			Std: 'Central America Standard Time',
			TZI:
			{
					Bias: 360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Central Asia Standard Time':
	{
			DisplayName: "(UTC+06:00) Astana",
			Dlt: 'Central Asia Daylight Time',
			Std: 'Central Asia Standard Time',
			TZI:
			{
					Bias: -360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Central Brazilian Standard Time':
	{
			DisplayName: "(UTC-04:00) Cuiaba",
			Dlt: 'Central Brazilian Daylight Time',
			Std: 'Central Brazilian Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2020,
					2004: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2018: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2019: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Central Europe Standard Time':
	{
			DisplayName: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
			Dlt: 'Central Europe Daylight Time',
			Std: 'Central Europe Standard Time',
			TZI:
			{
					Bias: -60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Central European Standard Time':
	{
			DisplayName: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
			Dlt: 'Central European Daylight Time',
			Std: 'Central European Standard Time',
			TZI:
			{
					Bias: -60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Central Pacific Standard Time':
	{
			DisplayName: "(UTC+11:00) Solomon Is., New Caledonia",
			Dlt: 'Central Pacific Daylight Time',
			Std: 'Central Pacific Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Central Standard Time':
	{
			DisplayName: "(UTC-06:00) Central Time (US & Canada)",
			Dlt: 'Central Daylight Time',
			Std: 'Central Standard Time',
			TZI:
			{
					Bias: 360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Central Standard Time (Mexico)':
	{
			DisplayName: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
			Dlt: 'Central Daylight Time (Mexico)',
			Std: 'Central Standard Time (Mexico)',
			TZI:
			{
					Bias: 360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Chatham Islands Standard Time':
	{
			DisplayName: "(UTC+12:45) Chatham Islands",
			Dlt: 'Chatham Islands Daylight Time',
			Std: 'Chatham Islands Standard Time',
			TZI:
			{
					Bias: -765,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 45,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 45,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2008,
					2006: {
							Bias: -765,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -765,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -765,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 45,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'China Standard Time':
	{
			DisplayName: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
			Dlt: 'China Daylight Time',
			Std: 'China Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Cuba Standard Time':
	{
			DisplayName: "(UTC-05:00) Havana",
			Dlt: 'Cuba Daylight Time',
			Std: 'Cuba Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 1,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2003,
					LastEntry: 2013,
					2003: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2004: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Dateline Standard Time':
	{
			DisplayName: "(UTC-12:00) International Date Line West",
			Dlt: 'Dateline Daylight Time',
			Std: 'Dateline Standard Time',
			TZI:
			{
					Bias: 720,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'E. Africa Standard Time':
	{
			DisplayName: "(UTC+03:00) Nairobi",
			Dlt: 'E. Africa Daylight Time',
			Std: 'E. Africa Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'E. Australia Standard Time':
	{
			DisplayName: "(UTC+10:00) Brisbane",
			Dlt: 'E. Australia Daylight Time',
			Std: 'E. Australia Standard Time',
			TZI:
			{
					Bias: -600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'E. Europe Standard Time':
	{
			DisplayName: "(UTC+02:00) Chisinau",
			Dlt: 'E. Europe Daylight Time',
			Std: 'E. Europe Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'E. South America Standard Time':
	{
			DisplayName: "(UTC-03:00) Brasilia",
			Dlt: 'E. South America Daylight Time',
			Std: 'E. South America Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2020,
					2004: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2016: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2018: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2019: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Easter Island Standard Time':
	{
			DisplayName: "(UTC-06:00) Easter Island",
			Dlt: 'Easter Island Daylight Time',
			Std: 'Easter Island Standard Time',
			TZI:
			{
					Bias: 360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 6,
							Day: 1,
							Hour: 22,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 6,
							Day: 1,
							Hour: 22,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2019,
					2007: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 3,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Eastern Standard Time':
	{
			DisplayName: "(UTC-05:00) Eastern Time (US & Canada)",
			Dlt: 'Eastern Daylight Time',
			Std: 'Eastern Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Eastern Standard Time (Mexico)':
	{
			DisplayName: "(UTC-05:00) Chetumal",
			Dlt: 'Eastern Daylight Time (Mexico)',
			Std: 'Eastern Standard Time (Mexico)',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2016,
					2014: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Egypt Standard Time':
	{
			DisplayName: "(UTC+02:00) Cairo",
			Dlt: 'Egypt Daylight Time',
			Std: 'Egypt Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2005,
					LastEntry: 2017,
					2005: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2008: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Ekaterinburg Standard Time':
	{
			DisplayName: "(UTC+05:00) Ekaterinburg",
			Dlt: 'Russia TZ 4 Daylight Time',
			Std: 'Russia TZ 4 Standard Time',
			TZI:
			{
					Bias: -300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Fiji Standard Time':
	{
			DisplayName: "(UTC+12:00) Fiji",
			Dlt: 'Fiji Daylight Time',
			Std: 'Fiji Standard Time',
			TZI:
			{
					Bias: -720,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 1,
							DayOfWeek: 0,
							Day: 3,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2008,
					LastEntry: 2029,
					2008: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 4,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2022: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2023: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2024: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2025: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2026: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2027: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2028: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2029: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'FLE Standard Time':
	{
			DisplayName: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
			Dlt: 'FLE Daylight Time',
			Std: 'FLE Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 4,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Georgian Standard Time':
	{
			DisplayName: "(UTC+04:00) Tbilisi",
			Dlt: 'Georgian Daylight Time',
			Std: 'Georgian Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'GMT Standard Time':
	{
			DisplayName: "(UTC+00:00) Dublin, Edinburgh, Lisbon, London",
			Dlt: 'GMT Daylight Time',
			Std: 'GMT Standard Time',
			TZI:
			{
					Bias: 0,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 1,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Greenland Standard Time':
	{
			DisplayName: "(UTC-03:00) Greenland",
			Dlt: 'Greenland Daylight Time',
			Std: 'Greenland Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 6,
							Day: 5,
							Hour: 23,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 6,
							Day: 5,
							Hour: 22,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2021,
					2004: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 22,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Greenwich Standard Time':
	{
			DisplayName: "(UTC+00:00) Monrovia, Reykjavik",
			Dlt: 'Greenwich Daylight Time',
			Std: 'Greenwich Standard Time',
			TZI:
			{
					Bias: 0,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'GTB Standard Time':
	{
			DisplayName: "(UTC+02:00) Athens, Bucharest",
			Dlt: 'GTB Daylight Time',
			Std: 'GTB Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 4,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Haiti Standard Time':
	{
			DisplayName: "(UTC-05:00) Haiti",
			Dlt: 'Haiti Daylight Time',
			Std: 'Haiti Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2017,
					2006: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2007: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Hawaiian Standard Time':
	{
			DisplayName: "(UTC-10:00) Hawaii",
			Dlt: 'Hawaiian Daylight Time',
			Std: 'Hawaiian Standard Time',
			TZI:
			{
					Bias: 600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'India Standard Time':
	{
			DisplayName: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
			Dlt: 'India Daylight Time',
			Std: 'India Standard Time',
			TZI:
			{
					Bias: -330,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Iran Standard Time':
	{
			DisplayName: "(UTC+03:30) Tehran",
			Dlt: 'Iran Daylight Time',
			Std: 'Iran Standard Time',
			TZI:
			{
					Bias: -210,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 2,
							Day: 3,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 1,
							Day: 4,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2024,
					2004: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 1,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 3,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 2,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 1,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 2,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 1,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 3,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 2,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 3,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 1,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 2,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 1,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 3,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 2,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 1,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2022: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 3,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 2,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2023: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 3,
									Day: 4,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2024: {
							Bias: -210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Israel Standard Time':
	{
			DisplayName: "(UTC+02:00) Jerusalem",
			Dlt: 'Jerusalem Daylight Time',
			Std: 'Jerusalem Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 5,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2023,
					2004: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 3,
									Day: 4,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 3,
									Day: 1,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2022: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2023: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Jordan Standard Time':
	{
			DisplayName: "(UTC+02:00) Amman",
			Dlt: 'Jordan Daylight Time',
			Std: 'Jordan Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 5,
							Day: 5,
							Hour: 1,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 4,
							Day: 5,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2011,
					LastEntry: 2014,
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 5,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 5,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 5,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
			}
	},
	'Kaliningrad Standard Time':
	{
			DisplayName: "(UTC+02:00) Kaliningrad",
			Dlt: 'Russia TZ 1 Daylight Time',
			Std: 'Russia TZ 1 Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Kamchatka Standard Time':
	{
			DisplayName: "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
			Dlt: 'Kamchatka Daylight Time',
			Std: 'Kamchatka Standard Time',
			TZI:
			{
					Bias: -720,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Korea Standard Time':
	{
			DisplayName: "(UTC+09:00) Seoul",
			Dlt: 'Korea Daylight Time',
			Std: 'Korea Standard Time',
			TZI:
			{
					Bias: -540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Libya Standard Time':
	{
			DisplayName: "(UTC+02:00) Tripoli",
			Dlt: 'Libya Daylight Time',
			Std: 'Libya Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2011,
					LastEntry: 2014,
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -60,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 6,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -60,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Line Islands Standard Time':
	{
			DisplayName: "(UTC+14:00) Kiritimati Island",
			Dlt: 'Line Islands Daylight Time',
			Std: 'Line Islands Standard Time',
			TZI:
			{
					Bias: -840,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Lord Howe Standard Time':
	{
			DisplayName: "(UTC+10:30) Lord Howe Island",
			Dlt: 'Lord Howe Daylight Time',
			Std: 'Lord Howe Standard Time',
			TZI:
			{
					Bias: -630,
					StandardBias: 0,
					DaylightBias: -30,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2005,
					LastEntry: 2008,
					2005: {
							Bias: -630,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -630,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -630,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -630,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Magadan Standard Time':
	{
			DisplayName: "(UTC+11:00) Magadan",
			Dlt: 'Magadan Daylight Time',
			Std: 'Magadan Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -120,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Magallanes Standard Time':
	{
			DisplayName: "(UTC-03:00) Punta Arenas",
			Dlt: 'Magallanes Daylight Time',
			Std: 'Magallanes Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2017,
					2007: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2008: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Marquesas Standard Time':
	{
			DisplayName: "(UTC-09:30) Marquesas Islands",
			Dlt: 'Marquesas Daylight Time',
			Std: 'Marquesas Standard Time',
			TZI:
			{
					Bias: 570,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Mauritius Standard Time':
	{
			DisplayName: "(UTC+04:00) Port Louis",
			Dlt: 'Mauritius Daylight Time',
			Std: 'Mauritius Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2010,
					2007: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Mid-Atlantic Standard Time':
	{
			DisplayName: "(UTC-02:00) Mid-Atlantic - Old",
			Dlt: 'Mid-Atlantic Daylight Time',
			Std: 'Mid-Atlantic Standard Time',
			TZI:
			{
					Bias: 120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Middle East Standard Time':
	{
			DisplayName: "(UTC+02:00) Beirut",
			Dlt: 'Middle East Daylight Time',
			Std: 'Middle East Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 6,
							Day: 5,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 6,
							Day: 5,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2009,
					LastEntry: 2021,
					2009: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2016: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2019: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2020: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2021: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
			}
	},
	'Montevideo Standard Time':
	{
			DisplayName: "(UTC-03:00) Montevideo",
			Dlt: 'Montevideo Daylight Time',
			Std: 'Montevideo Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2016,
					2014: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Morocco Standard Time':
	{
			DisplayName: "(UTC+01:00) Casablanca",
			Dlt: 'Morocco Daylight Time',
			Std: 'Morocco Standard Time',
			TZI:
			{
					Bias: 0,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 2,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 5,
							DayOfWeek: 0,
							Day: 3,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2029,
					2007: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 0,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 7,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 4,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 6,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2022: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2023: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2024: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2025: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2026: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2027: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2028: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 4,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2029: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 0,
									Day: 3,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Mountain Standard Time':
	{
			DisplayName: "(UTC-07:00) Mountain Time (US & Canada)",
			Dlt: 'Mountain Daylight Time',
			Std: 'Mountain Standard Time',
			TZI:
			{
					Bias: 420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Mountain Standard Time (Mexico)':
	{
			DisplayName: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
			Dlt: 'Mountain Daylight Time (Mexico)',
			Std: 'Mountain Standard Time (Mexico)',
			TZI:
			{
					Bias: 420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Myanmar Standard Time':
	{
			DisplayName: "(UTC+06:30) Yangon (Rangoon)",
			Dlt: 'Myanmar Daylight Time',
			Std: 'Myanmar Standard Time',
			TZI:
			{
					Bias: -390,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'N. Central Asia Standard Time':
	{
			DisplayName: "(UTC+07:00) Novosibirsk",
			Dlt: 'Novosibirsk Daylight Time',
			Std: 'Novosibirsk Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 7,
									DayOfWeek: 0,
									Day: 4,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Namibia Standard Time':
	{
			DisplayName: "(UTC+02:00) Windhoek",
			Dlt: 'Namibia Daylight Time',
			Std: 'Namibia Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2017,
					LastEntry: 2018,
					2017: {
							Bias: -60,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Nepal Standard Time':
	{
			DisplayName: "(UTC+05:45) Kathmandu",
			Dlt: 'Nepal Daylight Time',
			Std: 'Nepal Standard Time',
			TZI:
			{
					Bias: -345,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'New Zealand Standard Time':
	{
			DisplayName: "(UTC+12:00) Auckland, Wellington",
			Dlt: 'New Zealand Daylight Time',
			Std: 'New Zealand Standard Time',
			TZI:
			{
					Bias: -720,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2008,
					2006: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Newfoundland Standard Time':
	{
			DisplayName: "(UTC-03:30) Newfoundland",
			Dlt: 'Newfoundland Daylight Time',
			Std: 'Newfoundland Standard Time',
			TZI:
			{
					Bias: 210,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2012,
					2006: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 0,
									Minute: 1,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 210,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Norfolk Standard Time':
	{
			DisplayName: "(UTC+11:00) Norfolk Island",
			Dlt: 'Norfolk Daylight Time',
			Std: 'Norfolk Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2020,
					2014: {
							Bias: -690,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'North Asia East Standard Time':
	{
			DisplayName: "(UTC+08:00) Irkutsk",
			Dlt: 'Russia TZ 7 Daylight Time',
			Std: 'Russia TZ 7 Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'North Asia Standard Time':
	{
			DisplayName: "(UTC+07:00) Krasnoyarsk",
			Dlt: 'Russia TZ 6 Daylight Time',
			Std: 'Russia TZ 6 Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'North Korea Standard Time':
	{
			DisplayName: "(UTC+09:00) Pyongyang",
			Dlt: 'North Korea Daylight Time',
			Std: 'North Korea Standard Time',
			TZI:
			{
					Bias: -540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2019,
					2014: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -510,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 5,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -510,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -510,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: 30,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 5,
									Day: 1,
									Hour: 23,
									Minute: 30,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Omsk Standard Time':
	{
			DisplayName: "(UTC+06:00) Omsk",
			Dlt: 'Omsk Daylight Time',
			Std: 'Omsk Standard Time',
			TZI:
			{
					Bias: -360,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Pacific SA Standard Time':
	{
			DisplayName: "(UTC-04:00) Santiago",
			Dlt: 'Pacific SA Daylight Time',
			Std: 'Pacific SA Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 6,
							Day: 1,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 6,
							Day: 1,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2019,
					2007: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2008: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2018: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 8,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2019: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
			}
	},
	'Pacific Standard Time':
	{
			DisplayName: "(UTC-08:00) Pacific Time (US & Canada)",
			Dlt: 'Pacific Daylight Time',
			Std: 'Pacific Standard Time',
			TZI:
			{
					Bias: 480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Pacific Standard Time (Mexico)':
	{
			DisplayName: "(UTC-08:00) Baja California",
			Dlt: 'Pacific Daylight Time (Mexico)',
			Std: 'Pacific Standard Time (Mexico)',
			TZI:
			{
					Bias: 480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2009,
					LastEntry: 2010,
					2009: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Pakistan Standard Time':
	{
			DisplayName: "(UTC+05:00) Islamabad, Karachi",
			Dlt: 'Pakistan Daylight Time',
			Std: 'Pakistan Standard Time',
			TZI:
			{
					Bias: -300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2010,
					2007: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 2,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Paraguay Standard Time':
	{
			DisplayName: "(UTC-04:00) Asuncion",
			Dlt: 'Paraguay Daylight Time',
			Std: 'Paraguay Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 6,
							Day: 5,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 6,
							Day: 1,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2008,
					LastEntry: 2021,
					2008: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2009: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2010: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2011: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 2,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2012: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2017: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2018: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2019: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2020: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2021: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
			}
	},
	'Qyzylorda Standard Time':
	{
			DisplayName: "(UTC+05:00) Qyzylorda",
			Dlt: 'Qyzylorda Daylight Time',
			Std: 'Qyzylorda Standard Time',
			TZI:
			{
					Bias: -300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2017,
					LastEntry: 2019,
					2017: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 5,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Romance Standard Time':
	{
			DisplayName: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
			Dlt: 'Romance Daylight Time',
			Std: 'Romance Standard Time',
			TZI:
			{
					Bias: -60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Russia Time Zone 10':
	{
			DisplayName: "(UTC+11:00) Chokurdakh",
			Dlt: 'Russia TZ 10 Daylight Time',
			Std: 'Russia TZ 10 Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Russia Time Zone 11':
	{
			DisplayName: "(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky",
			Dlt: 'Russia TZ 11 Daylight Time',
			Std: 'Russia TZ 11 Standard Time',
			TZI:
			{
					Bias: -720,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2009,
					LastEntry: 2012,
					2009: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -720,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Russia Time Zone 3':
	{
			DisplayName: "(UTC+04:00) Izhevsk, Samara",
			Dlt: 'Russia TZ 3 Daylight Time',
			Std: 'Russia TZ 3 Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2009,
					LastEntry: 2012,
					2009: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Russian Standard Time':
	{
			DisplayName: "(UTC+03:00) Moscow, St. Petersburg",
			Dlt: 'Russia TZ 2 Daylight Time',
			Std: 'Russia TZ 2 Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'SA Eastern Standard Time':
	{
			DisplayName: "(UTC-03:00) Cayenne, Fortaleza",
			Dlt: 'SA Eastern Daylight Time',
			Std: 'SA Eastern Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'SA Pacific Standard Time':
	{
			DisplayName: "(UTC-05:00) Bogota, Lima, Quito, Rio Branco",
			Dlt: 'SA Pacific Daylight Time',
			Std: 'SA Pacific Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'SA Western Standard Time':
	{
			DisplayName: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
			Dlt: 'SA Western Daylight Time',
			Std: 'SA Western Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Saint Pierre Standard Time':
	{
			DisplayName: "(UTC-03:00) Saint Pierre and Miquelon",
			Dlt: 'Saint Pierre Daylight Time',
			Std: 'Saint Pierre Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2007,
					2006: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Sakhalin Standard Time':
	{
			DisplayName: "(UTC+11:00) Sakhalin",
			Dlt: 'Sakhalin Daylight Time',
			Std: 'Sakhalin Standard Time',
			TZI:
			{
					Bias: -660,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Samoa Standard Time':
	{
			DisplayName: "(UTC+13:00) Samoa",
			Dlt: 'Samoa Daylight Time',
			Std: 'Samoa Standard Time',
			TZI:
			{
					Bias: -780,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 4,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 9,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2009,
					LastEntry: 2012,
					2009: {
							Bias: 660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 4,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -780,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Sao Tome Standard Time':
	{
			DisplayName: "(UTC+00:00) Sao Tome",
			Dlt: 'Sao Tome Daylight Time',
			Std: 'Sao Tome Standard Time',
			TZI:
			{
					Bias: 0,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2017,
					LastEntry: 2020,
					2017: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -60,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 0,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Saratov Standard Time':
	{
			DisplayName: "(UTC+04:00) Saratov",
			Dlt: 'Saratov Daylight Time',
			Std: 'Saratov Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'SE Asia Standard Time':
	{
			DisplayName: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
			Dlt: 'SE Asia Daylight Time',
			Std: 'SE Asia Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Singapore Standard Time':
	{
			DisplayName: "(UTC+08:00) Kuala Lumpur, Singapore",
			Dlt: 'Malay Peninsula Daylight Time',
			Std: 'Malay Peninsula Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'South Africa Standard Time':
	{
			DisplayName: "(UTC+02:00) Harare, Pretoria",
			Dlt: 'South Africa Daylight Time',
			Std: 'South Africa Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Sri Lanka Standard Time':
	{
			DisplayName: "(UTC+05:30) Sri Jayawardenepura",
			Dlt: 'Sri Lanka Daylight Time',
			Std: 'Sri Lanka Standard Time',
			TZI:
			{
					Bias: -330,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Sudan Standard Time':
	{
			DisplayName: "(UTC+02:00) Khartoum",
			Dlt: 'Sudan Daylight Time',
			Std: 'Sudan Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2016,
					LastEntry: 2018,
					2016: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 2,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Syria Standard Time':
	{
			DisplayName: "(UTC+02:00) Damascus",
			Dlt: 'Syria Daylight Time',
			Std: 'Syria Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 4,
							Day: 5,
							Hour: 23,
							Minute: 59,
							Second: 59,
							Milliseconds: 999,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 5,
							Day: 5,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2004,
					LastEntry: 2020,
					2004: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2005: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 4,
									Day: 1,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Taipei Standard Time':
	{
			DisplayName: "(UTC+08:00) Taipei",
			Dlt: 'Taipei Daylight Time',
			Std: 'Taipei Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Tasmania Standard Time':
	{
			DisplayName: "(UTC+10:00) Hobart",
			Dlt: 'Tasmania Daylight Time',
			Std: 'Tasmania Standard Time',
			TZI:
			{
					Bias: -600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 4,
							DayOfWeek: 0,
							Day: 1,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2007,
					LastEntry: 2008,
					2007: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Tocantins Standard Time':
	{
			DisplayName: "(UTC-03:00) Araguaina",
			Dlt: 'Tocantins Daylight Time',
			Std: 'Tocantins Standard Time',
			TZI:
			{
					Bias: 180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2011,
					LastEntry: 2014,
					2011: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 3,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 2,
									DayOfWeek: 6,
									Day: 3,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 2,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Tokyo Standard Time':
	{
			DisplayName: "(UTC+09:00) Osaka, Sapporo, Tokyo",
			Dlt: 'Tokyo Daylight Time',
			Std: 'Tokyo Standard Time',
			TZI:
			{
					Bias: -540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Tomsk Standard Time':
	{
			DisplayName: "(UTC+07:00) Tomsk",
			Dlt: 'Tomsk Daylight Time',
			Std: 'Tomsk Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -360,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Tonga Standard Time':
	{
			DisplayName: "(UTC+13:00) Nuku'alofa",
			Dlt: 'Tonga Daylight Time',
			Std: 'Tonga Standard Time',
			TZI:
			{
					Bias: -780,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2015,
					LastEntry: 2018,
					2015: {
							Bias: -780,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -780,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -780,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 3,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -780,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Transbaikal Standard Time':
	{
			DisplayName: "(UTC+09:00) Chita",
			Dlt: 'Transbaikal Daylight Time',
			Std: 'Transbaikal Standard Time',
			TZI:
			{
					Bias: -540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -120,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Turkey Standard Time':
	{
			DisplayName: "(UTC+03:00) Istanbul",
			Dlt: 'Turkey Daylight Time',
			Std: 'Turkey Standard Time',
			TZI:
			{
					Bias: -180,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2017,
					2010: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 1,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 1,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 2,
									Hour: 4,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Turks And Caicos Standard Time':
	{
			DisplayName: "(UTC-05:00) Turks and Caicos",
			Dlt: 'Turks and Caicos Daylight Time',
			Std: 'Turks and Caicos Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2019,
					2014: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Ulaanbaatar Standard Time':
	{
			DisplayName: "(UTC+08:00) Ulaanbaatar",
			Dlt: 'Ulaanbaatar Daylight Time',
			Std: 'Ulaanbaatar Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2014,
					LastEntry: 2017,
					2014: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'US Eastern Standard Time':
	{
			DisplayName: "(UTC-05:00) Indiana (East)",
			Dlt: 'US Eastern Daylight Time',
			Std: 'US Eastern Standard Time',
			TZI:
			{
					Bias: 300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 11,
							DayOfWeek: 0,
							Day: 1,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 2,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2005,
					LastEntry: 2007,
					2005: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 300,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'US Mountain Standard Time':
	{
			DisplayName: "(UTC-07:00) Arizona",
			Dlt: 'US Mountain Daylight Time',
			Std: 'US Mountain Standard Time',
			TZI:
			{
					Bias: 420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC':
	{
			DisplayName: "(UTC) Coordinated Universal Time",
			Dlt: 'Coordinated Universal Time',
			Std: 'Coordinated Universal Time',
			TZI:
			{
					Bias: 0,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC+12':
	{
			DisplayName: "(UTC+12:00) Coordinated Universal Time+12",
			Dlt: 'UTC+12',
			Std: 'UTC+12',
			TZI:
			{
					Bias: -720,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC+13':
	{
			DisplayName: "(UTC+13:00) Coordinated Universal Time+13",
			Dlt: 'UTC+13',
			Std: 'UTC+13',
			TZI:
			{
					Bias: -780,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC-02':
	{
			DisplayName: "(UTC-02:00) Coordinated Universal Time-02",
			Dlt: 'UTC-02',
			Std: 'UTC-02',
			TZI:
			{
					Bias: 120,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC-08':
	{
			DisplayName: "(UTC-08:00) Coordinated Universal Time-08",
			Dlt: 'UTC-08',
			Std: 'UTC-08',
			TZI:
			{
					Bias: 480,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC-09':
	{
			DisplayName: "(UTC-09:00) Coordinated Universal Time-09",
			Dlt: 'UTC-09',
			Std: 'UTC-09',
			TZI:
			{
					Bias: 540,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'UTC-11':
	{
			DisplayName: "(UTC-11:00) Coordinated Universal Time-11",
			Dlt: 'UTC-11',
			Std: 'UTC-11',
			TZI:
			{
					Bias: 660,
					StandardBias: 0,
					DaylightBias: 0,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Venezuela Standard Time':
	{
			DisplayName: "(UTC-04:00) Caracas",
			Dlt: 'Venezuela Daylight Time',
			Std: 'Venezuela Standard Time',
			TZI:
			{
					Bias: 240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2017,
					2006: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -30,
							StandardDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 2,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 270,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: 30,
							StandardDate:
							{
									Year: 0,
									Month: 5,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 30,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 5,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Vladivostok Standard Time':
	{
			DisplayName: "(UTC+10:00) Vladivostok",
			Dlt: 'Russia TZ 9 Daylight Time',
			Std: 'Russia TZ 9 Standard Time',
			TZI:
			{
					Bias: -600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -660,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Volgograd Standard Time':
	{
			DisplayName: "(UTC+04:00) Volgograd",
			Dlt: 'Volgograd Daylight Time',
			Std: 'Volgograd Standard Time',
			TZI:
			{
					Bias: -240,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2019,
					2010: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -180,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: 60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 1,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -240,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'W. Australia Standard Time':
	{
			DisplayName: "(UTC+08:00) Perth",
			Dlt: 'W. Australia Daylight Time',
			Std: 'W. Australia Standard Time',
			TZI:
			{
					Bias: -480,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2005,
					LastEntry: 2010,
					2005: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2006: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 0,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 12,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 4,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'W. Central Africa Standard Time':
	{
			DisplayName: "(UTC+01:00) West Central Africa",
			Dlt: 'W. Central Africa Daylight Time',
			Std: 'W. Central Africa Standard Time',
			TZI:
			{
					Bias: -60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'W. Europe Standard Time':
	{
			DisplayName: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
			Dlt: 'W. Europe Daylight Time',
			Std: 'W. Europe Standard Time',
			TZI:
			{
					Bias: -60,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 0,
							Day: 5,
							Hour: 3,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 0,
							Day: 5,
							Hour: 2,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'W. Mongolia Standard Time':
	{
			DisplayName: "(UTC+07:00) Hovd",
			Dlt: 'W. Mongolia Daylight Time',
			Std: 'W. Mongolia Standard Time',
			TZI:
			{
					Bias: -420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2017,
					2006: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'West Asia Standard Time':
	{
			DisplayName: "(UTC+05:00) Ashgabat, Tashkent",
			Dlt: 'West Asia Daylight Time',
			Std: 'West Asia Standard Time',
			TZI:
			{
					Bias: -300,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'West Bank Standard Time':
	{
			DisplayName: "(UTC+02:00) Gaza, Hebron",
			Dlt: 'West Bank Gaza Daylight Time',
			Std: 'West Bank Gaza Standard Time',
			TZI:
			{
					Bias: -120,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 10,
							DayOfWeek: 6,
							Day: 5,
							Hour: 1,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 3,
							DayOfWeek: 5,
							Day: 5,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2012,
					LastEntry: 2019,
					2012: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 5,
									Day: 3,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2013: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 9,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2014: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 4,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2015: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 4,
									Day: 4,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 23,
									Minute: 59,
									Second: 59,
									Milliseconds: 999,
							}
					},
					2016: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 6,
									Day: 4,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: -120,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 6,
									Day: 5,
									Hour: 1,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 5,
									Day: 5,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'West Pacific Standard Time':
	{
			DisplayName: "(UTC+10:00) Guam, Port Moresby",
			Dlt: 'West Pacific Daylight Time',
			Std: 'West Pacific Standard Time',
			TZI:
			{
					Bias: -600,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
	},
	'Yakutsk Standard Time':
	{
			DisplayName: "(UTC+09:00) Yakutsk",
			Dlt: 'Russia TZ 8 Daylight Time',
			Std: 'Russia TZ 8 Standard Time',
			TZI:
			{
					Bias: -540,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2010,
					LastEntry: 2015,
					2010: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 3,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 6,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: -600,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: -540,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
	'Yukon Standard Time':
	{
			DisplayName: "(UTC-07:00) Yukon",
			Dlt: 'Yukon Daylight Time',
			Std: 'Yukon Standard Time',
			TZI:
			{
					Bias: 420,
					StandardBias: 0,
					DaylightBias: -60,
					StandardDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					},
					DaylightDate:
					{
							Year: 0,
							Month: 0,
							DayOfWeek: 0,
							Day: 0,
							Hour: 0,
							Minute: 0,
							Second: 0,
							Milliseconds: 0,
					}
			},
			'Dynamic DST': {
					FirstEntry: 2006,
					LastEntry: 2021,
					2006: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 10,
									DayOfWeek: 0,
									Day: 5,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 4,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2007: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2008: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2009: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2010: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2011: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2012: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2013: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2014: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2015: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2016: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2017: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2018: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2019: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 11,
									DayOfWeek: 0,
									Day: 1,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2020: {
							Bias: 480,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 1,
									DayOfWeek: 3,
									Day: 1,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 3,
									DayOfWeek: 0,
									Day: 2,
									Hour: 2,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
					2021: {
							Bias: 420,
							StandardBias: 0,
							DaylightBias: -60,
							StandardDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							},
							DaylightDate:
							{
									Year: 0,
									Month: 0,
									DayOfWeek: 0,
									Day: 0,
									Hour: 0,
									Minute: 0,
									Second: 0,
									Milliseconds: 0,
							}
					},
			}
	},
}

class SystemTime {
	public Year: int = 0;
	public Month: int = 0;
	public DayOfWeek: int = 0;
	public Day: int = 0;
	public Hour: int = 0;
	public Minute: int = 0;
	public Second: int = 0;
	public Milliseconds: int = 0;
}

export class DynamicTimeZoneInformation {
	public Bias: int = 0;
	public StandardName: string = '';
	public StandardDate: SystemTime = new SystemTime();
	public StandardBias: int = 0;
	public DaylightName: string = '';
	public DaylightDate: SystemTime = new SystemTime();
	public DaylightBias: int = 0;
	public TimeZoneKeyName: string = '';
	public DynamicDaylightTimeDisabled: boolean = false;
}

export class TimeZoneInformation {
	public Bias: int = 0;
	public StandardName: string = '';
	public StandardDate: SystemTime = new SystemTime();
	public StandardBias: int = 0;
	public DaylightName: string = '';
	public DaylightDate: SystemTime = new SystemTime();
	public DaylightBias: int = 0;

	public constructor(dtzi: DynamicTimeZoneInformation) {
		this.Bias = dtzi.Bias;
		this.StandardName = dtzi.StandardName;
		this.StandardDate = dtzi.StandardDate;
		this.StandardBias = dtzi.StandardBias;
		this.DaylightName = dtzi.DaylightName;
		this.DaylightDate = dtzi.DaylightDate;
		this.DaylightBias = dtzi.DaylightBias;
	}
}

class RegistryTimeZoneInformation {
	public Bias: int;
	public StandardBias: int;
	public DaylightBias: int;
	public StandardDate: SystemTime;
	public DaylightDate: SystemTime;

	public constructor(tzi: TimeZoneInformation) {
		this.Bias = tzi.Bias;
		this.StandardDate = tzi.StandardDate;
		this.StandardBias = tzi.StandardBias;
		this.DaylightDate = tzi.DaylightDate;
		this.DaylightBias = tzi.DaylightBias;
	}

	public RegistryTimeZoneInformation(tzi: any) {
		//
		// typedef struct _REG_TZI_FORMAT {
		// [00-03]    LONG Bias;
		// [04-07]    LONG StandardBias;
		// [08-11]    LONG DaylightBias;
		// [12-27]    SYSTEMTIME StandardDate;
		// [12-13]        WORD wYear;
		// [14-15]        WORD wMonth;
		// [16-17]        WORD wDayOfWeek;
		// [18-19]        WORD wDay;
		// [20-21]        WORD wHour;
		// [22-23]        WORD wMinute;
		// [24-25]        WORD wSecond;
		// [26-27]        WORD wMilliseconds;
		// [28-43]    SYSTEMTIME DaylightDate;
		// [28-29]        WORD wYear;
		// [30-31]        WORD wMonth;
		// [32-33]        WORD wDayOfWeek;
		// [34-35]        WORD wDay;
		// [36-37]        WORD wHour;
		// [38-39]        WORD wMinute;
		// [40-41]        WORD wSecond;
		// [42-43]        WORD wMilliseconds;
		// } REG_TZI_FORMAT;
		//

		this.Bias = tzi.Bias;
		this.StandardBias = tzi.StandardBias;
		this.DaylightBias = tzi.DaylightBias;

		this.StandardDate = tzi.StandardDate;
		this.DaylightDate = tzi.DaylightDate;

	}
}

class OffsetAndRule {
	public year: int = 0;
	public offset: TimeSpan = null as any;
	public rule: AdjustmentRule = null as any;
	public constructor();
	public constructor(year: int, offset: TimeSpan, rule: AdjustmentRule);
	public constructor(...args: any[]) {
		if (args.length === 0) {
		} else if (args.length === 3) {
			const year: int = args[0];
			const offset: TimeSpan = args[1];
			const rule: AdjustmentRule = args[2];
			this.year = year;
			this.offset = offset;
			this.rule = rule;
		}
	}
}

//
export enum TimeZoneInfoOptions {
	None = 1,
	NoThrowOnInvalidTime = 2
};

enum TimeZoneInfoResult {
	Success = 0,
	TimeZoneNotFoundException = 1,
	InvalidTimeZoneException = 2,
	SecurityException = 3
}

class CachedData {
	private m_localTimeZone: TimeZoneInfo = null as any;
	private m_utcTimeZone: TimeZoneInfo = null as any;

	public CreateLocal(): TimeZoneInfo {
		let timeZone: TimeZoneInfo = this.m_localTimeZone;
		if (timeZone == null) {
			timeZone = (TimeZoneInfo as any).GetLocalTimeZone(this);

			// this step is to break the reference equality
			// between TimeZoneInfo.Local and a second time zone
			// such as "Pacific Standard Time"
			timeZone = new TimeZoneInfo(
				(timeZone as any).m_id,
				(timeZone as any).m_baseUtcOffset,
				(timeZone as any).m_displayName,
				(timeZone as any).m_standardDisplayName,
				(timeZone as any).m_daylightDisplayName,
				(timeZone as any).m_adjustmentRules,
				false);

			this.m_localTimeZone = timeZone;
		}
		return timeZone;
	}


	public get Local(): TimeZoneInfo {
		let timeZone: TimeZoneInfo = this.m_localTimeZone;
		if (timeZone == null) {
			timeZone = this.CreateLocal();
		}
		return timeZone;
	}


	private CreateUtc(): TimeZoneInfo {
		let timeZone: TimeZoneInfo = this.m_utcTimeZone;
		if (timeZone == null) {
			timeZone = TimeZoneInfo.CreateCustomTimeZone('UTC', TimeSpan.Zero, 'UTC', 'UTC');
			this.m_utcTimeZone = timeZone;
		}
		return timeZone;
	}

	public get Utc(): TimeZoneInfo {
		//Contract.Ensures(Contract.Result<TimeZoneInfo>() != null);

		let timeZone: TimeZoneInfo = this.m_utcTimeZone;
		if (timeZone == null) {
			timeZone = this.CreateUtc();
		}
		return timeZone;
	}


	//
	// GetCorrespondingKind-
	//
	// Helper function that returns the corresponding DateTimeKind for this TimeZoneInfo
	//
	public GetCorrespondingKind(timeZone: TimeZoneInfo): DateTimeKind {
		let kind: DateTimeKind;

		//
		// we check reference equality to see if 'this' is the same as
		// TimeZoneInfo.Local or TimeZoneInfo.Utc.  This check is needed to
		// support setting the DateTime Kind property to 'Local' or
		// 'Utc' on the ConverTime(...) return value.
		//
		// Using reference equality instead of value equality was a
		// performance based design compromise.  The reference equality
		// has much greater performance, but it reduces the number of
		// returned DateTime's that can be properly set as 'Local' or 'Utc'.
		//
		// For example, the user could be converting to the TimeZoneInfo returned
		// by FindSystemTimeZoneById("Pacific Standard Time") and their local
		// machine may be in Pacific time.  If we used value equality to determine
		// the corresponding Kind then this conversion would be tagged as 'Local';
		// where as we are currently tagging the returned DateTime as 'Unspecified'
		// in this example.  Only when the user passes in TimeZoneInfo.Local or
		// TimeZoneInfo.Utc to the ConvertTime(...) methods will this check succeed.
		//
		if (timeZone === this.m_utcTimeZone) {
			kind = DateTimeKind.Utc;
		} else if (timeZone === this.m_localTimeZone) {
			kind = DateTimeKind.Local;
		} else {
			kind = DateTimeKind.Unspecified;
		}

		return kind;
	}


	public m_systemTimeZones: Dictionary<string, TimeZoneInfo> = null as any;
	public m_readOnlySystemTimeZones: ReadOnlyCollection<TimeZoneInfo> = null as any;
	public m_allSystemTimeZonesRead: boolean = false;
	private static GetTimeZoneInformation(timeZoneInformation: Out<TimeZoneInformation>): int {
		const currentTimeZone = TimeZones['Turkey Standard Time'];
		timeZoneInformation.value.Bias = currentTimeZone.TZI.Bias;
		timeZoneInformation.value.DaylightBias = currentTimeZone.TZI.DaylightBias;
		timeZoneInformation.value.DaylightDate = currentTimeZone.TZI.DaylightDate;
		timeZoneInformation.value.DaylightName = currentTimeZone.Dlt;
		timeZoneInformation.value.StandardBias = currentTimeZone.TZI.StandardBias;
		timeZoneInformation.value.StandardDate = currentTimeZone.TZI.StandardDate;
		timeZoneInformation.value.StandardName = currentTimeZone.Std;
		return TIME_ZONE_ID_STANDARD;
	}
	private static GetCurrentOneYearLocal(): TimeZoneInfo {
		// load the data from the OS
		let match: TimeZoneInfo;

		const timeZoneInformation: Out<TimeZoneInformation> = New.Out(new TimeZoneInformation(new DynamicTimeZoneInformation()));
		const result: int = CachedData.GetTimeZoneInformation(timeZoneInformation);
		if (result === TIME_ZONE_ID_INVALID)
			match = TimeZoneInfo.CreateCustomTimeZone('Local', TimeSpan.Zero, 'Local', 'Local');
		else
			match = TimeZoneInfo.GetLocalTimeZoneFromWin32Data(timeZoneInformation.value, false);
		return match;
	}

	private m_oneYearLocalFromUtc: OffsetAndRule = new OffsetAndRule();

	public GetOneYearLocalFromUtc(year: int): OffsetAndRule {
		let oneYearLocFromUtc: OffsetAndRule = this.m_oneYearLocalFromUtc;
		if (oneYearLocFromUtc == null || oneYearLocFromUtc.year !== year) {
			const currentYear: TimeZoneInfo = CachedData.GetCurrentOneYearLocal();
			const rule: AdjustmentRule = (currentYear as any).m_adjustmentRules == null ? null : (currentYear as any).m_adjustmentRules[0];
			oneYearLocFromUtc = new OffsetAndRule(year, currentYear.BaseUtcOffset, rule);
			this.m_oneYearLocalFromUtc = oneYearLocFromUtc;
		}
		return oneYearLocFromUtc;
	}
}

/*============================================================
**
** Class: TimeZoneInfo.AdjustmentRule
**
**
** Purpose:
** This class is used to represent a Dynamic TimeZone.  It
** has methods for converting a DateTime to UTC from local time
** and to local time from UTC and methods for getting the
** standard name and daylight name of the time zone.
**
**
============================================================*/
export class AdjustmentRule implements IEquatable<AdjustmentRule> {

	// ---- SECTION:  members supporting exposed properties -------------*
	private m_dateStart: DateTime = null as any;
	private m_dateEnd: DateTime = null as any;
	private m_daylightDelta: TimeSpan = null as any;
	private m_daylightTransitionStart: TransitionTime = null as any;
	private m_daylightTransitionEnd: TransitionTime = null as any;
	private m_baseUtcOffsetDelta: TimeSpan = null as any;   // delta from the default Utc offset (utcOffset = defaultUtcOffset + m_baseUtcOffsetDelta)


	// ---- SECTION: public properties --------------*
	public get DateStart(): DateTime {
		return this.m_dateStart;
	}

	public get DateEnd(): DateTime {
		return this.m_dateEnd;
	}

	public get DaylightDelta(): TimeSpan {
		return this.m_daylightDelta;
	}


	public get DaylightTransitionStart(): TransitionTime {
		return this.m_daylightTransitionStart;
	}


	public get DaylightTransitionEnd(): TransitionTime {
		return this.m_daylightTransitionEnd;
	}

	public /* internal */ get BaseUtcOffsetDelta(): TimeSpan {
		return this.m_baseUtcOffsetDelta;
	}

	public /* internal */ get HasDaylightSaving(): boolean {
		return !this.DaylightDelta.Equals(TimeSpan.Zero) || !this.DaylightTransitionStart.TimeOfDay.Equals(DateTime.MinValue) ||
			!this.DaylightTransitionEnd.TimeOfDay.Equals(DateTime.MinValue.AddMilliseconds(Convert.ToLong(1)));
	}

	// ---- SECTION: public methods --------------*

	// IEquatable<AdjustmentRule>
	public Equals(other: AdjustmentRule): boolean {
		let equals: boolean = (other != null && this.m_dateStart.Equals(other.m_dateStart) && this.m_dateEnd.Equals(other.m_dateEnd) && this.m_daylightDelta.Equals(other.m_daylightDelta) && this.m_baseUtcOffsetDelta.Equals(other.m_baseUtcOffsetDelta));

		equals = equals && this.m_daylightTransitionEnd.Equals(other.m_daylightTransitionEnd) && this.m_daylightTransitionStart.Equals(other.m_daylightTransitionStart);

		return equals;
	}


	@Override
	public GetHashCode(): int {
		return this.m_dateStart.GetHashCode();
	}

	// -------- SECTION: constructors -----------------*

	private AdjustmentRule() { }


	// -------- SECTION: factory methods -----------------*

	public static CreateAdjustmentRule(dateStart: DateTime, dateEnd: DateTime, daylightDelta: TimeSpan, daylightTransitionStart: TransitionTime, daylightTransitionEnd: TransitionTime): AdjustmentRule;
	public static /* internal */  CreateAdjustmentRule(dateStart: DateTime, dateEnd: DateTime, daylightDelta: TimeSpan, daylightTransitionStart: TransitionTime, daylightTransitionEnd: TransitionTime, baseUtcOffsetDelta: TimeSpan): AdjustmentRule
	public static CreateAdjustmentRule(...args: any[]): AdjustmentRule {
		if (args.length === 5) {
			const dateStart: DateTime = args[0];
			const dateEnd: DateTime = args[1];
			const daylightDelta: TimeSpan = args[2];
			const daylightTransitionStart: TransitionTime = args[3];
			const daylightTransitionEnd: TransitionTime = args[4];
			AdjustmentRule.ValidateAdjustmentRule(dateStart, dateEnd, daylightDelta, daylightTransitionStart, daylightTransitionEnd);

			const rule: AdjustmentRule = new AdjustmentRule();

			rule.m_dateStart = dateStart;
			rule.m_dateEnd = dateEnd;
			rule.m_daylightDelta = daylightDelta;
			rule.m_daylightTransitionStart = daylightTransitionStart;
			rule.m_daylightTransitionEnd = daylightTransitionEnd;
			rule.m_baseUtcOffsetDelta = TimeSpan.Zero;

			return rule;
		} else if (args.length === 6) {
			const dateStart: DateTime = args[0];
			const dateEnd: DateTime = args[1];
			const daylightDelta: TimeSpan = args[2];
			const daylightTransitionStart: TransitionTime = args[3];
			const daylightTransitionEnd: TransitionTime = args[4];
			const baseUtcOffsetDelta: TimeSpan = args[5];
			const rule: AdjustmentRule = AdjustmentRule.CreateAdjustmentRule(dateStart, dateEnd, daylightDelta, daylightTransitionStart, daylightTransitionEnd);
			rule.m_baseUtcOffsetDelta = baseUtcOffsetDelta;
			return rule;
		}
		throw new ArgumentOutOfRangeException('');
	}



	// ----- SECTION: internal utility methods ----------------*

	//
	// When Windows sets the daylight transition start Jan 1st at 12:00 AM, it means the year starts with the daylight saving on.
	// We have to special case this value and not adjust it when checking if any date is in the daylight saving period.
	//
	public /* internal */  IsStartDateMarkerForBeginningOfYear(): boolean {
		return this.DaylightTransitionStart.Month === 1 && this.DaylightTransitionStart.Day === 1 && this.DaylightTransitionStart.TimeOfDay.Hour === 0 &&
			this.DaylightTransitionStart.TimeOfDay.Minute === 0 && this.DaylightTransitionStart.TimeOfDay.Second === 0 && this.m_dateStart.Year === this.m_dateEnd.Year;
	}

	//
	// When Windows sets the daylight transition end Jan 1st at 12:00 AM, it means the year ends with the daylight saving on.
	// We have to special case this value and not adjust it when checking if any date is in the daylight saving period.
	//
	public /* internal */  IsEndDateMarkerForEndOfYear(): boolean {
		return this.DaylightTransitionEnd.Month === 1 && this.DaylightTransitionEnd.Day === 1 && this.DaylightTransitionEnd.TimeOfDay.Hour === 0 &&
			this.DaylightTransitionEnd.TimeOfDay.Minute === 0 && this.DaylightTransitionEnd.TimeOfDay.Second === 0 &&
			this.m_dateStart.Year === this.m_dateEnd.Year;
	}

	//
	// ValidateAdjustmentRule -
	//
	// Helper function that performs all of the validation checks for the
	// factory methods and deserialization callback
	//
	private static ValidateAdjustmentRule(
		dateStart: DateTime,
		dateEnd: DateTime,
		daylightDelta: TimeSpan,
		daylightTransitionStart: TransitionTime,
		daylightTransitionEnd: TransitionTime): void {


		if (dateStart.Kind !== DateTimeKind.Unspecified) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeKindMustBeUnspecified"), "dateStart");
		}

		if (dateEnd.Kind !== DateTimeKind.Unspecified) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeKindMustBeUnspecified"), "dateEnd");
		}

		if (daylightTransitionStart.Equals(daylightTransitionEnd)) {
			throw new ArgumentException(Environment.GetResourceString("Argument_TransitionTimesAreIdentical"),
				"daylightTransitionEnd");
		}


		if (dateStart > dateEnd) {
			throw new ArgumentException(Environment.GetResourceString("Argument_OutOfOrderDateTimes"), "dateStart");
		}

		if (TimeZoneInfo.UtcOffsetOutOfRange(daylightDelta)) {
			throw new ArgumentOutOfRangeException("daylightDelta" + daylightDelta +
				Environment.GetResourceString("ArgumentOutOfRange_UtcOffset"));
		}

		if (daylightDelta.Ticks.mod(TimeSpan.TicksPerMinute).notEquals(0)) {
			throw new ArgumentException(Environment.GetResourceString("Argument_TimeSpanHasSeconds"),
				"daylightDelta");
		}

		if (!dateStart.TimeOfDay.Equals(TimeSpan.Zero)) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeHasTimeOfDay"),
				"dateStart");
		}

		if (dateEnd.TimeOfDay != TimeSpan.Zero) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeHasTimeOfDay"),
				"dateEnd");
		}
		// Contract.EndContractBlock();
	}
}
/*============================================================
**
** Class: TimeZoneInfo.TransitionTime
**
**
** Purpose:
** This class is used to represent a Dynamic TimeZone.  It
** has methods for converting a DateTime to UTC from local time
** and to local time from UTC and methods for getting the
** standard name and daylight name of the time zone.
**
**
============================================================*/
export class TransitionTime implements IEquatable<TransitionTime>{

	// ---- SECTION:  members supporting exposed properties -------------*
	private m_timeOfDay: DateTime = null as any;
	private m_month: byte = 0;
	private m_week: byte = 0;
	private m_day: byte = 0;
	private m_dayOfWeek: DayOfWeek = 0;
	private m_isFixedDateRule: boolean = false;


	// ---- SECTION: public properties --------------*
	public get TimeOfDay(): DateTime {
		return this.m_timeOfDay;
	}

	public get Month(): int {
		return this.m_month;
	}


	public get Week(): int {
		return this.m_week;
	}

	public get Day(): int {
		return this.m_day;
	}

	public get DayOfWeek(): DayOfWeek {
		return this.m_dayOfWeek;
	}

	public get IsFixedDateRule(): boolean {
		return this.m_isFixedDateRule;
	}


	public Equals(other: TransitionTime): boolean {

		let equal: boolean = (this.m_isFixedDateRule === other.m_isFixedDateRule
			&& this.m_timeOfDay === other.m_timeOfDay
			&& this.m_month === other.m_month);

		if (equal) {
			if (other.m_isFixedDateRule) {
				equal = (this.m_day === other.m_day);
			}
			else {
				equal = (this.m_week === other.m_week
					&& this.m_dayOfWeek === other.m_dayOfWeek);
			}
		}
		return equal;
	}
	public NotEquals(other: TransitionTime): boolean {
		return !this.Equals(other);
	}

	@Override
	public GetHashCode(): int {
		return (this.m_month ^ this.m_week << 8);
	}


	// -------- SECTION: constructors -----------------*
	/*
				private TransitionTime() {
					m_timeOfDay = new DateTime();
					m_month = 0;
					m_week  = 0;
					m_day   = 0;
					m_dayOfWeek = DayOfWeek.Sunday;
					m_isFixedDateRule = false;
				}
	*/


	// -------- SECTION: factory methods -----------------*


	public static CreateFixedDateRule(
		timeOfDay: DateTime,
		month: int,
		day: int): TransitionTime {

		return TransitionTime.CreateTransitionTime(timeOfDay, month, 1, day, DayOfWeek.Sunday, true);
	}


	public static CreateFloatingDateRule(
		timeOfDay: DateTime,
		month: int,
		week: int,
		dayOfWeek: DayOfWeek): TransitionTime {

		return TransitionTime.CreateTransitionTime(timeOfDay, month, week, 1, dayOfWeek, false);
	}


	private static CreateTransitionTime(
		timeOfDay: DateTime,
		month: int,
		week: int,
		day: int,
		dayOfWeek: DayOfWeek,
		isFixedDateRule: boolean): TransitionTime {

		TransitionTime.ValidateTransitionTime(timeOfDay, month, week, day, dayOfWeek);

		const t: TransitionTime = new TransitionTime();
		t.m_isFixedDateRule = isFixedDateRule;
		t.m_timeOfDay = timeOfDay;
		t.m_dayOfWeek = dayOfWeek;
		t.m_day = day;
		t.m_week = week;
		t.m_month = month;

		return t;
	}


	// ----- SECTION: internal utility methods ----------------*

	//
	// ValidateTransitionTime -
	//
	// Helper function that validates a TransitionTime instance
	//
	private static ValidateTransitionTime(
		timeOfDay: DateTime,
		month: int,
		week: int,
		day: int,
		dayOfWeek: DayOfWeek): void {

		if (timeOfDay.Kind !== DateTimeKind.Unspecified) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeKindMustBeUnspecified"), "timeOfDay");
		}

		// Month range 1-12
		if (month < 1 || month > 12) {
			throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_MonthParam"));
		}

		// Day range 1-31
		if (day < 1 || day > 31) {
			throw new ArgumentOutOfRangeException("day", Environment.GetResourceString("ArgumentOutOfRange_DayParam"));
		}

		// Week range 1-5
		if (week < 1 || week > 5) {
			throw new ArgumentOutOfRangeException("week", Environment.GetResourceString("ArgumentOutOfRange_Week"));
		}

		// DayOfWeek range 0-6
		if (dayOfWeek < 0 || dayOfWeek > 6) {
			throw new ArgumentOutOfRangeException("dayOfWeek", Environment.GetResourceString("ArgumentOutOfRange_DayOfWeek"));
		}
		//Contract.EndContractBlock();

		const timeOfDayYear: Out<int> = New.Out();
		const timeOfDayMonth: Out<int> = New.Out();
		const timeOfDayDay: Out<int> = New.Out();

		(timeOfDay as any).GetDatePart(timeOfDayYear, timeOfDayMonth.value, timeOfDayDay.value);

		if (timeOfDayYear.value !== 1 || timeOfDayMonth.value !== 1 || timeOfDayDay.value !== 1 || (timeOfDay.Ticks.mod(TimeSpan.TicksPerMillisecond).notEquals(Convert.ToLong(0)))) {
			throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeHasTicks"), "timeOfDay");
		}
	}
}

export class TimeZoneInfo implements IEquatable<TimeZoneInfo> {

	// ---- SECTION:  members supporting exposed properties -------------*
	private m_id: string = '';
	private m_displayName: string = '';
	private m_standardDisplayName: string = '';
	private m_daylightDisplayName: string = '';
	private m_baseUtcOffset: TimeSpan = null as any;
	private m_supportsDaylightSavingTime: boolean = false;
	private m_adjustmentRules: AdjustmentRule[] = null as any;

	// ---- SECTION:  members for internal support ---------*
	// registry constants for the 'Time Zones' hive
	//
	private static readonly c_timeZonesRegistryHive: string = "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Time Zones";
	private static readonly c_timeZonesRegistryHivePermissionList: string = "HKEY_LOCAL_MACHINE\\" + TimeZoneInfo.c_timeZonesRegistryHive;
	private static readonly c_displayValue: string = "Display";
	private static readonly c_daylightValue: string = "Dlt";
	private static readonly c_standardValue: string = "Std";
	private static readonly c_muiDisplayValue: string = "MUI_Display";
	private static readonly c_muiDaylightValue: string = "MUI_Dlt";
	private static readonly c_muiStandardValue: string = "MUI_Std";
	private static readonly c_timeZoneInfoValue: string = "TZI";
	private static readonly c_firstEntryValue: string = "FirstEntry";
	private static readonly c_lastEntryValue: string = "LastEntry";


	// constants for TimeZoneInfo.Local and TimeZoneInfo.Utc
	private static readonly c_utcId: string = "UTC";
	private static readonly c_localId: string = "Local";

	private static readonly c_maxKeyLength: int = 255;

	private static readonly c_regByteLength: int = 44;

	// Number of 100ns ticks per time unit
	private static readonly c_ticksPerMillisecond: long = Convert.ToLong(10000);
	private static readonly c_ticksPerSecond: long = TimeZoneInfo.c_ticksPerMillisecond.mul(1000);
	private static readonly c_ticksPerMinute: long = TimeZoneInfo.c_ticksPerSecond.mul(60);
	private static readonly c_ticksPerHour: long = TimeZoneInfo.c_ticksPerMinute.mul(60);
	private static readonly c_ticksPerDay: long = TimeZoneInfo.c_ticksPerHour.mul(24);
	private static readonly c_ticksPerDayRange: long = TimeZoneInfo.c_ticksPerDay.sub(TimeZoneInfo.c_ticksPerMillisecond);

	//
	// All cached data are encapsulated in a helper class to allow consistent view even when the data are refreshed using ClearCachedData()
	//
	// For example, TimeZoneInfo.Local can be cleared by another thread calling TimeZoneInfo.ClearCachedData. Without the consistent snapshot,
	// there is a chance that the internal ConvertTime calls will throw since 'source' won't be reference equal to the new TimeZoneInfo.Local.
	//
	//#pragma warning disable 0420


	private static s_cachedData: CachedData = new CachedData();



	// used by GetUtcOffsetFromUtc (DateTime.Now, DateTime.ToLocalTime) for max/min whole-day range checks
	private static s_maxDateOnly: DateTime = new DateTime(9999, 12, 31);
	private static s_minDateOnly: DateTime = new DateTime(1, 1, 2);

	// ---- SECTION: public properties --------------*

	public get Id(): string {
		return this.m_id;
	}

	public get DisplayName(): string {
		return this.m_displayName == null ? TString.Empty : this.m_displayName;
	}

	public get StandardName(): string {
		return (this.m_standardDisplayName == null ? TString.Empty : this.m_standardDisplayName);
	}

	public get DaylightName(): string {
		return (this.m_daylightDisplayName == null ? TString.Empty : this.m_daylightDisplayName);
	}

	public get BaseUtcOffset(): TimeSpan {
		return this.m_baseUtcOffset;
	}

	public get SupportsDaylightSavingTime(): boolean {
		return this.m_supportsDaylightSavingTime;
	}


	// ---- SECTION: public methods --------------*

	//
	// GetAdjustmentRules -
	//
	// returns a cloned array of AdjustmentRule objects
	//
	public GetAdjustmentRules(): AdjustmentRule[] {
		if (this.m_adjustmentRules == null) {
			return new AdjustmentRule[0];
		}
		else {
			return TArray.Clone(this.m_adjustmentRules);
		}
	}


	//
	// GetAmbiguousTimeOffsets -
	//
	// returns an array of TimeSpan objects representing all of
	// possible UTC offset values for this ambiguous time
	//
	public GetAmbiguousTimeOffsets(dateTimeOffset: DateTimeOffset): TimeSpan[];
	public GetAmbiguousTimeOffsets(dateTime: DateTime): TimeSpan[];
	public GetAmbiguousTimeOffsets(...args: any[]): TimeSpan[] {
		if (args.length === 1 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset)) {
			const dateTimeOffset: DateTimeOffset = args[0];
			if (!this.SupportsDaylightSavingTime) {
				throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeOffsetIsNotAmbiguous"), "dateTimeOffset");
			}
			//Contract.EndContractBlock();

			const adjustedTime: DateTime = (TimeZoneInfo.ConvertTime(dateTimeOffset, this)).DateTime;

			let isAmbiguous: boolean = false;
			const rule: AdjustmentRule = this.GetAdjustmentRuleForTime(adjustedTime);
			if (rule != null && rule.HasDaylightSaving) {
				const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(adjustedTime.Year, rule);
				isAmbiguous = TimeZoneInfo.GetIsAmbiguousTime(adjustedTime, rule, daylightTime);
			}

			if (!isAmbiguous) {
				throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeOffsetIsNotAmbiguous"), "dateTimeOffset");
			}

			// the passed in dateTime is ambiguous in this TimeZoneInfo instance
			const timeSpans: TimeSpan[] = new TimeSpan[2];

			const actualUtcOffset: TimeSpan = this.m_baseUtcOffset.Add(rule.BaseUtcOffsetDelta);

			// the TimeSpan array must be sorted from least to greatest
			if (rule.DaylightDelta > TimeSpan.Zero) {
				timeSpans[0] = actualUtcOffset; // FUTURE:  + rule.StandardDelta;
				timeSpans[1] = actualUtcOffset.Add(rule.DaylightDelta);
			}
			else {
				timeSpans[0] = actualUtcOffset.Add(rule.DaylightDelta);
				timeSpans[1] = actualUtcOffset; // FUTURE: + rule.StandardDelta;
			}
			return timeSpans;
		} else if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
			const dateTime: DateTime = args[0];
			if (!this.SupportsDaylightSavingTime) {
				throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeIsNotAmbiguous"), "dateTime");
			}
			//Contract.EndContractBlock();

			let adjustedTime: DateTime;
			if (dateTime.Kind == DateTimeKind.Local) {
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				adjustedTime = TimeZoneInfo.convertTime(dateTime, cachedData.Local, this, TimeZoneInfoOptions.None, cachedData);
			}
			else if (dateTime.Kind == DateTimeKind.Utc) {
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				adjustedTime = TimeZoneInfo.convertTime(dateTime, cachedData.Utc, this, TimeZoneInfoOptions.None, cachedData);
			}
			else {
				adjustedTime = dateTime;
			}

			let isAmbiguous: boolean = false;
			const rule: AdjustmentRule = this.GetAdjustmentRuleForTime(adjustedTime);
			if (rule != null && rule.HasDaylightSaving) {
				const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(adjustedTime.Year, rule);
				isAmbiguous = TimeZoneInfo.GetIsAmbiguousTime(adjustedTime, rule, daylightTime);
			}

			if (!isAmbiguous) {
				throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeIsNotAmbiguous"), "dateTime");
			}

			// the passed in dateTime is ambiguous in this TimeZoneInfo instance
			const timeSpans: TimeSpan[] = New.Array(2);
			const actualUtcOffset: TimeSpan = this.m_baseUtcOffset.Add(rule.BaseUtcOffsetDelta);

			// the TimeSpan array must be sorted from least to greatest
			if (rule.DaylightDelta > TimeSpan.Zero) {
				timeSpans[0] = actualUtcOffset; // FUTURE:  + rule.StandardDelta;
				timeSpans[1] = actualUtcOffset.Add(rule.DaylightDelta);
			}
			else {
				timeSpans[0] = actualUtcOffset.Add(rule.DaylightDelta);
				timeSpans[1] = actualUtcOffset; // FUTURE: + rule.StandardDelta;
			}
			return timeSpans;
		}
		throw new ArgumentOutOfRangeException('');
	}


	//
	// GetUtcOffset -
	//
	// returns the Universal Coordinated Time (UTC) Offset
	// for the current TimeZoneInfo instance.
	//
	public GetUtcOffset(dateTimeOffset: DateTimeOffset): TimeSpan;
	public GetUtcOffset(dateTime: DateTime): TimeSpan;
	public /* internal */  GetUtcOffset(dateTime: DateTime, flags: TimeZoneInfoOptions): TimeSpan;
	public GetUtcOffset(...args: any[]): TimeSpan {
		if (args.length === 1 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset)) {
			const dateTimeOffset: DateTimeOffset = args[0];
			return TimeZoneInfo.GetUtcOffsetFromUtc(dateTimeOffset.UtcDateTime, this);
		} else if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
			const dateTime: DateTime = args[0];
			return this.getUtcOffset(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime, TimeZoneInfo.s_cachedData);
		} else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.int(args[0])) {
			const dateTime: DateTime = args[0];
			const flags: TimeZoneInfoOptions = args[1];
			return this.getUtcOffset(dateTime, flags, TimeZoneInfo.s_cachedData);
		}
		throw new ArgumentOutOfRangeException('');
	}


	private getUtcOffset(dateTime: DateTime, flags: TimeZoneInfoOptions, cachedData: CachedData): TimeSpan {
		if (dateTime.Kind === DateTimeKind.Local) {
			if (cachedData.GetCorrespondingKind(this) !== DateTimeKind.Local) {
				//
				// normal case of converting from Local to Utc and then getting the offset from the UTC DateTime
				//
				const adjustedTime: DateTime = TimeZoneInfo.ConvertTime(dateTime, cachedData.Local, cachedData.Utc, flags);
				return TimeZoneInfo.GetUtcOffsetFromUtc(adjustedTime, this);
			}

			//
			// Fall through for TimeZoneInfo.Local.GetUtcOffset(date)
			// to handle an edge case with Invalid-Times for DateTime formatting:
			//
			// Consider the invalid PST time "2007-03-11T02:00:00.0000000-08:00"
			//
			// By directly calling GetUtcOffset instead of converting to UTC and then calling GetUtcOffsetFromUtc
			// the correct invalid offset of "-08:00" is returned.  In the normal case of converting to UTC as an
			// interim-step, the invalid time is adjusted into a *valid* UTC time which causes a change in output:
			//
			// 1) invalid PST time "2007-03-11T02:00:00.0000000-08:00"
			// 2) converted to UTC "2007-03-11T10:00:00.0000000Z"
			// 3) offset returned  "2007-03-11T03:00:00.0000000-07:00"
			//
		}
		else if (dateTime.Kind === DateTimeKind.Utc) {
			if (cachedData.GetCorrespondingKind(this) == DateTimeKind.Utc) {
				return this.m_baseUtcOffset;
			}
			else {
				//
				// passing in a UTC dateTime to a non-UTC TimeZoneInfo instance is a
				// special Loss-Less case.
				//
				return TimeZoneInfo.GetUtcOffsetFromUtc(dateTime, this);
			}
		}

		return TimeZoneInfo.GetUtcOffset(dateTime, this, flags);
	}

	// Shortcut for TimeZoneInfo.Local.GetUtcOffset
	public /* internal */ static GetLocalUtcOffset(dateTime: DateTime, flags: TimeZoneInfoOptions): TimeSpan {
		const cachedData: CachedData = TimeZoneInfo.s_cachedData;
		return cachedData.Local.getUtcOffset(dateTime, flags, cachedData);
	}





	//
	// IsAmbiguousTime -
	//
	// returns true if the time is during the ambiguous time period
	// for the current TimeZoneInfo instance.
	//
	public IsAmbiguousTime(dateTimeOffset: DateTimeOffset): boolean;
	public IsAmbiguousTime(dateTime: DateTime): boolean;
	public /* internal */  IsAmbiguousTime(dateTime: DateTime, flags: TimeZoneInfoOptions): boolean;
	public IsAmbiguousTime(...args: any[]): boolean {
		if (args.length === 1 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset)) {
			const dateTimeOffset: DateTimeOffset = args[0];
			if (!this.m_supportsDaylightSavingTime) {
				return false;
			}

			const adjustedTime: DateTimeOffset = TimeZoneInfo.ConvertTime(dateTimeOffset, this);
			return this.IsAmbiguousTime(adjustedTime.DateTime);
		} else if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
			const dateTime: DateTime = args[0];
			return this.IsAmbiguousTime(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime);
		} else if (args.length === 2) {
			const dateTime: DateTime = args[0];
			const flags: TimeZoneInfoOptions = args[1];
			if (!this.m_supportsDaylightSavingTime) {
				return false;
			}

			let adjustedTime: DateTime;
			if (dateTime.Kind === DateTimeKind.Local) {
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				adjustedTime = TimeZoneInfo.convertTime(dateTime, cachedData.Local, this, flags, cachedData);
			}
			else if (dateTime.Kind === DateTimeKind.Utc) {
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				adjustedTime = TimeZoneInfo.convertTime(dateTime, cachedData.Utc, this, flags, cachedData);
			}
			else {
				adjustedTime = dateTime;
			}

			const rule: AdjustmentRule = this.GetAdjustmentRuleForTime(adjustedTime);
			if (rule != null && rule.HasDaylightSaving) {
				const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(adjustedTime.Year, rule);
				return TimeZoneInfo.GetIsAmbiguousTime(adjustedTime, rule, daylightTime);
			}
			return false;
		}
		throw new ArgumentOutOfRangeException('');
	}

	//
	// IsDaylightSavingTime -
	//
	// Returns true if the time is during Daylight Saving time
	// for the current TimeZoneInfo instance.
	//
	public IsDaylightSavingTime(dateTimeOffset: DateTimeOffset): boolean;
	public IsDaylightSavingTime(dateTime: DateTime): boolean;
	public /* internal */  IsDaylightSavingTime(dateTime: DateTime, flags: TimeZoneInfoOptions): boolean;
	public IsDaylightSavingTime(...args: any[]): boolean {
		if (args.length === 1 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset)) {
			const dateTimeOffset: DateTimeOffset = args[0];
			let isDaylightSavingTime: Out<boolean> = New.Out(false);
			TimeZoneInfo.GetUtcOffsetFromUtc(dateTimeOffset.UtcDateTime, this, isDaylightSavingTime);
			return isDaylightSavingTime.value;
		} else if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
			const dateTime: DateTime = args[0];
			return this.isDaylightSavingTime(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime, TimeZoneInfo.s_cachedData);
		} else if (args.length === 2) {
			const dateTime: DateTime = args[0];
			const flags: TimeZoneInfoOptions = args[1];
			return this.isDaylightSavingTime(dateTime, flags, TimeZoneInfo.s_cachedData);
		}
		throw new ArgumentOutOfRangeException('');
	}

	private isDaylightSavingTime(dateTime: DateTime, flags: TimeZoneInfoOptions, cachedData: CachedData): boolean {
		//
		//    dateTime.Kind is UTC, then time will be converted from UTC
		//        into current instance's timezone
		//    dateTime.Kind is Local, then time will be converted from Local
		//        into current instance's timezone
		//    dateTime.Kind is UnSpecified, then time is already in
		//        current instance's timezone
		//
		// Our DateTime handles ambiguous times, (one is in the daylight and
		// one is in standard.) If a new DateTime is constructed during ambiguous
		// time, it is defaulted to "Standard" (i.e. this will return false).
		// For Invalid times, we will return false

		if (!this.m_supportsDaylightSavingTime || this.m_adjustmentRules == null) {
			return false;
		}

		let adjustedTime: DateTime;
		//
		// handle any Local/Utc special cases...
		//
		if (dateTime.Kind === DateTimeKind.Local) {
			adjustedTime = TimeZoneInfo.convertTime(dateTime, cachedData.Local, this, flags, cachedData);
		}
		else if (dateTime.Kind === DateTimeKind.Utc) {
			if (cachedData.GetCorrespondingKind(this) === DateTimeKind.Utc) {
				// simple always false case: TimeZoneInfo.Utc.IsDaylightSavingTime(dateTime, flags);
				return false;
			}
			else {
				//
				// passing in a UTC dateTime to a non-UTC TimeZoneInfo instance is a
				// special Loss-Less case.
				//
				let isDaylightSavings: Out<boolean> = New.Out(false);;
				TimeZoneInfo.GetUtcOffsetFromUtc(dateTime, this, isDaylightSavings);
				return isDaylightSavings.value;
			}
		}
		else {
			adjustedTime = dateTime;
		}

		//
		// handle the normal cases...
		//
		const rule: AdjustmentRule = this.GetAdjustmentRuleForTime(adjustedTime);
		if (rule != null && rule.HasDaylightSaving) {
			const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(adjustedTime.Year, rule);
			return TimeZoneInfo.GetIsDaylightSavings(adjustedTime, rule, daylightTime, flags);
		}
		else {
			return false;
		}
	}


	//
	// IsInvalidTime -
	//
	// returns true when dateTime falls into a "hole in time".
	//
	public IsInvalidTime(dateTime: DateTime): boolean {
		let isInvalid: boolean = false;

		if ((dateTime.Kind === DateTimeKind.Unspecified)
			|| (dateTime.Kind === DateTimeKind.Local && TimeZoneInfo.s_cachedData.GetCorrespondingKind(this) === DateTimeKind.Local)) {

			// only check Unspecified and (Local when this TimeZoneInfo instance is Local)
			const rule: AdjustmentRule = this.GetAdjustmentRuleForTime(dateTime);

			if (rule != null && rule.HasDaylightSaving) {
				const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(dateTime.Year, rule);
				isInvalid = TimeZoneInfo.GetIsInvalidTime(dateTime, rule, daylightTime);
			}
			else {
				isInvalid = false;
			}
		}

		return isInvalid;
	}


	//
	// ClearCachedData -
	//
	// Clears data from static members
	//
	public static ClearCachedData(): void {
		// Clear a fresh instance of cached data
		TimeZoneInfo.s_cachedData = new CachedData();
	}

	//
	// ConvertTimeBySystemTimeZoneId -
	//
	// Converts the value of a DateTime object from sourceTimeZone to destinationTimeZone
	//
	public static ConvertTimeBySystemTimeZoneId(dateTimeOffset: DateTimeOffset, destinationTimeZoneId: string): DateTimeOffset;
	public static ConvertTimeBySystemTimeZoneId(dateTime: DateTime, destinationTimeZoneId: string): DateTime;
	public static ConvertTimeBySystemTimeZoneId(dateTime: DateTime, sourceTimeZoneId: string, destinationTimeZoneId: string): DateTime;
	public static ConvertTimeBySystemTimeZoneId(...args: any[]): DateTimeOffset | DateTime {
		if (args.length === 2 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset) && is.string(args[1])) {
			const dateTimeOffset: DateTimeOffset = args[0];
			const destinationTimeZoneId: string = args[1];
			return TimeZoneInfo.ConvertTime(dateTimeOffset, TimeZoneInfo.FindSystemTimeZoneById(destinationTimeZoneId));
		} else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.string(args[1])) {
			const dateTime: DateTime = args[0];
			const destinationTimeZoneId: string = args[1];
			return TimeZoneInfo.ConvertTime(dateTime, TimeZoneInfo.FindSystemTimeZoneById(destinationTimeZoneId));
		} else if (args.length === 3) {
			const dateTime: DateTime = args[0];
			const sourceTimeZoneId: string = args[1];
			const destinationTimeZoneId: string = args[2];
			if (dateTime.Kind === DateTimeKind.Local && TString.Compare(sourceTimeZoneId, TimeZoneInfo.Local.Id, StringComparison.OrdinalIgnoreCase) === 0) {
				// TimeZoneInfo.Local can be cleared by another thread calling TimeZoneInfo.ClearCachedData.
				// Take snapshot of cached data to guarantee this method will not be impacted by the ClearCachedData call.
				// Without the snapshot, there is a chance that ConvertTime will throw since 'source' won't
				// be reference equal to the new TimeZoneInfo.Local
				//
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				return TimeZoneInfo.convertTime(dateTime, cachedData.Local, TimeZoneInfo.FindSystemTimeZoneById(destinationTimeZoneId), TimeZoneInfoOptions.None, cachedData);
			}
			else if (dateTime.Kind === DateTimeKind.Utc && TString.Compare(sourceTimeZoneId, TimeZoneInfo.Utc.Id, StringComparison.OrdinalIgnoreCase) === 0) {
				// TimeZoneInfo.Utc can be cleared by another thread calling TimeZoneInfo.ClearCachedData.
				// Take snapshot of cached data to guarantee this method will not be impacted by the ClearCachedData call.
				// Without the snapshot, there is a chance that ConvertTime will throw since 'source' won't
				// be reference equal to the new TimeZoneInfo.Utc
				//
				const cachedData: CachedData = TimeZoneInfo.s_cachedData;
				return TimeZoneInfo.convertTime(dateTime, cachedData.Utc, TimeZoneInfo.FindSystemTimeZoneById(destinationTimeZoneId), TimeZoneInfoOptions.None, cachedData);
			}
			else {
				return TimeZoneInfo.ConvertTime(dateTime, TimeZoneInfo.FindSystemTimeZoneById(sourceTimeZoneId), TimeZoneInfo.FindSystemTimeZoneById(destinationTimeZoneId));
			}
		}
		throw new ArgumentOutOfRangeException('');

	}




	//
	// ConvertTime -
	//
	// Converts the value of the dateTime object from sourceTimeZone to destinationTimeZone
	//

	public static ConvertTime(dateTimeOffset: DateTimeOffset, destinationTimeZone: TimeZoneInfo): DateTimeOffset;
	public static ConvertTime(dateTime: DateTime, destinationTimeZone: TimeZoneInfo): DateTime;
	public static ConvertTime(dateTime: DateTime, sourceTimeZone: TimeZoneInfo, destinationTimeZone: TimeZoneInfo): DateTime;
	public static /* internal */  ConvertTime(dateTime: DateTime, sourceTimeZone: TimeZoneInfo, destinationTimeZone: TimeZoneInfo, flags: TimeZoneInfoOptions): DateTime;
	public static ConvertTime(...args: any[]): DateTimeOffset | DateTime {
		if (args.length === 2 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset) && is.typeof<TimeZoneInfo>(args[0], System.Types.TimeZoneInfo)) {
			const dateTimeOffset: DateTimeOffset = args[0];
			const destinationTimeZone: TimeZoneInfo = args[1];

			if (destinationTimeZone == null) {
				throw new ArgumentNullException("destinationTimeZone");
			}

			//Contract.EndContractBlock();
			// calculate the destination time zone offset
			const utcDateTime: DateTime = dateTimeOffset.UtcDateTime;
			const destinationOffset: TimeSpan = TimeZoneInfo.GetUtcOffsetFromUtc(utcDateTime, destinationTimeZone);

			// check for overflow
			const ticks: long = utcDateTime.Ticks.add(destinationOffset.Ticks);

			if (ticks.greaterThan(DateTimeOffset.MaxValue.Ticks)) {
				return DateTimeOffset.MaxValue;
			}
			else if (ticks.lessThan(DateTimeOffset.MinValue.Ticks)) {
				return DateTimeOffset.MinValue;
			}
			else {
				return new DateTimeOffset(ticks, destinationOffset);
			}
		} else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.typeof<TimeZoneInfo>(args[0], System.Types.TimeZoneInfo)) {
			const dateTime: DateTime = args[0];
			const destinationTimeZone: TimeZoneInfo = args[1];
			if (destinationTimeZone == null) {
				throw new ArgumentNullException("destinationTimeZone");
			}
			//Contract.EndContractBlock();

			// Special case to give a way clearing the cache without exposing ClearCachedData()
			if (dateTime.Ticks.equals(Convert.ToLong(0))) {
				TimeZoneInfo.ClearCachedData();
			}
			const cachedData: CachedData = TimeZoneInfo.s_cachedData;
			if (dateTime.Kind === DateTimeKind.Utc) {
				return TimeZoneInfo.convertTime(dateTime, cachedData.Utc, destinationTimeZone, TimeZoneInfoOptions.None, cachedData);
			}
			else {
				return TimeZoneInfo.convertTime(dateTime, cachedData.Local, destinationTimeZone, TimeZoneInfoOptions.None, cachedData);
			}
		} else if (args.length === 3) {
			const dateTime: DateTime = args[0];
			const sourceTimeZone: TimeZoneInfo = args[1];
			const destinationTimeZone: TimeZoneInfo = args[2];
			return TimeZoneInfo.convertTime(dateTime, sourceTimeZone, destinationTimeZone, TimeZoneInfoOptions.None, TimeZoneInfo.s_cachedData);
		} else if (args.length === 4) {
			const dateTime: DateTime = args[0];
			const sourceTimeZone: TimeZoneInfo = args[1];
			const destinationTimeZone: TimeZoneInfo = args[2];
			const flags: TimeZoneInfoOptions = args[3];
			return TimeZoneInfo.convertTime(dateTime, sourceTimeZone, destinationTimeZone, flags, TimeZoneInfo.s_cachedData);
		}
		throw new ArgumentOutOfRangeException('');

	}



	private static convertTime(dateTime: DateTime, sourceTimeZone: TimeZoneInfo, destinationTimeZone: TimeZoneInfo, flags: TimeZoneInfoOptions, cachedData: CachedData): DateTime {
		if (sourceTimeZone == null) {
			throw new ArgumentNullException("sourceTimeZone");
		}

		if (destinationTimeZone == null) {
			throw new ArgumentNullException("destinationTimeZone");
		}
		//Contract.EndContractBlock();

		const sourceKind: DateTimeKind = cachedData.GetCorrespondingKind(sourceTimeZone);
		if (((flags & TimeZoneInfoOptions.NoThrowOnInvalidTime) === 0) && (dateTime.Kind !== DateTimeKind.Unspecified) && (dateTime.Kind !== sourceKind)) {
			throw new ArgumentException(Environment.GetResourceString("Argument_ConvertMismatch"), "sourceTimeZone");
		}

		//
		// check to see if the DateTime is in an invalid time range.  This check
		// requires the current AdjustmentRule and DaylightTime - which are also
		// needed to calculate 'sourceOffset' in the normal conversion case.
		// By calculating the 'sourceOffset' here we improve the
		// performance for the normal case at the expense of the 'ArgumentException'
		// case and Loss-less Local special cases.
		//
		const sourceRule: AdjustmentRule = sourceTimeZone.GetAdjustmentRuleForTime(dateTime);
		let sourceOffset: TimeSpan = sourceTimeZone.BaseUtcOffset;

		if (sourceRule != null) {
			sourceOffset = sourceOffset.Add(sourceRule.BaseUtcOffsetDelta);
			if (sourceRule.HasDaylightSaving) {
				let sourceIsDaylightSavings: boolean = false;
				const sourceDaylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(dateTime.Year, sourceRule);

				// 'dateTime' might be in an invalid time range since it is in an AdjustmentRule
				// period that supports DST
				if (((flags & TimeZoneInfoOptions.NoThrowOnInvalidTime) === 0) && TimeZoneInfo.GetIsInvalidTime(dateTime, sourceRule, sourceDaylightTime)) {
					throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeIsInvalid"), "dateTime");
				}
				sourceIsDaylightSavings = TimeZoneInfo.GetIsDaylightSavings(dateTime, sourceRule, sourceDaylightTime, flags);

				// adjust the sourceOffset according to the Adjustment Rule / Daylight Saving Rule
				sourceOffset = sourceOffset.Add(sourceIsDaylightSavings ? sourceRule.DaylightDelta : TimeSpan.Zero /*FUTURE: sourceRule.StandardDelta*/);
			}
		}

		const targetKind: DateTimeKind = cachedData.GetCorrespondingKind(destinationTimeZone);

		// handle the special case of Loss-less Local->Local and UTC->UTC)
		if (dateTime.Kind !== DateTimeKind.Unspecified && sourceKind !== DateTimeKind.Unspecified && sourceKind === targetKind) {
			return dateTime;
		}

		const utcTicks: long = dateTime.Ticks.sub(sourceOffset.Ticks);

		// handle the normal case by converting from 'source' to UTC and then to 'target'
		let isAmbiguousLocalDst: Out<boolean> = New.Out(false);
		const targetConverted: DateTime = TimeZoneInfo.ConvertUtcToTimeZone(utcTicks, destinationTimeZone, isAmbiguousLocalDst);

		if (targetKind === DateTimeKind.Local) {
			// Because the ticks conversion between UTC and local is lossy, we need to capture whether the
			// time is in a repeated hour so that it can be passed to the DateTime constructor.
			return new DateTime(targetConverted.Ticks, DateTimeKind.Local, isAmbiguousLocalDst.value);
		}
		else {
			return new DateTime(targetConverted.Ticks, targetKind);
		}
	}

	//
	// ConvertTimeFromUtc -
	//
	// Converts the value of a DateTime object from Coordinated Universal Time (UTC) to
	// the destinationTimeZone.
	//
	public static ConvertTimeFromUtc(dateTime: DateTime, destinationTimeZone: TimeZoneInfo): DateTime {
		const cachedData: CachedData = TimeZoneInfo.s_cachedData;
		return TimeZoneInfo.convertTime(dateTime, cachedData.Utc, destinationTimeZone, TimeZoneInfoOptions.None, cachedData);
	}


	//
	// ConvertTimeToUtc -
	//
	// Converts the value of a DateTime object to Coordinated Universal Time (UTC).
	//
	public static ConvertTimeToUtc(dateTime: DateTime): DateTime;
	public static /* internal */  ConvertTimeToUtc(dateTime: DateTime, flags: TimeZoneInfoOptions): DateTime;
	public static ConvertTimeToUtc(dateTime: DateTime, sourceTimeZone: TimeZoneInfo): DateTime;
	public static ConvertTimeToUtc(...args: any[]): DateTime {
		if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
			const dateTime: DateTime = args[0];
			if (dateTime.Kind == DateTimeKind.Utc) {
				return dateTime;
			}
			const cachedData: CachedData = TimeZoneInfo.s_cachedData;
			return TimeZoneInfo.convertTime(dateTime, cachedData.Local, cachedData.Utc, TimeZoneInfoOptions.None, cachedData);
		} else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.int(args[1])) {
			const dateTime: DateTime = args[0];
			const flags: TimeZoneInfoOptions = args[1];
			if (dateTime.Kind === DateTimeKind.Utc) {
				return dateTime;
			}
			const cachedData: CachedData = TimeZoneInfo.s_cachedData;
			return TimeZoneInfo.convertTime(dateTime, cachedData.Local, cachedData.Utc, flags, cachedData);
		} else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.typeof<TimeZoneInfo>(args[1], System.Types.TimeZoneInfo)) {
			const dateTime: DateTime = args[0];
			const sourceTimeZone: TimeZoneInfo = args[1];
			const cachedData: CachedData = TimeZoneInfo.s_cachedData;
			return TimeZoneInfo.convertTime(dateTime, sourceTimeZone, cachedData.Utc, TimeZoneInfoOptions.None, cachedData);
		}
		throw new ArgumentOutOfRangeException('');
	}

	//
	// IEquatable.Equals -
	//
	// returns value equality.  Equals does not compare any localizable
	// String objects (DisplayName, StandardName, DaylightName).
	//
	public Equals(other: TimeZoneInfo): boolean {
		return (other != null && TString.Compare(this.m_id, other.m_id, StringComparison.OrdinalIgnoreCase) === 0 && this.HasSameRules(other));
	}

	/* 	public override bool Equals(object obj) {
			TimeZoneInfo tzi = obj as TimeZoneInfo;
			if (null == tzi) {
				return false;
			}
			return Equals(tzi);
		} */

	//
	// FromSerializedString -
	//
	/* public static FromSerializedString(source: string): TimeZoneInfo {
		if (source == null) {
			throw new ArgumentNullException("source");
		}
		if (source.length === 0) {
			throw new ArgumentException(Environment.GetResourceString("Argument_InvalidSerializedString", source), "source");
		}
		//Contract.EndContractBlock();

		return StringSerializer.GetDeserializedTimeZoneInfo(source);
	} */


	//
	// GetHashCode -
	//
	@Override
	public GetHashCode(): int {
		return TString.GetHashCode(this.m_id.toUpperCase(/* CultureInfo.InvariantCulture */));
	}



	//
	// GetSystemTimeZones -
	//
	// returns a ReadOnlyCollection<TimeZoneInfo> containing all valid TimeZone's
	// from the local machine.  The entries in the collection are sorted by
	// 'DisplayName'.
	//
	// This method does *not* throw TimeZoneNotFoundException or
	// InvalidTimeZoneException.
	//
	// <SecurityKernel Critical="True" Ring="0">
	// <Asserts Name="Imperative: System.Security.PermissionSet" />
	// </SecurityKernel>
	public static GetSystemTimeZones(): ReadOnlyCollection<TimeZoneInfo> {

		const cachedData: CachedData = TimeZoneInfo.s_cachedData;

		//lock(cachedData) {
		if (cachedData.m_readOnlySystemTimeZones == null) {
				/* const permSet:PermissionSet = new PermissionSet(PermissionState.None);
				permSet.AddPermission(new RegistryPermission(RegistryPermissionAccess.Read, c_timeZonesRegistryHivePermissionList));
				permSet.Assert(); */

				/* using( */const reg: RegistryKey = Registry.LocalMachine.OpenSubKey(TimeZoneInfo.c_timeZonesRegistryHive, false);

			if (reg != null) {
				foreach(reg.GetSubKeyNames(), (keyName: string) => {
					let value: Out<TimeZoneInfo> = New.Out();
					let ex: Out<Exception> = New.Out();
					TimeZoneInfo.TryGetTimeZone(keyName, false, value, ex, cachedData);  // populate the cache
				});
			}
			cachedData.m_allSystemTimeZonesRead = true;

			let list: List<TimeZoneInfo>;
			if (cachedData.m_systemTimeZones != null) {
				// return a collection of the cached system time zones
				list = new List<TimeZoneInfo>(cachedData.m_systemTimeZones.Values);
			}
			else {
				// return an empty collection
				list = new List<TimeZoneInfo>();
			}

			// sort and copy the TimeZoneInfo's into a ReadOnlyCollection for the user
			list.Sort(new TimeZoneInfoComparer());

			cachedData.m_readOnlySystemTimeZones = new ReadOnlyCollection<TimeZoneInfo>(list);
		}
		return cachedData.m_readOnlySystemTimeZones;
	}

	//#endif // FEATURE_WIN32_REGISTRY


	//
	// HasSameRules -
	//
	// Value equality on the "adjustmentRules" array
	//
	public HasSameRules(other: TimeZoneInfo): boolean {
		if (other == null) {
			throw new ArgumentNullException("other");
		}

		// check the utcOffset and supportsDaylightSavingTime members
		//Contract.EndContractBlock();

		if (!this.m_baseUtcOffset.Equals(other.m_baseUtcOffset) || this.m_supportsDaylightSavingTime !== other.m_supportsDaylightSavingTime) {
			return false;
		}

		let sameRules: boolean;
		const currentRules: AdjustmentRule[] = this.m_adjustmentRules;
		const otherRules: AdjustmentRule[] = other.m_adjustmentRules;

		sameRules = (currentRules == null && otherRules == null) || (currentRules != null && otherRules != null);

		if (!sameRules) {
			// AdjustmentRule array mismatch
			return false;
		}

		if (currentRules != null) {
			if (currentRules.length !== otherRules.length) {
				// AdjustmentRule array length mismatch
				return false;
			}

			for (let i: int = 0; i < currentRules.length; i++) {
				if (!(currentRules[i]).Equals(otherRules[i])) {
					// AdjustmentRule value-equality mismatch
					return false;
				}
			}

		}
		return sameRules;
	}

	//
	// Local -
	//
	// returns a TimeZoneInfo instance that represents the local time on the machine.
	// Accessing this property may throw InvalidTimeZoneException or COMException
	// if the machine is in an unstable or corrupt state.
	//
	public static get Local(): TimeZoneInfo {
		//Contract.Ensures(Contract.Result<TimeZoneInfo>() != null);
		return TimeZoneInfo.s_cachedData.Local;
	}


	//
	// ToSerializedString -
	//
	// "TimeZoneInfo"           := TimeZoneInfo Data;[AdjustmentRule Data 1];...;[AdjustmentRule Data N]
	//
	// "TimeZoneInfo Data"      := <m_id>;<m_baseUtcOffset>;<m_displayName>;
	//                          <m_standardDisplayName>;<m_daylightDispayName>;
	//
	// "AdjustmentRule Data" := <DateStart>;<DateEnd>;<DaylightDelta>;
	//                          [TransitionTime Data DST Start]
	//                          [TransitionTime Data DST End]
	//
	// "TransitionTime Data" += <DaylightStartTimeOfDat>;<Month>;<Week>;<DayOfWeek>;<Day>
	//
	/* 	public ToSerializedString(): string {
			return StringSerializer.GetSerializedString(this);
		} */


	//
	// ToString -
	//
	// returns the DisplayName:
	// "(GMT-08:00) Pacific Time (US & Canada); Tijuana"
	@Override
	public ToString(): string {
		return this.DisplayName;
	}


	//
	// Utc -
	//
	// returns a TimeZoneInfo instance that represents Universal Coordinated Time (UTC)
	public static get Utc(): TimeZoneInfo {
		// Contract.Ensures(Contract.Result<TimeZoneInfo>() != null);
		return TimeZoneInfo.s_cachedData.Utc;
	}


	// -------- SECTION: constructors -----------------*
	//
	// TimeZoneInfo -
	//
	// private ctor
	//
	public constructor(zone: TimeZoneInformation, dstDisabled: boolean);
	public constructor(
		id: string,
		baseUtcOffset: TimeSpan,
		displayName: string,
		standardDisplayName: string,
		daylightDisplayName: string,
		adjustmentRules: AdjustmentRule[],
		disableDaylightSavingTime: boolean);
	public constructor(...args: any[]) {
		if (args.length === 2) {
			const zone: TimeZoneInformation = args[0];
			const dstDisabled: boolean = args[1];
			if (TString.IsNullOrEmpty(zone.StandardName)) {
				this.m_id = TimeZoneInfo.c_localId;  // the ID must contain at least 1 character - initialize m_id to "Local"
			}
			else {
				this.m_id = zone.StandardName;
			}
			this.m_baseUtcOffset = new TimeSpan(0, -(zone.Bias), 0);

			if (!dstDisabled) {
				// only create the adjustment rule if DST is enabled
				const regZone: RegistryTimeZoneInformation = new RegistryTimeZoneInformation(zone);
				const rule: AdjustmentRule = TimeZoneInfo.CreateAdjustmentRuleFromTimeZoneInformation(regZone, DateTime.MinValue.Date, DateTime.MaxValue.Date, zone.Bias);
				if (rule != null) {
					this.m_adjustmentRules = new AdjustmentRule[1];
					this.m_adjustmentRules[0] = rule;
				}
			}
			const _m_supportsDaylightSavingTime: Out<boolean> = New.Out(this.m_supportsDaylightSavingTime);
			TimeZoneInfo.ValidateTimeZoneInfo(this.m_id, this.m_baseUtcOffset, this.m_adjustmentRules, _m_supportsDaylightSavingTime);
			this.m_supportsDaylightSavingTime = _m_supportsDaylightSavingTime.value;
			this.m_displayName = zone.StandardName;
			this.m_standardDisplayName = zone.StandardName;
			this.m_daylightDisplayName = zone.DaylightName;
		} else if (args.length === 7) {
			const id: string = args[0];
			const baseUtcOffset: TimeSpan = args[1];
			const displayName: string = args[2];
			const standardDisplayName: string = args[3];
			const daylightDisplayName: string = args[4];
			const adjustmentRules: AdjustmentRule[] = args[5];
			const disableDaylightSavingTime: boolean = args[6];
			const adjustmentRulesSupportDst: Out<boolean> = New.Out(false);
			TimeZoneInfo.ValidateTimeZoneInfo(id, baseUtcOffset, adjustmentRules, adjustmentRulesSupportDst);

			if (!disableDaylightSavingTime && adjustmentRules != null && adjustmentRules.length > 0) {
				this.m_adjustmentRules = TArray.Clone(adjustmentRules);
			}

			this.m_id = id;
			this.m_baseUtcOffset = baseUtcOffset;
			this.m_displayName = displayName;
			this.m_standardDisplayName = standardDisplayName;
			this.m_daylightDisplayName = (disableDaylightSavingTime ? null : daylightDisplayName) as any;
			this.m_supportsDaylightSavingTime = adjustmentRulesSupportDst && !disableDaylightSavingTime;
		}
	}

	//
	// CreateCustomTimeZone -
	//
	// returns a TimeZoneInfo instance that may
	// support Daylight Saving Time
	//
	public static CreateCustomTimeZone(id: string, baseUtcOffset: TimeSpan, displayName: string, standardDisplayName: string): TimeZoneInfo;
	public static CreateCustomTimeZone(id: string, baseUtcOffset: TimeSpan, displayName: string, standardDisplayName: string, daylightDisplayName: string, adjustmentRules: AdjustmentRule[]): TimeZoneInfo;
	public static CreateCustomTimeZone(id: string, baseUtcOffset: TimeSpan, displayName: string, standardDisplayName: string, daylightDisplayName: string, adjustmentRules: AdjustmentRule[], disableDaylightSavingTime: boolean): TimeZoneInfo;
	public static CreateCustomTimeZone(...args: any[]): TimeZoneInfo {
		if (args.length === 4) {
			const id: string = args[0];
			const baseUtcOffset: TimeSpan = args[1];
			const displayName: string = args[2];
			const standardDisplayName: string = args[3];
			return new TimeZoneInfo(
				id,
				baseUtcOffset,
				displayName,
				standardDisplayName,
				standardDisplayName,
				null as any,
				false);
		} else if (args.length === 6) {
			const id: string = args[0];
			const baseUtcOffset: TimeSpan = args[1];
			const displayName: string = args[2];
			const standardDisplayName: string = args[3];
			const daylightDisplayName: string = args[4];
			const adjustmentRules: AdjustmentRule[] = args[5];
			return new TimeZoneInfo(
				id,
				baseUtcOffset,
				displayName,
				standardDisplayName,
				daylightDisplayName,
				adjustmentRules,
				false);
		} else if (args.length === 7) {
			const id: string = args[0];
			const baseUtcOffset: TimeSpan = args[1];
			const displayName: string = args[2];
			const standardDisplayName: string = args[3];
			const daylightDisplayName: string = args[4];
			const adjustmentRules: AdjustmentRule[] = args[5];
			const disableDaylightSavingTime: boolean = args[6];
			return new TimeZoneInfo(
				id,
				baseUtcOffset,
				displayName,
				standardDisplayName,
				daylightDisplayName,
				adjustmentRules,
				disableDaylightSavingTime);
		}
		throw new ArgumentOutOfRangeException('');
	}
	// ----- SECTION: internal instance utility methods ----------------*
	// assumes dateTime is in the current time zone's time
	private GetAdjustmentRuleForTime(dateTime: DateTime): AdjustmentRule {
		if (this.m_adjustmentRules == null || this.m_adjustmentRules.length === 0) {
			return null as any;
		}

		// Only check the whole-date portion of the dateTime -
		// This is because the AdjustmentRule DateStart & DateEnd are stored as
		// Date-only values {4/2/2006 - 10/28/2006} but actually represent the
		// time span {4/2/2006@00:00:00.00000 - 10/28/2006@23:59:59.99999}
		const date: DateTime = dateTime.Date;

		for (let i: int = 0; i < this.m_adjustmentRules.length; i++) {
			if (this.m_adjustmentRules[i].DateStart <= date && this.m_adjustmentRules[i].DateEnd >= date) {
				return this.m_adjustmentRules[i];
			}
		}

		return null as any;
	}



	// ----- SECTION: internal static utility methods ----------------*

	//
	// CheckDaylightSavingTimeNotSupported -
	//
	// Helper function to check if the current TimeZoneInformation struct does not support DST.  This
	// check returns true when the DaylightDate == StandardDate
	//
	// This check is only meant to be used for "Local".
	//
	private static CheckDaylightSavingTimeNotSupported(timeZone: TimeZoneInformation): boolean {
		return (timeZone.DaylightDate.Year == timeZone.StandardDate.Year
			&& timeZone.DaylightDate.Month == timeZone.StandardDate.Month
			&& timeZone.DaylightDate.DayOfWeek == timeZone.StandardDate.DayOfWeek
			&& timeZone.DaylightDate.Day == timeZone.StandardDate.Day
			&& timeZone.DaylightDate.Hour == timeZone.StandardDate.Hour
			&& timeZone.DaylightDate.Minute == timeZone.StandardDate.Minute
			&& timeZone.DaylightDate.Second == timeZone.StandardDate.Second
			&& timeZone.DaylightDate.Milliseconds == timeZone.StandardDate.Milliseconds);
	}


	//
	// ConvertUtcToTimeZone -
	//
	// Helper function that converts a dateTime from UTC into the destinationTimeZone
	//
	// * returns DateTime.MaxValue when the converted value is too large
	// * returns DateTime.MinValue when the converted value is too small
	//
	private static ConvertUtcToTimeZone(ticks: long, destinationTimeZone: TimeZoneInfo, isAmbiguousLocalDst: Out<boolean>): DateTime {
		let utcConverted: DateTime;
		let localConverted: DateTime;

		// utcConverted is used to calculate the UTC offset in the destinationTimeZone
		if (ticks > DateTime.MaxValue.Ticks) {
			utcConverted = DateTime.MaxValue;
		}
		else if (ticks < DateTime.MinValue.Ticks) {
			utcConverted = DateTime.MinValue;
		}
		else {
			utcConverted = new DateTime(ticks);
		}

		// verify the time is between MinValue and MaxValue in the new time zone
		const offset: TimeSpan = TimeZoneInfo.GetUtcOffsetFromUtc(utcConverted, destinationTimeZone, isAmbiguousLocalDst);
		ticks = ticks.add(offset.Ticks);

		if (ticks.greaterThan(DateTime.MaxValue.Ticks)) {
			localConverted = DateTime.MaxValue;
		}
		else if (ticks.lessThan(DateTime.MinValue.Ticks)) {
			localConverted = DateTime.MinValue;
		}
		else {
			localConverted = new DateTime(ticks);
		}
		return localConverted;
	}


	//
	// CreateAdjustmentRuleFromTimeZoneInformation-
	//
	// Converts a Win32Native.RegistryTimeZoneInformation (REG_TZI_FORMAT struct) to an AdjustmentRule
	private static CreateAdjustmentRuleFromTimeZoneInformation(timeZoneInformation: RegistryTimeZoneInformation,
		startDate: DateTime, endDate: DateTime, defaultBaseUtcOffset: int): AdjustmentRule {
		let rule: AdjustmentRule;
		let supportsDst: boolean = (timeZoneInformation.StandardDate.Month !== 0);

		if (!supportsDst) {
			if (timeZoneInformation.Bias === defaultBaseUtcOffset) {
				// this rule will not contain any information to be used to adjust dates. just ignore it
				return null as any;
			}

			return rule = AdjustmentRule.CreateAdjustmentRule(
				startDate,
				endDate,
				TimeSpan.Zero, // no daylight saving transition
				TransitionTime.CreateFixedDateRule(DateTime.MinValue, 1, 1),
				TransitionTime.CreateFixedDateRule(DateTime.MinValue.AddMilliseconds(1), 1, 1),
				new TimeSpan(0, defaultBaseUtcOffset - timeZoneInformation.Bias, 0));  // Bias delta is all what we need from this rule
		}

		//
		// Create an AdjustmentRule with TransitionTime objects
		//
		const daylightTransitionStart: Out<TransitionTime> = New.Out();
		if (!TimeZoneInfo.TransitionTimeFromTimeZoneInformation(timeZoneInformation, daylightTransitionStart, true /* start date */)) {
			return null as any;
		}

		const daylightTransitionEnd: Out<TransitionTime> = New.Out();
		if (!TimeZoneInfo.TransitionTimeFromTimeZoneInformation(timeZoneInformation, daylightTransitionEnd, false /* end date */)) {
			return null as any;
		}

		if (daylightTransitionStart.value.Equals(daylightTransitionEnd.value)) {
			// this happens when the time zone does support DST but the OS has DST disabled
			return null as any;
		}

		rule = AdjustmentRule.CreateAdjustmentRule(
			startDate,
			endDate,
			new TimeSpan(0, -timeZoneInformation.DaylightBias, 0),
			daylightTransitionStart.value,
			daylightTransitionEnd.value,
			new TimeSpan(0, defaultBaseUtcOffset - timeZoneInformation.Bias, 0));

		return rule;
	}


	//
	// FindIdFromTimeZoneInformation -
	//
	// Helper function that searches the registry for a time zone entry
	// that matches the TimeZoneInformation struct
	//
	private static FindIdFromTimeZoneInformation(timeZone: TimeZoneInformation, dstDisabled: Out<boolean>): string {
		dstDisabled.value = false;

		try {

			const key: RegistryKey = Registry.LocalMachine.OpenSubKey(TimeZoneInfo.c_timeZonesRegistryHive, false);

			if (key == null) {
				return null as any;
			}
			throw new Exception('düzelt');
			/* foreach(key.GetSubKeyNames(), (keyName: string) => {
				if (TimeZoneInfo.TryCompareTimeZoneInformationToRegistry(timeZone, keyName, dstDisabled)) {
					return keyName;
				}
			}); */
		}
		finally {
			//	PermissionSet.RevertAssert();
		}
		return null as any;
	}

	//
	// GetDaylightTime -
	//
	// Helper function that returns a DaylightTime from a year and AdjustmentRule
	//
	private static GetDaylightTime(year: int, rule: AdjustmentRule): DaylightTimeStruct {
		const delta: TimeSpan = rule.DaylightDelta;
		const startTime: DateTime = TimeZoneInfo.TransitionTimeToDateTime(year, rule.DaylightTransitionStart);
		const endTime: DateTime = TimeZoneInfo.TransitionTimeToDateTime(year, rule.DaylightTransitionEnd);
		return new DaylightTimeStruct(startTime, endTime, delta);
	}

	//
	// GetIsDaylightSavings -
	//
	// Helper function that checks if a given dateTime is in Daylight Saving Time (DST)
	// This function assumes the dateTime and AdjustmentRule are both in the same time zone
	//
	private static GetIsDaylightSavings(time: DateTime, rule: AdjustmentRule, daylightTime: DaylightTimeStruct, flags: TimeZoneInfoOptions): boolean {
		if (rule == null) {
			return false;
		}

		let startTime: DateTime;
		let endTime: DateTime;

		if (time.Kind == DateTimeKind.Local) {
			// startTime and endTime represent the period from either the start of DST to the end and ***includes*** the
			// potentially overlapped times
			startTime = rule.IsStartDateMarkerForBeginningOfYear() ? new DateTime(daylightTime.Start.Year, 1, 1, 0, 0, 0) : daylightTime.Start.Add(daylightTime.Delta);
			endTime = rule.IsEndDateMarkerForEndOfYear() ? new DateTime(daylightTime.End.Year + 1, 1, 1, 0, 0, 0).AddTicks(-1) : daylightTime.End;
		}
		else {
			// startTime and endTime represent the period from either the start of DST to the end and
			// ***does not include*** the potentially overlapped times
			//
			//         -=-=-=-=-=- Pacific Standard Time -=-=-=-=-=-=-
			//    April 2, 2006                            October 29, 2006
			// 2AM            3AM                        1AM              2AM
			// |      +1 hr     |                        |       -1 hr      |
			// | <invalid time> |                        | <ambiguous time> |
			//                  [========== DST ========>)
			//
			//        -=-=-=-=-=- Some Weird Time Zone -=-=-=-=-=-=-
			//    April 2, 2006                          October 29, 2006
			// 1AM              2AM                    2AM              3AM
			// |      -1 hr       |                      |       +1 hr      |
			// | <ambiguous time> |                      |  <invalid time>  |
			//                    [======== DST ========>)
			//
			const invalidAtStart: boolean = rule.DaylightDelta > TimeSpan.Zero;
			startTime = rule.IsStartDateMarkerForBeginningOfYear() ? new DateTime(daylightTime.Start.Year, 1, 1, 0, 0, 0) : daylightTime.Start.Add(invalidAtStart ? rule.DaylightDelta : TimeSpan.Zero); /* FUTURE: - rule.StandardDelta; */
			endTime = rule.IsEndDateMarkerForEndOfYear() ? new DateTime(daylightTime.End.Year + 1, 1, 1, 0, 0, 0).AddTicks(-1) : daylightTime.End.Add(invalidAtStart ? rule.DaylightDelta.Negate() : TimeSpan.Zero);
		}

		let isDst: boolean = TimeZoneInfo.CheckIsDst(startTime, time, endTime, false);

		// If this date was previously converted from a UTC date and we were able to detect that the local
		// DateTime would be ambiguous, this data is stored in the DateTime to resolve this ambiguity.
		if (isDst && time.Kind === DateTimeKind.Local) {
			// For normal time zones, the ambiguous hour is the last hour of daylight saving when you wind the
			// clock back. It is theoretically possible to have a positive delta, (which would really be daylight
			// reduction time), where you would have to wind the clock back in the begnning.
			if (TimeZoneInfo.GetIsAmbiguousTime(time, rule, daylightTime)) {
				isDst = time.IsAmbiguousDaylightSavingTime();
			}
		}

		return isDst;
	}


	//
	// GetIsDaylightSavingsFromUtc -
	//
	// Helper function that checks if a given dateTime is in Daylight Saving Time (DST)
	// This function assumes the dateTime is in UTC and AdjustmentRule is in a different time zone
	//
	private static GetIsDaylightSavingsFromUtc(time: DateTime, Year: int, utc: TimeSpan, rule: AdjustmentRule, isAmbiguousLocalDst: Out<boolean>, zone: TimeZoneInfo): boolean {
		isAmbiguousLocalDst.value = false;

		if (rule == null) {
			return false;
		}

		// Get the daylight changes for the year of the specified time.
		const offset: TimeSpan = utc.Add(rule.BaseUtcOffsetDelta); /* FUTURE: + rule.StandardDelta; */
		const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(Year, rule);

		// The start and end times represent the range of universal times that are in DST for that year.
		// Within that there is an ambiguous hour, usually right at the end, but at the beginning in
		// the unusual case of a negative daylight savings delta.
		// We need to handle the case if the current rule has daylight saving end by the end of year. If so, we need to check if next year starts with daylight saving on
		// and get the actual daylight saving end time. Here is example for such case:
		//      Converting the UTC datetime "12/31/2011 8:00:00 PM" to "(UTC+03:00) Moscow, St. Petersburg, Volgograd (RTZ 2)" zone.
		//      In 2011 the daylight saving will go through the end of the year. If we use the end of 2011 as the daylight saving end,
		//      that will fail the conversion because the UTC time +4 hours (3 hours for the zone UTC offset and 1 hour for daylight saving) will move us to the next year "1/1/2012 12:00 AM",
		//      checking against the end of 2011 will tell we are not in daylight saving which is wrong and the conversion will be off by one hour.
		// Note we handle the similar case when rule year start with daylight saving and previous year end with daylight saving.

		let ignoreYearAdjustment: boolean = false;
		let startTime: DateTime;
		if (rule.IsStartDateMarkerForBeginningOfYear() && daylightTime.Start.Year > DateTime.MinValue.Year) {
			const previousYearRule: AdjustmentRule = zone.GetAdjustmentRuleForTime(new DateTime(daylightTime.Start.Year - 1, 12, 31));
			if (previousYearRule != null && previousYearRule.IsEndDateMarkerForEndOfYear()) {
				const previousDaylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(daylightTime.Start.Year - 1, previousYearRule);
				startTime = previousDaylightTime.Start.Subtract(utc).Subtract(previousYearRule.BaseUtcOffsetDelta);
				ignoreYearAdjustment = true;
			} else {
				startTime = new DateTime(daylightTime.Start.Year, 1, 1, 0, 0, 0).Subtract(offset);
			}
		} else {
			startTime = daylightTime.Start.Subtract(offset);
		}

		let endTime: DateTime;
		if (rule.IsEndDateMarkerForEndOfYear() && daylightTime.End.Year < DateTime.MaxValue.Year) {
			const nextYearRule: AdjustmentRule = zone.GetAdjustmentRuleForTime(new DateTime(daylightTime.End.Year + 1, 1, 1));
			if (nextYearRule != null && nextYearRule.IsStartDateMarkerForBeginningOfYear()) {
				if (nextYearRule.IsEndDateMarkerForEndOfYear()) {// next year end with daylight saving on too
					endTime = new DateTime(daylightTime.End.Year + 1, 12, 31).Subtract(utc).Subtract(nextYearRule.BaseUtcOffsetDelta).Subtract(nextYearRule.DaylightDelta);
				} else {
					const nextdaylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(daylightTime.End.Year + 1, nextYearRule);
					endTime = nextdaylightTime.End.Subtract(utc).Subtract(nextYearRule.BaseUtcOffsetDelta).Subtract(nextYearRule.DaylightDelta);
				}
				ignoreYearAdjustment = true;
			} else {
				endTime = new DateTime(daylightTime.End.Year + 1, 1, 1, 0, 0, 0).AddTicks(-1).Subtract(offset).Subtract(rule.DaylightDelta);
			}
		} else {
			endTime = daylightTime.End.Subtract(offset).Subtract(rule.DaylightDelta);
		}

		let ambiguousStart: DateTime;
		let ambiguousEnd: DateTime;
		if (daylightTime.Delta.Ticks.greaterThan(0)) {
			ambiguousStart = endTime.Subtract(daylightTime.Delta);
			ambiguousEnd = endTime;
		} else {
			ambiguousStart = startTime;
			ambiguousEnd = startTime.Subtract(daylightTime.Delta);
		}

		const isDst: boolean = TimeZoneInfo.CheckIsDst(startTime, time, endTime, ignoreYearAdjustment);

		// See if the resulting local time becomes ambiguous. This must be captured here or the
		// DateTime will not be able to round-trip back to UTC accurately.
		if (isDst) {
			isAmbiguousLocalDst.value = (time >= ambiguousStart && time < ambiguousEnd);

			if (!isAmbiguousLocalDst.value && ambiguousStart.Year != ambiguousEnd.Year) {
				// there exists an extreme corner case where the start or end period is on a year boundary and
				// because of this the comparison above might have been performed for a year-early or a year-later
				// than it should have been.
				let ambiguousStartModified: DateTime;
				let ambiguousEndModified: DateTime;
				try {
					ambiguousStartModified = ambiguousStart.AddYears(1);
					ambiguousEndModified = ambiguousEnd.AddYears(1);
					isAmbiguousLocalDst.value = (time.greaterThanOrEqual(ambiguousStart) && time.lessThan(ambiguousEnd));
				}
				catch (ArgumentOutOfRangeException) { }

				if (!isAmbiguousLocalDst.value) {
					try {
						ambiguousStartModified = ambiguousStart.AddYears(-1);
						ambiguousEndModified = ambiguousEnd.AddYears(-1);
						isAmbiguousLocalDst.value = (time.greaterThanOrEqual(ambiguousStart) && time.lessThan(ambiguousEnd));
					}
					catch (ArgumentOutOfRangeException) { }
				}
			}
		}
		return isDst;
	}


	private static CheckIsDst(startTime: DateTime, time: DateTime, endTime: DateTime, ignoreYearAdjustment: boolean): boolean {
		let isDst: boolean;

		if (!ignoreYearAdjustment) {
			let startTimeYear: int = startTime.Year;
			let endTimeYear: int = endTime.Year;

			if (startTimeYear != endTimeYear) {
				endTime = endTime.AddYears(startTimeYear - endTimeYear);
			}

			let timeYear: int = time.Year;

			if (startTimeYear !== timeYear) {
				time = time.AddYears(startTimeYear - timeYear);
			}
		}

		if (startTime > endTime) {
			// In southern hemisphere, the daylight saving time starts later in the year, and ends in the beginning of next year.
			// Note, the summer in the southern hemisphere begins late in the year.
			isDst = (time < endTime || time >= startTime);
		}
		else {
			// In northern hemisphere, the daylight saving time starts in the middle of the year.
			isDst = (time >= startTime && time < endTime);
		}
		return isDst;
	}


	//
	// GetIsAmbiguousTime(DateTime dateTime, AdjustmentRule rule, DaylightTime daylightTime) -
	//
	// returns true when the dateTime falls into an ambiguous time range.
	// For example, in Pacific Standard Time on Sunday, October 29, 2006 time jumps from
	// 2AM to 1AM.  This means the timeline on Sunday proceeds as follows:
	// 12AM ... [1AM ... 1:59:59AM -> 1AM ... 1:59:59AM] 2AM ... 3AM ...
	//
	// In this example, any DateTime values that fall into the [1AM - 1:59:59AM] range
	// are ambiguous; as it is unclear if these times are in Daylight Saving Time.
	//
	private static GetIsAmbiguousTime(time: DateTime, rule: AdjustmentRule, daylightTime: DaylightTimeStruct): boolean {
		let isAmbiguous: boolean = false;
		if (rule == null || rule.DaylightDelta.Equals(TimeSpan.Zero)) {
			return isAmbiguous;
		}

		let startAmbiguousTime: DateTime;
		let endAmbiguousTime: DateTime;

		// if at DST start we transition forward in time then there is an ambiguous time range at the DST end
		if (rule.DaylightDelta > TimeSpan.Zero) {
			if (rule.IsEndDateMarkerForEndOfYear()) { // year end with daylight on so there is no ambiguous time
				return false;
			}
			startAmbiguousTime = daylightTime.End;
			endAmbiguousTime = daylightTime.End.Subtract(rule.DaylightDelta); /* FUTURE: + rule.StandardDelta; */
		}
		else {
			if (rule.IsStartDateMarkerForBeginningOfYear()) { // year start with daylight on so there is no ambiguous time
				return false;
			}
			startAmbiguousTime = daylightTime.Start;
			endAmbiguousTime = daylightTime.Start.Add(rule.DaylightDelta); /* FUTURE: - rule.StandardDelta; */
		}

		isAmbiguous = (time >= endAmbiguousTime && time < startAmbiguousTime);

		if (!isAmbiguous && startAmbiguousTime.Year != endAmbiguousTime.Year) {
			// there exists an extreme corner case where the start or end period is on a year boundary and
			// because of this the comparison above might have been performed for a year-early or a year-later
			// than it should have been.
			let startModifiedAmbiguousTime: DateTime;
			let endModifiedAmbiguousTime: DateTime;
			try {
				startModifiedAmbiguousTime = startAmbiguousTime.AddYears(1);
				endModifiedAmbiguousTime = endAmbiguousTime.AddYears(1);
				isAmbiguous = (time >= endModifiedAmbiguousTime && time < startModifiedAmbiguousTime);
			}
			catch (ArgumentOutOfRangeException) { }

			if (!isAmbiguous) {
				try {
					startModifiedAmbiguousTime = startAmbiguousTime.AddYears(-1);
					endModifiedAmbiguousTime = endAmbiguousTime.AddYears(-1);
					isAmbiguous = (time >= endModifiedAmbiguousTime && time < startModifiedAmbiguousTime);
				}
				catch (ArgumentOutOfRangeException) { }
			}
		}
		return isAmbiguous;
	}



	//
	// GetIsInvalidTime -
	//
	// Helper function that checks if a given DateTime is in an invalid time ("time hole")
	// A "time hole" occurs at a DST transition point when time jumps forward;
	// For example, in Pacific Standard Time on Sunday, April 2, 2006 time jumps from
	// 1:59:59.9999999 to 3AM.  The time range 2AM to 2:59:59.9999999AM is the "time hole".
	// A "time hole" is not limited to only occurring at the start of DST, and may occur at
	// the end of DST as well.
	//
	private static GetIsInvalidTime(time: DateTime, rule: AdjustmentRule, daylightTime: DaylightTimeStruct): boolean {
		let isInvalid: boolean = false;
		if (rule == null || rule.DaylightDelta === TimeSpan.Zero) {
			return isInvalid;
		}

		let startInvalidTime: DateTime;
		let endInvalidTime: DateTime;

		// if at DST start we transition forward in time then there is an ambiguous time range at the DST end
		if (rule.DaylightDelta < TimeSpan.Zero) {
			// if the year ends with daylight saving on then there cannot be any time-hole's in that year.
			if (rule.IsEndDateMarkerForEndOfYear())
				return false;

			startInvalidTime = daylightTime.End;
			endInvalidTime = daylightTime.End.Subtract(rule.DaylightDelta); /* FUTURE: + rule.StandardDelta; */
		}
		else {
			// if the year starts with daylight saving on then there cannot be any time-hole's in that year.
			if (rule.IsStartDateMarkerForBeginningOfYear())
				return false;

			startInvalidTime = daylightTime.Start;
			endInvalidTime = daylightTime.Start.Add(rule.DaylightDelta); /* FUTURE: - rule.StandardDelta; */
		}

		isInvalid = (time >= startInvalidTime && time < endInvalidTime);

		if (!isInvalid && startInvalidTime.Year != endInvalidTime.Year) {
			// there exists an extreme corner case where the start or end period is on a year boundary and
			// because of this the comparison above might have been performed for a year-early or a year-later
			// than it should have been.
			let startModifiedInvalidTime: DateTime;
			let endModifiedInvalidTime: DateTime;
			try {
				startModifiedInvalidTime = startInvalidTime.AddYears(1);
				endModifiedInvalidTime = endInvalidTime.AddYears(1);
				isInvalid = (time >= startModifiedInvalidTime && time < endModifiedInvalidTime);
			}
			catch (ArgumentOutOfRangeException) { }

			if (!isInvalid) {
				try {
					startModifiedInvalidTime = startInvalidTime.AddYears(-1);
					endModifiedInvalidTime = endInvalidTime.AddYears(-1);
					isInvalid = (time >= startModifiedInvalidTime && time < endModifiedInvalidTime);
				}
				catch (ArgumentOutOfRangeException) { }
			}
		}
		return isInvalid;
	}

	//
	// GetLocalTimeZone -
	//
	// Helper function for retrieving the local system time zone.
	//
	// returns a new TimeZoneInfo instance
	//
	// may throw COMException, TimeZoneNotFoundException, InvalidTimeZoneException
	//
	// assumes cachedData lock is taken
	//

	private static GetLocalTimeZone(cachedData: CachedData): TimeZoneInfo {

		let id: string = null as any;

		//
		// Try using the "kernel32!GetDynamicTimeZoneInformation" API to get the "id"
		//
		const dynamicTimeZoneInformation: Out<DynamicTimeZoneInformation> = New.Out();

		// call kernel32!GetDynamicTimeZoneInformation...
		let result: long = UnsafeNativeMethods.GetDynamicTimeZoneInformation(dynamicTimeZoneInformation);
		if (result == Win32Native.TIME_ZONE_ID_INVALID) {
			// return a dummy entry
			return TimeZoneInfo.CreateCustomTimeZone(TimeZoneInfo.c_localId, TimeSpan.Zero, TimeZoneInfo.c_localId, TimeZoneInfo.c_localId);
		}

		const timeZoneInformation: TimeZoneInformation = new TimeZoneInformation(dynamicTimeZoneInformation.value);

		let dstDisabled: Out<boolean> = New.Out(dynamicTimeZoneInformation.value.DynamicDaylightTimeDisabled);

		// check to see if we can use the key name returned from the API call
		if (!TString.IsNullOrEmpty(dynamicTimeZoneInformation.value.TimeZoneKeyName)) {
			let zone: Out<TimeZoneInfo> = New.Out();
			let ex: Out<Exception> = New.Out();

			if (TimeZoneInfo.TryGetTimeZone(dynamicTimeZoneInformation.value.TimeZoneKeyName, dstDisabled.value, zone, ex, cachedData) === TimeZoneInfoResult.Success) {
				// successfully loaded the time zone from the registry
				return zone.value;
			}
		}

		// the key name was not returned or it pointed to a bogus entry - search for the entry ourselves
		id = TimeZoneInfo.FindIdFromTimeZoneInformation(timeZoneInformation, dstDisabled);

		if (id != null) {
			const zone: Out<TimeZoneInfo> = New.Out();
			const ex: Out<Exception> = New.Out();
			if (TimeZoneInfo.TryGetTimeZone(id, dstDisabled.value, zone, ex, cachedData) === TimeZoneInfoResult.Success) {
				// successfully loaded the time zone from the registry
				return zone.value;
			}
		}

		// We could not find the data in the registry.  Fall back to using
		// the data from the Win32 API
		return TimeZoneInfo.GetLocalTimeZoneFromWin32Data(timeZoneInformation, dstDisabled.value);

	}

	//
	// GetLocalTimeZoneFromWin32Data -
	//
	// Helper function used by 'GetLocalTimeZone()' - this function wraps a bunch of
	// try/catch logic for handling the TimeZoneInfo private constructor that takes
	// a Win32Native.TimeZoneInformation structure.
	//
	public static GetLocalTimeZoneFromWin32Data(timeZoneInformation: TimeZoneInformation, dstDisabled: boolean): TimeZoneInfo {
		// first try to create the TimeZoneInfo with the original 'dstDisabled' flag
		try {
			return new TimeZoneInfo(timeZoneInformation, dstDisabled);
		}
		catch (ArgumentException) { }


		// if 'dstDisabled' was false then try passing in 'true' as a last ditch effort
		if (!dstDisabled) {
			try {
				return new TimeZoneInfo(timeZoneInformation, true);
			}
			catch (ArgumentException) { }

		}

		// the data returned from Windows is completely bogus; return a dummy entry
		return TimeZoneInfo.CreateCustomTimeZone(TimeZoneInfo.c_localId, TimeSpan.Zero, TimeZoneInfo.c_localId, TimeZoneInfo.c_localId);
	}



	//
	// FindSystemTimeZoneById -
	//
	// Helper function for retrieving a TimeZoneInfo object by <time_zone_name>.
	// This function wraps the logic necessary to keep the private
	// SystemTimeZones cache in working order
	//
	// This function will either return a valid TimeZoneInfo instance or
	// it will throw 'InvalidTimeZoneException' / 'TimeZoneNotFoundException'.
	//
	public static FindSystemTimeZoneById(id: string): TimeZoneInfo {

		// Special case for Utc as it will not exist in the dictionary with the rest
		// of the system time zones.  There is no need to do this check for Local.Id
		// since Local is a real time zone that exists in the dictionary cache
		if (TString.Compare(id, TimeZoneInfo.c_utcId, StringComparison.OrdinalIgnoreCase) == 0) {
			return TimeZoneInfo.Utc;
		}

		if (id == null) {
			throw new ArgumentNullException("id");
		}
		else if (id.length == 0 || id.length > TimeZoneInfo.c_maxKeyLength || id.contains("\0")) {
			throw new TimeZoneNotFoundException(Environment.GetResourceString("TimeZoneNotFound_MissingRegistryData", id));
		}

		let value: Out<TimeZoneInfo> = New.Out();
		let e: Out<Exception> = New.Out();

		let result: TimeZoneInfoResult;

		let cachedData: CachedData = TimeZoneInfo.s_cachedData;

		//lock(cachedData) {
		result = TimeZoneInfo.TryGetTimeZone(id, false, value, e, cachedData);
		//}

		if (result === TimeZoneInfoResult.Success) {
			return value.value;
		}
		else if (result === TimeZoneInfoResult.InvalidTimeZoneException) {
			throw new InvalidTimeZoneException(Environment.GetResourceString("InvalidTimeZone_InvalidRegistryData", id), e);
		}
		else if (result === TimeZoneInfoResult.SecurityException) {
			throw new SecurityException(Environment.GetResourceString("Security_CannotReadRegistryData", id), e);
		}
		else {
			throw new TimeZoneNotFoundException(Environment.GetResourceString("TimeZoneNotFound_MissingRegistryData", id), e);
		}
	}
	//#endif // FEATURE_WIN32_REGISTRY


	//
	// GetUtcOffset -
	//
	// Helper function that calculates the UTC offset for a dateTime in a timeZone.
	// This function assumes that the dateTime is already converted into the timeZone.
	//
	private static GetUtcOffset(time: DateTime, zone: TimeZoneInfo, flags: TimeZoneInfoOptions): TimeSpan {
		let baseOffset: TimeSpan = zone.BaseUtcOffset;
		let rule: AdjustmentRule = zone.GetAdjustmentRuleForTime(time);

		if (rule != null) {
			baseOffset = baseOffset.Add(rule.BaseUtcOffsetDelta);
			if (rule.HasDaylightSaving) {
				const daylightTime: DaylightTimeStruct = TimeZoneInfo.GetDaylightTime(time.Year, rule);
				let isDaylightSavings: boolean = TimeZoneInfo.GetIsDaylightSavings(time, rule, daylightTime, flags);
				baseOffset = baseOffset.Add(isDaylightSavings ? rule.DaylightDelta : TimeSpan.Zero /* FUTURE: rule.StandardDelta */);
			}
		}

		return baseOffset;
	}


	//
	// GetUtcOffsetFromUtc -
	//
	// Helper function that calculates the UTC offset for a UTC-dateTime in a timeZone.
	// This function assumes that the dateTime is represented in UTC and has *not*
	// already been converted into the timeZone.
	//
	public static GetUtcOffsetFromUtc(time: DateTime, zone: TimeZoneInfo): TimeSpan;
	public static GetUtcOffsetFromUtc(time: DateTime, zone: TimeZoneInfo, isDaylightSavings: Out<boolean>): TimeSpan;
	public static /* internal */  GetUtcOffsetFromUtc(time: DateTime, zone: TimeZoneInfo, isDaylightSavings: Out<boolean>, isAmbiguousLocalDst: Out<boolean>): TimeSpan;
	public static GetUtcOffsetFromUtc(...args: any[]): TimeSpan {
		if (args.length === 2) {
			const time: DateTime = args[0];
			const zone: TimeZoneInfo = args[1];
			const isDaylightSavings: Out<boolean> = New.Out();
			return TimeZoneInfo.GetUtcOffsetFromUtc(time, zone, isDaylightSavings);
		} else if (args.length === 3) {
			const time: DateTime = args[0];
			const zone: TimeZoneInfo = args[1];
			const isDaylightSavings: Out<boolean> = args[2];
			let isAmbiguousLocalDst: Out<boolean> = New.Out();
			return TimeZoneInfo.GetUtcOffsetFromUtc(time, zone, isDaylightSavings, isAmbiguousLocalDst);
		} else if (args.length === 4) {
			const time: DateTime = args[0];
			const zone: TimeZoneInfo = args[1];
			const isDaylightSavings: Out<boolean> = args[2];
			const isAmbiguousLocalDst: Out<boolean> = args[3]
			isDaylightSavings.value = false;
			isAmbiguousLocalDst.value = false;
			let baseOffset: TimeSpan = zone.BaseUtcOffset;
			let year: int;
			let rule: AdjustmentRule;

			if (time > TimeZoneInfo.s_maxDateOnly) {
				rule = zone.GetAdjustmentRuleForTime(DateTime.MaxValue);
				year = 9999;
			}
			else if (time < TimeZoneInfo.s_minDateOnly) {
				rule = zone.GetAdjustmentRuleForTime(DateTime.MinValue);
				year = 1;
			}
			else {
				let targetTime: DateTime = time.Add(baseOffset);

				// As we get the associated rule using the adjusted targetTime, we should use the adjusted year (targetTime.Year) too as after adding the baseOffset,
				// sometimes the year value can change if the input datetime was very close to the beginning or the end of the year. Examples of such cases:
				//      “Libya Standard Time” when used with the date 2011-12-31T23:59:59.9999999Z
				//      "W. Australia Standard Time" used with date 2005-12-31T23:59:00.0000000Z
				year = targetTime.Year;

				rule = zone.GetAdjustmentRuleForTime(targetTime);
			}

			if (rule != null) {
				baseOffset = baseOffset.Add(rule.BaseUtcOffsetDelta);
				if (rule.HasDaylightSaving) {
					isDaylightSavings.value = TimeZoneInfo.GetIsDaylightSavingsFromUtc(time, year, zone.m_baseUtcOffset, rule, isAmbiguousLocalDst, zone);
					baseOffset = baseOffset.Add(isDaylightSavings ? rule.DaylightDelta : TimeSpan.Zero /* FUTURE: rule.StandardDelta */);
				}
			}

			return baseOffset;
		}
		throw new ArgumentOutOfRangeException('');
	}

	// DateTime.Now fast path that avoids allocating an historically accurate TimeZoneInfo.Local and just creates a 1-year (current year) accurate time zone
	public static /* internal */  GetDateTimeNowUtcOffsetFromUtc(time: DateTime, isAmbiguousLocalDst: Out<boolean>): TimeSpan {
		let isDaylightSavings: Out<boolean> = New.Out(false);

		isAmbiguousLocalDst.value = false;
		let baseOffset: TimeSpan;
		let timeYear: int = time.Year;

		const match: OffsetAndRule = TimeZoneInfo.s_cachedData.GetOneYearLocalFromUtc(timeYear);
		baseOffset = match.offset;

		if (match.rule != null) {
			baseOffset = baseOffset.Add(match.rule.BaseUtcOffsetDelta);
			if (match.rule.HasDaylightSaving) {
				isDaylightSavings.value = TimeZoneInfo.GetIsDaylightSavingsFromUtc(time, timeYear, match.offset, match.rule, isAmbiguousLocalDst, TimeZoneInfo.Local);
				baseOffset = baseOffset.Add(isDaylightSavings ? match.rule.DaylightDelta : TimeSpan.Zero /* FUTURE: rule.StandardDelta */);
			}
		}
		return baseOffset;

	}




	//
	// TransitionTimeFromTimeZoneInformation -
	//
	// Converts a Win32Native.RegistryTimeZoneInformation (REG_TZI_FORMAT struct) to a TransitionTime
	//
	// * when the argument 'readStart' is true the corresponding daylightTransitionTimeStart field is read
	// * when the argument 'readStart' is false the corresponding dayightTransitionTimeEnd field is read
	//
	private static TransitionTimeFromTimeZoneInformation(timeZoneInformation: RegistryTimeZoneInformation, transitionTime: Out<TransitionTime>,
		readStartDate: boolean): boolean {
		//
		// SYSTEMTIME -
		//
		// If the time zone does not support daylight saving time or if the caller needs
		// to disable daylight saving time, the wMonth member in the SYSTEMTIME structure
		// must be zero. If this date is specified, the DaylightDate value in the
		// TIME_ZONE_INFORMATION structure must also be specified. Otherwise, the system
		// assumes the time zone data is invalid and no changes will be applied.
		//
		const supportsDst: boolean = (timeZoneInformation.StandardDate.Month !== 0);

		if (!supportsDst) {
			transitionTime.value = new TransitionTime();
			return false;
		}

		//
		// SYSTEMTIME -
		//
		// * FixedDateRule -
		//   If the Year member is not zero, the transition date is absolute; it will only occur one time
		//
		// * FloatingDateRule -
		//   To select the correct day in the month, set the Year member to zero, the Hour and Minute
		//   members to the transition time, the DayOfWeek member to the appropriate weekday, and the
		//   Day member to indicate the occurence of the day of the week within the month (first through fifth).
		//
		//   Using this notation, specify the 2:00a.m. on the first Sunday in April as follows:
		//   Hour      = 2,
		//   Month     = 4,
		//   DayOfWeek = 0,
		//   Day       = 1.
		//
		//   Specify 2:00a.m. on the last Thursday in October as follows:
		//   Hour      = 2,
		//   Month     = 10,
		//   DayOfWeek = 4,
		//   Day       = 5.
		//
		if (readStartDate) {
			//
			// read the "daylightTransitionStart"
			//
			if (timeZoneInformation.DaylightDate.Year === 0) {
				transitionTime.value = TransitionTime.CreateFloatingDateRule(
					new DateTime(1,    /* year  */
						1,    /* month */
						1,    /* day   */
						timeZoneInformation.DaylightDate.Hour,
						timeZoneInformation.DaylightDate.Minute,
						timeZoneInformation.DaylightDate.Second,
						timeZoneInformation.DaylightDate.Milliseconds),
					timeZoneInformation.DaylightDate.Month,
					timeZoneInformation.DaylightDate.Day,   /* Week 1-5 */
					timeZoneInformation.DaylightDate.DayOfWeek);
			}
			else {
				transitionTime.value = TransitionTime.CreateFixedDateRule(
					new DateTime(1,    /* year  */
						1,    /* month */
						1,    /* day   */
						timeZoneInformation.DaylightDate.Hour,
						timeZoneInformation.DaylightDate.Minute,
						timeZoneInformation.DaylightDate.Second,
						timeZoneInformation.DaylightDate.Milliseconds),
					timeZoneInformation.DaylightDate.Month,
					timeZoneInformation.DaylightDate.Day);
			}
		}
		else {
			//
			// read the "daylightTransitionEnd"
			//
			if (timeZoneInformation.StandardDate.Year == 0) {
				transitionTime.value = TransitionTime.CreateFloatingDateRule(
					new DateTime(1,    /* year  */
						1,    /* month */
						1,    /* day   */
						timeZoneInformation.StandardDate.Hour,
						timeZoneInformation.StandardDate.Minute,
						timeZoneInformation.StandardDate.Second,
						timeZoneInformation.StandardDate.Milliseconds),
					timeZoneInformation.StandardDate.Month,
					timeZoneInformation.StandardDate.Day,   /* Week 1-5 */
					timeZoneInformation.StandardDate.DayOfWeek);
			}
			else {
				transitionTime.value = TransitionTime.CreateFixedDateRule(
					new DateTime(1,    /* year  */
						1,    /* month */
						1,    /* day   */
						timeZoneInformation.StandardDate.Hour,
						timeZoneInformation.StandardDate.Minute,
						timeZoneInformation.StandardDate.Second,
						timeZoneInformation.StandardDate.Milliseconds),
					timeZoneInformation.StandardDate.Month,
					timeZoneInformation.StandardDate.Day);
			}
		}

		return true;
	}

	//
	// TransitionTimeToDateTime -
	//
	// Helper function that converts a year and TransitionTime into a DateTime
	//
	private static TransitionTimeToDateTime(year: int, transitionTime: TransitionTime): DateTime {
		let value: DateTime;
		let timeOfDay: DateTime = transitionTime.TimeOfDay;

		if (transitionTime.IsFixedDateRule) {
			// create a DateTime from the passed in year and the properties on the transitionTime

			// if the day is out of range for the month then use the last day of the month
			const day: int = DateTime.DaysInMonth(year, transitionTime.Month);

			value = new DateTime(year, transitionTime.Month, (day < transitionTime.Day) ? day : transitionTime.Day,
				timeOfDay.Hour, timeOfDay.Minute, timeOfDay.Second, timeOfDay.Millisecond);
		}
		else {
			if (transitionTime.Week <= 4) {
				//
				// Get the (transitionTime.Week)th Sunday.
				//
				value = new DateTime(year, transitionTime.Month, 1,
					timeOfDay.Hour, timeOfDay.Minute, timeOfDay.Second, timeOfDay.Millisecond);

				const dayOfWeek: int = value.DayOfWeek;
				let delta: int = transitionTime.DayOfWeek - dayOfWeek;
				if (delta < 0) {
					delta += 7;
				}
				delta += 7 * (transitionTime.Week - 1);

				if (delta > 0) {
					value = value.AddDays(Convert.ToDouble(delta));
				}
			}
			else {
				//
				// If TransitionWeek is greater than 4, we will get the last week.
				//
				const daysInMonth: int = DateTime.DaysInMonth(year, transitionTime.Month);
				value = new DateTime(year, transitionTime.Month, daysInMonth,
					timeOfDay.Hour, timeOfDay.Minute, timeOfDay.Second, timeOfDay.Millisecond);

				// This is the day of week for the last day of the month.
				const dayOfWeek: int = value.DayOfWeek;
				let delta: int = dayOfWeek - transitionTime.DayOfWeek;
				if (delta < 0) {
					delta += 7;
				}

				if (delta > 0) {
					value = value.AddDays(Convert.ToDouble(delta).neg());
				}
			}
		}
		return value;
	}


	private static TryCreateAdjustmentRules(id: string, defaultTimeZoneInformation: RegistryTimeZoneInformation, rules: Out<AdjustmentRule[]>, e: Out<Exception>, defaultBaseUtcOffset: int): boolean {
		e.value = null as any;

		const rule: AdjustmentRule = TimeZoneInfo.CreateAdjustmentRuleFromTimeZoneInformation(defaultTimeZoneInformation, DateTime.MinValue.Date, DateTime.MaxValue.Date, defaultBaseUtcOffset);

		if (rule == null) {
			rules.value = null as any;
		}
		else {
			rules.value = new AdjustmentRule[1];
			rules.value[0] = rule;
		}

		return true;

	}

	//
	// TryCompareStandardDate -
	//
	// Helper function that compares the StandardBias and StandardDate portion a
	// TimeZoneInformation struct to a time zone registry entry
	//
	private static TryCompareStandardDate(timeZone: TimeZoneInformation, registryTimeZoneInfo: RegistryTimeZoneInformation): boolean {
		return timeZone.Bias === registryTimeZoneInfo.Bias
			&& timeZone.StandardBias === registryTimeZoneInfo.StandardBias
			&& timeZone.StandardDate.Year === registryTimeZoneInfo.StandardDate.Year
			&& timeZone.StandardDate.Month === registryTimeZoneInfo.StandardDate.Month
			&& timeZone.StandardDate.DayOfWeek === registryTimeZoneInfo.StandardDate.DayOfWeek
			&& timeZone.StandardDate.Day === registryTimeZoneInfo.StandardDate.Day
			&& timeZone.StandardDate.Hour === registryTimeZoneInfo.StandardDate.Hour
			&& timeZone.StandardDate.Minute === registryTimeZoneInfo.StandardDate.Minute
			&& timeZone.StandardDate.Second === registryTimeZoneInfo.StandardDate.Second
			&& timeZone.StandardDate.Milliseconds === registryTimeZoneInfo.StandardDate.Milliseconds;
	}

	//
	// TryCompareTimeZoneInformationToRegistry -
	//
	// Helper function that compares a TimeZoneInformation struct to a time zone registry entry
	//
	private static TryCompareTimeZoneInformationToRegistry(timeZone: TimeZoneInformation, id: string, dstDisabled: Out<boolean>): boolean {

		dstDisabled.value = false;
		try {

			const key = TimeZones[id];
			if (key == null) {
				return false;
			}
			const registryTimeZoneInfo: RegistryTimeZoneInformation = new RegistryTimeZoneInformation(key.TZI);

			//
			// first compare the bias and standard date information between the data from the Win32 API
			// and the data from the registry...
			//
			let result: boolean = TimeZoneInfo.TryCompareStandardDate(timeZone, registryTimeZoneInfo);

			if (!result) {
				return false;
			}

			result = dstDisabled.value || TimeZoneInfo.CheckDaylightSavingTimeNotSupported(timeZone)
				//
				// since Daylight Saving Time is not "disabled", do a straight comparision between
				// the Win32 API data and the registry data ...
				//
				|| (timeZone.DaylightBias === registryTimeZoneInfo.DaylightBias
					&& timeZone.DaylightDate.Year === registryTimeZoneInfo.DaylightDate.Year
					&& timeZone.DaylightDate.Month === registryTimeZoneInfo.DaylightDate.Month
					&& timeZone.DaylightDate.DayOfWeek === registryTimeZoneInfo.DaylightDate.DayOfWeek
					&& timeZone.DaylightDate.Day === registryTimeZoneInfo.DaylightDate.Day
					&& timeZone.DaylightDate.Hour === registryTimeZoneInfo.DaylightDate.Hour
					&& timeZone.DaylightDate.Minute === registryTimeZoneInfo.DaylightDate.Minute
					&& timeZone.DaylightDate.Second === registryTimeZoneInfo.DaylightDate.Second
					&& timeZone.DaylightDate.Milliseconds === registryTimeZoneInfo.DaylightDate.Milliseconds);

			// Finally compare the "StandardName" string value...
			//
			// we do not compare "DaylightName" as this TimeZoneInformation field may contain
			// either "StandardName" or "DaylightName" depending on the time of year and current machine settings
			//
			if (result) {
				const registryStandardName: string = key.Std;/* GetValue(TimeZoneInfo.c_standardValue, TString.Empty, RegistryValueOptions.None) as string */;
				result = TString.Compare(registryStandardName, timeZone.StandardName, StringComparison.Ordinal) === 0;
			}
			return result;

		}
		finally {
			//PermissionSet.RevertAssert();
		}
	}
	//#endif // FEATURE_WIN32_REGISTRY

	//
	// TryGetLocalizedNamesByRegistryKey -
	//
	// Helper function for retrieving the DisplayName, StandardName, and DaylightName from the registry
	//
	// The function first checks the MUI_ key-values, and if they exist, it loads the strings from the MUI
	// resource dll(s).  When the keys do not exist, the function falls back to reading from the standard
	// key-values
	//
	// This method expects that its caller has already Asserted RegistryPermission.Read
	//
	private static TryGetLocalizedNamesByRegistryKey(key: RegistryKey, displayName: Out<string>, standardName: Out<string>, daylightName: Out<string>): boolean {
		displayName.value = TString.Empty;
		standardName.value = TString.Empty;
		daylightName.value = TString.Empty;

		// read the MUI_ registry keys
		const displayNameMuiResource: string = key.GetValue(TimeZoneInfo.c_muiDisplayValue, TString.Empty);
		const standardNameMuiResource: string = key.GetValue(TimeZoneInfo.c_muiStandardValue, TString.Empty);
		const daylightNameMuiResource: string = key.GetValue(TimeZoneInfo.c_muiDaylightValue, TString.Empty);



		// fallback to using the standard registry keys
		if (TString.IsNullOrEmpty(displayName.value)) {
			displayName.value = key.GetValue(TimeZoneInfo.c_displayValue, TString.Empty);
		}
		if (TString.IsNullOrEmpty(standardName.value)) {
			standardName.value = key.GetValue(TimeZoneInfo.c_standardValue, TString.Empty);
		}
		if (TString.IsNullOrEmpty(daylightName.value)) {
			daylightName.value = key.GetValue(TimeZoneInfo.c_daylightValue, String.Empty);
		}

		return true;
	}

	private static TryGetTimeZoneByRegistryKey(id: string, value: Out<TimeZoneInfo>, e: Out<Exception>): TimeZoneInfoResult {
		e.value = null as any;
		// TODO:
		try {


			const key = TimeZones[id];

			if (key == null) {
				value.value = null as any;
				return TimeZoneInfoResult.TimeZoneNotFoundException;
			}

			let defaultTimeZoneInformation: RegistryTimeZoneInformation = new RegistryTimeZoneInformation(null as any);
			const regValue = key.TZI;
			if (regValue == null) {
				// the registry value could not be cast to a byte array
				value.value = null as any;
				return TimeZoneInfoResult.InvalidTimeZoneException;
			}
			defaultTimeZoneInformation = new RegistryTimeZoneInformation(regValue);

			let adjustmentRules: Out<AdjustmentRule[]> = New.Out();
			if (!TimeZoneInfo.TryCreateAdjustmentRules(id, defaultTimeZoneInformation, adjustmentRules, e, defaultTimeZoneInformation.Bias)) {
				value.value = null as any;
				return TimeZoneInfoResult.InvalidTimeZoneException;
			}

			const displayName: Out<string> = New.Out('');
			const standardName: Out<string> = New.Out('');
			const daylightName: Out<string> = New.Out('');

			if (!TimeZoneInfo.TryGetLocalizedNamesByRegistryKey(key, displayName, standardName, daylightName)) {
				value.value = null as any;
				return TimeZoneInfoResult.InvalidTimeZoneException;
			}

			try {
				value.value = new TimeZoneInfo(
					id,
					new TimeSpan(0, -(defaultTimeZoneInformation.Bias), 0),
					displayName.value,
					standardName.value,
					daylightName.value,
					adjustmentRules.value,
					false);

				return TimeZoneInfoResult.Success;
			}
			catch (ex: any) {
				// TimeZoneInfo constructor can throw ArgumentException and InvalidTimeZoneException
				value.value = null as any;
				e.value = ex;
				return TimeZoneInfoResult.InvalidTimeZoneException;
			}

		}
		finally {
		}
	}

	//
	// TryGetTimeZone -
	//
	// Helper function for retrieving a TimeZoneInfo object by <time_zone_name>.
	//
	// This function may return null.
	//
	// assumes cachedData lock is taken
	//
	private static TryGetTimeZone(id: string, dstDisabled: boolean, value: Out<TimeZoneInfo>, e: Out<Exception>, cachedData: CachedData): TimeZoneInfoResult {
		let result: TimeZoneInfoResult = TimeZoneInfoResult.Success;
		e.value = null as any;
		let match: Out<TimeZoneInfo> = New.Out();

		// check the cache
		if (cachedData.m_systemTimeZones != null) {
			if (cachedData.m_systemTimeZones.TryGetValue(id, match)) {
				if (dstDisabled && match.value.m_supportsDaylightSavingTime) {
					// we found a cache hit but we want a time zone without DST and this one has DST data
					value.value = TimeZoneInfo.CreateCustomTimeZone(match.value.m_id, match.value.m_baseUtcOffset, match.value.m_displayName, match.value.m_standardDisplayName);
				}
				else {
					value.value = new TimeZoneInfo(match.value.m_id, match.value.m_baseUtcOffset, match.value.m_displayName, match.value.m_standardDisplayName,
						match.value.m_daylightDisplayName, match.value.m_adjustmentRules, false);
				}
				return result;
			}
		}

		// fall back to reading from the local machine
		// when the cache is not fully populated
		if (!cachedData.m_allSystemTimeZonesRead) {
			result = TimeZoneInfo.TryGetTimeZoneByRegistryKey(id, match, e);
			if (result == TimeZoneInfoResult.Success) {
				if (cachedData.m_systemTimeZones == null)
					cachedData.m_systemTimeZones = new Dictionary<string, TimeZoneInfo>();

				cachedData.m_systemTimeZones.Add(id, match.value);

				if (dstDisabled && match.value.m_supportsDaylightSavingTime) {
					// we found a cache hit but we want a time zone without DST and this one has DST data
					value.value = TimeZoneInfo.CreateCustomTimeZone(match.value.m_id, match.value.m_baseUtcOffset, match.value.m_displayName, match.value.m_standardDisplayName);
				}
				else {
					value.value = new TimeZoneInfo(match.value.m_id, match.value.m_baseUtcOffset, match.value.m_displayName, match.value.m_standardDisplayName,
						match.value.m_daylightDisplayName, match.value.m_adjustmentRules, false);
				}
			}
			else {
				value.value = null as any;
			}
		}
		else {
			result = TimeZoneInfoResult.TimeZoneNotFoundException;
			value.value = null as any;
		}

		return result;
	}
	//#endif // FEATURE_WIN32_REGISTRY


	//
	// UtcOffsetOutOfRange -
	//
	// Helper function that validates the TimeSpan is within +/- 14.0 hours
	//
	public static /* internal */  UtcOffsetOutOfRange(offset: TimeSpan): boolean {
		return (offset.TotalHours.lessThan(-14.0) || offset.TotalHours.greaterThan(14.0));
	}


	//
	// ValidateTimeZoneInfo -
	//
	// Helper function that performs all of the validation checks for the
	// factory methods and deserialization callback
	//
	// returns a Boolean indicating whether the AdjustmentRule[] supports DST
	//
	private static ValidateTimeZoneInfo(
		id: string,
		baseUtcOffset: TimeSpan,
		adjustmentRules: AdjustmentRule[],
		adjustmentRulesSupportDst: Out<boolean>): void {

		if (id == null) {
			throw new ArgumentNullException("id");
		}

		if (id.length === 0) {
			throw new ArgumentException(Environment.GetResourceString("Argument_InvalidId", id), "id");
		}

		if (TimeZoneInfo.UtcOffsetOutOfRange(baseUtcOffset)) {

			throw new ArgumentOutOfRangeException("baseUtcOffset", Environment.GetResourceString("ArgumentOutOfRange_UtcOffset"));
		}

		if (baseUtcOffset.Ticks.mod(TimeSpan.TicksPerMinute).notEquals(0)) {
			throw new ArgumentException(Environment.GetResourceString("Argument_TimeSpanHasSeconds"), "baseUtcOffset");
		}
		//Contract.EndContractBlock();

		adjustmentRulesSupportDst.value = false;

		//
		// "adjustmentRules" can either be null or a valid array of AdjustmentRule objects.
		// A valid array is one that does not contain any null elements and all elements
		// are sorted in chronological order
		//

		if (adjustmentRules != null && adjustmentRules.length !== 0) {
			adjustmentRulesSupportDst.value = true;
			let prev: AdjustmentRule = null as any;
			let current: AdjustmentRule = null as any;
			for (let i: int = 0; i < adjustmentRules.length; i++) {
				prev = current;
				current = adjustmentRules[i];

				if (current == null) {
					throw new InvalidTimeZoneException(Environment.GetResourceString("Argument_AdjustmentRulesNoNulls"));
				}

				if (TimeZoneInfo.UtcOffsetOutOfRange(baseUtcOffset.Add(current.DaylightDelta))) {
					throw new InvalidTimeZoneException(Environment.GetResourceString("ArgumentOutOfRange_UtcOffsetAndDaylightDelta"));
				}

				if (prev != null && current.DateStart.lessThanOrEqual(prev.DateEnd)) {
					// verify the rules are in chronological order and the DateStart/DateEnd do not overlap
					throw new InvalidTimeZoneException(Environment.GetResourceString("Argument_AdjustmentRulesOutOfOrder"));
				}
			}
		}
	}
} // TimezoneInfo

class TimeZoneInfoComparer implements IComparer<TimeZoneInfo> {
	public Compare(x: TimeZoneInfo, y: TimeZoneInfo): int {
		// sort by BaseUtcOffset first and by DisplayName second - this is similar to the Windows Date/Time control panel
		const comparison: int = x.BaseUtcOffset.CompareTo(y.BaseUtcOffset);
		return comparison == 0 ? TString.Compare(x.DisplayName, y.DisplayName, StringComparison.Ordinal) : comparison;
	}
}