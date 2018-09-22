const isUndefined = require('lodash.isundefined')
const invariant = require('invariant')

module.exports = store => {
  invariant(!isUndefined(store), 'Store instance should be defined')
  const storeKeys = Object.keys(store)
  const keys = [
    'dispatch',
    'subscribe',
    'getState',
    'replaceReducer',
    'Handlers',
    'Actions',
  ]
  try {
    keys.map(key => {
      invariant(
        storeKeys.find(el => el === key),
        `Store Object should have ${key} property`,
      )
    })
    return true
  } catch (exception) {
    return false
  }
}
