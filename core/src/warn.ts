export function warn(str: string) {
    /*
                 * IE9 on Windows7 64bit will throw a JS error
                 * if we don't use window.console in the conditional
                 */
    if (console.warn) {
        console.warn(str);
    }
}