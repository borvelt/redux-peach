const Store = require('./Store')

const ActionSelector = actionName => {
  const action = Store.Actions[actionName]
  if (typeof action === typeof undefined) {
    throw new Error(`actionName (${actionName}) not defined.`)
  }
  return action
}

module.exports = ActionSelector
