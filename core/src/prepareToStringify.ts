function _isElement(obj: any): boolean {
    return !!(obj && obj.nodeType == 1);
  }

export function prepareToStringify(obj: any): any {
    let desc: any;

    obj.visitedByCircularReferenceRemoval = true;

    for (var key in obj) {
      if (
        !(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == "object")
      ) {
        continue;
      }
      desc = Object.getOwnPropertyDescriptor(obj, key);
      if (
        obj[key].visitedByCircularReferenceRemoval ||
        _isElement(obj[key])
      ) {
        if (desc.configurable) {
          delete obj[key];
        } else {
          return null;
        }
      } else if (prepareToStringify(obj[key]) === null) {
        if (desc.configurable) {
          delete obj[key];
        } else {
          return null;
        }
      }
    }

    delete obj.visitedByCircularReferenceRemoval;

    return obj;
  }