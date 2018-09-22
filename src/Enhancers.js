const { compose, applyMiddleware } = require('redux')
const invariant = require('invariant')
const thunkMiddleware = require('redux-thunk').default

let middlewares = [thunkMiddleware]

let enhancers = []

module.exports = (otherMiddlewares = [], otherEnhancers = []) => {
  invariant(
    Array.isArray(otherEnhancers) && Array.isArray(otherEnhancers),
    'Middlewares and Ehnhancers should be Array',
  )
  return compose(
    applyMiddleware(...middlewares, ...otherMiddlewares),
    ...enhancers,
    ...otherEnhancers,
  )
}
