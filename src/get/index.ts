/**
 * get a value from an object using dot notation
 * taken from https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 * 
 * @param {object} object
 * @param {string} path
 */
export const Get = (object, path) => {
  if (!path) {
    return undefined
  }
  path = path.split('.')
  return path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object)
}
