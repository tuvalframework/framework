import { HttpMethodValue } from "./HttpMethodValue";
import { IUri } from "../../Uri/IUri";

interface IHttpRequestParamsBase {
	/**
	 * See HttpMethod.ts and HttpMethodValue.d.ts.  HttpMethodValue is a string literal type.
	 */
	method?: HttpMethodValue.Any;
	uri: string | IUri;
	data?: any;
}

export interface IHttpRequestParams extends IHttpRequestParamsBase {
	method: HttpMethodValue.Any;
}

export interface IHttpMethodParams<TMethod extends HttpMethodValue.Any> extends IHttpRequestParamsBase {
	method?: TMethod;
}

export interface IHttpPostParams<TData> extends IHttpMethodParams<HttpMethodValue.Post> {
	data: TData;
}
