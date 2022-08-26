import { SimpleDictionary } from "./dictionaries_/SimpleDictionary";

export class IntMap<T> extends SimpleDictionary<number, T> {
    constructor(initialCapacity: number) {
        super();
    }
}