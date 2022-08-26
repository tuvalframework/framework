import { IDisposable } from "../Disposable/IDisposable";
import { Stream } from "../IO/Stream";
import { ICryptoTransform } from "./ICryptoTransform";
import { ByteArray, int, New } from '../float';
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Environment } from "../Environment";
import { ClassInfo, Override } from "../Reflection/Decorators/ClassInfo";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { TArray } from '../Extensions/TArray';
import { SeekOrigin } from "../IO/SeekOrigin";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { Convert } from "../convert";
import { System } from '../SystemTypes';
import { as } from "../as";

export enum CryptoStreamMode {
    Read = 0,
    Write = 1,
}

@ClassInfo({
    fullName: System.Types.Cryptography.CryptoStream,
    instanceof: [
        System.Types.Cryptography.CryptoStream,
        System.Types.Disposable.IDisposable
    ]
})
export class CryptoStream extends Stream implements IDisposable {

    // Member veriables
    private _stream: Stream = null as any;
    private _Transform: ICryptoTransform = null as any;
    private _InputBuffer: ByteArray = null as any;  // read from _stream before _Transform
    private _InputBufferIndex: int = 0;
    private _InputBlockSize: int = 0;
    private _OutputBuffer: ByteArray = null as any; // buffered output of _Transform
    private _OutputBufferIndex: int = 0;
    private _OutputBlockSize: int = 0;
    private _transformMode: CryptoStreamMode = CryptoStreamMode.Read;
    private _canRead: boolean = false;
    private _canWrite: boolean = false;
    private _finalBlockTransformed: boolean = false;
    private _leaveOpen: boolean = false;

    // Constructors

    public constructor(stream: Stream, transform: ICryptoTransform, mode: CryptoStreamMode, leaveOpen: boolean = false) {
        super();
        this._stream = stream;
        this._transformMode = mode;
        this._Transform = transform;
        this._leaveOpen = leaveOpen;
        switch (this._transformMode) {
            case CryptoStreamMode.Read:
                if (!(this._stream.CanRead)) throw new ArgumentException(Environment.GetResourceString("Argument_StreamNotReadable"), "stream");
                this._canRead = true;
                break;
            case CryptoStreamMode.Write:
                if (!(this._stream.CanWrite)) throw new ArgumentException(Environment.GetResourceString("Argument_StreamNotWritable"), "stream");
                this._canWrite = true;
                break;
            default:
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidValue"));
        }
        this.InitializeBuffer();
    }

    @Override
    protected Get_CanRead(): boolean {
        return this._canRead;
    }

    // For now, assume we can never seek into the middle of a cryptostream
    // and get the state right.  This is too strict.
    protected Get_CanSeek(): boolean {
        return false;
    }

    protected Get_CanWrite(): boolean {
        return this._canWrite;
    }

    @Override
    protected Get_Length(): int {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnseekableStream"));
    }


    protected Get_Position(): int {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnseekableStream"));
    }
    protected Set_Position(value: int) {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnseekableStream"));
    }

    public get HasFlushedFinalBlock(): boolean {
        return this._finalBlockTransformed;
    }

    // The flush final block functionality used to be part of close, but that meant you couldn't do something like this:
    // MemoryStream ms = new MemoryStream();
    // CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
    // cs.Write(foo, 0, foo.Length);
    // cs.Close();
    // and get the encrypted data out of ms, because the cs.Close also closed ms and the data went away.
    // so now do this:
    // cs.Write(foo, 0, foo.Length);
    // cs.FlushFinalBlock() // which can only be called once
    // byte[] ciphertext = ms.ToArray();
    // cs.Close();
    public FlushFinalBlock(): void {
        if (this._finalBlockTransformed)
            throw new NotSupportedException(Environment.GetResourceString("Cryptography_CryptoStream_FlushFinalBlockTwice"));
        // We have to process the last block here.  First, we have the final block in _InputBuffer, so transform it

        const finalBytes: ByteArray = this._Transform.TransformFinalBlock(this._InputBuffer, 0, this._InputBufferIndex);

        this._finalBlockTransformed = true;
        // Now, write out anything sitting in the _OutputBuffer...
        if (this._canWrite && this._OutputBufferIndex > 0) {
            this._stream.Write(this._OutputBuffer, 0, this._OutputBufferIndex);
            this._OutputBufferIndex = 0;
        }
        // Write out finalBytes
        if (this._canWrite)
            this._stream.Write(finalBytes, 0, finalBytes.length);

        // If the inner stream is a CryptoStream, then we want to call FlushFinalBlock on it too, otherwise just Flush.
        const innerCryptoStream: CryptoStream =  as(this._stream, System.Types.Cryptography.CryptoStream);
        if (innerCryptoStream != null) {
            if (!innerCryptoStream.HasFlushedFinalBlock) {
                innerCryptoStream.FlushFinalBlock();
            }
        } else {
            this._stream.Flush();
        }
        // zeroize plain text material before returning
        if (this._InputBuffer != null)
            TArray.Clear(this._InputBuffer, 0, this._InputBuffer.length);
        if (this._OutputBuffer != null)
            TArray.Clear(this._OutputBuffer, 0, this._OutputBuffer.length);
        return;
    }

    @Override
    public Flush(): void {
        return;
    }

    @Override
    public Seek(offset: int, origin: SeekOrigin): int {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnseekableStream"));
    }

    @Override
    public SetLength(value: int): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnseekableStream"));
    }

    @Override
    public Read(buffer: ByteArray, offset: int, count: int): int {
        // argument checking
        if (!this.CanRead)
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnreadableStream"));
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        if (buffer.length - offset < count)
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        // Contract.EndContractBlock();
        // read <= count bytes from the input stream, transforming as we go.
        // Basic idea: first we deliver any bytes we already have in the
        // _OutputBuffer, because we know they're good.  Then, if asked to deliver
        // more bytes, we read & transform a block at a time until either there are
        // no bytes ready or we've delivered enough.
        let bytesToDeliver: int = count;
        let currentOutputIndex: int = offset;
        if (this._OutputBufferIndex !== 0) {
            // we have some already-transformed bytes in the output buffer
            if (this._OutputBufferIndex <= count) {
                TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, offset, this._OutputBufferIndex);
                bytesToDeliver -= this._OutputBufferIndex;
                currentOutputIndex += this._OutputBufferIndex;
                this._OutputBufferIndex = 0;
            } else {
                TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, offset, count);
                TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, count, this._OutputBuffer, 0, this._OutputBufferIndex - count);
                this._OutputBufferIndex -= count;
                return (count);
            }
        }
        // _finalBlockTransformed == true implies we're at the end of the input stream
        // if we got through the previous if block then _OutputBufferIndex = 0, meaning
        // we have no more transformed bytes to give
        // so return count-bytesToDeliver, the amount we were able to hand back
        // eventually, we'll just always return 0 here because there's no more to read
        if (this._finalBlockTransformed) {
            return (count - bytesToDeliver);
        }
        // ok, now loop until we've delivered enough or there's nothing available
        let amountRead: int = 0;
        let numOutputBytes: int;




        const slow = () => {

            const ProcessFinalBlock = () => {
                // if so, then call TransformFinalBlock to get whatever is left
                const finalBytes: ByteArray = this._Transform.TransformFinalBlock(this._InputBuffer, 0, this._InputBufferIndex);
                // now, since _OutputBufferIndex must be 0 if we're in the while loop at this point,
                // reset it to be what we just got back
                this._OutputBuffer = finalBytes;
                this._OutputBufferIndex = finalBytes.length;
                // set the fact that we've transformed the final block
                this._finalBlockTransformed = true;
                // now, return either everything we just got or just what's asked for, whichever is smaller
                if (bytesToDeliver < this._OutputBufferIndex) {
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, currentOutputIndex, bytesToDeliver);
                    this._OutputBufferIndex -= bytesToDeliver;
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, bytesToDeliver, this._OutputBuffer, 0, this._OutputBufferIndex);
                    return (count);
                } else {
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, currentOutputIndex, this._OutputBufferIndex);
                    bytesToDeliver -= this._OutputBufferIndex;
                    this._OutputBufferIndex = 0;
                    return (count - bytesToDeliver);
                }
            }


            // try to fill _InputBuffer so we have something to transform
            while (bytesToDeliver > 0) {
                while (this._InputBufferIndex < this._InputBlockSize) {
                    amountRead = this._stream.Read(this._InputBuffer, this._InputBufferIndex, this._InputBlockSize - this._InputBufferIndex);
                    // first, check to see if we're at the end of the input stream
                    if (amountRead == 0) {
                        return ProcessFinalBlock();
                    }
                    this._InputBufferIndex += amountRead;
                }
                numOutputBytes = this._Transform.TransformBlock(this._InputBuffer, 0, this._InputBlockSize, this._OutputBuffer, 0);
                this._InputBufferIndex = 0;
                if (bytesToDeliver >= numOutputBytes) {
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, currentOutputIndex, numOutputBytes);
                    currentOutputIndex += numOutputBytes;
                    bytesToDeliver -= numOutputBytes;
                } else {
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, 0, buffer, currentOutputIndex, bytesToDeliver);
                    this._OutputBufferIndex = numOutputBytes - bytesToDeliver;
                    TArray.Copy/* Buffer.InternalBlockCopy */(this._OutputBuffer, bytesToDeliver, this._OutputBuffer, 0, this._OutputBufferIndex);
                    return count;
                }
            }
            return count;
        }

        // OK, see first if it's a multi-block transform and we can speed up things
        if (bytesToDeliver > this._OutputBlockSize) {
            if (this._Transform.CanTransformMultipleBlocks) {
                const BlocksToProcess: int = Convert.ToInt32(bytesToDeliver / this._OutputBlockSize);
                const numWholeBlocksInBytes: int = BlocksToProcess * this._InputBlockSize;
                const tempInputBuffer: ByteArray = New.ByteArray(numWholeBlocksInBytes);
                // get first the block already read
                TArray.Copy/*  Buffer.InternalBlockCopy */(this._InputBuffer, 0, tempInputBuffer, 0, this._InputBufferIndex);
                amountRead = this._InputBufferIndex;
                amountRead += this._stream.Read(tempInputBuffer, this._InputBufferIndex, numWholeBlocksInBytes - this._InputBufferIndex);
                this._InputBufferIndex = 0;
                if (amountRead <= this._InputBlockSize) {
                    this._InputBuffer = tempInputBuffer;
                    this._InputBufferIndex = amountRead;
                    return slow();
                }
                // Make amountRead an integral multiple of _InputBlockSize
                const numWholeReadBlocksInBytes: int = Convert.ToInt32(amountRead / this._InputBlockSize) * this._InputBlockSize;
                const numIgnoredBytes: int = amountRead - numWholeReadBlocksInBytes;
                if (numIgnoredBytes !== 0) {
                    this._InputBufferIndex = numIgnoredBytes;
                    TArray.Copy/* Buffer.InternalBlockCopy */(tempInputBuffer, numWholeReadBlocksInBytes, this._InputBuffer, 0, numIgnoredBytes);
                }
                const tempOutputBuffer: ByteArray = New.ByteArray(Convert.ToInt32(numWholeReadBlocksInBytes / this._InputBlockSize) * this._OutputBlockSize);
                numOutputBytes = this._Transform.TransformBlock(tempInputBuffer, 0, numWholeReadBlocksInBytes, tempOutputBuffer, 0);
                TArray.Copy/* Buffer.InternalBlockCopy */(tempOutputBuffer, 0, buffer, currentOutputIndex, numOutputBytes);
                // Now, tempInputBuffer and tempOutputBuffer are no more needed, so zeroize them to protect plain text
                TArray.Clear(tempInputBuffer, 0, tempInputBuffer.length);
                TArray.Clear(tempOutputBuffer, 0, tempOutputBuffer.length);
                bytesToDeliver -= numOutputBytes;
                currentOutputIndex += numOutputBytes;
            }
        }
        return slow();
    }

    @Override
    public Write(buffer: ByteArray, offset: int, count: int): void {
        if (!this.CanWrite)
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_UnwritableStream"));
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        if (buffer.length - offset < count)
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        //Contract.EndContractBlock();
        // write <= count bytes to the output stream, transforming as we go.
        // Basic idea: using bytes in the _InputBuffer first, make whole blocks,
        // transform them, and write them out.  Cache any remaining bytes in the _InputBuffer.
        let bytesToWrite: int = count;
        let currentInputIndex: int = offset;
        // if we have some bytes in the _InputBuffer, we have to deal with those first,
        // so let's try to make an entire block out of it
        if (this._InputBufferIndex > 0) {
            if (count >= this._InputBlockSize - this._InputBufferIndex) {
                // we have enough to transform at least a block, so fill the input block
                TArray.Copy/* Buffer.InternalBlockCopy */(buffer, offset, this._InputBuffer, this._InputBufferIndex, this._InputBlockSize - this._InputBufferIndex);
                currentInputIndex += (this._InputBlockSize - this._InputBufferIndex);
                bytesToWrite -= (this._InputBlockSize - this._InputBufferIndex);
                this._InputBufferIndex = this._InputBlockSize;
                // Transform the block and write it out
            } else {
                // not enough to transform a block, so just copy the bytes into the _InputBuffer
                // and return
                TArray.Copy/* Buffer.InternalBlockCopy */(buffer, offset, this._InputBuffer, this._InputBufferIndex, count);
                this._InputBufferIndex += count;
                return;
            }
        }
        // If the OutputBuffer has anything in it, write it out
        if (this._OutputBufferIndex > 0) {
            this._stream.Write(this._OutputBuffer, 0, this._OutputBufferIndex);
            this._OutputBufferIndex = 0;
        }
        // At this point, either the _InputBuffer is full, empty, or we've already returned.
        // If full, let's process it -- we now know the _OutputBuffer is empty
        let numOutputBytes: int;
        if (this._InputBufferIndex === this._InputBlockSize) {
            numOutputBytes = this._Transform.TransformBlock(this._InputBuffer, 0, this._InputBlockSize, this._OutputBuffer, 0);
            // write out the bytes we just got
            this._stream.Write(this._OutputBuffer, 0, numOutputBytes);
            // reset the _InputBuffer
            this._InputBufferIndex = 0;
        }
        while (bytesToWrite > 0) {
            if (bytesToWrite >= this._InputBlockSize) {
                // We have at least an entire block's worth to transform
                // If the transform will handle multiple blocks at once, do that
                if (this._Transform.CanTransformMultipleBlocks) {
                    const numWholeBlocks: int = Convert.ToInt32(bytesToWrite / this._InputBlockSize);
                    const numWholeBlocksInBytes: int = numWholeBlocks * this._InputBlockSize;
                    const _tempOutputBuffer: ByteArray = New.ByteArray(numWholeBlocks * this._OutputBlockSize);
                    numOutputBytes = this._Transform.TransformBlock(buffer, currentInputIndex, numWholeBlocksInBytes, _tempOutputBuffer, 0);
                    this._stream.Write(_tempOutputBuffer, 0, numOutputBytes);
                    currentInputIndex += numWholeBlocksInBytes;
                    bytesToWrite -= numWholeBlocksInBytes;
                } else {
                    // do it the slow way
                    numOutputBytes = this._Transform.TransformBlock(buffer, currentInputIndex, this._InputBlockSize, this._OutputBuffer, 0);
                    this._stream.Write(this._OutputBuffer, 0, numOutputBytes);
                    currentInputIndex += this._InputBlockSize;
                    bytesToWrite -= this._InputBlockSize;
                }
            } else {
                // In this case, we don't have an entire block's worth left, so store it up in the
                // input buffer, which by now must be empty.
                TArray.Copy/* Buffer.InternalBlockCopy */(buffer, currentInputIndex, this._InputBuffer, 0, bytesToWrite);
                this._InputBufferIndex += bytesToWrite;
                return;
            }
        }
        return;
    }

    public Clear(): void {
        this.Close();
    }

    @Override
    protected dispose(disposing: boolean): void {
        try {
            if (disposing) {
                if (!this._finalBlockTransformed) {
                    this.FlushFinalBlock();
                }
                if (!this._leaveOpen) {
                    this._stream.Close();
                }
            }
        }
        finally {
            try {
                // Ensure we don't try to transform the final block again if we get disposed twice
                // since it's null after this
                this._finalBlockTransformed = true;
                // we need to clear all the internal buffers
                if (this._InputBuffer != null)
                    TArray.Clear(this._InputBuffer, 0, this._InputBuffer.length);
                if (this._OutputBuffer != null)
                    TArray.Clear(this._OutputBuffer, 0, this._OutputBuffer.length);

                this._InputBuffer = null as any;
                this._OutputBuffer = null as any;
                this._canRead = false;
                this._canWrite = false;
            }
            finally {
                super.Dispose(/* disposing */);
            }
        }
    }

    // Private methods

    private  InitializeBuffer():void {
        if (this._Transform != null) {
            this._InputBlockSize = this._Transform.InputBlockSize;
            this._InputBuffer = New.ByteArray(this._InputBlockSize);
            this._OutputBlockSize = this._Transform.OutputBlockSize;
            this._OutputBuffer = New.ByteArray(this._OutputBlockSize);
        }
    }
}