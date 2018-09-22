const CreateStore = require('./CreateStore')
const Actions = require('./Actions')
const { DEFAULT_STATE_SET } = require('./Constants')

class Store {
  constructor() {}
  configure(props = { rootState: {}, middlewares: [], enhancers: [] }) {
    this._ = CreateStore(props.rootState, props.middlewares, props.enhancers)
  }

  get actions() {
    return new Actions(this)
  }

  get state() {
    return this._.getState()
  }

  set state(newState) {
    this.actions.new(DEFAULT_STATE_SET, {
      selfDispatch: true,
      onDispatchArgs: newState,
      onSucceed: action => action.payload,
    })
  }

  get dispatch() {
    return this._.dispatch
  }
}

module.exports = Store
