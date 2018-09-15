const { DefaultStates, Action, Store, ActionSelector } = require('./index')

DefaultStates({ obstacleHiring: { list: [1, 2] } })

Action({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({
    Counter: state.get('Counter') + action.payload,
  }),
})

Store.dispatch(ActionSelector('INCREMENT')(1))
Store.dispatch(ActionSelector('INCREMENT')(4))

console.log('StoreState: ', Store.getState())
