

export interface ISelectProperties {
    vp_Value: any
    vp_Placeholder: string;
    vp_Options: any[];
    vp_OnChange: (value: any, option: any) => void;
}