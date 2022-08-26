import { Console } from "./Console";
import { TString } from "./Extensions";

export class Locale {
    public static GetText(value: any);
    public static GetText(str: string, ...args: any[]);
    public static GetText(...args: any[]) {
        if (args.length === 1) {
            const value: any = args[0];
            return (TString.Format1(TString.ToString(value), ...args));
        } else if (args.length > 1 && typeof args[0] === 'string') {
            const str: string = args[0];
            const _args: any[] = args.slice(1, arguments.length);
            return (TString.Format1(TString.ToString(str), ..._args));
        }
    }
}