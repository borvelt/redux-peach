const store = require('./src/index')

store.configure({
  rootState: { users: { list: ['Jim', 'Jack', 'Paul'] }, Counter: 0 },
})

store.actions.create('INCREMENT', {
  async: true,
  onDispatch(value) {
    return new Promise(resolve =>
      setTimeout(() => resolve(value * value), 1000),
    )
  },
})

store.actions.handle('INCREMENT', {
  onSucceed(action, state) {
    return { Counter: state.Counter + action.payload }
  },
})

store.actions.handle('INCREMENT', {
  onSucceed(action, state) {
    return { Counter: state.Counter + action.payload + action.payload }
  },
})

const increment = store.actions.get('INCREMENT')

store.dispatch(increment(4))

store.actions.new('DECREMENT', {
  onDispatch(value) {
    return value * 2
  },
  selfDispatch: true,
  onDispatchArgs: [66],
  onSucceed(action, state) {
    return { Counter: state.Counter - action.payload }
  },
})

store.state = { test: 'redux-peach' }

setTimeout(() => console.log(store.state), 200)

setTimeout(() => console.log(store.state), 1001)
