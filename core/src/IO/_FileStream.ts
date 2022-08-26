import { Console } from '../Console';
import { dirname } from "path";
import { Exception } from "../Exception";
import { TString } from "../Extensions";
import { ByteArray, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { FileAccess } from "./FileAccess";
import { FileMode } from "./FileMode";
import { FS, FSNode, FSStream, IDBFS, PATH } from "./Internals/FS";
import { Path } from "./Path";
import { SeekOrigin } from "./SeekOrigin";
import { Stream } from "./Stream";
import { SystemEvents } from '../SystemEvents';
import { FileShare } from './FileShare';
import { FileOptions } from './FileOptions';

export class _FileStream extends Stream {
    private openFile: FSStream = null as any;
    private filePath: string = '';
    private dirPath: string = '';
    private fileName: string = '';
    private m_Position: int = 0;

    protected Get_CanRead(): boolean {
        return true;
    }
    protected Get_CanSeek(): boolean {
        return true;
    }
    protected Get_CanWrite(): boolean {
        return true;
    }
    protected Get_Length(): number {
        throw new Error("Method not implemented.");
    }
    protected Get_Position(): number {
        return this.m_Position;
    }
    protected Set_Position(value: number) {
        this.m_Position = value;
    }
    public Flush(): void {
        FS.syncfs();
    }
    public Read(buffer: ByteArray, offset: number, count: number): number {
        if (this.openFile && this.openFile.isRead) {
            const readBytes: int = FS.read(this.openFile, buffer, offset, count);
            if (readBytes > -1) {
                this.m_Position = offset + readBytes;
            }
            return readBytes;
        }
        return -1;
    }
    public Seek(offset: number, origin: SeekOrigin): number {
        throw new Error("Method not implemented.");
    }
    public SetLength(value: number): void {
        throw new Error("Method not implemented.");
    }
    public Write(buffer: ByteArray, offset: number, count: number): void {
        if (this.openFile && this.openFile.isWrite) {
            FS.write(this.openFile, buffer, offset, count);
        }
    }

    @Override
    public Close(): void {
        FS.close(this.openFile);
    }
    public constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare = FileShare.None, bufferSize: int = 4096, options: FileOptions = FileOptions.None) {

        super();
        // #if process.env.NODE_ENV === 'DEVELOPMENT'
        console.log('lorem')
        console.log('ipsum')
        // #endif
        this.filePath = path;
        this.dirPath = Path.GetDirectoryName(path);
        this.fileName = Path.GetDirectoryName(path);
        if (this.dirPath == null) {
            throw new Exception('Root Not Found.');
        }

        let newPath = path.replace(':\\', '\\');
        let dicArray: string[] = [];
        let i: number = 0;
        while (newPath != null && newPath !== '') {
            const directoryName = Path.GetDirectoryName(newPath);
            if (directoryName == null || directoryName === '') {
                break;
            }
            ///Console.WriteLine("GetDirectoryName('{0}') returns '{1}'", filePath, directoryName);
            const fileName = Path.GetFileName(directoryName);
            if (fileName !== '') {
                dicArray.push(fileName);
            } else if (directoryName !== '') {
                dicArray.push(directoryName);
            }

            newPath = directoryName;
            /*  if (i == 1) {
               filePath = directoryName + "\\";  // this will preserve the previous path
             } */
            i++;
        }
        dicArray = dicArray.reverse();

        //dirName = '/' + TString.ReplaceAll(dirName, '\\', '/');
        let currentDicName = '';
        for (let i = 0; i < dicArray.length; i++) {
            currentDicName += '/' + dicArray[i];
            const analyzeObject = FS.analyzePath(currentDicName);
            if (!analyzeObject.exists) {
                FS.mkdir(currentDicName);
            }
        }
        /*  try {
             const lookup = FS.lookupPath(currentDicName, { follow_mount: false });
             if (!(lookup && lookup.node && lookup.node.mounted)) {
                 FS.mount(IDBFS, { root: '.' }, currentDicName);
             }
         } catch (e) {
             FS.mount(IDBFS, { root: '.' }, currentDicName);
         } */

        const fileName = Path.GetFileName(path);
        let file;
        try {
            let fileInfo = FS.lookupPath(currentDicName + '/' + fileName);
            if (fileInfo && fileInfo.node) {
                file = fileInfo.node;
            } else {
                file = FS.createFile(currentDicName, fileName);
            }

        } catch (e) {
            file = FS.createFile(currentDicName, fileName);
        }
        let accessStr: string = (access === FileAccess.Write ? 'w' : (access === FileAccess.Read ? 'r' : 'wr'));

        this.openFile = FS.open(file, accessStr);
        // this.fsNode = FS.createFile();
    }
    @Override
    protected dispose(disposing: boolean): void {
        try {
            this.FlushWrite(!disposing);
        }
        finally {
        }
    }
    // Writes are buffered.  Anytime the buffer fills up
    // (_writePos + delta > _bufferSize) or the buffer switches to reading
    // and there is left over data (_writePos > 0), this function must be called.
    private FlushWrite(calledFromFinalizer: boolean): void {
        //Contract.Assert(_readPos == 0 && _readLen == 0, "FileStream: Read buffer must be empty in FlushWrite!");

        //WriteCore(_buffer, 0, _writePos);

        //_writePos = 0;
    }
}

(function () {
    FS.mkdir('/C');
    FS.mount(IDBFS, {}, '/C');
    FS.syncfs(true, function (err) {
        SystemEvents.OnFileSystemReady();
    });
})();