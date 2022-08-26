/* import { Context } from './Context/Context';
type Type = any; */

/* const types: SimpleDictionary<string, ClassType> = new SimpleDictionary<string, ClassType>();
export function type(objName: string): Type {
    if (types.containsKey(objName)) {
        return types.get(objName);
    } else {
        const type = new ClassType();
        types.set(objName, type);
        return type;
    }
} */


/* export function type(objConstructor: Constructor<any> | any): Type {
    if (objConstructor == null) {
      throw new ArgumentNullException('Object constructor can not be undefined for type retrive.');
    }

    const arrayJSType = typeof Array;
    const booleanJSType = typeof Boolean;
    const numberJSType = typeof Number;
    const stringJSType = typeof String;

    if (Array.constructor === (typeof objConstructor).constructor) {
      return PrimitiveTypes.Array;
    }

    if (Boolean.constructor === (typeof objConstructor).constructor) {
      return PrimitiveTypes.Boolean;
    }

    if (Number.constructor === (typeof objConstructor).constructor) {
      return PrimitiveTypes.Number;
    }

    if ( objConstructor === String ) {
      return PrimitiveTypes.String;
    }

    const proto = objConstructor.prototype || objConstructor.constructor.prototype;
    if (proto) {
        if (proto['__typeInfo__'] == null) {
            //throw new Exception('Object constructor do not support type retrive. ' + objConstructor.constructor.toString());
            proto['__typeInfo__'] = new ClassType();
          }

          return proto['__typeInfo__'];
    } else {
        throw error('Object prototype can not retrive. ' + objConstructor.toString());
    }

  } */