export function shallowCopy(source: any, target: any = {}): any {
	if (target) {
		for (let k in source) {
			//noinspection JSUnfilteredForInLoop
			target[k] = source[k];
		}
	}

	return target;
}