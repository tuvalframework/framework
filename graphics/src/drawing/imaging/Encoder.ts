import { Guid, is, System } from '@tuval/core';

export class Encoder {
	private guid: Guid = null as any;

	public static readonly ChrominanceTable: Encoder;
	public static readonly ColorDepth: Encoder;
	public static readonly Compression: Encoder;
	public static readonly LuminanceTable: Encoder;
	public static readonly Quality: Encoder;
	public static readonly RenderMethod: Encoder;
	public static readonly SaveFlag: Encoder;
	public static readonly ScanMethod: Encoder;
	public static readonly Transformation: Encoder;
	public static readonly Version: Encoder;

	public static StaticConstructor() {
		// GUID values are taken from my windows machine.
		(Encoder as any).ChrominanceTable = new Encoder("f2e455dc-09b3-4316-8260-676ada32481c");
		(Encoder as any).ColorDepth = new Encoder("66087055-ad66-4c7c-9a18-38a2310b8337");
		(Encoder as any).Compression = new Encoder("e09d739d-ccd4-44ee-8eba-3fbf8be4fc58");
		(Encoder as any).LuminanceTable = new Encoder("edb33bce-0266-4a77-b904-27216099e717");
		(Encoder as any).Quality = new Encoder("1d5be4b5-fa4a-452d-9cdd-5db35105e7eb");
		(Encoder as any).RenderMethod = new Encoder("6d42c53a-229a-4825-8bb7-5c99e2b9a8b8");
		(Encoder as any).SaveFlag = new Encoder("292266fc-ac40-47bf-8cfc-a85b89a655de");
		(Encoder as any).ScanMethod = new Encoder("3a4e2661-3109-4e56-8536-42c156e7dcfa");
		(Encoder as any).Transformation = new Encoder("8d0eb2d1-a58e-4ea8-aa14-108074b7b6f9");
		(Encoder as any).Version = new Encoder("24d18c76-814a-41a4-bf53-1c219cccf797");
	}

	public /* internal */ constructor(guid: string);
	public constructor(guid: Guid);
	public /* internal */ constructor(...args: any[]) {
		if (args.length === 1 && is.string(args[0])) {
			const guid: string  =args[0];
			this.guid = new Guid(guid);
		} else if (args.length === 1 && is.typeof<Guid>(args[0], System.Types.Guid)) {
			const guid: Guid = args[0];
			this.guid = guid;
		}
	}



	public get Guid(): Guid {
		return this.guid;
	}
}

Encoder.StaticConstructor();