import { ByteArray } from "../float";
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { Stream } from "../IO/Stream";
import { MethodInfo } from "./MethodInfo";

/* export class StringResourceItem extends Dictionary<string, string> {

}
export class StringResource extends Dictionary<string, StringResourceItem> {

} */

export interface IResource {
    culture: string;
    resources: IResourcePage[];
}
export interface IResourcePage {
    name: string;
    resources: IResourceItem[];
}
export interface IResourceItem {
    key: string;
    value: ByteArray | string;
}
export class Assembly {
    public EntryPoint: MethodInfo = null as any;
    public static  Resources: IResource[] = [];
    public static Load(path: string):Assembly {
        throw new NotImplementedException('');
    }

    public GetManifestResourceStream(name: string): Stream {
        return null as any;
    }
    public static GetEntryAssembly(): Assembly {
        return null as any;
    }
    public static GetCallingAssembly(): Assembly {
        return null as any;
    }
    public GetName(): any {
        return {};
    }
}