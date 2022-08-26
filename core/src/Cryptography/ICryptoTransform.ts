import { IDisposable } from '../Disposable';
import { int, ByteArray } from '../float';

export interface ICryptoTransform extends IDisposable {

    InputBlockSize: int;
    OutputBlockSize: int;
    // CanTransformMultipleBlocks == true implies that TransformBlock() can accept any number
    // of whole blocks, not just a single block.  If CanTransformMultipleBlocks is false, you have
    // to feed blocks one at a time.
    CanTransformMultipleBlocks: boolean;

    // If CanReuseTransform is true, then after a call to TransformFinalBlock() the transform
    // resets its internal state to its initial configuration (with Key and IV loaded) and can
    // be used to perform another encryption/decryption.
    CanReuseTransform: boolean;

    // The return value of TransformBlock is the number of bytes returned to outputBuffer and is
    // always <= OutputBlockSize.  If CanTransformMultipleBlocks is true, then inputCount may be
    // any positive multiple of InputBlockSize
    TransformBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int, outputBuffer: ByteArray, outputOffset: int): int;

    // Special function for transforming the last block or partial block in the stream.  The
    // return value is an array containting the remaining transformed bytes.
    // We return a new array here because the amount of information we send back at the end could
    // be larger than a single block once padding is accounted for.
    TransformFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): ByteArray;
}