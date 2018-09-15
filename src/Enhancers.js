const { compose, applyMiddleware } = require('redux')
const thunkMiddleware = require('redux-thunk').default

let middlewares = [thunkMiddleware]

let enhancers = []

module.exports = compose(
  applyMiddleware(...middlewares),
  ...enhancers,
)
