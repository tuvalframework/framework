import { TCompress } from "../Compress/TCompress";
    const path = require('path');
    const fs = require('fs');

export function createBios(srcFilePath: string, destBiosPath:string) {


const fileName = srcFilePath;
const fileName1 = destBiosPath;

const a = fs.readFileSync(fileName);
const bytes = TCompress.CompressBytes(a);


fs.writeFileSync(fileName1, bytes);

//const bytes1 = TCompress.DeCompressBytes(bytes);

}