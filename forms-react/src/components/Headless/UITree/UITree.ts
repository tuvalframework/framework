import { UITreeShell } from "./UITreeShell";

export const UITreeProtocol = Symbol('UITreeProtocol');

export function UITree() {
    return new UITreeShell();
}