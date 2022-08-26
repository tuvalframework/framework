declare var Tuval: any;
export function isInDocument(el: any): boolean {
    while ((el = el.parentNode)) {
      if (el === Tuval._document) {
        return true;
      }
    }
    return false;
  }