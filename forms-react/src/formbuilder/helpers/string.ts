export const StringHelpers = {
    concat : (str1, str2) => {
        if (typeof str1 === 'string' && typeof str2 === 'string') {
          return str1 + ' ' + str2;
        }
        return str1;
      }
}