import { long } from "../float";
import { FileAttributes } from "./FileAttributes";

export class MonoIOStat {
    public Attributes: FileAttributes = null as any;
    public Length: long = null as any;
    public CreationTime: long = null as any;
    public LastAccessTime: long = null as any;
    public LastWriteTime: long = null as any;
}