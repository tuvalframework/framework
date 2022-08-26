export declare const enum AuthenticationLevel {
	/**
	 * No authentication is required for the client and server.
	 */
	None = 0,

	/**
	 * The client and server should be authenticated. The request does not fail if the server is not authenticated. To determine whether mutual authentication occurred, check the value of the WebResponse.IsMutuallyAuthenticated property.
	 */
	MutualAuthRequested = 1,

	/**
	 * The client and server should be authenticated. If the server is not authenticated, your application will receive an IOException with a ProtocolViolationException inner exception that indicates that mutual authentication failed
	 */
	MutualAuthRequired = 2,

}
