

import {IRequestCachePolicy} from "./Cache/IRequestCachePolicy";
import {AuthenticationLevel} from "./Security/AuthenticationLevel";

export interface IWebRequest
{

	authenticationLevel:AuthenticationLevel;
	cachePolicy:IRequestCachePolicy;
	connectionGroupName:string;

	contentLength:number;
	contentType:string;
}