export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' ||
    // browser case
    ({}.toString.call(window) === '[object Window]' ||
      // electron case
      {}.toString.call(window) === '[object global]')
  );
}
