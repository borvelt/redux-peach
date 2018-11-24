/*
* Created by borvelt <borvelt@gmail.com>
* Here is redux-peach amazing examples
* Please before start see this examples and find redux-peach in its power.
* */
const Store = require('./src/Store')
const Action = require('./src/Action')
const State = require('./src/State')
/*
* Create store, with redux peach
* CAUTION: you can pass your own redux store object to redux-peach Store,
 * because some development libraries will not covered with
  * passing parameter to configure method in shape of middlewares or
  * enhancers
* */
const store = new Store()
/*
* Store Configuration
* Set rootState, middlewares, enhancers and etc...
* */
store.configure({
  rootState: { users: { list: ['Jim', 'Jack', 'Paul'] } },
})
/*
* First Appearance of action means to define an action with some
 * functionality, don't worry actions are mutable and throughout application
  * you can change their behavior
* Here we define INCREMENT action...
* this action is an async, that will resolve after 1000ms.
* */
Action()
  .setName('INCREMENT')
  .hookToStore(store)
  .setScope('Math.Numbers')
  .setInitialState({ Counter: 0 })
  .setAsyncFlag(true)
  .setOnDispatchListener(
    value =>
      new Promise(resolve => setTimeout(() => resolve(value * value), 1000)),
  )
  .make()

/*
* Second or more appearance of action means you want to change action
 * behavior, maybe you want to add some listener or make action async or etc...
* */
Action('INCREMENT')
  .hookToStore(store)
  .setOnSucceedListener((action, state) => ({
    Counter: state.Counter + action.payload,
  }))
  .make()
/*
* Look at this action, what is it mean? yes mutate INCREMENT action but it's
 * so weird!?
 * It seams we have to setOnSucceedListener and it means that we over write
  * it, but NO!!!!
  * if we set listeners for times, redux-peach will run all of them in queue
   * FIFO.
* */
Action('INCREMENT', store)
  .setOnSucceedListener((action, state) => ({
    Counter: state.Counter + action.payload + action.payload,
  }))
  .make()

const [increment, action] = Action.find('INCREMENT', store)
State.set(action.getInitialState(), store)

store.dispatch(increment(4))

Action()
  .setName('DECREMENT')
  .hookToStore(store)
  .setScope('Math.Numbers')
  .setOnDispatchListener(value => value * 2)
  .setSelfDispatchFlag(true)
  .setOnDispatchArgs([66])
  .setOnSucceedListener((action, state) => ({
    Counter: state.Counter - action.payload,
  }))
  .make()

State.set({ test: 'redux-peach' }, store)

setTimeout(() => console.log(store.getState()), 200)

setTimeout(() => console.log(store.getState()), 1001)
