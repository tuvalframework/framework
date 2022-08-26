//
// Flags used to indicate special rule used in parsing/formatting
// for a specific DateTimeFormatInfo instance.
// This is an internal flag.
//
// This flag is different from MonthNameStyles because this flag
// can be expanded to accomodate parsing behaviors like CJK month names
// or alternative month names, etc.

export /* internal */ enum DateTimeFormatFlags {
    None = 0x00000000,
    UseGenitiveMonth = 0x00000001,
    UseLeapYearMonth = 0x00000002,
    UseSpacesInMonthNames = 0x00000004, // Has spaces or non-breaking space in the month names.
    UseHebrewRule = 0x00000008,   // Format/Parse using the Hebrew calendar rule.
    UseSpacesInDayNames = 0x00000010,   // Has spaces or non-breaking space in the day names.
    UseDigitPrefixInTokens = 0x00000020,   // Has token starting with numbers.

    NotInitialized = -1,
}