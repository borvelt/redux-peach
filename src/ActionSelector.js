const invariant = require('invariant')
const isUndefined = require('lodash.isundefined')
const isReduxStore = require('./IsReduxStore')

class ActionSelector {
  constructor(store) {
    this._store = store.toReduxStoreObject()
    invariant(
      isReduxStore(this._store),
      'ActionSelector should recieve Store instance.',
    )
  }

  get(actionName) {
    invariant(!isUndefined(actionName), 'actionName should be defined')
    const action = this._store.Actions.get(actionName)
    invariant(!isUndefined(action), `actionName (${actionName}) not defined.`)
    return action
  }
}

module.exports = ActionSelector
