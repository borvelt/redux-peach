const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const { Map } = require('immutable')
const State = require('./State')

module.exports = (rootState = {}, middlewares = [], enhancers = []) => {
  const createdStore = createStore(
    () => State.createInstance(rootState),
    composedEnhacers(middlewares, enhancers),
  )
  createdStore.Handlers = Map({})
  createdStore.Actions = Map({})
  return createdStore
}
