const redux = require('redux')
const thunkMiddleware = require('redux-thunk').default

let middlewares = [thunkMiddleware]
if (process.env.__DEV__ === true) {
}
let enhancers = []

module.exports = redux.compose(
  redux.applyMiddleware(...middlewares),
  ...enhancers,
)
