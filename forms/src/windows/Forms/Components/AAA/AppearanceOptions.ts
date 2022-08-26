import { BorderOptions } from './BorderOptions';
import { Control } from './Control';
export class AppearanceOptions {
    private control:Control;


    public UseBackColor: boolean = false;
    public UseMaxWidth: boolean = false;
    public UseMaxHeight: boolean = false;
    public UseMinWidth: boolean = false;
    public UseMinHeight: boolean = false;
    public BorderLeftOptions: BorderOptions = new BorderOptions();
    public BorderRightOptions: BorderOptions = new BorderOptions();
    public BorderTopOptions: BorderOptions = new BorderOptions();
    public BorderBottomOptions: BorderOptions = new BorderOptions();

    public constructor(obj: Control) {
        this.control = obj;
    }
}