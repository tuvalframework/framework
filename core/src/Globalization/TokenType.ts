//
// The type of token that will be returned by DateTimeFormatInfo.Tokenize().
//
export enum TokenType {
    // The valid token should start from 1.

    // Regular tokens. The range is from 0x00 ~ 0xff.
    NumberToken = 1,    // The number.  E.g. "12"
    YearNumberToken = 2,    // The number which is considered as year number, which has 3 or more digits.  E.g. "2003"
    Am = 3,    // AM timemark. E.g. "AM"
    Pm = 4,    // PM timemark. E.g. "PM"
    MonthToken = 5,    // A word (or words) that represents a month name.
    EndOfString = 6,    // End of string
    DayOfWeekToken = 7,    // A word (or words) that represents a day of week name.  E.g. "Monday" or "Mon"
    TimeZoneToken = 8,    // A word that represents a timezone name. E.g. "GMT"
    EraToken = 9,    // A word that represents a era name. E.g. "A.D."
    DateWordToken = 10,   // A word that can appear in a DateTime string, but serves no parsing semantics.  E.g. "de" in Spanish culture.
    UnknownToken = 11,   // An unknown word, which signals an error in parsing.
    HebrewNumber = 12,   // A number that is composed of Hebrew text.  Hebrew calendar uses Hebrew digits for year values, month values, and day values.
    JapaneseEraToken = 13,   // Era name for JapaneseCalendar
    TEraToken = 14,   // Era name for TaiwanCalendar
    IgnorableSymbol = 15,   // A separator like "," that is equivalent to whitespace


    // Separator tokens.
    SEP_Unk = 0x100,         // Unknown separator.
    SEP_End = 0x200,    // The end of the parsing string.
    SEP_Space = 0x300,    // Whitespace (including comma).
    SEP_Am = 0x400,    // AM timemark. E.g. "AM"
    SEP_Pm = 0x500,    // PM timemark. E.g. "PM"
    SEP_Date = 0x600,    // date separator. E.g. "/"
    SEP_Time = 0x700,    // time separator. E.g. ":"
    SEP_YearSuff = 0x800,    // Chinese/Japanese/Korean year suffix.
    SEP_MonthSuff = 0x900,    // Chinese/Japanese/Korean month suffix.
    SEP_DaySuff = 0xa00,    // Chinese/Japanese/Korean day suffix.
    SEP_HourSuff = 0xb00,   // Chinese/Japanese/Korean hour suffix.
    SEP_MinuteSuff = 0xc00,   // Chinese/Japanese/Korean minute suffix.
    SEP_SecondSuff = 0xd00,   // Chinese/Japanese/Korean second suffix.
    SEP_LocalTimeMark = 0xe00,   // 'T', used in ISO 8601 format.
    SEP_DateOrOffset = 0xf00,   // '-' which could be a date separator or start of a time zone offset

    RegularTokenMask = 0x00ff,
    SeparatorTokenMask = 0xff00,
}