

export function isRefObject<E = any>(ref: any): ref is any/* MutableRefObject<E> */ {
    return (
        typeof ref === "object" &&
        Object.prototype.hasOwnProperty.call(ref, "current")
    )
}
