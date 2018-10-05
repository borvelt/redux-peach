const {
  isObject,
  isFunction,
  isUndefined,
  isBoolean,
  mergeCustomizer,
} = require('../Utils')

describe('all methods of utils', () => {
  let foo = {
    xor() {
      return x => x
    },
    get bar() {
      return null
    },
    undefined() {
      return this.undefined
    },
    baz() {},
    get xo() {
      return {}
    },
    boolT: 2 === 2,
    boolF: 2 === '2',
  }
  describe('isObject', () => {
    it('should return true type of null is object', () => {
      expect(isObject(null)).toBeTruthy()
    })
    it('should return false undefined is not object type', () => {
      expect(isObject(undefined)).toBeFalsy()
    })
    it('should return true proxy is a typeof object', () => {
      expect(isObject(new Proxy({}, {}))).toBeTruthy()
    })
    it('should return true foo.xo will return object', () => {
      expect(isObject(foo.xo)).toBeTruthy()
    })
  })
  describe('isFunction', () => {
    it('should return false foo.bar is object', () => {
      expect(isFunction(foo.bar)).toBeFalsy()
    })
    it('should return true foo.baz is function', () => {
      expect(isFunction(foo.baz)).toBeTruthy()
    })
    it('should return true foo.xor is function', () => {
      expect(isFunction(foo.xor)).toBeTruthy()
    })
  })
  describe('isBoolean', () => {
    it('should return true', () => {
      expect(isBoolean(foo.boolT)).toBeTruthy()
    })
    it('should return false', () => {
      expect(isBoolean(foo.boolF)).toBeTruthy()
    })
  })
  describe('isUndefined', () => {
    it('should return true', () => {
      expect(isUndefined(foo.foe)).toBeTruthy()
    })
    it('should return false', () => {
      expect(isUndefined(foo.undefined)).toBeFalsy()
    })
  })
  describe('mergecustomizer', () => {
    it('should return src value on merge', () => {
      let objValue = [1, 2, 3, 4]
      let srcValue = []
      expect(mergeCustomizer(objValue, srcValue)).toEqual(srcValue)
    })
  })
})
