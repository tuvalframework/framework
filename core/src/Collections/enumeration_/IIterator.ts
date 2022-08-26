export interface IIteratorResult<T> {
	done: boolean;
	value?: T;
	index?: number;
}

export interface IIterator<T> {
	Next(value?: any): IIteratorResult<T>;
	'return'?<TReturn>(value?: TReturn): IIteratorResult<TReturn>;
	'throw'?(e?: any): IIteratorResult<T>;
}
