import { int } from '../float';
import { TString } from '../Text/TString';

    export function validateUtf8(text: string): boolean {
        var bytes = textToBytes(text);
        var length = bytes.length;

        function invalidUtf8(text: string): boolean {
            //throw new Error("Invalid UTF8" + text);
            return false;
        };

        for (let i = 0; i < length; ) {
            var byte: int = bytes[i];

            // Four-byte sequence start
            if (isFourByte(byte)) {

                // A four-byte sequence start must be continued by three continuation bytes
                if (i + 3 >= length) {
                   return invalidUtf8(TString.Format("Expected 3 bytes after {0} byte, found {1}",nthPostfix(i), length - 1 - i));
                }

                if (!isContinuationByte(bytes[i + 1])) {
                   return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 1)));
                }
                if (!isContinuationByte(bytes[i + 2])) {
                   return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 2)));
                }
                if (!isContinuationByte(bytes[i + 3])) {
                   return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 3)));
                }

                i += 4;
            }

            // Three-byte sequence start
            else if (isThreeByte(byte)) {

                // A three-byte sequence start must be continued by two continuation bytes
                if (i + 2 >= length) {
                   return invalidUtf8(TString.Format("Expected 2 bytes after {0} byte, found {1}",nthPostfix(i), length - 1 - i));
                }

                if (!isContinuationByte(bytes[i + 1])) {
                    return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 1)));
                }
                if (!isContinuationByte(bytes[i + 2])) {
                   return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 2)));
                }

                i += 3;
            }

            // Two-byte sequence start
            else if (isTwoByte(byte)) {

                // A two-byte sequence start must be continued by one continuation byte
                if (i + 1 >= length) {
                    return invalidUtf8(TString.Format("Expected 1 byte after {0} byte, found 0",nthPostfix(i)));
                }

                if (!isContinuationByte(bytes[i + 1])) {
                    return invalidUtf8(TString.Format("{0} byte must be a continuation byte",nthPostfix(i + 1)));
                }

                i += 2;
            }

            // Single-byte code
            else if (isSingleByte(byte)) {
                i += 1;
            }

            else if (isContinuationByte(byte)) {
               return invalidUtf8(TString.Format("Unexpected continuation byte at position {0}",i + 1));
            }

            else {
               return invalidUtf8(TString.Format("Invalid byte at position {0} (0x{1})",i + 1, byte.toString(16)));
            }
        }

        return true;

    }

    // Continuation bytes: 10xxxxxx (10000000..10111111)
    var b10000000 = parseInt("10000000", 2);
    var b10111111 = parseInt("10111111", 2);
    function isContinuationByte(byte) {
        return (byte >= b10000000) && (byte <= b10111111);
    }

    // Four-byte sequence: 11110xxx (11110000..11110111)
    var b11110000 = parseInt("11110000", 2);
    var b11110111 = parseInt("11110111", 2);
    function isFourByte(byte) {
        return (byte >= b11110000) && (byte <= b11110111);
    }

    // Three-byte sequence: 1110xxxx (11100000..11101111)
    var b11100000 = parseInt("11100000", 2);
    var b11101111 = parseInt("11101111", 2);
    function isThreeByte(byte) {
        return (byte >= b11100000) && (byte <= b11101111);
    }

    // Two-byte sequence: 110xxxxx (11000000..11011111)
    var b11000000 = parseInt("11000000", 2);
    var b11011111 = parseInt("11011111", 2);
    function isTwoByte(byte) {
        return (byte >= b11000000) && (byte <= b11011111);
    }

    // Single-byte sequence: 0xxxxxxx (00000000..01111111)
    var b01111111 = parseInt("01111111", 2);
    function isSingleByte(byte) {
        return (byte >= 0) && (byte <= b01111111);
    }

    function nthPostfix(i) {
        var j = i % 10,
            k = i % 100;

        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    function textToBytes (text) {
        const bytes: int[] = [];

        for (let i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);

            // Single-byte UTF8
            if (charCode < 0x80) {
                bytes.push(charCode);
            }

            // Two-byte UTF8 sequence
            else if (charCode < 0x800) {
                bytes.push((charCode >> 6) | 0xc0, (charCode & 0x3f) | 0x80);
            }

            // Three byte UTF8 sequence
            else if (charCode < 0xd800 || charCode >= 0xe000) {
                bytes.push((charCode >> 12) | 0xe0, ((charCode>>6) & 0x3f) | 0x80, (charCode & 0x3f) | 0x80);
            }

            // Four-byte UTF8 sequence, encoded in two pairs of two bytes
            else {
                var nextChar = text.charCodeAt(i+1);
                var high = (charCode & 0x3ff) << 10;
                var low = nextChar & 0x3ff;
                charCode = high + low + 0x10000;
                bytes.push((charCode >>18) | 0xf0, ((charCode>>12) & 0x3f) | 0x80, ((charCode>>6) & 0x3f) | 0x80, (charCode & 0x3f) | 0x80);
                i++;
            }
        }

        return bytes;
    }
