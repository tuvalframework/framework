export enum FileOptions
	{
		None = 0,
		Encrypted = 0x4000,
		DeleteOnClose = 0x4000000,
		SequentialScan = 0x8000000,
		RandomAccess = 0x10000000,
		Asynchronous = 0x40000000,
		WriteThrough = -2147483648
		//
		// FileIsTemporary = 1
		//    The above is an internal value used by Path.GetTempFile to
		//    get a file with 600 permissions, regardless of the umask
		//    settings.  If a value "1" must be introduced here, update
		//    both metadata/file-io.c and Path.GetTempFile
		//
	}