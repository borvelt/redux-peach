const invariant = require('invariant')
const Action = require('./Action')
const { isObject, mergeCustomizer } = require('./Utils')
const { DEFAULT_STATE_SET } = require('./Constants')
const lodashMerge = require('lodash.mergewith')
class State {
  constructor(rawState) {
    invariant(isObject(rawState), 'State should be javascript Object')
    this.__ = rawState
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

  merge(...args) {
    for (let arg of args) {
      lodashMerge(this.__, arg, mergeCustomizer)
    }
    return State.createInstance(this.__)
  }
}

State.proxyHandler = {
  ownKeys(target) {
    return Reflect.ownKeys(target.__)
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
    return target.__[key]
  },
}

module.exports = State
