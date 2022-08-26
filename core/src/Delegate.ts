/* import { ClassInfo } from './Reflection/Decorators/ClassInfo';
import { System } from './SystemTypes'; */

/* export class Delegate<TArgs = any> extends Function {
	constructor(private method: (sender: any, e: TArgs) => void) {
		super();
		return this.method as any;
	}
} */

function arrayRemove(arr, value) {
	return arr.filter(function (ele) {
		return ele !== value;
	});
}
/* @ClassInfo({
	fullName: System.Types.Delegate,
	instanceof: [
		System.Types.Delegate,
	]
}) */
export class Delegate<TMethod extends Function = any> extends Function {
	private subjects: TMethod[];
	constructor(method?: TMethod) {
		super();

		this.subjects = [];
		const self = this;
		if (method != null) {
			// super işi bozuyor. FUnction anonim bir fonksiyon dondürüyor.
			Delegate.prototype.add.call(this, method);
		}

		function selfCall(sender: any, args: any) {
			for (let i = 0; i < self.subjects.length; i++) {
				const method: TMethod = self.subjects[i];
				method(sender, args)
			}
		}

		selfCall.add = (handler: TMethod) => {
			self.subjects.push(handler);
		}
		selfCall.remove = (handler: TMethod) => {
			self.subjects = arrayRemove(self.subjects, handler);
		}

		return selfCall as any;
	}
	public add(handler: TMethod) {
		this.subjects.push(handler);
	}
	public remove(handler: TMethod) {
		this.subjects = arrayRemove(this.subjects, handler);
	}
}