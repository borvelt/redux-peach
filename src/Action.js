const Store = require('./Store')
const ActionCreator = require('./ActionCreator')
const ActionHandler = require('./ActionHandler')
const ActionSelector = require('./ActionSelector')

const Action = props => {
  ActionCreator(props)
  ActionHandler(props)
  if (props.selfDispatch) {
    Store.dispatch(ActionSelector(props.name)(props.onDispatchArgs))
  }
}

module.exports = Action
