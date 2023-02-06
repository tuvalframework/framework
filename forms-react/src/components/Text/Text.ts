import { TextClass } from './TextClass';


export function Text(text: string) {
    return new TextClass().text(text);
}