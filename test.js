const {
  DefaultStates,
  Action,
  Store,
  ActionSelector,
  ActionHandler,
} = require('./index')

DefaultStates({ obstacleHiring: { list: [1, 2] }, Counter: 0 })

Action({
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

Store.dispatch(ActionSelector('INCREMENT')(1))
Store.dispatch(ActionSelector('INCREMENT')(4))
console.log('--------------------------------')
console.log('StoreState: ', Store.getState())
console.log('--------------------------------')
