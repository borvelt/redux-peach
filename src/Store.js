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
      State.set({}, this.reduxStoreObject)
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

  get reduxStoreObject() {
    return this.__
  }

  get actions() {
    return this.reduxStoreObject.__actions
  }

  set state(newState) {
    State.set(newState, this.reduxStoreObject)
  }

  findAction(actionName) {
    return Action.find(actionName, this.reduxStoreObject)
  }

  setState(newState) {
    State.set(newState, this.reduxStoreObject)
  }

  get getState() {
    return this.reduxStoreObject.getState
  }

  get subscribe() {
    return this.reduxStoreObject.subscribe
  }

  get dispatch() {
    return this.reduxStoreObject.dispatch
  }
}

module.exports = Store
