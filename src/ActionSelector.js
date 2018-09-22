const invariant = require('invariant')
const isUndefined = require('lodash.isundefined')
const isReduxStore = require('./IsReduxStore')

class ActionSelector {
  constructor(store) {
    invariant(
      isReduxStore(store._),
      'ActionSelector should recieve Store instance.',
    )
    this._store = store._
  }

  get(actionName) {
    invariant(!isUndefined(actionName), 'actionName should be defined')
    const action = this._store.Actions.get(actionName)
    invariant(!isUndefined(action), `actionName (${actionName}) not defined.`)
    return action
  }
}

module.exports = ActionSelector
