let _isNode: boolean
export function isNode() {
  if (typeof _isNode === 'undefined') {
    _isNode = typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]'
  }
  return _isNode
}
