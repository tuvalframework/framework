
export interface Selector<TSource, TResult> {
	(source: TSource): TResult;
}


export interface SelectorWithIndex<TSource, TResult> {
	(source: TSource, index: number): TResult;
}

export interface Action<T> extends Selector<T, void> {

}

export interface Action2<T1, T2> {
	(arg1: T1, arg2: T2): void;
}

export interface ActionWithIndex<T> extends SelectorWithIndex<T, void> {
}

export interface Predicate<T> extends Selector<T, boolean> {
}

export interface PredicateWithIndex<T> extends SelectorWithIndex<T, boolean> {
}

export interface Comparison<T> {
	(a: T, b: T, strict?: boolean): number;
}

export interface EqualityComparison<T> {
	(a: T, b: T, strict?: boolean): boolean;
}


export interface Func<TResult> {
	(): TResult;
}

export interface Func1<T1, TResult> {
	(args1: T1): TResult;
}

export interface Closure {
	(): void;
}
