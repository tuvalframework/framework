import { Guid } from "@tuval/core";

export class CssHelper {
    static addCssToDocument(css: string, id: string = null): string {
        const head: any = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        id = id ?? Guid.NewGuid().ToString();
        style.setAttribute('id', id);
        if ((<any>style).styleSheet) {
            (<any>style).styleSheet.css = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        return id;
    }
}

