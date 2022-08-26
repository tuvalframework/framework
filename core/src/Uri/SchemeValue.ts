export namespace SchemeValue {
	export type File = 'file';
	export type Gopher = 'gopher';
	export type FTP = 'ftp';
	export type HTTP = 'http';
	export type HTTPS = 'https';
	export type LDAP = 'ldap';
	export type MailTo = 'mailto';
	export type Pipe = 'net.pipe';
	export type TCP = 'net.tcp';
	export type NNTP = 'nntp' | 'news';
	export type Telnet = 'telnet';
	export type UUID = 'uuid';

	/**
	 * The allowed HTTP Method values.
	 */
	export type Any
		= File
		| Gopher
		| FTP
		| HTTP
		| HTTPS
		| LDAP
		| MailTo
		| Pipe
		| TCP
		| NNTP
		| Telnet
		| UUID;
}
