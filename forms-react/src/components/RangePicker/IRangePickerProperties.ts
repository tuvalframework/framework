
export type EventValue<DateType> = DateType | null;
export type RangeValue<DateType= any> = [EventValue<DateType>, EventValue<DateType>] | null;

export interface IRangePickerProperties {
    vp_OnChange?: (values: RangeValue, formatString: [string, string]) => void;
}