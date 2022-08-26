/**
 * Defines the load types that PreloadJS supports by default. This is typically used when passing a type override to
 * a {{#crossLink "LoadQueue"}}{{/crossLink}}.
 *
 * <h4>Example</h4>
 *
 * 		queue.loadFile({src:"https://somecdn/wfossn3", type:Types.IMAGE});
 *
 * You can also use the string value:
 *
 * 		queue.loadFile({src:"https://somecdn/wfossn3", type:"image"});
 *
 */
export enum Types {
    /**
     * The preload type for generic binary types. Note that images are loaded as binary files when using XHR.
     */
    BINARY = "binary",

    /**
     * The preload type for css files. CSS files are loaded using a &lt;link&gt; when loaded with XHR, or a
     * &lt;style&gt; tag when loaded with tags.
     */
    CSS = "css",

    /**
     * The preload type for font files.
     */
    FONT = "font",

    /**
     * The preload type for fonts specified with CSS (such as Google fonts)
     */
    FONTCSS = "fontcss",

    /**
     * The preload type for image files, usually png, gif, or jpg/jpeg. Images are loaded into an &lt;image&gt; tag.
     */
    IMAGE = "image",

    /**
     * The preload type for javascript files, usually with the "js" file extension. JavaScript files are loaded into a
     * &lt;script&gt; tag.
     *
     * Since version 0.4.1+, due to how tag-loaded scripts work, all JavaScript files are automatically injected into
     * the body of the document to maintain parity between XHR and tag-loaded scripts. In version 0.4.0 and earlier,
     * only tag-loaded scripts are injected.
     */
    JAVASCRIPT = "javascript",

    /**
     * The preload type for json files, usually with the "json" file extension. JSON data is loaded and parsed into a
     * JavaScript object. Note that if a `callback` is present on the load item, the file will be loaded with JSONP,
     * no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to, and the JSON
     * must contain a matching wrapper function.
     */
    JSON = "json",

    /**
     * The preload type for jsonp files, usually with the "json" file extension. JSON data is loaded and parsed into a
     * JavaScript object. You are required to pass a callback parameter that matches the function wrapper in the JSON.
     * Note that JSONP will always be used if there is a callback present, no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}}
     * property is set to.
     */
    JSONP = "jsonp",

    /**
     * The preload type for json-based manifest files, usually with the "json" file extension. The JSON data is loaded
     * and parsed into a JavaScript object. PreloadJS will then look for a "manifest" property in the JSON, which is an
     * Array of files to load, following the same format as the {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}
     * method. If a "callback" is specified on the manifest object, then it will be loaded using JSONP instead,
     * regardless of what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to.
     */
    MANIFEST = "manifest",

    /**
     * The preload type for sound files, usually mp3, ogg, or wav. When loading via tags, audio is loaded into an
     * &lt;audio&gt; tag.
     */
    SOUND = "sound",

    /**
     * The preload type for video files, usually mp4, ts, or ogg. When loading via tags, video is loaded into an
     * &lt;video&gt; tag.
     */
    VIDEO = "video",

    /**
     * The preload type for SpriteSheet files. SpriteSheet files are JSON files that contain string image paths.
     */
    SPRITESHEET = "spritesheet",

    /**
     * The preload type for SVG files.
     */
    SVG = "svg",

    /**
     * The preload type for text files, which is also the default file type if the type can not be determined. Text is
     * loaded as raw text.
     */
    TEXT = "text",

    /**
     * The preload type for xml files. XML is loaded into an XML document.
     */
    XML = "xml"
}