import { ByteArray } from '@tuval/core';
export interface IUploadFileReady {
    GetFileContentAsString(): string;
    fileName: string;
    fileExt: string;
    fileAsByteArray: ByteArray,
    file: any;
}