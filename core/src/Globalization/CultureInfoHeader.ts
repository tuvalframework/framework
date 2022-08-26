import { uint, ushort } from "../float";

export class CultureInfoHeader {
    public /* internal */  version: uint = 0;
    public /* internal */  hashID0: ushort = 0;
    public /* internal */  hashID1: ushort = 0;
    public /* internal */  hashID2: ushort = 0;
    public /* internal */  hashID3: ushort = 0;
    public /* internal */  hashID4: ushort = 0;
    public /* internal */  hashID5: ushort = 0;
    public /* internal */  hashID6: ushort = 0;
    public /* internal */  hashID7: ushort = 0;
    public /* internal */  numCultures: ushort = 0;
    public /* internal */  maxPrimaryLang: ushort = 0;
    public /* internal */  numWordFields: ushort = 0;
    public /* internal */  numStrFields: ushort = 0;
    public /* internal */  numWordRegistry: ushort = 0;
    public /* internal */  numStringRegistry: ushort = 0;
    public /* internal */  wordRegistryOffset: uint = 0;
    public /* internal */  stringRegistryOffset: uint = 0;
    public /* internal */  IDTableOffset: uint = 0;
    public /* internal */  nameTableOffset: uint = 0;
    public /* internal */  dataTableOffset: uint = 0;
    public /* internal */  stringPoolOffset: uint = 0;
}