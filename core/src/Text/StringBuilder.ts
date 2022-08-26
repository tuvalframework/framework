import { Convert } from './../convert';
import { is } from './../is';
import { Environment } from '../Environment';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { char, CharArray, decimal, double, float, int, long, short, uint, ulong, ushort } from '../float';
import { newOutEmpty, Out } from '../Out';
import { TObject } from './../Extensions/TObject';
import { TString } from './TString';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { byte } from '../byte';
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { Override } from '../Reflection/Decorators/ClassInfo';
import { start } from 'repl';
import { Exception } from '../Exception';

export class StringBuilder extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    public /* internal */ static readonly DefaultCapacity: int = 16;
    public /* internal */  m_currentThread: int = 0; //StringBuilder.InternalGetCurrentThread();
    public /* internal */  m_MaxCapacity: int = 0;
    public /* internal */  m_StringValue: string = null as any;

    public get Capacity(): int {
        return this.m_StringValue.length;
    }
    public set Capacity(value: int) {
        //this.InternalSetCapacity(value);
    }
    public get(index: int): char {
        return this.m_StringValue[index].charCodeAt(0);
    }
    public set(index: int, value: char) {
        this.m_StringValue = this.m_StringValue.substr(0, index) + String.fromCharCode(value) + this.m_StringValue.substr(index + String.fromCharCode(value).length);
    }

    public get Length(): int {
        return this.m_StringValue.length;
    }
    public set Length(value: int) {
        /*  let int32: Out<int> = newOutEmpty();
         const threadSafeString: string = this.GetThreadSafeString(out ınt32);
         if (value == 0) {
             threadSafeString.SetLength(0);
             this.ReplaceString(int32, threadSafeString);
             return;
         }
         const length: int = threadSafeString.length;
         let int321: int = value;
         if (int321 < 0) {
             throw new ArgumentOutOfRangeException("newlength", Environment.GetResourceString("ArgumentOutOfRange_NegativeLength"));
         }
         if (int321 > this.MaxCapacity) {
             throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
         }
         if (int321 === length) {
             return;
         }
         if (int321 > threadSafeString.Capacity) {
             const stringForStringBuilder: string = TString.GetStringForStringBuilder(threadSafeString, (int321 > threadSafeString.Capacity ? int321 : threadSafeString.Capacity));
             stringForStringBuilder.SetLength(int321);
             this.ReplaceString(ınt32, stringForStringBuilder);
             return;
         }
         if (int321 > length) {
             for (let i: int = length; i < int321; i++) {
                 threadSafeString.InternalSetCharNoBoundsCheck(i, '\0');
             }
         }
         threadSafeString.InternalSetCharNoBoundsCheck(int321, '\0');
         threadSafeString.SetLength(int321);
         this.ReplaceString(int32, threadSafeString); */
    }


    public get MaxCapacity(): int {
        return this.m_MaxCapacity;
    }

    public constructor();
    public constructor(capacity: int);
    public constructor(value: string);
    public constructor(value: string, capacity: int);
    public constructor(value: string, startIndex: int, length: int, capacity: int);
    public constructor(capacity: int, maxCapacity: int);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.constructor3(value);
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const value: string = args[0];
            const capacity: int = args[1];
            this.constructor4(value, capacity);
        } else if (args.length === 4 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const value: string = args[0];
            const startIndex: int = args[1];
            const length: int = args[2];
            const capacity: int = args[3];
            this.constructor5(value, startIndex, length, capacity);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const capacity: int = args[0];
            const maxCapacity: int = args[1];
            this.constructor(capacity, maxCapacity);
        }
    }

    public constructor1() {
        this.constructor2(16);
    }

    public constructor2(capacity: int) {
        if (capacity < 0) {
            throw new ArgumentOutOfRangeException("capacity", TString.Format(Environment.GetResourceString("ArgumentOutOfRange_MustBePositive"), "capacity"));
        }
        if (capacity === 0) {
            capacity = 16;
        }
        this.m_StringValue = TString.Empty;
        this.m_MaxCapacity = 2147483647;
    }

    public constructor3(value: string) {
        this.m_StringValue = value;
    }

    public constructor4(value: string, capacity: int) {
        if (capacity < 0) {
            throw new ArgumentOutOfRangeException("capacity", TString.Format(Environment.GetResourceString("ArgumentOutOfRange_MustBePositive"), "capacity"));
        }
        this.m_StringValue = value;
    }

    public constructor5(value: string, startIndex: int, length: int, capacity: int) {
        if (capacity < 0) {
            throw new ArgumentOutOfRangeException("capacity", TString.Format(Environment.GetResourceString("ArgumentOutOfRange_MustBePositive"), "capacity"));
        }
        if (length < 0) {
            throw new ArgumentOutOfRangeException("length", TString.Format(Environment.GetResourceString("ArgumentOutOfRange_MustBeNonNegNum"), "length"));
        }
        this.m_StringValue = value.substr(startIndex, length);
    }

    public constructor6(capacity: int, maxCapacity: int) {
        if (capacity > maxCapacity) {
            throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_Capacity"));
        }
        if (maxCapacity < 1) {
            throw new ArgumentOutOfRangeException("maxCapacity", Environment.GetResourceString("ArgumentOutOfRange_SmallMaxCapacity"));
        }
        if (capacity < 0) {
            throw new ArgumentOutOfRangeException("capacity", TString.Format(Environment.GetResourceString("ArgumentOutOfRange_MustBePositive"), "capacity"));
        }
        if (capacity == 0) {
            capacity = 16;
        }
        this.m_StringValue = TString.Empty;
        this.m_MaxCapacity = maxCapacity;
    }

    public AppendChar(value: string): StringBuilder;
    public AppendChar(value: string, repeatCount: int): StringBuilder;
    public AppendChar(value: char): StringBuilder;
    public AppendChar(value: char, repeatCount: int): StringBuilder;
    public AppendChar(...args: any[]) {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            if (this.m_StringValue == null) {
                this.m_StringValue = value;
            } else {
                this.m_StringValue += value;
            }
            return this;
        } else if (args.length === 1 && is.char(args[0])) {
            const value: char = args[0];
            if (this.m_StringValue == null) {
                this.m_StringValue = String.fromCharCode(value);
            } else {
                this.m_StringValue += String.fromCharCode(value);
            }
            return this;
        } else if (args.length === 2 && is.char(args[0]) && is.int(args[1])) {
            const value: char = args[0];
            const repeatCount: int = args[1];
            for (let i = 0; i < repeatCount; i++) {
                if (this.m_StringValue == null) {
                    this.m_StringValue = String.fromCharCode(value);
                } else {
                    this.m_StringValue += String.fromCharCode(value);
                }
            }
            return this;
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const value: string = args[0];
            const repeatCount: int = args[1];
            for (let i = 0; i < repeatCount; i++) {
                if (this.m_StringValue == null) {
                    this.m_StringValue = value;
                } else {
                    this.m_StringValue += value;
                }
            }
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public AppendCharArray(value: CharArray): StringBuilder;
    public AppendCharArray(value: CharArray, startIndex: int, charCount: int): StringBuilder;
    public AppendCharArray(...args: any[]): StringBuilder {
        if (args.length === 1 && is.CharArray(args[0])) {
            const value: CharArray = args[0];
            if (this.m_StringValue == null) {
                this.m_StringValue = TString.FromCharArray(value);
            } else {
                this.m_StringValue += TString.FromCharArray(value);
            }
            return this;
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const value: CharArray = args[0];
            const startIndex: int = args[1];
            const charCount: int = args[2];
            if (this.m_StringValue == null) {
                this.m_StringValue = TString.FromCharArray(value, startIndex, charCount);
            } else {
                this.m_StringValue += TString.FromCharArray(value, startIndex, charCount);
            }
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public Append(value: string): StringBuilder;
    public Append(value: string, startIndex: int, count: int): StringBuilder;
    public Append(...args: any[]) {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            if (this.m_StringValue == null) {
                this.m_StringValue = value;
            } else {
                this.m_StringValue += value;
            }
            return this;
        } else if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const value: string = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];
            if (this.m_StringValue == null) {
                this.m_StringValue = value.substr(startIndex, length);
            } else {
                this.m_StringValue += value.substr(startIndex, length);
            }
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public AppendLine(): StringBuilder;
    public AppendLine(str: string): StringBuilder;
    public AppendLine(...args: any): StringBuilder {
        if (args.length === 0) {
            this.Append('\n');
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            this.Append(str + '\n');
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }
    /* internal unsafe StringBuilder Append(char * value, int count) {
        int ınt32;
        if (value == null) {
            return this;
        }
        string threadSafeString = this.GetThreadSafeString(out ınt32);
        int length = threadSafeString.Length;
        int ınt321 = length + count;
        if (!this.NeedsAllocation(threadSafeString, ınt321)) {
            threadSafeString.AppendInPlace(value, count, length);
            this.ReplaceString(ınt32, threadSafeString);
        }
        else {
            string newString = this.GetNewString(threadSafeString, ınt321);
            newString.AppendInPlace(value, count, length);
            this.ReplaceString(ınt32, newString);
        }
        return this;
    } */

    public AppendBoolean(value: boolean): StringBuilder {
        return this.Append(value.toString());
    }


    /*  public  Append(sbyte value):StringBuilder {
         return this.Append(value.ToString());
     } */

    public AppendByte(value: byte): StringBuilder {
        value = Convert.ToByte(value);
        return this.Append(value.toString());
    }



    public AppendShort(value: short): StringBuilder {
        value = Convert.ToShort(value);
        return this.Append(value.toString());
    }

    public AppendInt(value: int): StringBuilder {
        value = Convert.ToInt32(value);
        return this.Append(value.toString());
    }

    public AppendLong(value: long): StringBuilder {
        value = Convert.ToLong(value);
        return this.Append(value.toNumber());
    }

    public AppendFloat(value: float): StringBuilder {
        value = Convert.ToFloat(value);
        return this.Append(value.toString());
    }

    public AppendDouble(value: double): StringBuilder {
        //value = Convert.ToDouble(value);
        return this.Append(value.toNumber());
    }

    public AppendDecimal(value: decimal): StringBuilder {
        //value = Convert.ToDecimal(value);
        return this.Append(value.toNumber());
    }

    public AppendUShort(value: ushort): StringBuilder {
        return this.Append(value.toString());
    }

    public AppendUInt(value: uint): StringBuilder {
        return this.Append(value.toString());
    }

    public AppendULong(value: ulong): StringBuilder {
        return this.Append(value.toNumber());
    }

    public AppendAny(value: any): StringBuilder {
        if (value == null) {
            return this;
        }
        return this.Append(value.toString());
    }

    public AppendFormat(format: string, ...args: any[]): StringBuilder {
        return this.Append(TString.Format(format, ...args));
    }

    /*   public StringBuilder AppendFormat(string format, object arg0, object arg1) {
          object[] objArray = new object[] { arg0, arg1 };
          return this.AppendFormat((IFormatProvider)null, format, objArray);
      }

      public StringBuilder AppendFormat(string format, object arg0, object arg1, object arg2) {
          object[] objArray = new object[] { arg0, arg1, arg2 };
          return this.AppendFormat((IFormatProvider)null, format, objArray);
      }

      public StringBuilder AppendFormat(string format, params object[] args) {
          return this.AppendFormat((IFormatProvider)null, format, args);
      }

      public StringBuilder AppendFormat(IFormatProvider provider, string format, params object[] args) {
          if (format == null || args == null) {
              throw new ArgumentNullException((format == null ? "format" : "args"));
          }
          char[] charArray = format.ToCharArray(0, format.Length);
          int ınt32 = 0;
          int length = (int)charArray.Length;
          char chr = '\0';
          ICustomFormatter customFormatter = null;
          if (provider != null) {
              customFormatter = (ICustomFormatter)provider.GetFormat(typeof (ICustomFormatter));
          }
          while (true) {
              int ınt321 = ınt32;
              int ınt322 = ınt32;
              while (ınt32 < length) {
                  chr = charArray[ınt32];
                  ınt32++;
                  if (chr == '}') {
                      if (ınt32 >= length || charArray[ınt32] != '}') {
                          StringBuilder.FormatError();
                      }
                      else {
                          ınt32++;
                      }
                  }
                  if (chr == '{') {
                      if (ınt32 >= length || charArray[ınt32] != '{') {
                          ınt32--;
                          break;
                      }
                      else {
                          ınt32++;
                      }
                  }
                  int ınt323 = ınt322;
                  ınt322 = ınt323 + 1;
                  charArray[ınt323] = chr;
              }
              if (ınt322 > ınt321) {
                  this.Append(charArray, ınt321, ınt322 - ınt321);
              }
              if (ınt32 == length) {
                  break;
              }
              ınt32++;
              if (ınt32 != length) {
                  char chr1 = charArray[ınt32];
                  chr = chr1;
                  if (chr1 >= '0' && chr <= '9') {
                      goto Label1;
                  }
              }
              StringBuilder.FormatError();
              Label1:
              int ınt324 = 0;
              do {
                  ınt324 = ınt324 * 10 + chr - 48;
                  ınt32++;
                  if (ınt32 == length) {
                      StringBuilder.FormatError();
                  }
                  chr = charArray[ınt32];
              }
              while (chr >= '0' && chr <= '9' && ınt324 < 1000000);
              if (ınt324 >= (int)args.Length)
              {
                  throw new FormatException(Environment.GetResourceString("Format_IndexOutOfRange"));
              }
              while (ınt32 < length) {
                  char chr2 = charArray[ınt32];
                  chr = chr2;
                  if (chr2 != ' ') {
                      break;
                  }
                  ınt32++;
              }
              bool flag = false;
              int ınt325 = 0;
              if (chr == ',') {
                  ınt32++;
                  while (ınt32 < length && charArray[ınt32] == ' ') {
                      ınt32++;
                  }
                  if (ınt32 == length) {
                      StringBuilder.FormatError();
                  }
                  chr = charArray[ınt32];
                  if (chr == '-') {
                      flag = true;
                      ınt32++;
                      if (ınt32 == length) {
                          StringBuilder.FormatError();
                      }
                      chr = charArray[ınt32];
                  }
                  if (chr < '0' || chr > '9') {
                      StringBuilder.FormatError();
                  }
                  do {
                      ınt325 = ınt325 * 10 + chr - 48;
                      ınt32++;
                      if (ınt32 == length) {
                          StringBuilder.FormatError();
                      }
                      chr = charArray[ınt32];
                      if (chr < '0' || chr > '9') {
                          goto Label2;
                      }
                  }
                  while (ınt325 < 1000000);
              }
              Label2:
              while (ınt32 < length) {
                  char chr3 = charArray[ınt32];
                  chr = chr3;
                  if (chr3 != ' ') {
                      break;
                  }
                  ınt32++;
              }
              object obj = args[ınt324];
              string str = null;
              if (chr == ':') {
                  ınt32++;
                  ınt321 = ınt32;
                  ınt322 = ınt32;
                  while (true) {
                      if (ınt32 == length) {
                          StringBuilder.FormatError();
                      }
                      chr = charArray[ınt32];
                      ınt32++;
                      if (chr == '{') {
                          if (ınt32 >= length || charArray[ınt32] != '{') {
                              StringBuilder.FormatError();
                          }
                          else {
                              ınt32++;
                          }
                      }
                      else if (chr == '}') {
                          if (ınt32 >= length || charArray[ınt32] != '}') {
                              break;
                          }
                          ınt32++;
                      }
                      int ınt326 = ınt322;
                      ınt322 = ınt326 + 1;
                      charArray[ınt326] = chr;
                  }
                  ınt32--;
                  if (ınt322 > ınt321) {
                      str = new string(charArray, ınt321, ınt322 - ınt321);
                  }
              }
              if (chr != '}') {
                  StringBuilder.FormatError();
              }
              ınt32++;
              string empty = null;
              if (customFormatter != null) {
                  empty = customFormatter.Format(str, obj, provider);
              }
              if (empty == null) {
                  if (obj is IFormattable)
                  {
                      empty = ((IFormattable)obj).ToString(str, provider);
                  }
                      else if (obj != null) {
                      empty = obj.ToString();
                  }
              }
              if (empty == null) {
                  empty = string.Empty;
              }
              int length1 = ınt325 - empty.Length;
              if (!flag && length1 > 0) {
                  this.Append(' ', length1);
              }
              this.Append(empty);
              if (flag && length1 > 0) {
                  this.Append(' ', length1);
              }
          }
          return this;
      } */

    public EnsureCapacity(capacity: int): int {
        throw new NotImplementedException('');
    }

    public Equals<StringBuilder>(sb: StringBuilder): boolean {
        if (sb == null) {
            return false;
        }
        /* if (this.Capacity != sb.Capacity || this.MaxCapacity != sb.MaxCapacity) {
            return false;
        } */
        return this.m_StringValue === (sb as any).m_StringValue;
    }

    private static FormatError(): void {
        throw new Exception(Environment.GetResourceString("Format_InvalidString"));
    }

    public Insert(index: int, value: string): StringBuilder;
    public Insert(index: int, value: string, count: int): StringBuilder;
    public Insert(index: int, value: CharArray, startIndex: int, charCount: int): StringBuilder;
    public Insert(...args: any[]) {
        if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const index: int = args[0];
            const value: string = args[1];
            this.m_StringValue = this.m_StringValue.substr(0, index) + value + this.m_StringValue.substr(index + value.length);
            return this;
        } else if (args.length === 3 && is.int(args[0]) && is.string(args[1]) && is.int(args[2])) {
            const index: int = args[0];
            const value: string = args[1];
            const count: int = args[2];
            this.m_StringValue = this.m_StringValue.substr(0, index) + value.substr(0, count) + this.m_StringValue.substr(index + count);
            return this;
        } else if (args.length === 4 && is.int(args[0]) && is.CharArray(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const index: int = args[0];
            const value: CharArray = args[1];
            const startIndex: int = args[2];
            const charCount: int = args[3];
            const str = TString.FromCharArray(value, startIndex, charCount);
            this.m_StringValue = this.m_StringValue.substr(0, index) + str.substr(0, 1) + this.m_StringValue.substr(index + charCount);
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public InsertBoolean(index: int, value: boolean): StringBuilder {
        return this.Insert(index, value.toString(), 1);
    }

    /* public  Insert(int index, sbyte value):StringBuilder {
        return this.Insert(index, value.ToString(), 1);
    } */

    public InsertByte(index: int, value: byte): StringBuilder {
        return this.Insert(index, value.toString(), 1);
    }

    public InsertShort(index: int, value: short): StringBuilder {
        return this.Insert(index, value.toString(), 1);
    }

    public InsertChar(index: int, value: char): StringBuilder {
        return this.Insert(index, String.fromCharCode(value), 1);
    }

    public InsertCharArray(index: int, value: CharArray): StringBuilder {
        if (value == null) {
            return this.Insert(index, value, 0, 0);
        }
        return this.Insert(index, value, 0, value.length);
    }

    /*  [MethodImpl(MethodImplOptions.InternalCall)]
     public extern StringBuilder Insert(int index, char[] value, int startIndex, int charCount); */

    public InsertInt(index: int, value: int): StringBuilder {
        value = Convert.ToInt32(value);
        return this.Insert(index, value.toString(), 1);
    }

    public InsertLong(index: int, value: long): StringBuilder {
        value = Convert.ToLong(value);
        return this.Insert(index, value.toNumber(), 1);
    }

    public InsertFloat(index: int, value: float): StringBuilder {
        value = Convert.ToFloat(value);
        return this.Insert(index, value.toString(), 1);
    }

    public InsertDouble(index: int, value: double): StringBuilder {
        //value = Convert.ToDouble(value);
        return this.Insert(index, value.toNumber(), 1);
    }

    public InsertDecimal(index: int, value: decimal): StringBuilder {
        //value = Convert.ToDecimal(value);
        return this.Insert(index, value.toNumber(), 1);
    }

    public InsertUShort(index: int, value: ushort): StringBuilder {
        value = Convert.ToUShort(value);
        return this.Insert(index, value.toString(), 1);
    }

    public InsertUInt(index: int, value: uint): StringBuilder {
        value = Convert.ToUInt32(value);
        return this.Insert(index, value.toString(), 1);
    }

    public InsertULong(index: int, value: ulong): StringBuilder {
        //value = Convert.ToULong(value);
        return this.Insert(index, value.toNumber(), 1);
    }

    public InsertAny(index: int, value: any): StringBuilder {
        if (value == null) {
            return this;
        }
        return this.Insert(index, value.toString(), 1);
    }

    /*  [MethodImpl(MethodImplOptions.InternalCall)]
     private static extern int InternalGetCurrentThread();

     [MethodImpl(MethodImplOptions.InternalCall)]
     internal extern int InternalSetCapacity(int capacity);

     [MethodImpl(MethodImplOptions.InternalCall)]
     private extern void MakeFromString(string value, int startIndex, int length, int capacity);

         private bool NeedsAllocation(string currentString, int requiredLength)
 {
     return currentString.ArrayLength <= requiredLength;
 }

 [MethodImpl(MethodImplOptions.InternalCall)] */
    public Remove(startIndex: int, length: int): StringBuilder {
        throw new NotImplementedException('');
    }

    public Replace(oldValue: string, newValue: string): StringBuilder;
    public Replace(oldValue: string, newValue: string, startIndex: int, count: int): StringBuilder;
    public Replace(oldChar: char, newChar: char): StringBuilder;
    public Replace(oldChar: char, newChar: char, startIndex: int, count: int): StringBuilder;
    public Replace(...args: any[]): StringBuilder {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const oldValue: string = args[0];
            const newValue: string = args[1];
            this.Replace(oldValue, newValue, 0, this.Length);
            return this;
        } else if (args.length === 4 && is.string(args[0]) && is.string(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const oldValue: string = args[0];
            const newValue: string = args[1];
            const startIndex: int = args[2];
            const count: int = args[3];
            this.m_StringValue = this.m_StringValue.substr(startIndex, count).replace(oldValue, newValue);
            return this;
        } else if (args.length === 2 && is.char(args[0]) && is.char(args[1])) {
            const oldChar: char = args[0];
            const newChar: char = args[1];
            this.Replace(oldChar, newChar, 0, this.Length);
            return this;
        } else if (args.length === 4 && is.char(args[0]) && is.char(args[1]) && is.char(args[2]) && is.int(args[3])) {
            const oldChar: char = args[0];
            const newChar: char = args[1];
            const startIndex: int = args[2];
            const count: int = args[3];
            this.m_StringValue = this.m_StringValue.substr(startIndex, count).replace(String.fromCharCode(oldChar), String.fromCharCode(newChar));
            return this;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    private ReplaceString(tid: int, value: string): void {
        this.m_currentThread = tid;
        this.m_StringValue = value;
    }

    public ToString(): string;
    public ToString(startIndex: int, length: int): string;
    public ToString(...args: any[]): string {
        if (args.length === 0) {
            return this.m_StringValue;
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const startIndex: int = args[0];
            const length: int = args[1];
            return this.m_StringValue.substring(startIndex, length);
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public Clear(): StringBuilder {
        this.Length = 0;
        return this;
    }
}