const { DefaultStates, Action, Store, ActionSelector } = require('./index')

DefaultStates({ Counter: 0 })

Action({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({ Counter: state.Counter + action.payload }),
})

Store.dispatch(ActionSelector('INCREMENT')(1))
Store.dispatch(ActionSelector('INCREMENT')(4))
console.log(Store.getState())
