import { TCompress } from "../Compress/TCompress";
import { Encoding } from "../Encoding/Encoding";
import { TBuffer } from "../IO/Buffer/TBuffer";

const path = require('path');
const fs = require('fs');

export function publish(distfolder: string, componentsFolder: string, libFolder: string){

const directoryPath = path.join(distfolder);

const dirs = fs.readdirSync(directoryPath);

dirs.forEach(function(dir) {
    if (fs.lstatSync(path.join(directoryPath, dir)).isFile()) {
        if (path.extname(path.join(directoryPath, dir)) === '.js') {
            //console.log(path.join(directoryPath, dir));
            const fileName = path.join(directoryPath, dir);
            const a = fs.readFileSync(fileName);
            const compressedBytes = TCompress.CompressBytes(a);
            /* const base64 = tuval.Convert.ToBase64String(a);
            const base64bytes = tuval.Encoding.UTF8.GetBytes(base64); */
            const __buffer = new Buffer(a);
            const scriptStr = __buffer.toString('utf8'); //tuval.Encoding.UTF8.GetString(a);

            const headerObj = getHeader(scriptStr);
            console.log(headerObj);

            const headerJSON = JSON.stringify(headerObj);
            const headerJSONBytes = Encoding.UTF8.GetBytes(headerJSON); // new Uint8Array(Buffer.from(headerJSON, 'utf-8').buffer);

            //console.log(scriptStr);
            const buffer = new TBuffer();
            buffer.writeInt32(headerJSONBytes.length);
            buffer.writeBytes(headerJSONBytes);
            buffer.writeInt32(compressedBytes.length);
            buffer.writeBytes(compressedBytes);
            //const base64 = tuval.Convert.ToBase64String(a);
            const packageName = fileName.replace('.js', '.app');
            console.log(buffer.buffer);
            fs.writeFileSync(packageName, Buffer.from(buffer.buffer, 0, buffer.offset) /*  tuval.Encoding.UTF8.GetBytes(base64) */ );
            //console.log(packageName);
        }
    }
});

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
        'spreadsheet'
    ]
    const header = {};

    libNames.forEach(lib => {
        if (scriptStr.indexOf('tuval$components$' + lib) > -1 && name !== lib) {
            header['tuval$components$' + lib] = true;
        }
    });

    return header;
}

packageLib();

function packageLib() {

    const directoryPath = componentsFolder;
    const targetPath = libFolder;

    const dirs = fs.readdirSync(directoryPath);

    dirs.forEach(function(dir) {
        if (fs.lstatSync(path.join(directoryPath, dir)).isDirectory()) {
            if (path.extname(path.join(directoryPath, dir, 'index.js')) === '.js') {
                //console.log(path.join(directoryPath, dir));
                const fileName = path.join(directoryPath, dir, 'index.js');
                const a = fs.readFileSync(fileName);
                const compressedBytes = TCompress.CompressBytes(a);
                /*const base64 = tuval.Convert.ToBase64String(a);
                  const base64bytes = tuval.Encoding.UTF8.GetBytes(base64);
                */
                const scriptStr = Encoding.UTF8.GetString(a);

                const headerObj = getHeader(scriptStr, dir);

                const headerJSON = JSON.stringify(headerObj);
                const headerJSONBytes = Encoding.UTF8.GetBytes(headerJSON);

                //console.log(scriptStr);
                const buffer = new TBuffer();
                buffer.writeInt32(headerJSONBytes.length);
                buffer.writeBytes(headerJSONBytes);
                buffer.writeInt32(compressedBytes.length);
                buffer.writeBytes(compressedBytes);
                /*  for (let i = 0; i < bytes.length; i++) {
                     buffer.writeByte(bytes[i]);
                 } */

                //const base64 = tuval.Convert.ToBase64String(a);
                const packageName = path.join(targetPath, 'tuval$components$' + dir + '.lib'); //fileName.replace('.js', '.app');
                console.log(fileName + ' ' + buffer.length);
                fs.writeFileSync(packageName, Buffer.from(buffer.buffer, 0, buffer.offset) /*  tuval.Encoding.UTF8.GetBytes(base64) */ );
                //console.log(packageName);
            }
        }
    });
}

}