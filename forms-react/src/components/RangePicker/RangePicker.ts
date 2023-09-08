import { RangePickerShell } from "./RangePickerShell";




export const RangePickerProtocol = Symbol('RangePickerProtocol');

export function RangePicker() {
    return new RangePickerShell();
}