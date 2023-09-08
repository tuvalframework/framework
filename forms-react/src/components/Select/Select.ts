import { SelectShell } from "./SelectShell";



export const SelectProtocol = Symbol('SelectProtocol');

export function Select() {
    return new SelectShell();
}