function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return srcValue
  }
}

module.exports = mergeCustomizer
