//
// Flags used to indicate different styles of month names.
// This is an internal flag used by internalGetMonthName().
// Use flag here in case that we need to provide a combination of these styles
// (such as month name of a leap year in genitive form.  Not likely for now,
// but would like to keep the option open).
//

export enum MonthNameStyles {
    Regular = 0x00000000,
    Genitive = 0x00000001,
    LeapYear = 0x00000002,
}