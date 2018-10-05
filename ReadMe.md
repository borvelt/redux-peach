# Redux Peach
### Eat redux state container like 🍑

[ImmutableJS](https://github.com/facebook/immutable-js), 
[redux](https://github.com/reduxjs/redux),
[redux-actions](https://github.com/redux-utilities/redux-actions),
[redux-thunk](https://github.com/reduxjs/redux-thunk) and
[invariant](https://github.com/zertosh/invariant)
are this repository dependencies. I thinks it should be good if you know something about this libraries. 

## First Of All 
First of all I want to tell you that this librarie will fix your below concerns about your project: 

> your confusing to find action string and constants in your reducers and your action creators.

> your worries about your application scaffold, all of us always think that our application doesn't have rubost scaffold.

this is `redux-peach` do exactly.

**redux-peach** is a wrapper. It helps you to understand states and manage states with redux and also helps you to use powerfull libraries like **redux-action** and **redux-thunk** in your projects easier, with immutated states.

I think 
[react-boilerplate](https://github.com/react-boilerplate/react-boilerplate)
 is highly scalable and it predict all project situations and solve problems.
In this boilerplate you see that every part of project will be load separately and will load with lazy loading.
I mean when you need Component Box that time this will load, not earlier.

In this boilerplate Huge part of project or screens or part of screens or etc is in Containers.
Containers Contain Components, routes, actions, reducers, selectors and other things that container need. So now we will make a reducer and actions in one component and it works fine.

many times we need to define one action in Component A and handle defined action in B,C,D Components.
It's good solution that handle this action in reducer of other components but we know that use redux without `redux-actions` is messy and we have first problem that I mentioned above.
If we use `redux-actions` we can't handle one action with two or more function and we have to make separate actions and this will make application scaffold weak.

`redux-peach` have both of this we can handle actions with two or more functions to run, with same action name and clean scaffold in addition you can use redux middlewares every where you want and it's very simple.

## Use case
  This is multi purpose library and not written to use for specific frameworks like reactjs, vue, angular or etc. This can globaly use for javascript projects.
## Concepts

### Enhancers
This containe middlewares and enhancers for your store, if you want to add some action logger or redux dev tools or etc, you should add as argument to `store.configure` method.`

### State
We have State type, this will strongly handle states and make states immutable.Ease of use immutable states.

### rootState
rootState will added when you want to configure your store, simply you will write javascript object but it will change to State instance.

### CreateStore
Return function that accepts some arguments like rootState, middlewares and enhancers and return redux store object

### Store
This class where you should make and instance for your application and then configure it with your rootState, middlewares and enhancers.

### Action
You should create action for your application an then dispatch, ofcurse you need to add listener for your action, every thing about actions is in Action class.

We have two type of actions and some sub actions:
  * Regular actions
  
    Regular actions contains two sub actions, [actionName_SUCCEED, actioName_FAILED]

  * Async actions

      Async actions contains four sub actions, [actioName_STARTED, actioName_onSucceed, actioName_onEnded, actioName_onFailed]

#### Handle Actions
According to your action type (async flag) some sub actions will dispatch that you can handle by some function like this:
  sub action[actionName_SUCCEED] -> dispatch -> will handle with onSucceed function

  sub action[actionName_FAILED] -> dispatch -> will handle with onFailed function

#### Handle Pre defined actions
Some libraries has their own actions, you can handle them by create new action with same name and catch them with `.onHappened(x => x)` method.

#### [payloadCreator and metaCreator definition](https://redux-actions.js.org/api/createaction#createactiontype-payloadcreator-metacreator)


## Getting Started
```bash
$ npm install --save redux-peach
```
Add in Your project if you are using reactjs you can use it with `react-redux` and use `provider`.
```javascript
const {Store, State, Action} = require('redux-peach')
```
Now you should configure your store like this:
```javascript 
// set middlewares and enhancers here
store.configure({
  rootState: { users: { list: ['Jim', 'Jack', 'Paul'] }, Counter: 0 },
})
```
Create Async action with name INCREMENT:
```javascript
Action()
  .setName('INCREMENT')
  .hookToStore(store)
  .setAsync(true)
  .setOnDispatchListener(
    value =>
      new Promise(resolve => setTimeout(() => resolve(value * value), 1000)),
  )
  .make()
  // You can add payloadCreator and metaCreator as described in redux-actions library.
})
```
After 1000 milisecond will return square of value that you will dispatch. Always you should call `make`, `hookToStore` to make and hook current action to store.

It's important to call `make` method after all operations of action.And It's also better to call `hookToStore` after `setName` because in `hookToStore` if action defined before, this will return that and if you call it as last method and action name defined, all of your configuration will discard.

Now let's handle INCREMENT action:
```javascript
Action()
  .setName('INCREMENT')
  .hookToStore(store)
  .onSucceed((action, state) => ({
    Counter: state.Counter + action.payload,
  }))
  .make()
})
```
And another hanlder for INCREMENT action:
```javascript
Action()
  .setName('INCREMENT')
  .hookToStore(store)
  .onSucceed((action, state) => ({
    Counter: state.Counter + action.payload + action.payload,
  }))
  .make()
```
Lets get `INCREMENT` action
```javascript
const increment = Action.find('INCREMENT', store)
```
And then dispatch it
```javascript
store.dispatch(increment.prepareForDispatch(4)) //Increment state.Counter by 4
```
Create `DECREMENT` action that will dispatch immediately after created.
```javascript
Action()
  .setName('DECREMENT')
  .hookToStore(store)
  .setOnDispatchListener(value => value * 2)
  .setSelfDispatch(true)
  .setOnDispatchArgs([66])
  .onSucceed((action, state) => ({ Counter: state.Counter - action.payload }))
  .make()
```
If you need to set state every where you want, you can but be careful that this feature create to set default state in lazy loading for components.

```javascript
State.set({ test: 'redux-peach' }, store)
// OR
store.state = { test: 'redux-peach' }
```

If we want to look on states we see this:
```javascript 
setTimeout(() => console.log(store.state), 200)
//After 200miliseconds: { users: { list: [ 'Jim', 'Jack', 'Paul' ] }, Counter: -132, test: 'redux-peach' }
setTimeout(() => console.log(store.state), 1001)
//After 801miliseconds: { users: { list: [ 'Jim', 'Jack', 'Paul' ] }, Counter: -84, test: 'redux-peach' }
```
## Set your own store
If you have store with very special configurations like persistence or any thing other, you can make your store then import to `redux-peach`.Just pass your store to constructor.
```javascript
const store = new Store(reduxStore)
```
## Use With reactJS
To use this library with [react](https://reactjs.org/) you can create store object and pass through your components with [Context](https://reactjs.org/docs/context.html) or create global object or every ways you will prefer.

Create Store.js file in your project root:
```javascript
import { Store, State, Action } from 'redux-peach'
//Create reduxStore...
export const store = new Store(reduxStore)
export const setState = newState => State.set(newState, store)
export const findAction = actionName => Action.find(actionName, store)
export const newAction = actionName =>
  Action()
    .setName(actionName)
    .hookToStore(store)
```
Now import every where you want in your react project
#### react Context
You can make [context](https://reactjs.org/docs/context.html) in react and provide your store in root of your project and consume it every where.Or until react 16.x you can use [legacy context](https://reactjs.org/docs/legacy-context.html).

If you are using [react-redux](https://github.com/reduxjs/react-redux) store object will provide with `provider` component.Just consume it
```javascript
class A extends Component {
  static contextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.store = context.store
  }
}
```
#### State type and preformance issue
`State` type in `redux-peach` handle shallow equals in `redux-react` library. and it doesn't have a performance issue.
## Test
Run tests with `npm test`.
Test framework is jest.

Current tests is not unit test exactly and just check base functionality.

*42 Tests* will be passed.

Need More TESTS!!!!

## License
*MIT*