const CreateStore = require('./CreateStore')
const Actions = require('./Actions')
const State = require('./State')
const { DEFAULT_STATE_SET } = require('./Constants')

class Store {
  constructor() {}

  configure(
    props = {
      rootState: {},
      middlewares: [],
      enhancers: [],
    },
  ) {
    this.__ = CreateStore(props.rootState, props.middlewares, props.enhancers)
  }

  toReduxStoreObject() {
    return this.__
  }

  get actions() {
    return new Actions(this)
  }

  get state() {
    return this.toReduxStoreObject().getState()
  }

  set state(newState) {
    this.actions.new(DEFAULT_STATE_SET, {
      selfDispatch: true,
      onDispatchArgs: newState,
      onSucceed: action => action.payload,
    })
  }

  get dispatch() {
    return this.toReduxStoreObject().dispatch
  }
}

module.exports = Store
