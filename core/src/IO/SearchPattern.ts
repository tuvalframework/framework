import { CharArray, New } from "../float";

export class SearchPattern {
    /*
            public SearchPattern (string pattern) : this (pattern, false) { }

            public SearchPattern (string pattern, bool ignore)
            {
                this.ignore = ignore;
                Compile (pattern);
            }

            public bool IsMatch (string text)
            {
                return Match (ops, text, 0);
            }

            // private

            private Op ops;		// the compiled pattern
            private bool ignore;	// ignore case

            private void Compile (string pattern)
            {
                if (pattern == null || pattern.IndexOfAny (InvalidChars) >= 0)
                    throw new ArgumentException ("Invalid search pattern.");

                if (pattern == "*") {	// common case
                    ops = new Op (OpCode.True);
                    return;
                }

                ops = null;

                int ptr = 0;
                Op last_op = null;
                while (ptr < pattern.Length) {
                    Op op;

                    switch (pattern [ptr]) {
                    case '?':
                        op = new Op (OpCode.AnyChar);
                        ++ ptr;
                        break;

                    case '*':
                        op = new Op (OpCode.AnyString);
                        ++ ptr;
                        break;

                    default:
                        op = new Op (OpCode.ExactString);
                        int end = pattern.IndexOfAny (WildcardChars, ptr);
                        if (end < 0)
                            end = pattern.Length;

                        op.Argument = pattern.Substring (ptr, end - ptr);
                        if (ignore)
                            op.Argument = op.Argument.ToLowerInvariant ();

                        ptr = end;
                        break;
                    }

                    if (last_op == null)
                        ops = op;
                    else
                        last_op.Next = op;

                    last_op = op;
                }

                if (last_op == null)
                    ops = new Op (OpCode.End);
                else
                    last_op.Next = new Op (OpCode.End);
            }

            private bool Match (Op op, string text, int ptr)
            {
                while (op != null) {
                    switch (op.Code) {
                    case OpCode.True:
                        return true;

                    case OpCode.End:
                        if (ptr == text.Length)
                            return true;

                        return false;

                    case OpCode.ExactString:
                        int length = op.Argument.Length;
                        if (ptr + length > text.Length)
                            return false;

                        string str = text.Substring (ptr, length);
                        if (ignore)
                            str = str.ToLowerInvariant ();

                        if (str != op.Argument)
                            return false;

                        ptr += length;
                        break;

                    case OpCode.AnyChar:
                        if (++ ptr > text.Length)
                            return false;
                        break;

                    case OpCode.AnyString:
                        while (ptr <= text.Length) {
                            if (Match (op.Next, text, ptr))
                                return true;

                            ++ ptr;
                        }

                        return false;
                    }

                    op = op.Next;
                }

                return true;
            }

            // private static
    */
    public static readonly WildcardChars: string[] = ['*', '?'];
    /*
            internal static readonly char [] InvalidChars = { Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar };

            private class Op {
                public Op (OpCode code)
                {
                    this.Code = code;
                    this.Argument = null;
                    this.Next = null;
                }

                public OpCode Code;
                public string Argument;
                public Op Next;
            }

            private enum OpCode {
                ExactString,		// literal
                AnyChar,		// ?
                AnyString,		// *
                End,			// end of pattern
                True			// always succeeds
            };
    */
}