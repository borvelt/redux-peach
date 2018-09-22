const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const { Map, fromJS } = require('immutable')

module.exports = (rootState = {}, middlewares = [], enhancers = []) => {
  const createdStore = createStore(
    () => fromJS(rootState),
    composedEnhacers(middlewares, enhancers),
  )
  createdStore.Handlers = Map({})
  createdStore.Actions = Map({})
  return createdStore
}
