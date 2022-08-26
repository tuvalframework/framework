import { Delegate } from "./Delegate";
import { Event } from "./Event";
export class FileSystemReadyDelegate extends Delegate<()=>void> {}
export class SystemEvents {
    public static OnFileSystemReady:Event<FileSystemReadyDelegate> = new Event<FileSystemReadyDelegate>();
}

