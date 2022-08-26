import { Stream } from "stream";
import { ArgumentException } from "./Exceptions/ArgumentException";
import { int } from "./float";
import { Path } from "./IO/Path";

declare const process: any;

// Need to spoof this so WebPack doesn't panic (warnings).
let r: any;
try {
	r = eval('require');
}
catch (ex) { }


//noinspection JSUnusedGlobalSymbols
export const
	isCommonJS: boolean
		= !!(r && r.resolve);

//noinspection JSUnusedGlobalSymbols
export const
	isRequireJS: boolean
		= !!(r && r.toUrl && r.defined);

/*
 * Ensure is in a real Node environment, with a `process.nextTick`.
 * To see through fake Node environments:
 * Mocha test runner - exposes a `process` global without a `nextTick`
 * Browserify - exposes a `process.nexTick` function that uses
 * `setTimeout`. In this case `setImmediate` is preferred because
 * it is faster. Browserify's `process.toString()` yields
 * "[object Object]", while in a real Node environment
 * `process.nextTick()` yields "[object process]".
 */

export const
	isNodeJS: boolean
		= typeof process === "object"
		&& process.toString() === "[object process]"
		&& process.nextTick !== void 0;

declare const exports: any;
//noinspection JSUnusedAssignment
//Object.freeze(exports);

enum SpecialFolderOption {
	None = 0,
	DoNotVerify = 0x4000,
	Create = 0x8000
}

export enum SpecialFolder {
	MyDocuments = 0x05,
	Desktop = 0x00,
	MyComputer = 0x11,
	Programs = 0x02,
	Personal = 0x05,
	Favorites = 0x06,
	Startup = 0x07,
	Recent = 0x08,
	SendTo = 0x09,
	StartMenu = 0x0b,
	MyMusic = 0x0d,
	DesktopDirectory = 0x10,
	Templates = 0x15,
	ApplicationData = 0x1a,
	LocalApplicationData = 0x1c,
	InternetCache = 0x20,
	Cookies = 0x21,
	History = 0x22,
	CommonApplicationData = 0x23,
	System = 0x25,
	ProgramFiles = 0x26,
	MyPictures = 0x27,
	CommonProgramFiles = 0x2b,
	MyVideos = 0x0e,
	NetworkShortcuts = 0x13,
	Fonts = 0x14,
	CommonStartMenu = 0x16,
	CommonPrograms = 0x17,
	CommonStartup = 0x18,
	CommonDesktopDirectory = 0x19,
	PrinterShortcuts = 0x1b,
	Windows = 0x24,
	UserProfile = 0x28,
	SystemX86 = 0x29,
	ProgramFilesX86 = 0x2a,
	CommonProgramFilesX86 = 0x2c,
	CommonTemplates = 0x2d,
	CommonDocuments = 0x2e,
	CommonAdminTools = 0x2f,
	AdminTools = 0x30,
	CommonMusic = 0x35,
	CommonPictures = 0x36,
	CommonVideos = 0x37,
	Resources = 0x38,
	LocalizedResources = 0x39,
	CommonOemLinks = 0x3a,
	CDBurning = 0x3b,
}


export class Environment {
	public static OSVersion: any = {
		Platform: 4,
		Version: {
			Major: 7
		}
	}
	public static NewLine: string = '\n';
	public static OSInfo: any = null;
	public static OSName: any = null;
	public static IsRunningOnWindows: boolean = true;
	public static get TickCount(): int {
		const now = new Date();
		const ticks = now.getTime();
		return ticks;
	}
	public static GetResourceString(key: string): string;
	public static GetResourceString(key: string, a: string): string;
	public static GetResourceString(key: string, a: number): string;
	public static GetResourceString(key: string, a: number, b: number): string;
	public static GetResourceString(key: string, ...params: any[]): string {
		return key;
	}
	public static GetLogicalDrives(): string[] {
		return ['c'];
	}

	/* public static GetFolderPath(folder: SpecialFolder): string {
		return Environment.GetFolderPath(folder, SpecialFolderOption.None);
	} */
	public static GetFolderPath(folder: SpecialFolder, option: SpecialFolderOption = SpecialFolderOption.None): string {
		let dir: string = null as any;

		if (Environment.IsRunningOnWindows)
			dir = Environment.GetWindowsFolderPath(folder);
		else
			dir = Environment.UnixGetFolderPath(folder, option);

		return dir;
	}

	public /* internal */ static GetWindowsFolderPath(folder: SpecialFolder): string {
		return '';
	}
	public /* internal */ static UnixGetFolderPath(folder: SpecialFolder, option: SpecialFolderOption): string {
		return '';
	}

	public static GetEnvironmentVariable(name: string): string {
		return '';
	}

	public static GetCommandLineArgs(): string[] {
		return [];
	}

	public static CurrentDirectory: string = '';

}