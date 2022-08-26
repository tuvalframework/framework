import { ArgumentNullException } from "./Exceptions";

export function checkNotNull<T>(obj: T, message?: string): T {
    if (obj == null) {
        throw new ArgumentNullException(message == null ? 'checkNotNull throw exception.' : message);
    }
    return obj;
}

export function checkCriticalArgument(condition: boolean, ...message: string[]) {
    if (!condition) {
        throw new ArgumentNullException(message == null ? 'checkCriticalArgument throw exception.' : String.Concat(...message));
    }
}

export function checkState(condition: boolean, message?: string) {
    if (condition) {
        throw new ArgumentNullException(message == null ? 'checkState throw exception.' : message);
    }
}