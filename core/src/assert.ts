import { stringify } from "./stringify";
/**
 * Verilen condition'a göre geçilen message veya Error 'u throw eder.
 * @param condition
 * @param args
 */
export function assert(condition: boolean, message: string): void;
export function assert(condition: boolean, error?: Error): void;
export function assert(condition: boolean, ...message: string[]): void;
export function assert(condition: boolean, ...args: any[]): void {

    // Durum gerçekleşiyorsa throw etmeden dön.
    if (condition) {
        return;
    }

    // Eğer parametre olarak Error nesnesi verilmişse onu throw et.
    if (args.length === 1 && args[0] instanceof Error) {
        throw args[0];
    }

    const msgs = args
        .filter(arg => arg !== '')
        .map((arg) => {
            return typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : stringify(arg);
        });

        throw new Error(msgs.join(' ') || 'Unknown Error');
}