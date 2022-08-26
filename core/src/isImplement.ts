import { Type } from "./Reflection/Type";

export function isImplement<T>(obj: any, name: Type): obj is T {
  const con: any = obj;

  if (con.__implements__) {
    return con.__implements__.indexOf(name) > -1;
  }
  return undefined as any;
}
