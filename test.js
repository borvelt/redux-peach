const {
  DefaultStates,
  ActionCreator,
  Store,
  ActionSelector,
  ActionHandler,
} = require('./index')

DefaultStates({ users: { list: [1, 2] }, Counter: 0 })

ActionCreator({
  name: 'INCREMENT',
  async: true,
  onDispatch: value => {
    return new Promise(resolve => setTimeout(() => resolve(value), 1000))
  },
})

ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({
    Counter: state.get('Counter') + action.payload,
  }),
})

ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({
    Counter: state.get('Counter') + action.payload * 10,
  }),
})

ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({
    Counter: state.get('Counter') + action.payload + 10,
  }),
})

Store.dispatch(ActionSelector('INCREMENT')(4))
console.log('--------------------------------')
setTimeout(() => console.log('StoreState: ', Store.getState()), 2000)
console.log('--------------------------------')
