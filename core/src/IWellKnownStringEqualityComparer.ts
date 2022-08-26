import { IEqualityComparer } from "./Collections/IEqualityComparer";

export interface IWellKnownStringEqualityComparer {
    getEqualityComparerForSerialization(): IEqualityComparer<string>;
    getRandomizedEqualityComparer(): IEqualityComparer<string>;
}