import { HttpMethodValue } from "./HttpMethodValue";

export namespace HttpMethod {

	export const
		OPTIONS: HttpMethodValue.Options = 'OPTIONS',
		HEAD: HttpMethodValue.Head = 'HEAD',
		GET: HttpMethodValue.Get = 'GET',
		PUT: HttpMethodValue.Put = 'PUT',
		POST: HttpMethodValue.Post = 'POST',
		DELETE: HttpMethodValue.Delete = 'DELETE',
		TRACE: HttpMethodValue.Trace = 'TRACE',
		CONNECT: HttpMethodValue.Connect = 'CONNECT';

}
