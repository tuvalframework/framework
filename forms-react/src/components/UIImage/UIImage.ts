import { is } from "@tuval/core";
import { UIView } from "../UIView/UIView";
import { UIImageClass } from "./UIImageClass";


export function UIImage(src: string): UIImageClass {
    const emptyImage = 'data:image/svg+xml;base64,PHN2ZyBpZD0iYjM4OGU5NDQtNTUwOS00OWM5LTg0ZDctZjM4YmZmYTk5NWIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50IiAvPg0KPC9zdmc+';
    if (is.nullOrEmpty(src)) {
        src = emptyImage;
    }

    return new UIImageClass().src(src);;

}
