export class SynchronizationContext {
    public static Current:SynchronizationContext;
    public static SetSynchronizationContext(context:SynchronizationContext) {
        SynchronizationContext.Current = context;
    }
    public CreateCopy(): SynchronizationContext {
        return null as any;
    }
}