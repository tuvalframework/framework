export class DomUtils {
    public static container: any = null;
    public static AppendToHead(el) {
        DomUtils.GetHead().appendChild(el);
    }

    public static AppendToBody = function (el) {
        if (DomUtils.container == null) {
            DomUtils.container = document.createElement("div");
            DomUtils.container.id = "preloadjs-container";
            var style = DomUtils.container.style;
            style.visibility = "hidden";
            style.position = "absolute";
            style.width = DomUtils.container.style.height = "10px";
            style.overflow = "hidden";
            style.transform = style.msTransform = style.webkitTransform = style.oTransform = "translate(-10px, -10px)"; //LM: Not working
            DomUtils.GetBody().appendChild(DomUtils.container);
        }
        DomUtils.container.appendChild(el);
    }

    public static GetHead() {
        return document.head || document.getElementsByTagName("head")[0];
    }

    public static GetBody() {
        return document.body || document.getElementsByTagName("body")[0];
    }

    public static RemoveChild(el) {
        if (el.parent) {
            el.parent.removeChild(el);
        }
    }

    /**
     * Check if item is a valid HTMLImageElement
     * @method isImageTag
     * @param {Object} item
     * @returns {Boolean}
     * @static
     */
    public static IsImageTag(item: any): boolean {
        return item instanceof HTMLImageElement;
    }

    /**
     * Check if item is a valid HTMLAudioElement
     * @method isAudioTag
     * @param {Object} item
     * @returns {Boolean}
     * @static
     */
    public static IsAudioTag(item: any): boolean {
        if (window.HTMLAudioElement) {
            return item instanceof HTMLAudioElement;
        } else {
            return false;
        }
    }


    /**
     * Check if item is a valid HTMLVideoElement
     * @method isVideoTag
     * @param {Object} item
     * @returns {Boolean}
     * @static
     */
    public static IsVideoTag(item) {
        if (window.HTMLVideoElement) {
            return item instanceof HTMLVideoElement;
        } else {
            return false;
        }
    }
}