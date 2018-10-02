const invariant = require('invariant')
const Action = require('./Action')
const { isObject, mergeCustomizer } = require('./Utils')
const { DEFAULT_STATE_SET } = require('./Constants')
const lodashMerge = require('lodash.mergewith')

class StateClass {
  constructor(rawState) {
    invariant(isObject(rawState), 'State should be javascript Object')
    this.__ = rawState
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
    let new__ = {}
    for (let arg of args) {
      lodashMerge(new__, this.__, arg, mergeCustomizer)
    }
    return new State(new__)
  }
}

StateClass.proxyHandler = {
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

const State = new Proxy(StateClass, {
  construct: (target, rawState) =>
    new Proxy(new target(...rawState), State.proxyHandler),
})

module.exports = State
