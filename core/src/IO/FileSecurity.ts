import { SafeFileHandle } from "../Marshal/IntPtr";
import { AccessControlSections } from "../security/AccessControl/AccessControlSections";

export class FileSecurity {
    public constructor(handle: SafeFileHandle, includeSections: AccessControlSections);
    public constructor(path: string, includeSections: AccessControlSections);
    public constructor(...args: any[]) {

    }
    public PersistModifications(path: string) {

    }
}