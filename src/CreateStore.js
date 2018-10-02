const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const State = require('./State')

module.exports = (rootState = {}, middlewares = [], enhancers = []) => {
  const createdStore = createStore(
    () => new State(rootState),
    composedEnhacers(middlewares, enhancers),
  )
  return createdStore
}
