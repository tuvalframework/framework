import { IHttpRequestParams } from "./IHttpRequestParams";
/**
 * Facilitates injecting a http request class for use with other classes.
 */
export interface IHttpRequestAdapter {
	request<TResult>(params: IHttpRequestParams): PromiseLike<TResult>;
}
