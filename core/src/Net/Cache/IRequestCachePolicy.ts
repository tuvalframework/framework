import { RequestCacheLevel } from "./RequestCacheLevel";

export interface IRequestCachePolicy {
	/**
	 * Gets the RequestCacheLevel value specified when this instance was constructed.
	 */
	level: RequestCacheLevel;
}