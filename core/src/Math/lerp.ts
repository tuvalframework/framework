import { float } from "../float";

export function lerp(start: float, stop: float, amt: float) {
    return amt * (stop - start) + start;
}