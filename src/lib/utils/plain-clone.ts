export function plainClone(source: any): any {
  return recursiveClone(source, {})
}

function recursiveClone(source: any, target: any): any {
  if (target && source) {
    for (const x in source) {
      if (Object.prototype.hasOwnProperty.call(source, x)) {
        if (target[x] && typeof source[x] === 'object') {
          target[x] = recursiveClone(target[x], source[x])
        } else {
          target[x] = source[x]
        }
      }
    }
  }
  return target
}
