/* import { System } from "./SystemTypes"; */

export function as<T>(obj: any, typeName: Symbol): T {
  if (obj == null) {
    return undefined as any;
  }

  if (obj.constructor && Array.isArray(obj.constructor.__instanceof__)) {
    const array: Symbol[] = obj.constructor.__instanceof__;
   /*  for (let i = 0; i < array.length; i++) {
      if (array[i].toString() === typeName.toString()) {
        return obj;
      }
    } */
     if (array.indexOf(typeName) >= 0) {
      return obj;
    }
  }

  return undefined as any;

}
/*
export function as<T>(obj: any, objConstructor: Constructor<T> | Interface): T {
  if (obj == null) {
    return undefined;
  }

  if (objConstructor instanceof Interface) {
    // TODO: GetType düzeltilecek.
    const objType: ClassType = obj.GetType();
    const interfaceType: Type = type(objConstructor);
    const result = objType.Interfaces.filter((value, index) => value.FullName === interfaceType.FullName);
    if (result) {
      return obj;
    } else {
      return undefined;
    }
  }

  if (typeof objConstructor === 'string') {
    // Interface casting
    if (isImplement<T>(obj, objConstructor)) {
      return obj;
    }
  } else if (obj instanceof objConstructor) {
    return obj;
  }
  return undefined;
} */
