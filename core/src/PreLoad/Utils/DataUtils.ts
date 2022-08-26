declare var ActiveXObject;
export class DataUtils {
    // static methods
    /**
     * Parse XML using the DOM. This is required when preloading XML or SVG.
     * @method parseXML
     * @param {String} text The raw text or XML that is loaded by XHR.
     * @return {XML} An XML document
     * @static
     */
    public static ParseXML(text: string): string {
        let xml: any = null;
        // CocoonJS does not support XML parsing with either method.

        // Most browsers will use DOMParser
        // IE fails on certain SVG files, so we have a fallback below.
        try {
            if (window.DOMParser) {
                var parser = new DOMParser();
                xml = parser.parseFromString(text, "text/xml");
            }
        } catch (e) {
        }

        // Fallback for IE support.
        if (!xml) {
            try {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = false;
                xml.loadXML(text);
            } catch (e) {
                xml = null;
            }
        }

        return xml;
    }

    /**
     * Parse a string into an Object.
     * @method parseJSON
     * @param {String} value The loaded JSON string
     * @returns {Object} A JavaScript object.
     */
    public static parseJSON(value: string): any {
        if (value == null) {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch (e) {
            // TODO; Handle this with a custom error?
            throw e;
        }
    }
}