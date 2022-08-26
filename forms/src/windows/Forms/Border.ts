import { TString } from '@tuval/core';
export enum BorderApplies {
    None = 0b0000,
    Top = 0b0001,
    Left = 0b0010,
    Right = 0b0100,
    Bottom = 0b1000,
    All = 0b1111,
}
export class Border {
    public static Empty: Border = new Border();
    public LeftBorderColor: string;
    public TopBorderColor: string;
    public RightBorderColor: string;
    public BottomBorderColor: string;
    public Applies: BorderApplies = BorderApplies.None;
    public constructor() {

    }
    public AddLeftBorder(color: string) {
        this.LeftBorderColor = color;
        this.Applies |= BorderApplies.Left;
    }
    public AddTopBorder(color: string) {
        this.TopBorderColor = color;
        this.Applies |= BorderApplies.Top;
    }
    public AddRightBorder(color: string) {
        this.RightBorderColor = color;
        this.Applies |= BorderApplies.Right;
    }
    public AddBottomBorder(color: string) {
        this.BottomBorderColor = color;
        this.Applies |= BorderApplies.Bottom;
    }
    public Inpose(styleObject: any) {
        if (this.Applies & BorderApplies.Left) {
            styleObject['borderLeft'] = TString.Format('solid {0}px {1}', 1, this.LeftBorderColor);
        }
        if (this.Applies & BorderApplies.Top) {
            styleObject['borderTop'] =TString.Format('solid {0}px {1}', 1, this.TopBorderColor);
        }
        if (this.Applies & BorderApplies.Right) {
            styleObject['borderRight'] = TString.Format('solid {0}px {1}', 1, this.RightBorderColor);
        }
        if (this.Applies & BorderApplies.Bottom) {
            styleObject['borderBottom'] = TString.Format('solid {0}px {1}', 1, this.BottomBorderColor);
        }
    }
}