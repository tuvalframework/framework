import { SchemeValue } from "./SchemeValue";

export class Scheme {

	/**
	 * The resource is a file on the local computer.
	 */
	public static File: SchemeValue.File = "file";


	/**
	 * The resource is accessed through FTP.
	 */
	public static FTP: SchemeValue.FTP = "ftp";


	/**
	 * The resource is accessed through the Gopher protocol.
	 */
	public static GOPHER: SchemeValue.Gopher = "gopher";


	/**
	 * The resource is accessed through HTTP.
	 */
	public static HTTP: SchemeValue.HTTP = "http";


	/**
	 * The resource is accessed through SSL-encrypted HTTP.
	 */
	public static HTTPS: SchemeValue.HTTPS = "https";


	/**
	 * The resource is accessed through the LDAP protocol.
	 */
	public static LDAP: SchemeValue.LDAP = "ldap";


	/**
	 * The resource is an e-mail address and accessed through the SMTP protocol.
	 */
	public static MAILTO: SchemeValue.MailTo = "mailto";


	/**
	 * The resource is accessed through a named pipe.
	 */
	public static PIPE: SchemeValue.Pipe = "net.pipe";


	/**
	 * The resource is accessed from TCP endpoint.
	 */
	public static TCP: SchemeValue.TCP = "net.tcp";


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	public static NEWS: SchemeValue.NNTP = "news";


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	public static NNTP: SchemeValue.NNTP = "nntp";


	/**
	 * The resource is accessed through the TELNET protocol.
	 */
	public static TELNET: SchemeValue.Telnet = "telnet";

	/**
	 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
	 */
	public static UUID: SchemeValue.UUID = "uuid";

	/**
	 * An index of possible values to validate against.
	 * @type {Array}
	 */
	public static All: any = Object.freeze([
		Scheme.File, Scheme.FTP, Scheme.GOPHER, Scheme.HTTP, Scheme.HTTPS, Scheme.LDAP, Scheme.MAILTO, Scheme.PIPE, Scheme.TCP, Scheme.NEWS, Scheme.NNTP, Scheme.TELNET,Scheme. UUID
	]);

	public static  isValid(scheme: string): scheme is SchemeValue.Any {
		return Scheme.All.indexOf(<any>scheme) != -1;
	}

}

Object.freeze(Scheme);