export namespace HttpMethodValue {

	export type Options = 'OPTIONS';
	export type Head = 'HEAD';
	export type Get = 'GET';
	export type Put = 'PUT';
	export type Post = 'POST';
	export type Delete = 'DELETE';
	export type Trace = 'TRACE';
	export type Connect = 'CONNECT';


	/**
	 * The allowed HTTP Method values.
	 */
	export type Any
		= Options
		| Head
		| Get
		| Put
		| Post
		| Delete
		| Trace
		| Connect;
}