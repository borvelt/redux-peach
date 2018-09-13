const redux = require('redux')
const composedEnhacers = require('./Enhancers')

const Store = redux.createStore(() => ({}), composedEnhacers)

Store.Handlers = {}
Store.Actions = {}

module.exports = Store
