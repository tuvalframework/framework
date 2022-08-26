import { TBuffer } from "../Buffer/TBuffer";

type int32 = number;
type uint32 = number;

export let HEAP: any,
  /** @type {ArrayBuffer} */
  SystemHeap: ArrayBuffer = null as any,
  /** @type {Int8Array} */
  HEAP8: Int8Array,
  /** @type {Uint8Array} */
  HEAPU8: Uint8Array,
  /** @type {Int16Array} */
  HEAP16: Int16Array,
  /** @type {Uint16Array} */
  HEAPU16: Uint16Array,
  /** @type {Int32Array} */
  HEAP32: Int32Array,
  /** @type {Uint32Array} */
  HEAPU32: Uint32Array,
  /** @type {Float32Array} */
  HEAPF32: Float32Array,
  /** @type {Float64Array} */
  HEAPF64: Float64Array;

/* export function GetTypeSize(type:DataTypes):number {
  switch (type) {
    case DataTypes.BYTE: return 1;
    case DataTypes.LONG: return 4;
    default: return 0;
  } */
// switch (type) {
/*  case 'i1': case 'i8': return 1;
 case 'i16': return 2;
 case 'i32': return 4;
 case 'i64': return 8;
 case 'float': return 4;
 case 'double': return 8;
 default: {
     if (type[type.length - 1] === '*') {
         return 4; // A pointer
     } else if (type[0] === 'i') {
         var bits = parseInt(type.substr(1));
        // assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
         return bits / 8;
     } else {
         return 0;
     }
 }
} */
//}
export function getNativeTypeSize(type): number {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        // assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

let allocator: Allocator;
const memory = new ArrayBuffer/* SharedArrayBuffer */(6 * 1024 * 1024); // new WebAssembly.Memory({ initial: 100, maximum: 100 });
export let HeapBuffer: TBuffer;
export function updateGlobalBufferAndViews(buf: ArrayBuffer) {
  SystemHeap = buf;
    /* "Module['HEAP8'] =" */ HEAP8 = new Int8Array(buf);
    /* "Module['HEAP16'] =" */ HEAP16 = new Int16Array(buf);
    /* "Module['HEAP32'] =" */ HEAP32 = new Int32Array(buf);
    /* "Module['HEAPU8'] =" */ HEAPU8 = new Uint8Array(buf);
    /* "Module['HEAPU16'] =" */ HEAPU16 = new Uint16Array(buf);
    /* "Module['HEAPU32'] =" */ HEAPU32 = new Uint32Array(buf);
    /* "Module['HEAPF32'] =" */ HEAPF32 = new Float32Array(buf);
    /* "Module['HEAPF64'] =" */ HEAPF64 = new Float64Array(buf);
  allocator = new Allocator(buf);
  HeapBuffer = new TBuffer(buf);
}
export function updateGlobalBufferAndViewsEx(buf: ArrayBuffer) {
  SystemHeap = buf;
    /* "Module['HEAP8'] =" */ HEAP8 = new Int8Array(buf);
    /* "Module['HEAP16'] =" */ HEAP16 = new Int16Array(buf);
    /* "Module['HEAP32'] =" */ HEAP32 = new Int32Array(buf);
    /* "Module['HEAPU8'] =" */ HEAPU8 = new Uint8Array(buf);
    /* "Module['HEAPU16'] =" */ HEAPU16 = new Uint16Array(buf);
    /* "Module['HEAPU32'] =" */ HEAPU32 = new Uint32Array(buf);
    /* "Module['HEAPF32'] =" */ HEAPF32 = new Float32Array(buf);
    /* "Module['HEAPF64'] =" */ HEAPF64 = new Float64Array(buf);
  allocator = new Allocator(new Int32Array(buf));
  HeapBuffer = new TBuffer(buf);
}
export function restoreGlobalBuffer() {
  updateGlobalBufferAndViews(memory/* .buffer */);
}




let tempDouble;
let tempI64;

export function getValue(ptr: number, type: string, noSafe: boolean = true) {
  type = type || 'i8';
  if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
  switch (type) {
    case 'i1': return HEAP8[((ptr) >> 0)];
    case 'i8': return HEAP8[((ptr) >> 0)];
    case 'i16': return HEAP16[((ptr) >> 1)];
    case 'i32': return HEAP32[((ptr) >> 2)];
    case 'i64': return HEAP32[((ptr) >> 2)];
    case 'float': return HEAPF32[((ptr) >> 2)];
    case 'double': return HEAPF64[((ptr) >> 3)];
    default: alert('invalid type for getValue: ' + type);
  }
  return null;
}
export function setValue(ptr: number, value: number, type: string, noSafe: boolean = true) {
  type = type || 'i8';
  if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
  switch (type) {
    case 'i1': HEAP8[((ptr) >> 0)] = value; break;
    case 'i8': HEAP8[((ptr) >> 0)] = value; break;
    case 'i16': HEAP16[((ptr) >> 1)] = value; break;
    case 'i32': HEAP32[((ptr) >> 2)] = value; break;
    case 'i64': (tempI64 = [value >>> 0, (tempDouble = value, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[((ptr) >> 2)] = tempI64[0], HEAP32[(((ptr) + (4)) >> 2)] = tempI64[1]); break;
    case 'float': HEAPF32[((ptr) >> 2)] = value; break;
    case 'double': HEAPF64[((ptr) >> 3)] = value; break;
    default: alert('invalid type for setValue: ' + type);
  }
}

//0x00640000   max value



/* setValue(0x00000000,-48,'i1');
alert(getValue(0x00000000,'i1')); */

const POINTER_SIZE_IN_BYTES = 4;
const MAX_HEIGHT = 32;


const HEADER_SIZE_IN_QUADS = 1 + (MAX_HEIGHT * 2);
const HEADER_OFFSET_IN_QUADS = 1;

const HEIGHT_OFFSET_IN_QUADS = 0;
const PREV_OFFSET_IN_QUADS = 1;
const NEXT_OFFSET_IN_QUADS = 2;

const POINTER_SIZE_IN_QUADS = 1;
const POINTER_OVERHEAD_IN_QUADS = 2;

const MIN_FREEABLE_SIZE_IN_QUADS = 3;
const FIRST_BLOCK_OFFSET_IN_QUADS = HEADER_OFFSET_IN_QUADS + HEADER_SIZE_IN_QUADS + POINTER_OVERHEAD_IN_QUADS;

const MIN_FREEABLE_SIZE_IN_BYTES = 16;
const FIRST_BLOCK_OFFSET_IN_BYTES = FIRST_BLOCK_OFFSET_IN_QUADS * POINTER_SIZE_IN_BYTES;
const OVERHEAD_IN_BYTES = (FIRST_BLOCK_OFFSET_IN_QUADS + 1) * POINTER_SIZE_IN_BYTES;

const ALIGNMENT_IN_BYTES = 8;
const ALIGNMENT_MASK = ALIGNMENT_IN_BYTES - 1;

const UPDATES: Int32Array = (new Int32Array(MAX_HEIGHT)).fill(HEADER_OFFSET_IN_QUADS);

type ListNode = {
  type: string;
  offset: int32;
  size: int32;
  height: int32;
  pointers: int32[];
};

type InspectionResult = {
  header: ListNode;
  blocks: Array<{
    type: string;
    size: int32;
    node?: ListNode
  }>;
};

export class Allocator {

  private buffer: ArrayBuffer = null as any
  private byteOffset: uint32 = null as any
  private byteLength: uint32 = null as any
  private int32Array: Int32Array = null as any

  /**
   * Initialize the allocator from the given Buffer or ArrayBuffer.
   */
  constructor(buffer: Int32Array);
  constructor(buffer: ArrayBuffer | SharedArrayBuffer);
  constructor(buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: uint32, byteLength: uint32);
  constructor(...args: any[]) {
    if (args.length === 1 && args[0] instanceof Int32Array) {
      this.int32Array = args[0];
      this.byteLength = args[0].byteLength;
    } else if (args.length >= 1 && (typeof SharedArrayBuffer !== 'undefined' && args[0] instanceof SharedArrayBuffer) || (args[0] instanceof ArrayBuffer)) {
      const buffer = args[0];
      const byteOffset = args[1] ? args[1] : 0;
      const byteLength = args[2] ? args[2] : 0;
      //if ((buffer instanceof SharedArrayBuffer) || (buffer instanceof ArrayBuffer)) {
      this.buffer = buffer;
      this.byteOffset = byteOffset;
      this.byteLength = byteLength === 0 ? buffer.byteLength - byteOffset : byteLength;
      //}
      this.int32Array = prepare(new Int32Array(this.buffer, this.byteOffset, bytesToQuads(this.byteLength)));
      checkListIntegrity(this.int32Array);
    }
  }

  /**
   * Allocate a given number of bytes and return the offset.
   * If allocation fails, returns 0.
   */
  alloc(numberOfBytes: int32): int32 {
    numberOfBytes = align(numberOfBytes);

    if (numberOfBytes < MIN_FREEABLE_SIZE_IN_BYTES) {
      numberOfBytes = MIN_FREEABLE_SIZE_IN_BYTES;
    }
    else if (numberOfBytes > this.byteLength) {
      throw new RangeError(`Allocation size must be between ${MIN_FREEABLE_SIZE_IN_BYTES} bytes and ${this.byteLength - OVERHEAD_IN_BYTES} bytes`);
    }

    const minimumSize: int32 = bytesToQuads(numberOfBytes);
    const int32Array: Int32Array = this.int32Array;
    const block: int32 = findFreeBlock(int32Array, minimumSize);
    if (block <= HEADER_OFFSET_IN_QUADS) {
      return 0;
    }
    const blockSize: int32 = readSize(int32Array, block);


    if (blockSize - (minimumSize + POINTER_OVERHEAD_IN_QUADS) >= MIN_FREEABLE_SIZE_IN_QUADS) {
      split(int32Array, block, minimumSize, blockSize);
    }
    else {
      remove(int32Array, block, blockSize);
    }

    return quadsToBytes(block);
  }

  /**
   * Allocate and clear the given number of bytes and return the offset.
   * If allocation fails, returns 0.
   */
  calloc(numberOfBytes: int32): int32 {

    if (numberOfBytes < MIN_FREEABLE_SIZE_IN_BYTES) {
      numberOfBytes = MIN_FREEABLE_SIZE_IN_BYTES;
    }
    else {
      numberOfBytes = align(numberOfBytes);
    }

    const address = this.alloc(numberOfBytes);
    if (address === 0) {
      // Not enough space
      return 0;
    }
    const int32Array = this.int32Array;
    const offset = bytesToQuads(address);
    const limit = numberOfBytes / 4;
    for (let i = 0; i < limit; i++) {
      int32Array[offset + i] = 0;
    }
    return address;
  }

  /**
   * Free a number of bytes from the given address.
   */
  free(address: int32): int32 {
    if ((address & ALIGNMENT_MASK) !== 0) {
      throw new RangeError(`Address must be a multiple of (${ALIGNMENT_IN_BYTES}).`);
    }

    if (address < FIRST_BLOCK_OFFSET_IN_BYTES || address > this.byteLength) {
      throw new RangeError(`Address must be between ${FIRST_BLOCK_OFFSET_IN_BYTES} and ${this.byteLength - OVERHEAD_IN_BYTES}`);
    }

    const int32Array: Int32Array = this.int32Array;
    const block = bytesToQuads(address);

    const blockSize: uint32 = readSize(int32Array, block);


    /* istanbul ignore if  */
    if (blockSize < MIN_FREEABLE_SIZE_IN_QUADS || blockSize > (this.byteLength - OVERHEAD_IN_BYTES) / 4) {
      throw new RangeError(`Invalid block: ${block}, got block size: ${quadsToBytes(blockSize)}`);
    }

    const preceding: int32 = getFreeBlockBefore(int32Array, block);
    const trailing: int32 = getFreeBlockAfter(int32Array, block);
    if (preceding !== 0) {
      if (trailing !== 0) {
        return quadsToBytes(insertMiddle(int32Array, preceding, block, blockSize, trailing));
      }
      else {
        return quadsToBytes(insertAfter(int32Array, preceding, block, blockSize));
      }
    }
    else if (trailing !== 0) {
      return quadsToBytes(insertBefore(int32Array, trailing, block, blockSize));
    }
    else {
      return quadsToBytes(insert(int32Array, block, blockSize));
    }
  }

  /**
   * Return the size of the block at the given address.
   */
  sizeOf(address: int32): uint32 {
    if (address < FIRST_BLOCK_OFFSET_IN_BYTES || address > this.byteLength || typeof address !== 'number' || isNaN(address)) {
      throw new RangeError(`Address must be between ${FIRST_BLOCK_OFFSET_IN_BYTES} and ${this.byteLength - OVERHEAD_IN_BYTES}`);
    }

    if ((address & ALIGNMENT_MASK) !== 0) {
      throw new RangeError(`Address must be a multiple of the pointer size (${POINTER_SIZE_IN_BYTES}).`);
    }

    return quadsToBytes(readSize(this.int32Array, bytesToQuads(address)));
  }

  /**
   * Inspect the instance.
   */
  inspect(): InspectionResult {
    return inspect(this.int32Array);
  }
}

/**
 * Prepare the given int32Array and ensure it contains a valid header.
 */
export function prepare(int32Array: Int32Array): Int32Array {
  if (!verifyHeader(int32Array)) {
    writeInitialHeader(int32Array);
  }
  return int32Array;
}

/**
 * Verify that the int32Array contains a valid header.
 */
export function verifyHeader(int32Array: Int32Array): boolean {
  return int32Array[HEADER_OFFSET_IN_QUADS - 1] === HEADER_SIZE_IN_QUADS
    && int32Array[HEADER_OFFSET_IN_QUADS + HEADER_SIZE_IN_QUADS] === HEADER_SIZE_IN_QUADS;
}

/**
 * Write the initial header for an empty int32Array.
 */
function writeInitialHeader(int32Array: Int32Array) {

  const header = HEADER_OFFSET_IN_QUADS;
  const headerSize = HEADER_SIZE_IN_QUADS;
  const block = FIRST_BLOCK_OFFSET_IN_QUADS;
  const blockSize = int32Array.length - (header + headerSize + POINTER_OVERHEAD_IN_QUADS + POINTER_SIZE_IN_QUADS);

  writeFreeBlockSize(int32Array, headerSize, header);
  int32Array[header + HEIGHT_OFFSET_IN_QUADS] = 1;
  int32Array[header + NEXT_OFFSET_IN_QUADS] = block;
  for (let height = 1; height < MAX_HEIGHT; height++) {
    int32Array[header + NEXT_OFFSET_IN_QUADS + height] = HEADER_OFFSET_IN_QUADS;
  }

  writeFreeBlockSize(int32Array, blockSize, block);
  int32Array[block + HEIGHT_OFFSET_IN_QUADS] = 1;
  int32Array[block + NEXT_OFFSET_IN_QUADS] = header;
}

/**
 * Check the integrity of the freelist in the given array.
 */
export function checkListIntegrity(int32Array: Int32Array): boolean {
  let block: int32 = FIRST_BLOCK_OFFSET_IN_QUADS;
  while (block < int32Array.length - POINTER_SIZE_IN_QUADS) {
    const size: int32 = readSize(int32Array, block);
    /* istanbul ignore if  */
    if (size < POINTER_OVERHEAD_IN_QUADS || size >= int32Array.length - FIRST_BLOCK_OFFSET_IN_QUADS) {
      throw new Error(`Got invalid sized chunk at ${quadsToBytes(block)} (${quadsToBytes(size)} bytes).`);
    }
    else if (isFree(int32Array, block)) {
      checkFreeBlockIntegrity(int32Array, block, size);
    }
    else {
      checkUsedBlockIntegrity(int32Array, block, size);
    }
    block += size + POINTER_OVERHEAD_IN_QUADS;
  }
  return true;
}

function checkFreeBlockIntegrity(int32Array: Int32Array, block: int32, blockSize: int32): boolean {
  /* istanbul ignore if  */
  if (int32Array[block - 1] !== int32Array[block + blockSize]) {
    throw new Error(`Block length header does not match footer (${quadsToBytes(int32Array[block - 1])} vs ${quadsToBytes(int32Array[block + blockSize])}).`);
  }
  const height: int32 = int32Array[block + HEIGHT_OFFSET_IN_QUADS];
  /* istanbul ignore if  */
  if (height < 1 || height > MAX_HEIGHT) {
    throw new Error(`Block ${quadsToBytes(block)} height must be between 1 and ${MAX_HEIGHT}, got ${height}.`);
  }
  for (let i = 0; i < height; i++) {
    const pointer = int32Array[block + NEXT_OFFSET_IN_QUADS + i];
    /* istanbul ignore if  */
    if (pointer >= FIRST_BLOCK_OFFSET_IN_QUADS && !isFree(int32Array, pointer)) {
      throw new Error(`Block ${quadsToBytes(block)} has a pointer to a non-free block (${quadsToBytes(pointer)}).`);
    }
  }
  return true;
}

function checkUsedBlockIntegrity(int32Array: Int32Array, block: int32, blockSize: int32): boolean {
  /* istanbul ignore if  */
  if (int32Array[block - 1] !== int32Array[block + blockSize]) {
    throw new Error(`Block length header does not match footer (${quadsToBytes(int32Array[block - 1])} vs ${quadsToBytes(int32Array[block + blockSize])}).`);
  }
  else {
    return true;
  }
}


/**
 * Inspect the freelist in the given array.
 */
export function inspect(int32Array: Int32Array): InspectionResult {
  const blocks: { type: string; offset: int32, size: int32; node?: ListNode }[] = [];
  const header: ListNode = readListNode(int32Array, HEADER_OFFSET_IN_QUADS);
  let block: int32 = FIRST_BLOCK_OFFSET_IN_QUADS;
  while (block < int32Array.length - POINTER_SIZE_IN_QUADS) {
    const size: int32 = readSize(int32Array, block);
    /* istanbul ignore if  */
    if (size < POINTER_OVERHEAD_IN_QUADS || size >= int32Array.length) {
      throw new Error(`Got invalid sized chunk at ${quadsToBytes(block)} (${quadsToBytes(size)})`);
    }
    if (isFree(int32Array, block)) {
      // @flowIssue todo
      blocks.push(readListNode(int32Array, block));
    }
    else {
      blocks.push({
        type: 'used',
        offset: quadsToBytes(block),
        size: quadsToBytes(size)
      });
    }
    block += size + POINTER_OVERHEAD_IN_QUADS;
  }
  return { header, blocks };
}

/**
 * Convert quads to bytes.
 */
function quadsToBytes(num: int32): int32 {
  return num * POINTER_SIZE_IN_BYTES;
}

/**
 * Convert bytes to quads.
 */
function bytesToQuads(num: int32): int32 {
  return Math.ceil(num / POINTER_SIZE_IN_BYTES);
}

/**
 * Align the given value to 8 bytes.
 */
function align(value: int32): int32 {
  return (value + ALIGNMENT_MASK) & ~ALIGNMENT_MASK;
}

/**
 * Read the list pointers for a given block.
 */
function readListNode(int32Array: Int32Array, block: int32): ListNode {
  const height: int32 = int32Array[block + HEIGHT_OFFSET_IN_QUADS];
  const pointers: int32[] = [];
  for (let i = 0; i < height; i++) {
    pointers.push(quadsToBytes(int32Array[block + NEXT_OFFSET_IN_QUADS + i]));
  }

  return {
    type: 'free',
    offset: quadsToBytes(block),
    height,
    pointers,
    size: quadsToBytes(int32Array[block - 1])
  };
}


/**
 * Read the size (in quads) of the block at the given address.
 */
function readSize(int32Array: Int32Array, block: int32): int32 {
  return Math.abs(int32Array[block - 1]);
}

/**
 * Write the size of the block at the given address.
 * Note: This ONLY works for free blocks, not blocks in use.
 */
function writeFreeBlockSize(int32Array: Int32Array, size: int32, block: int32): void {
  int32Array[block - 1] = size;
  int32Array[block + size] = size;
}

/**
 * Populate the `UPDATES` array with the offset of the last item in each
 * list level, *before* a node of at least the given size.
 */
function findPredecessors(int32Array: Int32Array, minimumSize: int32): void {

  const listHeight: int32 = int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS];

  let node: int32 = HEADER_OFFSET_IN_QUADS;

  for (let height = listHeight; height > 0; height--) {
    let next: int32 = node + NEXT_OFFSET_IN_QUADS + (height - 1);
    while (int32Array[next] >= FIRST_BLOCK_OFFSET_IN_QUADS && int32Array[int32Array[next] - 1] < minimumSize) {
      node = int32Array[next];
      next = node + NEXT_OFFSET_IN_QUADS + (height - 1);
    }
    UPDATES[height - 1] = node;
  }
}

/**
 * Find a free block with at least the given size and return its offset in quads.
 */
function findFreeBlock(int32Array: Int32Array, minimumSize: int32): int32 {

  let block: int32 = HEADER_OFFSET_IN_QUADS;

  for (let height = int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS]; height > 0; height--) {
    let next: int32 = int32Array[block + NEXT_OFFSET_IN_QUADS + (height - 1)];

    while (next !== HEADER_OFFSET_IN_QUADS && int32Array[next - 1] < minimumSize) {
      block = next;
      next = int32Array[block + NEXT_OFFSET_IN_QUADS + (height - 1)];
    }
  }

  block = int32Array[block + NEXT_OFFSET_IN_QUADS];
  if (block === HEADER_OFFSET_IN_QUADS) {

    return block;
  }
  else {

    return block;
  }
}


/**
 * Split the given block after a certain number of bytes and add the second half to the freelist.
 */
function split(int32Array: Int32Array, block: int32, firstSize: int32, blockSize: int32): void {


  const second: int32 = (block + firstSize + POINTER_OVERHEAD_IN_QUADS);
  const secondSize: int32 = (blockSize - (second - block));
  remove(int32Array, block, blockSize);


  int32Array[block - 1] = -firstSize;
  int32Array[block + firstSize] = -firstSize;



  int32Array[second - 1] = -secondSize;
  int32Array[second + secondSize] = -secondSize;

  insert(int32Array, second, secondSize);

}

/**
 * Remove the given block from the freelist and mark it as allocated.
 */
function remove(int32Array: Int32Array, block: int32, blockSize: int32): void {

  findPredecessors(int32Array, blockSize);

  let node: int32 = int32Array[UPDATES[0] + NEXT_OFFSET_IN_QUADS];

  while (node !== block && node !== HEADER_OFFSET_IN_QUADS && int32Array[node - 1] <= blockSize) {
    for (let height: number = int32Array[node + HEIGHT_OFFSET_IN_QUADS] - 1; height >= 0; height--) {
      if (int32Array[node + NEXT_OFFSET_IN_QUADS + height] === block) {
        UPDATES[height] = node;
      }
    }
    node = int32Array[node + NEXT_OFFSET_IN_QUADS];
  }

  /* istanbul ignore if  */
  if (node !== block) {
    throw new Error(`Could not find block to remove.`);
  }

  let listHeight: int32 = int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS];
  for (let height = 0; height < listHeight; height++) {
    const next: int32 = int32Array[UPDATES[height] + NEXT_OFFSET_IN_QUADS + height];
    if (next !== block) {
      break;
    }
    int32Array[UPDATES[height] + NEXT_OFFSET_IN_QUADS + height] = int32Array[block + NEXT_OFFSET_IN_QUADS + height];
  }

  while (listHeight > 0 && int32Array[HEADER_OFFSET_IN_QUADS + NEXT_OFFSET_IN_QUADS + (listHeight - 1)] === HEADER_OFFSET_IN_QUADS) {
    listHeight--;
    int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS] = listHeight;
  }
  // invert the size sign to signify an allocated block
  int32Array[block - 1] = -blockSize;
  int32Array[block + blockSize] = -blockSize;
}

/**
 * Iterate all of the free blocks in the list, looking for pointers to the given block.
 */
function hasPointersTo(int32Array: Int32Array, block: int32): boolean {
  let next: int32 = FIRST_BLOCK_OFFSET_IN_QUADS;

  while (next < int32Array.length - POINTER_SIZE_IN_QUADS) {
    if (isFree(int32Array, next)) {
      for (let height = int32Array[next + HEIGHT_OFFSET_IN_QUADS] - 1; height >= 0; height--) {
        const pointer: int32 = int32Array[next + NEXT_OFFSET_IN_QUADS + height];
        /* istanbul ignore if  */
        if (pointer === block) {
          return true;
        }
      }
    }
    next += readSize(int32Array, next) + POINTER_OVERHEAD_IN_QUADS;
  }
  return false;
}

/**
 * Determine whether the block at the given address is free or not.
 */
function isFree(int32Array: Int32Array, block: int32): boolean {
  /* istanbul ignore if  */
  if (block < HEADER_SIZE_IN_QUADS) {
    return false;
  }

  const size: int32 = int32Array[block - POINTER_SIZE_IN_QUADS];

  if (size < 0) {
    return false;
  }
  else {
    return true;
  }
}


/**
 * Get the address of the block before the given one and return the address *if it is free*,
 * otherwise 0.
 */
function getFreeBlockBefore(int32Array: Int32Array, block: int32): int32 {

  if (block <= FIRST_BLOCK_OFFSET_IN_QUADS) {
    return 0;
  }
  const beforeSize: int32 = int32Array[block - POINTER_OVERHEAD_IN_QUADS];


  if (beforeSize < POINTER_OVERHEAD_IN_QUADS) {
    return 0;
  }
  return block - (POINTER_OVERHEAD_IN_QUADS + beforeSize);
}

/**
 * Get the address of the block after the given one and return its address *if it is free*,
 * otherwise 0.
 */
function getFreeBlockAfter(int32Array: Int32Array, block: int32): int32 {


  const blockSize: int32 = readSize(int32Array, block);
  if (block + blockSize + POINTER_OVERHEAD_IN_QUADS >= int32Array.length - 2) {
    // Block is the last in the list.
    return 0;
  }
  const next: int32 = (block + blockSize + POINTER_OVERHEAD_IN_QUADS);
  const nextSize: int32 = int32Array[next - POINTER_SIZE_IN_QUADS];



  if (nextSize < POINTER_OVERHEAD_IN_QUADS) {
    return 0;
  }
  return next;
}


/**
 * Insert the given block into the freelist and return the number of bytes that were freed.
 */
function insert(int32Array: Int32Array, block: int32, blockSize: int32): int32 {


  findPredecessors(int32Array, blockSize);

  const blockHeight: int32 = generateHeight(int32Array, block, blockSize);
  const listHeight: int32 = int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS];

  for (let height = 1; height <= blockHeight; height++) {

    const update: int32 = UPDATES[height - 1] + NEXT_OFFSET_IN_QUADS + (height - 1);

    int32Array[block + NEXT_OFFSET_IN_QUADS + (height - 1)] = int32Array[update];
    int32Array[update] = block;
    UPDATES[height - 1] = HEADER_OFFSET_IN_QUADS;
  }

  int32Array[block - 1] = blockSize;
  int32Array[block + blockSize] = blockSize;
  return blockSize;
}


/**
 * Insert the given block into the freelist before the given free block,
 * joining them together, returning the number of bytes which were freed.
 */
function insertBefore(int32Array: Int32Array, trailing: int32, block: int32, blockSize: int32): int32 {

  const trailingSize: int32 = readSize(int32Array, trailing);

  remove(int32Array, trailing, trailingSize);
  const size: int32 = (blockSize + trailingSize + POINTER_OVERHEAD_IN_QUADS);
  int32Array[block - POINTER_SIZE_IN_QUADS] = -size;
  int32Array[trailing + trailingSize] = -size;
  insert(int32Array, block, size);
  return blockSize;
}

/**
 * Insert the given block into the freelist in between the given free blocks,
 * joining them together, returning the number of bytes which were freed.
 */
function insertMiddle(int32Array: Int32Array, preceding: int32, block: int32, blockSize: int32, trailing: int32): int32 {


  const precedingSize: int32 = readSize(int32Array, preceding);
  const trailingSize: int32 = readSize(int32Array, trailing);
  const size: int32 = ((trailing - preceding) + trailingSize);


  remove(int32Array, preceding, precedingSize);
  remove(int32Array, trailing, trailingSize);
  int32Array[preceding - POINTER_SIZE_IN_QUADS] = -size;
  int32Array[trailing + trailingSize] = -size;
  insert(int32Array, preceding, size);
  return blockSize;
}

/**
 * Insert the given block into the freelist after the given free block,
 * joining them together, returning the number of bytes which were freed.
 */
function insertAfter(int32Array: Int32Array, preceding: int32, block: int32, blockSize: int32): int32 {
  const precedingSize: int32 = (block - preceding) - POINTER_OVERHEAD_IN_QUADS;

  const size: int32 = ((block - preceding) + blockSize);
  remove(int32Array, preceding, precedingSize);
  int32Array[preceding - POINTER_SIZE_IN_QUADS] = -size;
  int32Array[block + blockSize] = -size;
  insert(int32Array, preceding, size);
  return blockSize;
}



/**
 * Generate a random height for a block, growing the list height by 1 if required.
 */
function generateHeight(int32Array: Int32Array, block: int32, blockSize: int32): int32 {

  const listHeight: int32 = int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS];
  let height: int32 = randomHeight();


  if (blockSize - 1 < height + 1) {
    height = blockSize - 2;

  }

  if (height > listHeight) {
    const newHeight: int32 = listHeight + 1;

    int32Array[HEADER_OFFSET_IN_QUADS + HEIGHT_OFFSET_IN_QUADS] = newHeight;
    int32Array[HEADER_OFFSET_IN_QUADS + NEXT_OFFSET_IN_QUADS + (newHeight - 1)] = HEADER_OFFSET_IN_QUADS;
    UPDATES[newHeight] = HEADER_OFFSET_IN_QUADS;
    int32Array[block + HEIGHT_OFFSET_IN_QUADS] = newHeight;
    return newHeight;
  }
  else {
    int32Array[block + HEIGHT_OFFSET_IN_QUADS] = height;
    return height;
  }
}

/**
 * Generate a random height for a new block.
 */
function randomHeight(): number {

  let height: number = 1;
  for (let r: number = Math.ceil(Math.random() * 2147483648); (r & 1) === 1 && height < MAX_HEIGHT; r >>= 1) {
    height++;
    Math.ceil(Math.random() * 2147483648)
  }
  return height;
}

export function malloc(size: number): number {
  return allocator.alloc(size);
}

export function free(pointer: number): number {
  return allocator.free(pointer);
}

export function inspectHeap(): InspectionResult {
  return allocator.inspect();
}

updateGlobalBufferAndViews(memory);