export enum MonoIOError {
    ERROR_SUCCESS = 0,
	ERROR_FILE_NOT_FOUND = 2,
    ERROR_PATH_NOT_FOUND = 3,
    ERROR_TOO_MANY_OPEN_FILES = 4,
    ERROR_ACCESS_DENIED = 5,
    ERROR_INVALID_HANDLE = 6,
	ERROR_INVALID_DRIVE = 15,
	ERROR_NOT_SAME_DEVICE = 17,
    ERROR_NO_MORE_FILES = 18,
    ERROR_WRITE_FAULT = 29,
    ERROR_READ_FAULT = 30,
    ERROR_GEN_FAILURE = 31,
    ERROR_SHARING_VIOLATION = 32,
    ERROR_LOCK_VIOLATION = 33,
	ERROR_HANDLE_DISK_FULL = 39,
	ERROR_FILE_EXISTS = 80,
    ERROR_CANNOT_MAKE = 82,
	ERROR_INVALID_PARAMETER = 87,
	ERROR_BROKEN_PIPE = 109,
	ERROR_INVALID_NAME = 123,
    ERROR_DIR_NOT_EMPTY = 145,
	ERROR_ALREADY_EXISTS = 183,
	ERROR_FILENAME_EXCED_RANGE = 206,
    ERROR_ENCRYPTION_FAILED = 6000,
}