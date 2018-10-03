const CreateStore = require('./CreateStore')
const invariant = require('invariant')
const Action = require('./Action')
const State = require('./State')
const isReduxStore = require('./IsReduxStore')

class Store {
  constructor(store) {
    try {
      invariant(isReduxStore(store), 'invalid input for Store')
      this.__ = store
      State.set({}, this.__)
    } catch (e) {
      //empty block
    }
  }

  configure(props = {}) {
    this.__ = CreateStore(
      props.rootState,
      props.middlewares,
      props.enhancers,
      props.composeEnhancer,
    )
  }

  toReduxStoreObject() {
    return this.__
  }

  set state(newState) {
    State.set(newState, this.__)
  }

  findAction(actionName) {
    return Action.find(actionName, this.__)
  }

  get state() {
    return this.toReduxStoreObject().getState()
  }

  get getState() {
    return this.toReduxStoreObject().getState
  }

  get subscribe() {
    return this.toReduxStoreObject().subscribe
  }

  get dispatch() {
    return this.toReduxStoreObject().dispatch
  }
}

module.exports = Store
