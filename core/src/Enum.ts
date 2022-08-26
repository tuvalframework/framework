export class Enum {
    public static GetValues(enumType: any): number[] {
        return Object.keys(enumType).filter(key => isNaN(Number(enumType[key]))).map(v => Number(v));
    }

    public static GetKeys(enumType: any): number[] {
        return Object.keys(enumType).filter(key => !isNaN(Number(enumType[key]))).map(v => Number(v));;
    }

    public static Parse<T>(enumValue:any) {
        return <T>enumValue;
    }

    public static IsDefined(enumObject: any, value: any) {
        if (enumObject == null) {
            return false;
        }
        return enumObject[value] != null;
    }
}