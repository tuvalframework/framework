import { LabelClass } from './LabelClass';


export function Label(text: string) {
    return new LabelClass().text(text);
}