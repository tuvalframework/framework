import {Primitive} from "./Primitive";
import {IMap} from "./IMap";

export type JsonEntry = Primitive | JsonArray | JsonMap;

export interface JsonArray extends ArrayLike<JsonEntry>
{

}

export interface JsonMap extends IMap<JsonEntry>
{

}

export type JsonData = JsonMap | JsonArray;
