const Action = require('./Action')

DefaultStates = props => {
  Action({
    selfDispatch: true,
    name: 'DEFAULT_STATE_SET',
    onDispatchArgs: props,
    onSucceed: action => action.payload,
  })
}

module.exports = DefaultStates
