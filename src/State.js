const invariant = require('invariant')
const Action = require('./Action')
const { fromJS, Collection } = require('immutable')
const { DEFAULT_STATE_SET } = require('./Constants')

class State {
  constructor(rawState) {
    invariant(rawState instanceof Object, 'State should be javascript Object')
    this.__ = fromJS(rawState)
  }
  static createInstance(rawState) {
    return new Proxy(new State(rawState), State.proxyHandler)
  }

  static set(state, store) {
    new Action()
      .setName(DEFAULT_STATE_SET)
      .onSucceed()
      .hookToStore(store)
      .setSelfDispatch(true)
      .setOnDispatchArgs(state)
      .make()
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
  ownKeys(target) {
    return Reflect.ownKeys(target.__.toJS())
  },
  getOwnPropertyDescriptor(target, prop) {
    if (!['__'].includes(prop)) {
      return { configurable: true, enumerable: true }
    }
  },
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
