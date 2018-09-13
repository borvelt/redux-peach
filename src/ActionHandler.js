const merge = require('lodash/mergeWith')
const reduxActions = require('redux-actions')
const Store = require('./Store')
const ActionSelector = require('./ActionSelector')
const mergeCustomizer = require('./merge')

const _ActionHandler = handler => {
  Object.keys(handler).map(key => {
    if (key in Store.Handlers) {
      const func1 = Store.Handlers[key]
      const func2 = handler[key]
      Store.Handlers[key] = (state, action) => {
        let func1Result = func1(state, action)
        let func2Result = func2(func1Result, action)
        return merge({}, func1Result, merge({}, state, func2Result))
      }
      handler = {}
    }
  })
  const handlers = merge(Store.Handlers, handler)
  Store.replaceReducer(reduxActions.handleActions(handlers, {}))
}
const listeners = ['onStarted', 'onSucceed', 'onFailed', 'onEnded']
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

const _getListener = props => {
  for (let i in listeners) {
    let listener = listeners[i]
    if (listener in props) {
      let on = listener.replace('on', '').toUpperCase()
      let actionName = _getActionName(props, on)
      _setHandler(actionName, props[listener])
    }
  }
}

const _getActionName = (props, on = 'SUCCEED') => {
  return 'actionName' in props
    ? props.actionName
    : ActionSelector(props.name)[on]
}

const _setHandler = (selectedAction, onHappening = () => {}) => {
  _ActionHandler({
    [selectedAction]: (state, action) =>
      merge({}, state, onHappening(action, state), mergeCustomizer),
  })
}

module.exports = ActionHandler
