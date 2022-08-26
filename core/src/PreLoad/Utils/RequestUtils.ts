import { Types } from "../Data/Types";

export class RequestUtils {
    /**
     * Determine if a specific type should be loaded as a binary file. Currently, only images and items marked
     * specifically as "binary" are loaded as binary. Note that audio is <b>not</b> a binary type, as we can not play
     * back using an audio tag if it is loaded as binary. Plugins can change the item type to binary to ensure they get
     * a binary result to work with. Binary files are loaded using XHR2. Types are defined as static constants on
     * {{#crossLink "AbstractLoader"}}{{/crossLink}}.
     * @method isBinary
     * @param {String} type The item type.
     * @return {Boolean} If the specified type is binary.
     * @static
     */
    public static IsBinary(type: string): boolean {
        switch (type) {
            case Types.IMAGE:
            case Types.BINARY:
                return true;
            default:
                return false;
        }
    }

    /**
     * Determine if a specific type is a text-based asset, and should be loaded as UTF-8.
     * @method isText
     * @param {String} type The item type.
     * @return {Boolean} If the specified type is text.
     * @static
     */
    public static IsText(type: string): boolean {
        switch (type) {
            case Types.TEXT:
            case Types.JSON:
            case Types.MANIFEST:
            case Types.XML:
            case Types.CSS:
            case Types.SVG:
            case Types.JAVASCRIPT:
            case Types.SPRITESHEET:
                return true;
            default:
                return false;
        }
    };

    /**
     * Determine the type of the object using common extensions. Note that the type can be passed in with the load item
     * if it is an unusual extension.
     * @method getTypeByExtension
     * @param {String} extension The file extension to use to determine the load type.
     * @return {String} The determined load type (for example, `Types.IMAGE`). Will return `null` if
     * the type can not be determined by the extension.
     * @static
     */
    public static GetTypeByExtension(extension: string): string {
        if (extension == null) {
            return Types.TEXT;
        }

        switch (extension.toLowerCase()) {
            case "jpeg":
            case "jpg":
            case "gif":
            case "png":
            case "webp":
            case "bmp":
                return Types.IMAGE;
            case "ogg":
            case "mp3":
            case "webm":
            case "aac":
                return Types.SOUND;
            case "mp4":
            case "webm":
            case "ts":
                return Types.VIDEO;
            case "json":
                return Types.JSON;
            case "xml":
                return Types.XML;
            case "css":
                return Types.CSS;
            case "js":
                return Types.JAVASCRIPT;
            case 'svg':
                return Types.SVG;
            default:
                return Types.TEXT;
        }
    }
}