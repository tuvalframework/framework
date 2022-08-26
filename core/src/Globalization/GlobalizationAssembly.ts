import { Hashtable } from "../Collections/Hashtable";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { TObject } from "../Extensions/TObject";
import { int } from "../float";
import { Assembly } from "../Reflection/Assembly";


export class GlobalizationAssembly extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    private static m_assemblyHash: Hashtable<Assembly, GlobalizationAssembly>;
    public/* internal */ static m_defaultInstance: GlobalizationAssembly;
    public /* internal */  compareInfoCache: Hashtable = null as any;
    public /* internal */ pNativeGlobalizationAssembly: int = 0;
    public static StaticConstructor() {
        GlobalizationAssembly.m_assemblyHash = new Hashtable(4);
        /*  lock(typeof (GlobalizationAssembly))
         { */
        if (GlobalizationAssembly.m_defaultInstance == null) {
            console.warn('GlobalizationAssembly.m_defaultInstance not defined.');
            //GlobalizationAssembly.m_defaultInstance = GlobalizationAssembly.GetGlobalizationAssembly(Assembly.GetAssembly(typeof (GlobalizationAssembly)));
        }
        // }
    }

    public constructor() {
        super();
        this.compareInfoCache = new Hashtable(4);
    }

    public /* internal */ static GetGlobalizationAssembly(assembly: Assembly): GlobalizationAssembly {
        const item: GlobalizationAssembly = GlobalizationAssembly.m_assemblyHash.Get(assembly);
        let globalizationAssembly: GlobalizationAssembly = item;
        if (item == null) {
            /*  lock(typeof (GlobalizationAssembly))
             { */
            const item1: GlobalizationAssembly = GlobalizationAssembly.m_assemblyHash.Get(assembly);
            globalizationAssembly = item1;
            if (item1 == null) {
                globalizationAssembly = new GlobalizationAssembly();
                globalizationAssembly.pNativeGlobalizationAssembly = GlobalizationAssembly.nativeCreateGlobalizationAssembly(assembly)
                GlobalizationAssembly.m_assemblyHash.Set(assembly, globalizationAssembly);
            }
            //}
        }
        return globalizationAssembly;
    }
    private static nativeCreateGlobalizationAssembly(assembly: Assembly): int {
        throw new NotImplementedException('');
    }
}

GlobalizationAssembly.StaticConstructor();