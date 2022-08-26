import { BindingFlags } from "./BindingFlags";
import { MemberTypes } from "./MemberTypes";
import { MethodBase } from "./MethodBase";

type Binder = any;
type CultureInfo = any;

export abstract class ConstructorInfo extends MethodBase {

	public static readonly ConstructorName: string = ".ctor";
	public static readonly TypeConstructorName: string = ".cctor";

	protected constructor() {
		super();
	}

	protected /* override */  Get_MemberType(): MemberTypes {
		return MemberTypes.Constructor;
	}

	public Invoke(parameters: any[]): any;
	public /* abstract */  Invoke(invokeAttr: BindingFlags, binder: Binder, parameters: any[], culture: CultureInfo): any;
	public Invoke(...args: any[]): any {
		if (args.length === 1) {
			const parameters: any[] = args[0];
			return this.Invoke(BindingFlags.CreateInstance, null, parameters ?? [], null);
		}

	}
}
