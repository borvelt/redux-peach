const isUndefined = input => typeof input === typeof undefined
const isFunction = input => typeof input === typeof (() => {})
const isObject = input => typeof input === typeof null
const isBoolean = input => typeof input === typeof true
const mergeCustomizer = (objValue, srcValue) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return srcValue
  }
}

exports.mergeCustomizer = mergeCustomizer
exports.isUndefined = isUndefined
exports.isFunction = isFunction
exports.isObject = isObject
exports.isBoolean = isBoolean
