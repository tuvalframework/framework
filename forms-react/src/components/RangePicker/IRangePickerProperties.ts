
export type EventValue<DateType> = DateType | null;
export type RangeValue<DateType = any> = [EventValue<DateType>, EventValue<DateType>] | null;

export interface PresetDate<T> {
    label: React.ReactNode;
    value: T | (() => T);
}

export interface IRangePickerProperties<DateType = any> {
    vp_Presets?:  PresetDate<Exclude<RangeValue<DateType>, null>>[];
    vp_OnChange?: (values: RangeValue<DateType>, formatString: [string, string]) => void;
}