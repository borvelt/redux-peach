const { List } = require('immutable')
const { handleActions } = require('redux-actions')
const invariant = require('invariant')
const isReduxStore = require('./IsReduxStore')
const ActionSelector = require('./ActionSelector')
const {
  ONSTARTED,
  ONSUCCEED,
  ONFAILED,
  ONENDED,
  SUCCEED,
  ON,
} = require('./Constants')

class ActionHandler {
  constructor(store) {
    this._store = store.toReduxStoreObject()
    invariant(
      isReduxStore(this._store),
      'ActionHandler should recieve Store instance.',
    )
    this._actionSelector = new ActionSelector(store)
    this._listeners = List([ONSTARTED, ONSUCCEED, ONFAILED, ONENDED])
  }

  create(props) {
    try {
      invariant('actionName' in props, 'actionName not in props')
      this._defineHandler(props.actionName, props.onHappening)
    } catch (e) {
      try {
        invariant(
          this._listeners.find(element => element in props),
          'no listener has been found.',
        )
        this._defineListener(props)
      } catch (ex) {
        this._defineHandler(this._defineActionName(props), props.onHappening)
      }
    }
  }

  _defineListener(props) {
    this._listeners.map(listener => {
      if (listener in props) {
        let on = listener.replace(ON, '').toUpperCase()
        let actionName = this._defineActionName(props, on)
        this._defineHandler(actionName, props[listener])
      }
    })
  }

  _defineHandler(selectedAction, onHappening = action => action.payload) {
    this._make({
      [selectedAction]: (state, action) =>
        state.merge(onHappening(action, state)),
    })
  }

  _defineActionName(props, on = SUCCEED) {
    return 'actionName' in props
      ? props.actionName
      : this._actionSelector.get(props.name)[on]
  }

  _make(handler) {
    Object.keys(handler).map(key => {
      if (this._store.Handlers.has(key)) {
        const func1 = this._store.Handlers.get(key)
        const func2 = handler[key]
        this._store.Handlers = this._store.Handlers.set(
          key,
          (state, action) => {
            let func1Result = func1(state, action)
            let func2Result = func2(func1Result, action)
            return func1Result.merge(state.merge(func2Result))
          },
        )
        handler = {}
      }
    })
    this._store.Handlers = this._store.Handlers.merge(handler)
    const handlers = this._store.Handlers.toJS()
    this._store.replaceReducer(handleActions(handlers, {}))
  }
}

module.exports = ActionHandler
