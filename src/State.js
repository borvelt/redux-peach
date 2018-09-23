const invariant = require('invariant')
const { fromJS, Collection } = require('immutable')

class State {
  constructor(rawState) {
    invariant(rawState instanceof Object, 'State should be javascript Object')
    this._ = fromJS(rawState)
  }
  static createInstance(rawState) {
    return new Proxy(new State(rawState), State.proxyHandler)
  }

  toImmutableObject() {
    return this._
  }

  merge(...args) {
    args = args.map(
      element =>
        element instanceof State ? element.toImmutableObject() : element,
    )
    this._ = this._.merge(...args)
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
      value = target._.get(key)
      invariant(!value instanceof Collection)
      return value.toJS()
    } catch (ex) {
      return value
    }
  },
}

module.exports = State
