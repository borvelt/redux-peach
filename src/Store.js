const { createStore } = require('redux')
const composedEnhacers = require('./Enhancers')
const { fromJS } = require('immutable')

const Store = createStore((state = fromJS({})) => state, composedEnhacers)

Store.Handlers = {}
Store.Actions = {}

module.exports = Store
