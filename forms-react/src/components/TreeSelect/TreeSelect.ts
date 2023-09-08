import { TreeSelectShell } from "./TreeSelectShell";


export const TreeSelectProtocol = Symbol('TreeSelectProtocol');

export function TreeSelect() {
    return new TreeSelectShell();
}