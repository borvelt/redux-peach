const { List } = require('immutable')
const { handleActions } = require('redux-actions')
const Store = require('./Store')
const ActionSelector = require('./ActionSelector')

const listeners = List(['onStarted', 'onSucceed', 'onFailed', 'onEnded'])

const ActionHandler = props => {
  if ('actionName' in props) {
    _setHandler(props.actionName, props.onHappening)
  } else {
    if (listeners.find(element => element in props)) {
      _getListener(props)
    } else {
      _setHandler(_getActionName(props), props.onHappening)
    }
  }
}

const _ActionHandler = handler => {
  Object.keys(handler).map(key => {
    if (Store.Handlers.has(key)) {
      const func1 = Store.Handlers.get(key)
      const func2 = handler[key]
      Store.Handlers = Store.Handlers.set(key, (state, action) => {
        let func1Result = func1(state, action)
        let func2Result = func2(func1Result, action)
        return func1Result.merge(state.merge(func2Result))
      })
      handler = {}
    }
  })
  Store.Handlers = Store.Handlers.merge(handler)
  const handlers = Store.Handlers.toJS()
  Store.replaceReducer(handleActions(handlers, {}))
}

const _getListener = props => {
  listeners.map(listener => {
    if (listener in props) {
      let on = listener.replace('on', '').toUpperCase()
      let actionName = _getActionName(props, on)
      _setHandler(actionName, props[listener])
    }
  })
}

const _getActionName = (props, on = 'SUCCEED') => {
  return 'actionName' in props
    ? props.actionName
    : ActionSelector(props.name)[on]
}

const _setHandler = (
  selectedAction,
  onHappening = action => action.payload,
) => {
  _ActionHandler({
    [selectedAction]: (state, action) =>
      state.merge(onHappening(action, state)),
  })
}

module.exports = ActionHandler
