export enum MethodImplAttributes {
    CodeTypeMask = 3,
    IL = 0,
    Native = 1,
    OPTIL = 2,
    Runtime = 3,
    ManagedMask = 4,
    Unmanaged = 4,
    Managed = 0,
    ForwardRef = 16,
    PreserveSig = 128,
    InternalCall = 4096,
    Synchronized = 32,
    NoInlining = 8,
    NoOptimization = 64,
    MaxMethodImplVal = 65535,
    AggressiveInlining = 256
}