import { TCompress } from "../Compress/TCompress";
import { Encoding } from "../Encoding/Encoding";
import { TBuffer } from "../IO/Buffer/TBuffer";

const path = require('path');
const fs = require('fs');


/* process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
}); */
export function appPackager(appJsFile: string, targetAppName: string, libName: string = '') {
    function getHeader(scriptStr, name?) {
        const libNames = [
            'buttons',
            'calendars',
            'charts',
            'compression',
            'core',
            'data',
            'diagram',
            'dropdowns',
            'excelexport',
            'filemanager',
            'fileutils',
            'grids',
            'inputs',
            'layouts',
            'lists',
            'navigations',
            'pdfexport',
            'popups',
            'splitbuttons',
            'svgbase',
            'codeeditor',
            'query-builder',
            'spreadsheet',
            'kanban'
        ]
        const header = {};

        libNames.forEach(lib => {
            if (scriptStr.indexOf('realmocean$' + lib) > -1 && name !== lib) {
                header['realmocean$' + lib] = true;
            }
        });

        return header;
    }

    const filename = appJsFile;
    const targetfile = targetAppName;
    const a = fs.readFileSync(filename);
    const compressedBytes = TCompress.CompressBytes(a);
    const scriptStr = Encoding.UTF8.GetString(a);
    const headerObj = getHeader(scriptStr, libName);
    const headerJSON = JSON.stringify(headerObj);
    const headerJSONBytes = Encoding.UTF8.GetBytes(headerJSON);
    const buffer = new TBuffer();
    buffer.writeInt32(headerJSONBytes.length);
    buffer.writeBytes(headerJSONBytes);
    buffer.writeInt32(compressedBytes.length);
    buffer.writeBytes(compressedBytes);
    fs.writeFileSync(targetfile, Buffer.from(buffer.buffer, 0, buffer.offset));
}