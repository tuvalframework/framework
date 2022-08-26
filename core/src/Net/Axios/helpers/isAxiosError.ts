
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
export function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };