const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const { Map, fromJS } = require('immutable')

const Store = createStore((state = fromJS({})) => state, composedEnhacers)
Store.Handlers = Map({})
Store.Actions = Map({})

module.exports = Store
