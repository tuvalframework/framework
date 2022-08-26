import { List, StringBuilder, foreach } from '@tuval/core';
import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';

export class KeyFrame {
    public name: string;
    public style: AppearanceObject;
    public constructor(name: string) {
        this.name = name;
        this.style = new AppearanceObject(null);
    }
}
export class KeyFrameCollection extends List<KeyFrame> {
    public Name: string;
    public constructor(name: string) {
        super();
        this.Name = name;
    }

    public ToString(): string {
        const sb = new StringBuilder();
        sb.AppendLine(`@keyframes ${this.Name} {`);
        foreach(this, (keyFrame: KeyFrame) => {
            sb.AppendLine(`${keyFrame.name}  {`);
            sb.AppendLine(keyFrame.style.ToString());
            sb.AppendLine(`}`);
        })
        sb.AppendLine(`}`);
        return sb.ToString();
    }
}

