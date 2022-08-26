import { IFormatProvider } from "./IFormatProvider";
export interface IFormattable {
	ToString(format?: string, formatProvider?: IFormatProvider): string;
}
