import { Base64Thing } from "./Base64/Base64";

export class InternalUtils {
    public static Base64Encode(text: string) {
        var bytes: any = [];
        for (let i = 0; i < text.length; i++) {
            var realBytes = unescape(encodeURIComponent(text[i]));
            for (let j = 0; j < realBytes.length; j++) {
                bytes.push(realBytes[j].charCodeAt(0));
            }
        }
        const B64 = new Base64Thing();
        var encoded = B64.Uint8ToBase64(bytes);
        return encoded;
    }
    public static Base64Decode(text: string) {
        const B64 = new Base64Thing();
        const bytes = B64.B64ToByteArray(text);
        const encodedString = String.fromCharCode.apply(null, bytes);
        const decoded = decodeURIComponent(escape(encodedString));
        return decoded;
    }
}