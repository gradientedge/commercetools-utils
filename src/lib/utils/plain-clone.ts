/**
 * Clones a plain JavaScript object
 *
 * This function only guarantees to clone an object that contains the following types:
 *  - boolean
 *  - number
 *  - string
 *  - array
 *  - null
 *
 * The object passed to it should not have any other data types within it.
 */
export function plainClone(source: any): any {
  return recursiveClone(source, {})
}

function recursiveClone(source: any, target: any): any {
  if (target && source) {
    for (const x in source) {
      if (Object.prototype.hasOwnProperty.call(source, x)) {
        if (typeof source[x] === 'object') {
          if (Array.isArray(source[x])) {
            target[x] = []
          } else {
            target[x] = {}
          }
          target[x] = recursiveClone(source[x], target[x])
        } else {
          target[x] = source[x]
        }
      }
    }
  }
  return target
}
