import { EventArgs } from "@tuval/core";
import { ScrollEventType } from "./ScrollEventType";
import { ScrollOrientation } from "./ScrollOrientation";

export class ScrollEventArgs extends EventArgs {
    public NewValue: number = 0;
    public OldValue: number = 0;
    public ScrollOrientation: ScrollOrientation = ScrollOrientation.VerticalScroll;
    public Type: ScrollEventType = ScrollEventType.First;

    public constructor(type: ScrollEventType, newValue: number);
    public constructor(type: ScrollEventType, newValue: number, scroll: ScrollOrientation);
    public constructor(type: ScrollEventType, oldValue: number, newValue: number);
    public constructor(type: ScrollEventType, oldValue: number, newValue: number, scroll: ScrollOrientation);
    public constructor(...args: any[]) {
        super();
    }

}