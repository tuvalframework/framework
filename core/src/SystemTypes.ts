
export class System {
    /*   public static currentTimeMillis(): long {
          return Convert.ToLong(DateUtil.now());
      } */
}

export namespace System {
    export const Types = {
        Extensions: {
            ArrayEnumerator: Symbol('ArrayEnumerator'),
        },
        IntPtr: Symbol('IntPtr'),
        Guid: Symbol('Guid'),
        TObject: Symbol('TObject'),
        Cryptography: {
            ICryptoTransform: Symbol('ICryptoTransform'),
            RijndaelManaged: Symbol('RijndaelManaged'),
            Rijndael: Symbol('Rijndael'),
            Aes: Symbol('Aes'),
            AesManaged: Symbol('AesManaged'),
            SymmetricAlgorithm: Symbol('SymmetricAlgorithm'),
            CryptoStream: Symbol('CryptoStream'),
        },
        Text: {
            StringBuilder: Symbol('StringBuilder'),
        },
        DateTime: Symbol('DateTime'),
        TimeSpan: Symbol('TimeSpan'),
        DateTimeOffset: Symbol('DateTimeOffset'),
        TimeZoneInfo: Symbol('TimeZoneInfo'),

        Globalization: {
            NumberFormatInfo: Symbol('NumberFormatInfo'),
            DateTimeResult: Symbol('DateTimeResult'),
            GregorianCalendar: Symbol('GregorianCalendar'),
            CultureInfo: Symbol('CultureInfo'),
            DateTimeFormatInfo: Symbol('DateTimeFormatInfo'),
            Calendar: Symbol('Calendar'),
            CultureData: Symbol('CultureData'),
            JapaneseCalendar: Symbol('JapaneseCalendar'),
        },
        CompareInfo: Symbol('CompareInfo'),
        UMP: {
            POINT: Symbol('POINT'),
            RECT: Symbol('RECT'),
            GdipEncoderParameter: Symbol('GdipEncoderParameter'),
        },
        com: {
            tuval: {
                twt: {
                    core: {
                        shared: {
                            impl: {
                                JsLogger: Symbol('JsLogger')
                            }
                        }
                    }
                }
            }
        },
        tuval: {
            util: {
                FloatArray: Symbol('FloatArray'),
                function: {
                    DoubleConsumer: Symbol('DoubleConsumer'),
                },
                logging: {
                    LogRecord: Symbol('LogRecord'),
                },
                CharSequence: Symbol('CharSequence'),
                AbstractMap: {
                    AbstractMap: Symbol('AbstractMap'),
                    AbstractEntry: Symbol('AbstractEntry'),
                },

                Map: {
                    Map: Symbol('Map'),
                    Entry: Symbol('Entry')
                },
                Set: Symbol('Set'),
                Pool: {
                    Pool: Symbol('Pool'),
                    Poolable: Symbol('Poolable')
                }
            },
            io: {
                /*  FileFilter: Symbol('FileFilter'),
                 Writer: Symbol('Writer'),
                 UTFDataFormatException: Symbol('UTFDataFormatException'),
                 StringWriter: Symbol('StringWriter'),
                 StringReader: Symbol('StringReader'),
                 Readable: Symbol('Readable'),
                 Reader: Symbol('Reader'),
                 RandomAccessFile: Symbol('RandomAccessFile'),
                 OutputStreamWriter: Symbol('OutputStreamWriter'),
                 Flushable: Symbol('Flushable'),
                 OutputStream: Symbol('OutputStream'),
                 IOUtils: Symbol('IOUtils'),
                 IOException: Symbol('IOException'),
                 InputStreamReader: Symbol('InputStreamReader'),
                 InputStream: Symbol('InputStream'),
                 FilterInputStream: Symbol('FilterInputStream'),
                 FileWriter: Symbol('FileWriter'),
                 FileNotFoundException: Symbol('FileNotFoundException'),
                 EOFException: Symbol('EOFException'),
                 DataOutput: Symbol('DataOutput'),
                 DataOutputStream: Symbol('DataOutputStream'),
                 DataInput: Symbol('DataInput'),
                 DataInputStream: Symbol('DataInputStream'),
                 ByteArrayOutputStream: Symbol('ByteArrayOutputStream'),
                 BufferedWriter: Symbol('BufferedWriter'),
                 BufferedReader: Symbol('BufferedReader'),
                 BufferedInputStream: Symbol('BufferedInputStream'),
                 Serializable: Symbol('Serializable'),
                 File: Symbol('File'), */
            },
            lang: {
                /*  Iterator: Symbol('Iterator'),
                 Iterable: Symbol('Iterable'),
                 Closeable: Symbol('Closeable'),
                 StringBuffer: Symbol('StringBuffer'),
                 Comparable: Symbol('Comparable'),
                 Throwable: Symbol('Throwable'),
                 CharSequence: Symbol('CharSequence'),
                 Appendable: Symbol('Appendable'),
                 StringBuilder: Symbol('StringBuilder'), */
            },
            nio: {
                LongToByteBufferAdapter: Symbol('LongToByteBufferAdapter'),
                FloatArrayBuffer: Symbol('FloatArrayBuffer'),
                DoubleToByteBufferAdapter: Symbol('DoubleToByteBufferAdapter'),
                DirectReadWriteShortBufferAdapter: Symbol('DirectReadWriteShortBufferAdapter'),
                DirectReadWriteIntBufferAdapter: Symbol('DirectReadWriteIntBufferAdapter'),
                DirectReadWriteFloatBufferAdapter: Symbol('DirectReadWriteFloatBufferAdapter'),
                DirectReadWriteByteBuffer: Symbol('DirectReadWriteByteBuffer'),
                ShortArrayBuffer: Symbol('ShortArrayBuffer'),
                ReadWriteIntArrayBuffer: Symbol('ReadWriteIntArrayBuffer'),
                ReadOnlyIntArrayBuffer: Symbol('ReadOnlyIntArrayBuffer'),
                LongArrayBuffer: Symbol('LongArrayBuffer'),
                ByteBufferWrapper: Symbol('ByteBufferWrapper'),
                IntToByteBufferAdapter: Symbol('IntToByteBufferAdapter'),
                IntArrayBuffer: Symbol('IntArrayBuffer'),
                HeapByteBuffer: Symbol('HeapByteBuffer'),
                FloatToByteBufferAdapter: Symbol('FloatToByteBufferAdapter'),
                DoubleBuffer: Symbol('DoubleBuffer'),
                DoubleArrayBuffer: Symbol('DoubleArrayBuffer'),
                DirectReadOnlyShortBufferAdapter: Symbol('DirectReadOnlyShortBufferAdapter'),
                DirectReadOnlyIntBufferAdapter: Symbol('DirectReadOnlyIntBufferAdapter'),
                DirectReadOnlyFloatBufferAdapter: Symbol('DirectReadOnlyFloatBufferAdapter'),
                DirectReadOnlyByteBuffer: Symbol('DirectReadOnlyByteBuffer'),
                HasArrayBufferView: Symbol('HasArrayBufferView'),
                DirectByteBuffer: Symbol('DirectByteBuffer'),
                CharSequenceAdapter: Symbol('CharSequenceAdapter'),
                BufferFactory: Symbol('BufferFactory'),
                BaseByteBuffer: Symbol('BaseByteBuffer'),
                LongBuffer: Symbol('LongBuffer'),
                FloatBuffer: Symbol('FloatBuffer'),
                CharToByteBufferAdapter: Symbol('CharToByteBufferAdapter'),
                CharBuffer: Symbol('CharBuffer'),
                CharSequence: Symbol('CharSequence'),
                ByteBuffer: Symbol('ByteBuffer'),
                ShortBuffer: Symbol('ShortBuffer'),
                IntBuffer: Symbol('IntBuffer'),
                Buffer: Symbol('Buffer'),
            }
        },
        Primitives: {
            Byte: Symbol('Byte'),
            Short: Symbol('Short'),
            Int: Symbol('Int'),
            Float: Symbol('Float'),
            Double: Symbol('Double'),
            Number: Symbol('Number'),
            String: Symbol('String'),
            Boolean: Symbol('Boolean'),
        },
        Encoding: {
            Encoding: Symbol('System.Types.Text.Encoding.Encoding'),
            UnicodeEncoding: Symbol('System.Types.Text.Encoding.UnicodeEncoding'),
            EncoderExceptionFallback: Symbol('System.Types.Text.Encoding.EncoderExceptionFallback'),
            DecoderExceptionFallback: Symbol('System.Types.Text.Encoding.DecoderExceptionFallback'),
            EncoderFallback: Symbol('System.Types.Text.Encoding.EncoderFallback'),
            DecoderFallback: Symbol('System.Types.Text.Encoding.DecoderFallback'),
            ASCIIEncoding: Symbol('System.Types.Text.Encoding.ASCIIEncoding'),
            UTF32Encoding: Symbol('System.Types.Text.Encoding.UTF32Encoding'),
            UTF8Encoding: Symbol('System.Types.Text.Encoding.UTF8Encoding')
        },
        IO: {
            Stream: Symbol('System.Types.IO.Stream'),
            MemoryStream: Symbol('System.Types.IO.MemoryStream'),
            TextReader: Symbol('System.Types.IO.TextReader'),
            StreamReader: Symbol('System.Types.IO.StreamReader'),
            //EncodingBase: Symbol('System.Types.IO.EncodingBase'),
        },
        IServiceProvider: Symbol('System.Types.IServiceProvider'),
        Collections: {
            BitArray: Symbol('System.Types.Collections..BitArray'),
            CompatibleComparer: Symbol('System.Types.Collections.CompatibleComparer'),
            ArrayList: {
                ArrayList: Symbol('System.Types.Collections.ArrayList.ArrayList'),
                ArrayListEnumeratorSimple: Symbol('System.Types.Collections.ArrayList.ArrayListEnumeratorSimple'),
            },
            ArrayLikeCollection: Symbol('System.Types.Collections..ArrayLikeCollection'),
            CollectionBase: Symbol('System.Types.Collections.CollectionBase'),
            Collection: Symbol('System.Types.Collections.Collection'),
            ICollection: Symbol('System.Types.Collections.ICollection'),
            IReadOnlyCollection: Symbol('System.Types.Collections.IReadOnlyCollection'),
            IHashCodeProvider: Symbol('System.Types.Collections.IHashCodeProvider'),
            Enumeration: {
                IEnumerable: Symbol('IEnumerable'),
                IEnumerateEach: Symbol('System.Types.Collections.Enumerable.IEnumerateEach'),
                IEnumerator: Symbol('IEnumerator'),
                IIterator: Symbol('IIterator')
            },
            Generics: {
                LinkedList: Symbol('System.Types.Collections.Generics.LinkedList'),
                LinkedListNode: Symbol('System.Types.Collections.Generics.LinkedListNode'),
                Queue: Symbol('System.Types.Collections.Generics.Queue'),
                Stack: Symbol('System.Types.Collections.Generics.Stack'),
                IList: Symbol('System.Types.Collections.Generics.IList'),
                List: Symbol('System.Types.Collections.Generics.List'),
                SortedList: Symbol('System.Types.Collections.Generics.SortedList'),
                ICollection: Symbol('System.Types.Collections.Generics.ICollection'),
                DictionaryEntry: Symbol('System.Types.Collections.Generics.DictionaryEntry'),
                Dictionaries: {
                    Dictionary: Symbol('System.Types.Collections.Generics.Dictionaries.Dictionary'),
                    DictionaryBase: Symbol('System.Types.Collections.Generics.Dictionaries.DictionaryBase'),
                    IDictionary: Symbol('System.Types.Collections.Generics.Dictionaries.IDictionary'),
                    IReadOnlyDictionary: Symbol('System.Types.Collections.Generics.Dictionaries.IReadOnlyDictionary'),
                    OrderedStringKeyDictionary: Symbol('System.Types.Collections.Generics.Dictionaries.OrderedStringKeyDictionary'),
                    SimpleDictionary: Symbol('System.Types.Collections.Generics.Dictionaries.SimpleDictionary'),
                    SimpleDictionaryEnumerator: Symbol('System.Types.Collections.Generics.Dictionaries.SimpleDictionaryEnumerator'),
                    StringKeyDictionary: Symbol('System.Types.Collections.Generics.Dictionaries.StringKeyDictionary'),
                    KeyCollection: Symbol('System.Types.Collections.Generics.Dictionary.KeyCollection'),
                },
                RandomizedObjectEqualityComparer: Symbol('System.Types.Collections.Generics.RandomizedObjectEqualityComparer'),
                IDictionary: Symbol('System.Types.Collections.Generics.IDictionary'),
                KeyValuePair: Symbol('System.Types.Collections.Generics.KeyValuePair'),
                /* Dictionary: {
                    Dictionary: Symbol('System.Types.Collections.Generics.Dictionary'),
                    KeyCollection: Symbol('System.Types.Collections.Generics.Dictionary.KeyCollection'),
                } */
            },
            Hashtable: {
                Hashtable: Symbol('System.Types.Collections.Hashtable.Hashtable'),
                KeyCollection: Symbol('System.Types.Collections.Hashtable.KeyCollection'),
            }
        },
        Disposable: {
            IDisposable: Symbol('System.Types.Disposable.IDisposable'),
            IDisposableAware: Symbol('System.Types.Disposable.IDisposableAware'),
            DisposableBase: Symbol('System.Types.Disposable.DisposableBase')
        },
        Reflection: {
            Decorators: {
                Class: Symbol('System.Reflection.Types.Decorators.Class')
            },
            ClassType: Symbol('System.Reflection.Types.ClassType')
        },
        Windows: {
            Forms: {
                Components: {
                    TuElement: Symbol('TuElement'),
                    TuElement2: Symbol('TuElement2')
                }
            }
        },
        Math: {
            Circle: Symbol('Circle'),
            Vector: Symbol('Vector'),
            Vector2: Symbol('Vector2'),
            Vector3: Symbol('Vector3'),
            Matrix3: Symbol('Matrix3'),
            Matrix4: Symbol('Matrix4'),
            Affine2: Symbol('Affine2'),
            Quaternion: Symbol('Quaternion'),
            GridPoint2: Symbol('GridPoint2'),
        },
        ICloneable: Symbol('ICloneable'),
        IEquatable: Symbol('IEquatable'),
        IComparer: Symbol('IComparer'),
        IComparable: Symbol('IComparable'),
        IEqualityComparer: Symbol('IEqualityComparer'),
        IWellKnownStringEqualityComparer: Symbol('System.IWellKnownStringEqualityComparer'),
        Delegate: Symbol('Delegate'),
        IFormatProvider: Symbol('IFormatProvider'),
    }

    export const Runtime = {
        Serialization: {
            ISerializable: Symbol('System.Runtime.Serialization.ISerializable'),
        }
    }

    export class out {
        public static println(str: string) {
            console.log(str);
        }
    }

    export class err {
        public static println(str: string) {
            console.error(str);
        }
    }
}
