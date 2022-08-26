import { int } from "../float";
import { LoadQueue } from "./LoadQueue";
import { File } from "../IO/File";
import { FileStream } from '../IO/FileStream';
import { using } from '../Disposable/dispose';
import { Browser } from '../Modulation/Browser';
import { TBuffer } from '../IO/Buffer/TBuffer';
import { Encoding } from '../Encoding/Encoding';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';

const cache: any = {};
export class TLoader {
    public static LoadBinary(url: string): Promise<ArrayBuffer> {
        if (cache[url]) {
            return new Promise((resolve, reject) => {
                resolve(cache[url]);
            });
        } else {
            return new Promise((resolve, reject) => {
                var preload = new LoadQueue();
                preload.addEventListener("fileload", (event: any) => {
                    cache[url] = event.result;
                    resolve(event.result);
                });
                preload.LoadFile({
                    src: url,
                    type: 'binary'
                });
            });
        }
    }

    public static LoadToFileSystem(url: string, path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            TLoader.LoadImage(url).then((image: HTMLImageElement) => {
                const context = Browser.CreateRenderingContext(image.width, image.height);
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, image.width, image.height).data;
                const buffer: TBuffer = new TBuffer();
                buffer.writeUint32(image.width); // image width
                buffer.writeUint32(image.height); // image height
                buffer.writeUint32(imageData.byteLength); // data length
                buffer.writeBytes(imageData);

                using(File.OpenWrite(path), (fs: FileStream) => {
                    fs.Write(new Uint8Array(buffer.buffer), 0, buffer.byteLength);
                    fs.Flush();
                    fs.Close();
                });
                resolve(true);
            });
        });
    }

    public static LoadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            var preload = new LoadQueue();
            preload.addEventListener("fileload", (event: any) => {
                resolve(event.result);
            });
            preload.LoadFile({
                src: url,
                type: 'image'
            });
        });
    }

    public static LoadJSON<T>(url: string): Promise<T>;
    public static LoadJSON<T>(url: string, filepath: string): Promise<boolean>;
    public static LoadJSON<T>(...args: any[]): Promise<T> {
        if (args.length === 1) {
            const url = args[0];
            return new Promise((resolve, reject) => {
                var preload = new LoadQueue();
                preload.addEventListener("fileload", (event: any) => {
                    resolve(event.result);
                });
                preload.LoadFile({
                    src: url,
                    type: 'json'
                });
            });
        } else if (args.length === 2) {
            const url = args[0];
            const path = args[1];
            return new Promise((resolve, reject) => {
                TLoader.LoadJSON(url).then(obj => {
                    using(File.OpenWrite(path), (fs: FileStream) => {
                        const bytes = Encoding.UTF8.GetBytes(JSON.stringify(obj));
                        fs.Write(bytes, 0, bytes.length);
                        fs.Flush();
                        fs.Close();
                        resolve(true as any);
                    });
                });
            });
        }
        throw new ArgumentOutOfRangeException('');
    }
    public static LoadJavaScript(url: string): Promise<HTMLScriptElement> {
        return new Promise((resolve, reject) => {
            var preload = new LoadQueue();
            preload.addEventListener("fileload", (event: any) => {
                resolve(event.result);
            });
            preload.LoadFile({
                src: url,
                type: 'javascript'
            });
        });
    }

    public static LoadBinaryRange(url: string, start: int = 0, end = null): Promise<any> {
        const authHeaderValue = ''; //`Bearer ${token}`;

        const fetchSettings = {
            headers: new Headers({
                Authorization: authHeaderValue,
                Range: `bytes=${start}-${end ? end : ''}`
            })
        };

        const fetchMethod = fetch(url, fetchSettings);
        const data = fetchMethod.then((res) => res.arrayBuffer());
        const header = fetchMethod.then((res) => res.headers.get('Content-Range'));

        return Promise.all([data, header]).then(([data, contentRange]) => ({
            data,
            contentRange
        }));
    }
}