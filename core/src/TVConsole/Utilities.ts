import { Context } from '../Context/Context';
import { int } from '../float';
import { TVC } from './TVC';

declare var Howl;


declare var Howl;
function fireEvent(el, etype) {
    if (el.fireEvent) {
        (el.fireEvent('on' + etype));
    }
    else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

export class Utilities {
    tvc: TVC;
    uniqueIdentifiersOnce: any;
    public constructor(tvc: TVC) {
        this.tvc = tvc;
    }

    public get TVC_Files(): any {
        const tvc_files = Context.Current.get('TVC_Files');
        return tvc_files;
    }

    private getBrowserLanguage() {
        let lang = window.navigator.languages ? window.navigator.languages[0] : null;
        lang = lang || window.navigator.language || (window.navigator as any).browserLanguage || (window.navigator as any).userLanguage;

        let shortLang: any = lang;
        if (shortLang.indexOf('-') !== -1)
            shortLang = shortLang.split('-')[0];

        if (shortLang.indexOf('_') !== -1)
            shortLang = shortLang.split('_')[0];

        return shortLang.toLowerCase();
    }

    private getUniqueIdentifier(root) {
        root = typeof root != 'undefined' ? root : 'ID_';
        root += Math.random() * 10000000 + '-' + (new Date() as any).now;
        return root;
    }
    // Make the system thread-safe, for the moment one identifier per root.
    private getUniqueIdentifierOnce(root) {
        if (this.uniqueIdentifiersOnce[root]) {
            return this.uniqueIdentifiersOnce[root];
        }
        var identifier = this.getUniqueIdentifier(root);
        this.uniqueIdentifiersOnce[root] = identifier;
        return identifier;
    }
    private resetUniqueIdentifierOnce(root) {
        if (this.uniqueIdentifiersOnce[root]) {
            this.uniqueIdentifiersOnce = this.cleanObject(this.uniqueIdentifiersOnce, this.uniqueIdentifiersOnce[root]);
            return true;
        }
        return false;
    }
    public sendCrashMail() {
        if (this.tvc.crashInfo) {
            var body = '\r\n\r\n';
            body += 'application: ' + this.tvc.manifest.infos.applicationName + '\r\n';
            body += 'date: ' + this.getFormattedDate() + '\r\n';
            body += 'source position: ' + this.tvc.sourcePos + '\r\n';
            body += 'message: ' + this.tvc.crash.error.message + '\r\n';
            body += 'stack: ' + this.tvc.crash.error.stack + '\r\n';
            body += '\r\n\r\n\r\n\r\n';

            var subject = 'Tuval Framework Runtime Crash Report';
            this.sendMail('info@tuvalframework.com', subject, body);
        }
    };
    private sendMail(to, subject, body) {
        var message = encodeURI("mailto:" + to + "?subject=" + subject + "&body=" + body)
        window.open(message);
    };
    private getFormattedDate() {
        var date = new Date();

        var month: any = date.getMonth() + 1;
        var day: any = date.getDate();
        var hour: any = date.getHours();
        var min: any = date.getMinutes();
        var sec: any = date.getSeconds();

        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        sec = (sec < 10 ? "0" : "") + sec;

        var str = day + '/' + month + '/' + date.getFullYear() + "-" + hour + ":" + min + ":" + sec;

        return str;
    }

    private rotate(x, y, cx, cy, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
        var ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }

    private rotatePoint(point, center, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        point.x = (cos * (point.x - center.x)) - (sin * (point.y - center.y)) + center.x;
        point.y = (cos * (point.y - center.y)) + (sin * (point.x - center.x)) + center.y;
    }

    private rotateCollisionRectangle(rectangle, center, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x1 = (cos * (rectangle.x1 - center.x)) - (sin * (rectangle.y1 - center.y)) + center.x;
        var y1 = (cos * (rectangle.y1 - center.y)) + (sin * (rectangle.x1 - center.x)) + center.y;
        var x2 = (cos * (rectangle.x2 - center.x)) - (sin * (rectangle.y1 - center.y)) + center.x;
        var y2 = (cos * (rectangle.y1 - center.y)) + (sin * (rectangle.x2 - center.x)) + center.y;
        var x3 = (cos * (rectangle.x2 - center.x)) - (sin * (rectangle.y2 - center.y)) + center.x;
        var y3 = (cos * (rectangle.y2 - center.y)) + (sin * (rectangle.x2 - center.x)) + center.y;
        var x4 = (cos * (rectangle.x1 - center.x)) - (sin * (rectangle.y2 - center.y)) + center.x;
        var y4 = (cos * (rectangle.y2 - center.y)) + (sin * (rectangle.x1 - center.x)) + center.y;
        rectangle.x1 = Math.min(x1, Math.min(x2, Math.min(x3, x4)));
        rectangle.x2 = Math.max(x1, Math.max(x2, Math.max(x3, x4)));
        rectangle.y1 = Math.min(y1, Math.min(y2, Math.min(y3, y4)));
        rectangle.y2 = Math.max(y1, Math.max(y2, Math.max(y3, y4)));
    }

    public slice(arr, position, length) {
        var result: any[] = [];
        length = typeof length != 'undefined' ? length : 1;
        for (var p = 0; p < arr.length; p++) {
            if (p < position || p >= position + length) {
                result.push(arr[p]);
            }
        }
        return result;
    }

    private trimString(str, position) {
        var start = 0;
        position = typeof position == 'undefined' ? { left: true, right: true } : position;
        if (position.left) {
            while (start < str.length && (str.charCodeAt(start) == 32 || str.charCodeAt(start) == 9 || str.charCodeAt(start) == 10 || str.charCodeAt(start) == 13))
                start++;
        }
        var end = str.length;
        if (position.right) {
            while (end > 0 && (str.charCodeAt(end - 1) === 32 || str.charCodeAt(end - 1) == 9 || str.charCodeAt(end - 1) == 10 || str.charCodeAt(end - 1) == 13))
                end--;
        }
        if (end > start)
            return str.substring(start, end);
        return '';
    }

    private static TVCTEMP_position: int;
    public static TVCTEMPRETURN_end_position: int;

    public extractFromString(text, start, type, throwError?, options?) {
        Utilities.TVCTEMP_position = start;
        let result: any;
        switch (type) {
            case 'string':
                result = this.extractString(text, Utilities.TVCTEMP_position, options);
                if (!result && throwError)
                    throw { error: throwError, parameter: text };
                return result;
            case 'word':
                result = this.extractWord(text, Utilities.TVCTEMP_position, options);
                if (!result && throwError)
                    throw { error: throwError, parameter: text };
                return result;
            case 'integer':
                result = this.extractNumber(text, Utilities.TVCTEMP_position, options);
                if (result.type != type && throwError)
                    throw { error: throwError, parameter: text };
                return result.integer;
            case 'float':
                result = this.extractNumber(text, Utilities.TVCTEMP_position, options);
                if (result.type != type && throwError)
                    throw { error: throwError, parameter: text };
                return result.float;
            case 'character':
                return this.extractCharacter(text, Utilities.TVCTEMP_position, options);
            default:
                throw 'internal_error';
        }
    }
    private getFromString(text, start, type, options) {
        var savePosition = Utilities.TVCTEMP_position;
        Utilities.TVCTEMP_position = start;
        let result: any;
        switch (type) {
            case 'string':
                result = this.extractString(text, Utilities.TVCTEMP_position, options);
                break;
            case 'word':
                result = this.extractWord(text, Utilities.TVCTEMP_position, options);
                break;
            case 'integer':
                result = this.extractNumber(text, Utilities.TVCTEMP_position, options).integer;
                break
            case 'float':
                result = this.extractNumber(text, Utilities.TVCTEMP_position, options).float;
                break;
            case 'character':
                result = this.extractCharacter(text, Utilities.TVCTEMP_position, options);
                break;
            default:
                throw 'internal_error';
        }
        Utilities.TVCTEMP_position = savePosition;
        return result;
    }
    public skipTheSpaces(text, start) {
        Utilities.TVCTEMP_position = start;
        while ((text.charAt(start) == ' ' || text.charAt(start) == '\t') && start < text.length)
            start++;
        Utilities.TVCTEMPRETURN_end_position = Utilities.TVCTEMP_position;
        Utilities.TVCTEMP_position = start;
    }
    private extractCharacter(text, start, unused) {
        this.skipTheSpaces(text, start);

        var result = undefined;
        if (Utilities.TVCTEMP_position < text.length)
            result = text.charAt(Utilities.TVCTEMP_position++);

        Utilities.TVCTEMPRETURN_end_position = Utilities.TVCTEMP_position;
        return result;
    }
    private extractString(text, start, unused) {
        this.skipTheSpaces(text, start);

        var result: any = undefined;
        var quote = text.charAt(Utilities.TVCTEMP_position);
        if (quote == '"' || quote == "'") {
            result = '';
            Utilities.TVCTEMP_position++;
            while (Utilities.TVCTEMP_position < text.length) {
                var c = text.charAt(Utilities.TVCTEMP_position++);
                if (c == quote)
                    break;
                result += c;
            }
        }
        Utilities.TVCTEMPRETURN_end_position = Utilities.TVCTEMP_position;
        return result;
    }
    private extractWord(text, start, options) {
        var result = '';
        options = typeof options == 'undefined' ? {} : options;
        while (start < text.length) {
            var c = text.charAt(module.exports.TVCTEMP_position++);
            if (this.getCharacterType(c) != 'letter') {
                if (options.acceptedCharacters) {
                    if (options.acceptedCharacters.indexOf(c) < 0)
                        break;
                }
                else {
                    break;
                }
            }
            result += c;
        }
        module.exports.TVCTEMPRETURN_end_position = module.exports.TVCTEMP_position;
        return result;
    };
    private extractNumber(line, start, unused) {
        this.skipTheSpaces(line, start);

        var result =
        {
            text: "",
            float: NaN,
            integer: NaN,
            type: 'nan',
            endPosition: 0
        }
        var c = line.charAt(Utilities.TVCTEMP_position);
        if (c == '-' || c == '–') {
            Utilities.TVCTEMP_position++;
            result.text += '-';
            c = line.charAt(Utilities.TVCTEMP_position);
        }
        if (this.getCharacterType(c) == 'number') {
            Utilities.TVCTEMP_position++;
            result.text += c;
            result.type = 'integer';
            while (Utilities.TVCTEMP_position < line.length) {
                c = line.charAt(Utilities.TVCTEMP_position);
                if (!((c >= '0' && c <= '9') || c == '.'))
                    break;
                result.text += c;
                if (c == '.')
                    result.type = 'float';
                Utilities.TVCTEMP_position++;
            }
            if (result.type == 'float') {
                result.float = parseFloat(result.text);
                result.integer = this.tvc.fp2Int(result.float); // BJF
            }
            else {
                result.integer = parseInt(result.text);
                result.float = result.integer;
            }
        }
        result.endPosition = Utilities.TVCTEMP_position;

        Utilities.TVCTEMPRETURN_end_position = Utilities.TVCTEMP_position;
        return result;
    }; // extractNumber(line,start)

    public getFontString(name, height, weight, italic, unused?) {
        var font = '';
        if (italic && italic != 'normal')
            font += italic + ' ';
        if (typeof weight != 'undefined')
            font += weight + ' ';
        font += height + 'px ' + name;
        return font;
    }

    public getFontStringHeight(fontString) {
        var height = 10;
        var pos = fontString.indexOf('px');
        if (pos >= 0)
            height = parseInt(fontString.substring(0, pos));
        return height;
    };


    private getTVCRGB(r, g, b, short) {
        var a = (typeof a === 'undefined' ? 255 : 0);
        if (!short)
            return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
        return ((r & 0xF) << 8) | ((g & 0xF) << 4) | (b & 0xF);
    };
    private getRGBA(r, g, b, a, short) {
        a = (typeof a == 'undefined' ? 255 : 0);
        if (!short)
            return ((r & 0xFF) << 24) | ((g & 0xFF) << 16) | ((b & 0xFF) << 8) | (a & 0xFF);
        return ((r & 0xF) << 12) | ((g & 0xF) << 8) | ((b & 0xF) << 4) | (a & 0xF);
    };
    private getRGBAColors(rgba, short) {
        var result;

        if (!short) {
            result =
            {
                r: (rgba >> 24) & 0xFF,
                g: (rgba >> 16) & 0xFF,
                b: (rgba >> 8) & 0xFF,
                a: (rgba & 0xFF)
            };
        }
        else {
            result =
            {
                r: (rgba >> 12) & 0xF,
                g: (rgba >> 8) & 0xF,
                b: (rgba >> 4) & 0xF,
                a: (rgba & 0xF)
            };
        }
        return result;
    };
    private getRGBColors(rgb, short) {
        var result;

        if (!short) {
            result =
            {
                r: (rgb >> 16) & 0xFF,
                g: (rgb >> 8) & 0xFF,
                b: (rgb) & 0xFF,
            };
        }
        else {
            result =
            {
                r: (rgb >> 8) & 0xF,
                g: (rgb >> 4) & 0xF,
                b: (rgb) & 0xF,
            };
        }
        return result;
    }; // getRBGColors

    public getRGBAStringColors(rgbaString) {
        var result: any = {};
        result.r = parseInt(rgbaString.substr(1, 2), 16);
        result.g = parseInt(rgbaString.substr(3, 2), 16);
        result.b = parseInt(rgbaString.substr(5, 2), 16);
        result.a = 255;
        if (rgbaString.length == 9)
            result.a = parseInt(rgbaString.substr(7, 2), 16);
        return result;
    }

    public getRGBAString(r, g, b, a?) {
        var rr = r.toString(16);
        if (rr.length < 2) rr = '0' + rr;
        var gg = g.toString(16);
        if (gg.length < 2) gg = '0' + gg;
        var bb = b.toString(16);
        if (bb.length < 2) bb = '0' + bb;
        var aa = '';
        if (typeof a != 'undefined') {
            aa = a.toString(16);
            if (aa.length < 2) aa = '0' + aa;
        }
        return ('#' + rr + gg + bb + aa).toUpperCase();
    }
    public getModernColorString(color, short = false) {
        var colorString = color.toString(16);
        if (short) {
            while (colorString.length < 3)
                colorString = '0' + colorString;
            colorString = colorString.substr(0, 1) + '0' + colorString.substr(1, 1) + '0' + colorString.substr(2, 1) + '0';
        }
        else {
            while (colorString.length < 6)
                colorString = '0' + colorString;
        }
        return ('#' + colorString).toUpperCase();
    }
    private static javascriptColors =
        {
            'aliceblue': 0xF0F8FF,
            'antiquewhite': 0xFAEBD7,
            'aqua': 0x00FFFF,
            'aquamarine': 0x7FFFD4,
            'azure': 0xF0FFFF,
            'beige': 0xF5F5DC,
            'bisque': 0xFFE4C4,
            'black': 0x000000,
            'blanchedalmond': 0xFFEBCD,
            'blue': 0x0000FF,
            'blueviolet': 0x8A2BE2,
            'brown': 0xA52A2A,
            'burlywood': 0xDEB887,
            'cadetblue': 0x5F9EA0,
            'chartreuse': 0x7FFF00,
            'chocolate': 0xD2691E,
            'coral': 0xFF7F50,
            'cornflowerblue': 0x6495ED,
            'cornsilk': 0xFFF8DC,
            'crimson': 0xDC143C,
            'cyan': 0x00FFFF,
            'darkblue': 0x00008B,
            'darkcyan': 0x008B8B,
            'darkgoldenrod': 0xB8860B,
            'darkgray': 0xA9A9A9,
            'darkgrey': 0xA9A9A9,
            'darkgreen': 0x006400,
            'darkkhaki': 0xBDB76B,
            'darkmagenta': 0x8B008B,
            'darkolivegreen': 0x556B2F,
            'darkorange': 0xFF8C00,
            'darkorchid': 0x9932CC,
            'darkred': 0x8B0000,
            'darksalmon': 0xE9967A,
            'darkseagreen': 0x8FBC8F,
            'darkslateblue': 0x483D8B,
            'darkslategray': 0x2F4F4F,
            'darkslategrey': 0x2F4F4F,
            'darkturquoise': 0x00CED1,
            'darkviolet': 0x9400D3,
            'deeppink': 0xFF1493,
            'deepskyblue': 0x00BFFF,
            'dimgray': 0x696969,
            'dimgrey': 0x696969,
            'dodgerblue': 0x1E90FF,
            'firebrick': 0xB22222,
            'floralwhite': 0xFFFAF0,
            'forestgreen': 0x228B22,
            'fuchsia': 0xFF00FF,
            'gainsboro': 0xDCDCDC,
            'ghostwhite': 0xF8F8FF,
            'gold': 0xFFD700,
            'goldenrod': 0xDAA520,
            'gray': 0x808080,
            'grey': 0x808080,
            'green': 0x008000,
            'greenyellow': 0xADFF2F,
            'honeydew': 0xF0FFF0,
            'hotpink': 0xFF69B4,
            'indianred': 0xCD5C5C,
            'indigo': 0x4B0082,
            'ivory': 0xFFFFF0,
            'khaki': 0xF0E68C,
            'lavender': 0xE6E6FA,
            'lavenderblush': 0xFFF0F5,
            'lawngreen': 0x7CFC00,
            'lemonchiffon': 0xFFFACD,
            'lightblue': 0xADD8E6,
            'lightcoral': 0xF08080,
            'lightcyan': 0xE0FFFF,
            'lightgoldenrodyellow': 0xFAFAD2,
            'lightgray': 0xD3D3D3,
            'lightgrey': 0xD3D3D3,
            'lightgreen': 0x90EE90,
            'lightpink': 0xFFB6C1,
            'lightsalmon': 0xFFA07A,
            'lightseagreen': 0x20B2AA,
            'lightskyblue': 0x87CEFA,
            'lightslategray': 0x778899,
            'lightslategrey': 0x778899,
            'lightsteelblue': 0xB0C4DE,
            'lightyellow': 0xFFFFE0,
            'lime': 0x00FF00,
            'limegreen': 0x32CD32,
            'linen': 0xFAF0E6,
            'magenta': 0xFF00FF,
            'maroon': 0x800000,
            'mediumaquamarine': 0x66CDAA,
            'mediumblue': 0x0000CD,
            'mediumorchid': 0xBA55D3,
            'mediumpurple': 0x9370DB,
            'mediumseagreen': 0x3CB371,
            'mediumslateblue': 0x7B68EE,
            'mediumspringGreen': 0x00FA9A,
            'mediumturquoise': 0x48D1CC,
            'mediumvioletRed': 0xC71585,
            'midnightblue': 0x191970,
            'mintcream': 0xF5FFFA,
            'mistyrose': 0xFFE4E1,
            'moccasin': 0xFFE4B5,
            'navajowhite': 0xFFDEAD,
            'navy': 0x000080,
            'oldlace': 0xFDF5E6,
            'olive': 0x808000,
            'olivedrab': 0x6B8E23,
            'orange': 0xFFA500,
            'orangered': 0xFF4500,
            'orchid': 0xDA70D6,
            'palegoldenrod': 0xEEE8AA,
            'palegreen': 0x98FB98,
            'paleturquoise': 0xAFEEEE,
            'palevioletred': 0xDB7093,
            'papayawhip': 0xFFEFD5,
            'peachpuff': 0xFFDAB9,
            'peru': 0xCD853F,
            'pink': 0xFFC0CB,
            'plum': 0xDDA0DD,
            'powderblue': 0xB0E0E6,
            'purple': 0x800080,
            'rebeccapurple': 0x663399,
            'red': 0xFF0000,
            'rosybrown': 0xBC8F8F,
            'royalblue': 0x4169E1,
            'saddlebrown': 0x8B4513,
            'salmon': 0xFA8072,
            'sandybrown': 0xF4A460,
            'seagreen': 0x2E8B57,
            'seashell': 0xFFF5EE,
            'sienna': 0xA0522D,
            'silver': 0xC0C0C0,
            'skyblue': 0x87CEEB,
            'slateblue': 0x6A5ACD,
            'slategray': 0x708090,
            'slategrey': 0x708090,
            'snow': 0xFFFAFA,
            'springgreen': 0x00FF7F,
            'steelblue': 0x4682B4,
            'tan': 0xD2B48C,
            'teal': 0x008080,
            'thistle': 0xD8BFD8,
            'tomato': 0xFF6347,
            'turquoise': 0x40E0D0,
            'violet': 0xEE82EE,
            'wheat': 0xF5DEB3,
            'white': 0xFFFFFF,
            'whitesmoke': 0xF5F5F5,
            'yellow': 0xFFFF00,
            'yellowgreen': 0x9ACD32,
        };
    private getJavascriptColor(colorName, short = false) {
        if (Utilities.javascriptColors[colorName.toLowerCase()])
            return Utilities.javascriptColors[colorName.toLowerCase()];
        throw 'color_not_found';
    };


    public pokeString(str, replacement, position, length) {
        var result = str.substring(0, position);
        if (length < replacement.length) {
            result += replacement.substr(0, length);
        }
        else {
            result += replacement;
            result += str.substr(position + replacement.length, length - replacement.length);
        }
        result += str.substring(position + length);
        return result;
    }

    public getFilename(path) {
        var posPoint = path.lastIndexOf('.');
        if (posPoint < 0)
            posPoint = path.length;

        var posSlash1 = path.lastIndexOf('/');
        var posSlash2 = path.lastIndexOf('\\');
        if (posSlash1 >= 0 && posSlash2 >= 0)
            posSlash1 = Math.max(posSlash1, posSlash2) + 1;
        else if (posSlash1 < 0 && posSlash2 < 0)
            posSlash1 = 0;
        else if (posSlash1 < 0)
            posSlash1 = posSlash2 + 1;
        else
            posSlash1++;

        return path.substring(posSlash1, posPoint);
    }

    public getFilenameExtension(path) {
        var posPoint = path.lastIndexOf('.');
        if (posPoint < 0)
            return '';
        return path.substring(posPoint + 1);
    }

    public getFilenameAndExtension(path) {
        var posSlash1 = path.lastIndexOf('/');
        var posSlash2 = path.lastIndexOf('\\');
        if (posSlash1 >= 0 && posSlash2 >= 0)
            posSlash1 = Math.max(posSlash1, posSlash2) + 1;
        else if (posSlash1 < 0 && posSlash2 < 0)
            posSlash1 = 0;
        else if (posSlash1 < 0)
            posSlash1 = posSlash2 + 1;
        else
            posSlash1++;

        return path.substring(posSlash1);
    }
    public getDir(path) {
        var colon = path.indexOf(':');
        if (colon >= 0)
            path = path.substring(colon + 1);
        var posSlash1 = path.lastIndexOf('/');
        var posSlash2 = path.lastIndexOf('\\');
        if (posSlash1 >= 0 && posSlash2 >= 0)
            posSlash1 = Math.max(posSlash1, posSlash2);
        else if (posSlash1 < 0 && posSlash2 < 0)
            posSlash1 = 0;
        else if (posSlash1 < 0)
            posSlash1 = posSlash2;
        return path.substring(0, posSlash1);
    }
    public convertStringToArrayBuffer(str) {
        var lookup = (window as any).base64Lookup;
        if (!lookup) {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            lookup = new Uint8Array(256);
            for (var i = 0; i < chars.length; i++) {
                lookup[chars.charCodeAt(i)] = i;
            }
            (window as any).base64Lookup = lookup;
        }

        var bufferLength = str.length * 0.75, len = str.length, i = 0, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (str[str.length - 1] === "=") {
            bufferLength--;
            if (str[str.length - 2] === "=") {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[str.charCodeAt(i)];
            encoded2 = lookup[str.charCodeAt(i + 1)];
            encoded3 = lookup[str.charCodeAt(i + 2)];
            encoded4 = lookup[str.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    }

    public convertArrayBufferToString(arrayBuffer) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var bytes = new Uint8Array(arrayBuffer), i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
        }
        else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
        }
        return base64;
    };
    private loadArraybuffer(path, options, callback, extra) {
        var self = this;
        fetch(path)
            .then(response => response.text())
            .then((data) => {
                var arrayBuffer = self.convertStringToArrayBuffer(data);
                callback(true, arrayBuffer, extra);
            })
            .catch(function (error) {
                callback(false, null, extra);
            });
    }
    public replaceStringInText(text, mark, replacement, number?) {
        number = (typeof number == 'undefined' ? 100000000 : number);
        if (replacement.indexOf(mark) >= 0)
            number = 1;
        var pos = text.indexOf(mark);
        while (pos >= 0 && number > 0) {
            text = text.substring(0, pos) + replacement + text.substring(pos + mark.length);
            pos = text.indexOf(mark);
            number--;
        }
        return text;
    };
    public loadScript(scripts, options, callback, extra?) {
        options = typeof options != 'undefined' ? options : {};
        const timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
        if (typeof scripts == 'string')
            scripts = [scripts];


        var loaded = 0;
        var toLoad = scripts.length;
        let onTimeout: Function = null as any;
        var handle = setTimeout(onTimeout, timeout);
        for (var s = 0; s < scripts.length; s++) {
            var path = scripts[s];

            var element: any = document.createElement('script');

            element.src = path;
            document.head.appendChild(element); 		// Adds to the document
            scripts[s] = element;
            const onLoad = () => {
                loaded++;
                if (loaded == toLoad) {
                    clearTimeout(handle);
                    if (callback)
                        callback(true, scripts, extra);
                }
            };
            const onError = () => {
                clearTimeout(handle);
                if (callback)
                    callback(false, scripts, extra);
            };
            const onTimeout = () => {
                if (callback)
                    callback(false, scripts, extra);
            };
            element.onload = onLoad;
            element.onError = onError;					// Not on all browsers
        }
    }

    private loadPng(path, options, callback, extra) {
        var image = new Image();
        image.onload = function () {
            callback(true, this, extra);
        };
        image.src = path;
    }
    private loadImages(images, options, callback, extra) {
        options = typeof options != 'undefined' ? options : {};
        const timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
        if (typeof images == 'string')
            images = [images];

        var loaded = 0;
        var toLoad = images.length;
        var loadedImages = {};
        for (var s = 0; s < images.length; s++) {
            var path = images[s];

            var i: any = new Image();
            i.__name = this.getFilename(path);
            i.onload = function () {
                loaded++;
                loadedImages[this.__name] = this;
                if (loaded == toLoad) {
                    clearTimeout(handle);
                    if (callback)
                        callback(true, loadedImages, extra);
                }
            };
            i.onerror = function () {
                clearTimeout(handle);
                if (callback)
                    callback(false, null, { error: 'load_error' });
            };
            i.src = path;
        }
        var handle = setTimeout(onTimeout, timeout);
        function onTimeout() {
            if (callback)
                callback(false, null, { error: 'timeout' });
        };
    };
    private convertObjectToArray(obj, options) {
        var result: any[] = [];
        for (var d = 0; d < obj.length; d++) {
            result.push(obj[d]);
        }
        if (options) {
            if (options.sort == 'up') {
                result.sort(function (a, b) {
                    return (a < b) ? 1 : -1;
                });
            }
            else if (options.sort == 'down') {
                result.sort(function (a, b) {
                    return (a > b) ? 1 : -1;
                });
            }
        }
        return result;
    }

    public copyArray(arr) {
        var result: any[] = [];
        for (var i = 0; i < arr.length; i++)
            result[i] = arr[i];
        return result;
    }
    public copyObject(obj) {
        var result = {};
        for (var i in obj) {
            if (this.isObject(obj[i]))
                result[i] = this.copyObject(obj[i]);
            else
                result[i] = obj[i];
        }
        return result;
    };
    private mergeObjectIntoNewObject(destination, source) {
        var result = {};
        for (var i in destination)
            result[i] = destination[i];
        for (var i in source)
            result[i] = source[i];
        return result;
    }

    public getPropertyCase(obj, prop, noCase) {
        if (typeof prop != 'string')
            return obj[prop];
        if (noCase) {
            prop = prop.toLowerCase();
            for (let p in obj) {
                if (p.toLowerCase() === prop) {
                    return obj[p];
                }
            }
        }
        return obj[prop];
    }
    private findPropertyWithProp(obj, propName, prop, noCase) {
        if (noCase)
            prop = prop.toLowerCase();
        for (let p in obj) {
            if (obj[p]) {
                var found = obj[p][propName];
                if (noCase)
                    found = found.toLowerCase();
                if (found == prop)
                    return obj[p];
            }
        }
        return obj[prop];
    }
    public cleanObject(obj, exclude, noCase?) {
        var temp = {};
        if (typeof exclude == 'string') {
            if (noCase) {
                for (var key in obj) {
                    if (typeof key != 'string' || key.toLowerCase() != exclude.toLowerCase())
                        temp[key] = obj[key];
                }
            }
            else {
                for (var key in obj) {
                    if (key != exclude)
                        temp[key] = obj[key];
                }
            }
        }
        else {
            for (var key in obj) {
                if (obj[key] && obj[key] != exclude)
                    temp[key] = obj[key];
            }
        }
        return temp;
    }
    public isObject(item) {
        return typeof item != 'undefined' ? (typeof item === "object" && !Array.isArray(item) && item !== null) : false;
    }
    public isArray(item) {
        return typeof item != 'undefined' ? item.constructor == Array : false;
    }
    public getTag(text, tags) {
        if (text && tags) {
            text = text.toLowerCase();
            if (typeof tags == 'string') {
                if (text.indexOf('#' + tags.toLowerCase()) >= 0) {
                    return tags;
                }
            }
            else {
                for (var t = 0; t < tags.length; t++) {
                    if (text.indexOf('#' + tags[t].toLowerCase()) >= 0) {
                        return tags[t];
                    }
                }
            }
        }
        return '';
    }

    public isTag(text, tags) {
        if (text && tags) {
            text = text.toLowerCase();
            tags = (this.isArray(tags) ? tags : [tags]);
            for (var t = 0; t < tags.length; t++) {
                if (text.indexOf('#' + tags[t].toLowerCase()) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public getTagParameter(text, tag) {
        if (text && tag) {
            text = text.toLowerCase();
            var start = text.indexOf('#' + tag.toLowerCase());
            if (start >= 0) {
                start += tag.length + 1;
                if (text.charAt(start) == ':') {
                    start++;
                    var end = text.indexOf(',', start);
                    if (end < 0) end = text.length;
                    var param = text.substring(start, end);
                    if (param.charAt(0) == '"' || param.charAt(0) == "'")
                        return text.substring(start + 1, end - 1);
                    var number = this.val(param);
                    if (!isNaN(number))
                        return number;
                    return param;
                }
            }
        }
        return undefined;
    };

    private val(value) // made this just like one in  BJF
    {
        var base = 10;
        var result = 0;
        var s = value.substring(0, 1);
        switch (s) {
            case '$':
                value = value.substring(1);
                base = 16;
                result = parseInt(value, base);
                break;
            case '%':
                value = value.substring(1);
                base = 2;
                result = parseInt(value, base);
                break;
            default:
                result = parseFloat(value);
        }
        if (isNaN(result))
            result = 0;
        return result;
        /*
            var base = 10;
            if ( value.substring( 0, 1 ) == '$' )
            {
                value = value.substring( 1 );
                base = 16;
            }
            if ( value.substring( 0, 1 ) == '%' )
            {
                value = value.substring( 1 );
                base = 2;
            }
            return parseInt( value, base ); // Int??? BJF
            */
    };

    private skipSpaces(line) {
        var position = 0;
        while ((line.charAt(position) == ' ' || line.charAt(position) == '\t') && position < line.length)
            position++;
        return line.substring(position);
    }

    public flattenObject(objet) {
        var result: any[] = [];
        for (var i in objet)
            result.push(objet[i]);
        return result;
    }


    private getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    private getRotatedPoint(pivotX, pivotY, cornerX, cornerY, angle) {
        var x, y, distance, diffX, diffY;
        diffX = cornerX - pivotX;
        diffY = cornerY - pivotY;
        distance = Math.sqrt(diffX * diffX + diffY * diffY);
        angle += Math.atan2(diffY, diffX);
        x = pivotX + distance * Math.cos(angle);
        y = pivotY + distance * Math.sin(angle);
        return { x: x, y: y };
    };

    private getRotatedBoxPoints(x, y, width, height, rotation) {
        var x1 = x - (width / 2), y1 = y - (height / 2), x2 = x + (width / 2), y2 = y - (height / 2);
        var x3 = x + (width / 2), y3 = y + (height / 2), x4 = x - (width / 2), y4 = y + (height / 2);

        var c = this.getRotatedPoint(x, y, x1, y1, rotation);
        x1 = c.x; y1 = c.y;

        c = this.getRotatedPoint(x, y, x2, y2, rotation);
        x2 = c.x; y2 = c.y;

        c = this.getRotatedPoint(x, y, x3, y3, rotation);
        x3 = c.x; y3 = c.y;

        c = this.getRotatedPoint(x, y, x4, y4, rotation);
        x4 = c.x; y4 = c.y;

        return [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }, { x: x1, y: y1 }];
    };

    ///////////////////////////////////////////////////////////////////////////////
    //
    // Properties
    //
    ///////////////////////////////////////////////////////////////////////////////
    private getPropertyFromPath(root, path, throwError?) {
        var localPath = path;
        var localRoot = root;
        let index;
        if (!root) {
            if (throwError)
                throw { error: throwError, parameter: 'path: "' + path + '"' };
            return undefined;
        }
        var dot = localPath.indexOf('.');
        while (dot >= 0) {
            index = -1;
            var subpath = localPath.substring(0, dot);
            var start = subpath.indexOf('[');
            if (start >= 0) {
                var end = subpath.indexOf(']', start);
                if (end >= 0) {
                    index = parseInt(subpath.substring(start + 1, end));
                    subpath = subpath.substring(0, start);
                }
            }
            localRoot = localRoot[subpath];
            if (index >= 0)
                localRoot = localRoot[index];
            localPath = localPath.substring(dot + 1);
            let address;
            if (typeof localRoot == 'undefined') {
                if (throwError)
                    throw { error: throwError, parameter: address };
                return undefined;
            }
            dot = localPath.indexOf('.');
        }

        var value, /* index */ name;
        var start = localPath.indexOf('[');
        if (start >= 0) {
            var end = localPath.indexOf(']', start);
            if (end >= 0) {
                index = parseInt(localPath.substring(start + 1, end));
                name = localPath.substring(0, start);
                localRoot = localRoot[name];
                value = localRoot[index];
            }
        }
        else {
            name = localPath;
            index = undefined as any;
            value = localRoot[localPath];
        }
        return { root: root, localRoot: localRoot, path: path, localPath: localPath, name: name, index: index, value: value };
    };
    private getProperty(root, path, type, throwError, defaultValue) {
        let value;
        if (!path) {
            if (throwError)
                throw { error: throwError, parameter: type };
            return undefined;
        }
        if (typeof defaultValue != 'undefined')
            throwError = undefined;
        var property = this.getPropertyFromPath(root, path, throwError);
        if (typeof property == 'undefined')
            value = defaultValue;
        else
            value = property.value;
        return this.checkAndReturnValueOfType(value, type, throwError);
    };
    private setProperty(root, path, value, throwError) {
        var property = this.getPropertyFromPath(root, path);
        if (!property) {
            if (throwError)
                throw throwError;
            return;
        }
        if (value == '[]')
            value = [];
        if (value == '{}')
            value = {};
        if (typeof property.index != 'undefined')
            property.localRoot[property.index] = value;
        else
            property.localRoot[property.name] = value;
    };
    private getPropertyType(root, path, throwError) {
        var property = this.getPropertyFromPath(root, path, throwError);
        if (property && property.value) {
            if (typeof property.value == 'string') {
                return 'string';
            }
            else if (this.tvc.utilities.isObject(property.value)) {
                return 'object';
            }
            else if (this.tvc.utilities.isArray(property.value)) {
                return 'array';
            }
            else {
                return 'number';
            }
        }
        let type;
        if (throwError)
            throw { error: throwError, parameter: type };
        return '';
    };
    private checkAndReturnValueOfType(value, type, throwError) {
        switch (type) {
            case 'string':
                if (typeof value == 'string')
                    return value;
                break;
            case 'number':
                if (typeof value == 'number' || typeof value == 'boolean')
                    return value;
                break;
            case 'array':
                if (this.tvc.utilities.isArray(value))
                    return value;
                break;
            case 'object':
                if (!this.tvc.utilities.isObject(value))
                    return value;
                break;
            default:
                break;
        }
        if (throwError)
            throw { error: throwError, parameter: type };
        return undefined;
    }

    private getCharacterType(c) {
        let type;
        if (c >= '0' && c <= '9')
            type = 'number';
        else if (c == ' ' || c == "\t")
            type = 'space';
        else if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_')
            type = 'letter';
        else if (c == '"' || c == "'")
            type = 'quote';
        else if (c == ':')
            type = 'column';
        else if (c == ';')
            type = 'semicolumn';
        else if (c == '-' || c == '–')
            type = 'minus';
        else if (c == '(' || c == ')')
            type = 'bracket';
        else
            type = 'other';
        return type;
    }

    // Fix coordinates
    public getZone(rectangle, vars, scale) {
        rectangle = typeof rectangle == 'undefined' ? {} : rectangle;
        scale = typeof scale == 'undefined' ? { x: 1, y: 1, z: 1 } : scale;
        rectangle.x = typeof rectangle.x == 'undefined' ? 0 : rectangle.x;
        rectangle.y = typeof rectangle.y == 'undefined' ? 0 : rectangle.y;
        rectangle.width = isNaN(rectangle.width) ? vars.width : rectangle.width;
        rectangle.height = isNaN(rectangle.height) ? vars.height : rectangle.height;
        return { x: rectangle.x * scale.x, y: rectangle.y * scale.y, width: rectangle.width * scale.x, height: rectangle.height * scale.y };
    }

    public checkRectangle(rectangle, vars, dimension?) {
        rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : vars.x;
        rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : vars.y;
        if (dimension) {
            if (typeof rectangle.width == 'undefined' || typeof rectangle.height == 'undefined')
                throw { error: 'illegal_function_call', parameter: '' };
            if (rectangle.x + rectangle.width > dimension.width)
                rectangle.width = dimension.width - rectangle.x;
            if (rectangle.y + rectangle.height > dimension.height)
                rectangle.height = dimension.height - rectangle.y;
            if (rectangle.width <= 0 || rectangle.height <= 0)
                throw { error: 'illegal_function_call', parameters: [rectangle.width, rectangle.height] };
        }
        return rectangle;
    }

    public makeTransparentImage(image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        this.remapBlock(context, [{ r: 0, g: 0, b: 0 }], [{ r: 0, g: 0, b: 0, a: 0 }], { x: 0, y: 0, width: image.width, height: image.height });
        return canvas;
    }

    public flipCanvas(canvas, horizontal, vertical) {
        var flipCanvas = document.createElement('canvas');
        flipCanvas.width = canvas.width;
        flipCanvas.height = canvas.height;
        var flipContext = flipCanvas.getContext('2d')!;
        flipContext.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
        flipContext.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
        flipContext.drawImage(canvas, 0, 0);
        //flipContext.fillStyle = this.backgroundColor;
        //flipContext.fillRect( 0, 0, canvas.width, canvas.height );
        return flipCanvas;
    }

    public remapBlock(context, rgbaSource, rgbaDestination, coordinates) {
        // Do the remapping
        if (coordinates.width > 0 && coordinates.height > 0) {
            var imageData = context.getImageData(coordinates.x, coordinates.y, coordinates.width, coordinates.height);

            var data = imageData.data;
            if (rgbaSource.length == 1) {
                rgbaSource = rgbaSource[0];
                rgbaDestination = rgbaDestination[0];
                var alpha = typeof rgbaDestination.a != 'undefined';
                for (var p = 0; p < data.length; p += 4) {
                    if (data[p] == rgbaSource.r && data[p + 1] == rgbaSource.g && data[p + 2] == rgbaSource.b) {
                        data[p] = rgbaDestination.r;
                        data[p + 1] = rgbaDestination.g;
                        data[p + 2] = rgbaDestination.b;
                        if (alpha)
                            data[p + 3] = rgbaDestination.a;
                    }
                }
            }
            else {
                for (var p = 0; p < data.length; p += 4) {
                    for (var c = 0; c < rgbaSource.length; c++) {
                        var source = rgbaSource[c];
                        if (data[p] == source.r && data[p + 1] == source.g && data[p + 2] == source.b) {
                            var destination = rgbaDestination[c];
                            data[p] = destination.r;
                            data[p + 1] = destination.g;
                            data[p + 2] = destination.b;
                            if (typeof destination.a != 'undefined')
                                data[p + 3] = destination.a;
                        }
                    }
                }
            }
            context.putImageData(imageData, coordinates.x, coordinates.y);
        }
    }

    /**
     * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
     *
     * @param {HtmlElement} canvas
     * @param {int} width
     * @param {int} height
     * @param {boolean} resize_canvas if true, canvas will be resized. Optional.
     */
    public resample_canvas(canvas, width, height, resize_canvas) {
        var width_source = canvas.width;
        var height_source = canvas.height;
        width = Math.round(width);
        height = Math.round(height);

        var ratio_w = width_source / width;
        var ratio_h = height_source / height;
        var ratio_w_half = Math.ceil(ratio_w / 2);
        var ratio_h_half = Math.ceil(ratio_h / 2);

        var ctx = canvas.getContext("2d");
        var img = ctx.getImageData(0, 0, width_source, height_source);
        var img2 = ctx.createImageData(width, height);
        var data = img.data;
        var data2 = img2.data;

        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var x2 = (i + j * width) * 4;
                var weight = 0;
                var weights = 0;
                var weights_alpha = 0;
                var gx_r = 0;
                var gx_g = 0;
                var gx_b = 0;
                var gx_a = 0;
                var center_y = (j + 0.5) * ratio_h;
                var yy_start = Math.floor(j * ratio_h);
                var yy_stop = Math.ceil((j + 1) * ratio_h);
                for (var yy = yy_start; yy < yy_stop; yy++) {
                    var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                    var center_x = (i + 0.5) * ratio_w;
                    var w0 = dy * dy; //pre-calc part of w
                    var xx_start = Math.floor(i * ratio_w);
                    var xx_stop = Math.ceil((i + 1) * ratio_w);
                    for (var xx = xx_start; xx < xx_stop; xx++) {
                        var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                        var w = Math.sqrt(w0 + dx * dx);
                        if (w >= 1) {
                            //pixel too far
                            continue;
                        }
                        //hermite filter
                        weight = 2 * w * w * w - 3 * w * w + 1;
                        var pos_x = 4 * (xx + yy * width_source);
                        //alpha
                        gx_a += weight * data[pos_x + 3];
                        weights_alpha += weight;
                        //colors
                        if (data[pos_x + 3] < 255)
                            weight = weight * data[pos_x + 3] / 250;
                        gx_r += weight * data[pos_x];
                        gx_g += weight * data[pos_x + 1];
                        gx_b += weight * data[pos_x + 2];
                        weights += weight;
                    }
                }
                data2[x2] = gx_r / weights;
                data2[x2 + 1] = gx_g / weights;
                data2[x2 + 2] = gx_b / weights;
                data2[x2 + 3] = gx_a / weights_alpha;
            }
        }
        //clear and resize canvas
        if (resize_canvas === true) {
            canvas.width = width;
            canvas.height = height;
        } else {
            ctx.clearRect(0, 0, width_source, height_source);
        }

        //draw
        ctx.putImageData(img2, 0, 0);
    }
    public loadUnlockedImages(pathArray, options, callback, extra?) {
        var error: any = false;
        var images = {};
        var count = pathArray.length;
        for (var p = 0; p < pathArray.length; p++) {
            var path = pathArray[p];
            var name = this.getFilename(path);
            this.loadUnlockedImage(path, options, function (response, data, extra) {
                images[extra] = data;
                if (!response)
                    error |= (true as any);
                count--;
                if (count == 0)
                    callback(!error, images, extra);
            }, name);
        }
    }

    public loadImage(path, options, callback, extra?) {
        var self = this;
        options = options ? options : {};
        var name = this.getFilename(path);
        var extension = this.getFilenameExtension(path);
        path = path.substring(0, path.length - (name.length + extension.length + 1));
        var type = options.type ? options.type : undefined;
        switch (extension.toLowerCase()) {
            case 'gif':
                type = type ? type : 'image/png';
                extension = 'gif';
                break;
            case 'jpg':
            case 'jpeg':
                type = type ? type : 'image/jpeg';
                extension = 'jpeg';
                break;
            case 'png':
                type = type ? type : 'image/png';
                extension = 'png';
                break;
            default:
                type = type ? type : 'image/png';
                break;
        }
        /*   if (this.TVC_Files['image_' + name]) {
              loadIt(this.TVC_Files['image_' + name]);
          }
          else { */
        // this.tvc.loadingMax++; başta yüklemiyoruz.
        this.loadPng(path + name + '.' + extension, options, function (response, data, extra) {
            /*   if (response) {
                  loadIt(self.TVC_Files['image_' + name]);
              }
              else {
                  self.tvc.loadingCount++; */
            callback(true, data, extra);
            // }
        }, extra);
        // }
    }

    public loadUnlockedImage(path, options, callback, extra?) {
        var self = this;
        options = options ? options : {};
        var name = this.getFilename(path);
        var extension = this.getFilenameExtension(path);
        path = path.substring(0, path.length - (name.length + extension.length + 1));
        var type = options.type ? options.type : undefined;
        switch (extension.toLowerCase()) {
            case 'gif':
                type = type ? type : 'image/png';
                extension = 'js';
                break;
            case 'jpg':
            case 'jpeg':
                type = type ? type : 'image/jpeg';
                extension = 'js';
                break;
            case 'png':
                type = type ? type : 'image/png';
                extension = 'js';
                break;
            default:
                type = type ? type : 'image/png';
                break;
        }
        if (this.TVC_Files['image_' + name]) {
            loadIt(this.TVC_Files['image_' + name]);
        }
        else {
            this.tvc.loadingMax++;
            this.loadScript(path + name + '.' + extension, options, function (response, data, extra) {
                if (response) {
                    loadIt(self.TVC_Files['image_' + name]);
                }
                else {
                    self.tvc.loadingCount++;
                    callback(false, null, extra);
                }
            }, extra);
        }
        function loadIt(base64) {
            self.tvc.loadingCount++;
            var arrayBuffer = self.convertStringToArrayBuffer(base64);
            var blob = new Blob([arrayBuffer], { type: type });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            var image = new Image();
            image.onload = function () {
                callback(true, this, extra);
            };
            image.src = imageUrl;
        }
    }

    public loadUnlockedSound(path, options, callback, extra) {
        var self = this;
        var name = 'sound_' + this.getFilename(path);
        if (this.TVC_Files[name]) {
            loadIt(this.TVC_Files[name]);
            if (!options.keepSource)
                this.TVC_Files[name] = null;
        }
        else {
            this.tvc.loadingMax++;
            this.loadScript(path, options, function (response, data, extra) {
                self.tvc.loadingCount++;
                if (response) {
                    if (this.TVC_Files[name]) {
                        loadIt(this.TVC_Files[name]);
                        if (!options.keepSource)
                            this.TVC_Files[name] = null;
                    }
                    else {
                        callback(false, null, extra);
                    }
                }
                else {
                    callback(false, null, extra);
                }
            }, extra);
        }
        function loadIt(source) {
            self.tvc.loadingMax++;
            if (Howl) {
                var sound = new Howl({ src: [source] });
                sound.on("load", function () {
                    self.tvc.loadingCount++;
                    callback(true, sound, extra);
                });
                sound.on("loaderror", function () {
                    self.tvc.loadingCount++;
                    callback(false, null, extra);
                });
            }
        }
    }

    public loadMultipleUnlockedSound(path, number, options, callback, extra?) {
        var result: any[] = [];
        for (var n = 0; n < number; n++) {
            this.loadUnlockedSound(path, { keepSource: true }, function (response, sound, num) {
                if (response) {
                    result.push(sound);
                    if (result.length == number)
                        callback(true, result, extra);
                }
            }, n);
        }
    }

    private loadUnlockedBankElement(path, options, callback, extra) {
        var self = this;
        var name = 'bank_' + options.name;
        if (this.TVC_Files[name]) {
            callback(true, this.TVC_Files[name]);
            //if ( !options.keepSource )
            //	TVC_Files[ name ] = null;
        }
        else {
            this.tvc.loadingMax++;
            this.loadScript(path, options, function (response, data, name2) {
                self.tvc.loadingCount++;
                if (response) {
                    /*
                    debugger;
                    if ( TVC_Files[ 'bank_10' ] && TVC_Files[ 'bank_11' ] )
                    {
                        if ( TVC_Files[ 'bank_10' ] == TVC_Files[ 'bank_11' ] )
                        {
                            var merde = 1;
                        }
                    }
                    */
                    var arrayBuffer = self.convertStringToArrayBuffer(this.TVC_Files[name2]);
                    //if ( !options.keepSource )
                    //	TVC_Files[ name2 ] = null;
                    callback(true, arrayBuffer, extra);
                }
                else {
                    callback(false, null, extra);
                }
            }, name);
        }
    }

    private findEndOfLine(text, pos) {
        if (pos >= text.length)
            return pos;

        var p1 = text.indexOf('\r\n', pos);
        var p2 = text.indexOf('\n', pos);
        if (p1 >= 0 && p2 >= 0) {
            if (p2 == p1 + 1)
                return p1;
            if (p2 < p1)
                return p2;
            return p1;
        }
        if (p1 >= 0)
            return p1;
        if (p2 >= 0)
            return p2;
        return text.length;
    }

    private findNextLine(text, pos) {
        if (pos >= text.length)
            return 0;

        if (text.indexOf('\r\n', pos) == pos)
            return pos + 2;
        return pos + 1;
    }

    private findStartOfLine(text, pos) {
        while (text.charCodeAt(pos) != 10 && pos > 0)
            pos--;
        if (pos > 0) {
            pos++;
            return pos;
        }
        return -1;
    }

}

