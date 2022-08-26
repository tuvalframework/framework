import { int } from "../../float";



/* Allowed flush values; see deflate() and inflate() below for details */
export const Z_NO_FLUSH: int = 0;
export const Z_PARTIAL_FLUSH: int = 1;
export const Z_SYNC_FLUSH: int = 2;
export const Z_FULL_FLUSH: int = 3;
export const Z_FINISH: int = 4;
export const Z_BLOCK: int = 5;
export const Z_TREES: int = 6;

/* Return codes for the compression/decompression functions. Negative values
* are errors, positive values are used for special but normal events.
*/
export const Z_OK: int = 0;
export const Z_STREAM_END: int = 1;
export const Z_NEED_DICT: int = 2;
export const Z_ERRNO: int = -1;
export const Z_STREAM_ERROR: int = -2;
export const Z_DATA_ERROR: int = -3;
//Z_MEM_ERROR:     -4,
export const Z_BUF_ERROR: int = -5;
//Z_VERSION_ERROR: -6,

/* compression levels */
export const Z_NO_COMPRESSION: int = 0;
export const Z_BEST_SPEED: int = 1;
export const Z_BEST_COMPRESSION: int = 9;
export const Z_DEFAULT_COMPRESSION: int = -1;


export const Z_FILTERED: int = 1;
export const Z_HUFFMAN_ONLY: int = 2;
export const Z_RLE: int = 3;
export const Z_FIXED: int = 4;
export const Z_DEFAULT_STRATEGY: int = 0;

/* Possible values of the data_type field (though see inflate()) */
export const Z_BINARY: int = 0;
export const Z_TEXT: int = 1;
//Z_ASCII:                1, // = Z_TEXT (deprecated)
export const Z_UNKNOWN: int = 2;

/* The deflate compression method */
export const Z_DEFLATED: int = 8;
  //Z_NULL:                 null // Use -1 or null inline, depending on var type

