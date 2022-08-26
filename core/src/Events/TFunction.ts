export class TFunction {
    /**
     * Bind function against target <this>.
     *
     * @param  {Function} fn
     * @param  {Object}   target
     *
     * @return {Function} bound function
     */
    public static Bind(fn: Function, target: any) {
        return fn.bind(target);
    }
}