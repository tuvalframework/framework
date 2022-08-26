export class Elements {
    public static a() {
        return Elements.el("a");
    }

    public static svg() {
        return Elements.el("svg");
    }

    public static object() {
        return Elements.el("object");
    }

    public static image() {
        return Elements.el("image");
    }

    public static img() {
        return Elements.el("img");
    }

    public static style() {
        return Elements.el("style");
    }

    public static link() {
        return Elements.el("link");
    }

    public static script() {
        return Elements.el("script");
    }

    public static audio() {
        return Elements.el("audio");
    }

    public static video() {
        return Elements.el("video");
    }

    public static text(value) {
        return document.createTextNode(value);
    }

    public static el(name) {
        return document.createElement(name);
    }

}