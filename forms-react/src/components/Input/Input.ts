import { InputShell } from "./InputShell";





export const InputProtocol = Symbol('InputProtocol');

export function Input() {
    return new InputShell();
}