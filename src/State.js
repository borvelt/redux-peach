const invariant = require('invariant')
const { fromJS, Collection } = require('immutable')

class State {
  constructor(rawState) {
    invariant(rawState instanceof Object, 'State should be javascript Object')
    this.__ = fromJS(rawState)
  }
  static createInstance(rawState) {
    return new Proxy(new State(rawState), State.proxyHandler)
  }

  toImmutableObject() {
    return this.__
  }

  merge(...args) {
    for (let arg of args) {
      if (arg instanceof State) {
        arg = arg.toImmutableObject()
      }
      this.__ = this.__.mergeDeep(arg)
    }
    return this
  }
}

State.proxyHandler = {
  get(target, key) {
    if (key in target) {
      return target[key]
    }
    let value
    try {
      value = target.__.get(key)
      invariant(!(value instanceof Collection), 'it`s not Collection Object')
      return value.toJS()
    } catch (ex) {
      return value
    }
  },
}

module.exports = State
