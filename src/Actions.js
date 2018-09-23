const invariant = require('invariant')
const ActionHandler = require('./ActionHandler')
const ActionCreator = require('./ActionCreator')
const ActionSelector = require('./ActionSelector')
const isReduxStore = require('./IsReduxStore')

class Actions {
  constructor(store) {
    this._store = store.toReduxStoreObject()
    invariant(
      isReduxStore(this._store),
      'ActionCreator should recieve Store instance.',
    )
    this._actionCreator = new ActionCreator(store)
    this._actionHandler = new ActionHandler(store)
    this._actionSelector = new ActionSelector(store)
  }

  new(name, props = {}) {
    const action = this.create(name, props)
    this.handle(name, props)
    if (props.selfDispatch) {
      this._store.dispatch(action(props.onDispatchArgs))
    }
    return action
  }

  get(actionName) {
    return this._actionSelector.get(actionName)
  }

  create(name, props) {
    return this._actionCreator.create({ name, ...props })
  }

  handle(name, props) {
    this._actionHandler.create({ name, ...props })
  }
}

module.exports = Actions
