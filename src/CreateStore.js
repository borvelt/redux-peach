const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const State = require('./State')

module.exports = (
  rootState = {},
  middlewares = [],
  enhancers = [],
  composeEnhancer = x => x,
) => {
  const createdStore = createStore(
    () => new State(rootState),
    composeEnhancer(composedEnhacers(middlewares, enhancers)),
  )
  return createdStore
}
