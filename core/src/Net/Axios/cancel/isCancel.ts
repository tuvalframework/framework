export function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };