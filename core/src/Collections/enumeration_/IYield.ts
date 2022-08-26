export interface IYield<T> {
	current: T | undefined;
	yieldReturn(value: T | undefined): boolean;
	yieldBreak(): boolean;
}

