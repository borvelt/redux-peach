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
rootState will added when you want to configure your store, simplay you will write javascript object but it will change to State instance.

### CreateStore
Return function that accepts some arguments like rootState, middlewares and enhancers and return redux store object

### Store
This class where you should make and instance for your application and then configure it with your rootState, middlewares and enhancers.

### ActionCreator
This will create an Action for your application we have two type of actions, ActionCreator return action function and types of actions.
  * Regular actions
  
    Regular actions contains two type of action, [onSucceed, onFailed]

  * Async actions

      Async actions contains four type of action, [onStarted, onSucceed, onEnded, onFailed]

### ActionHandler
In ActionHandler options we write the action name as same as we defined in ActionCreator and we send some functions like [onStarted, onSucceed, onEnded, onFailed] as object and all of this function will dispatch on time.

### Actions
ActionCreator and ActionHandler both of this operations is under Actions class.
Actions class perform all operation about actions.

### ActionSelector
ActionSelector use to get the action with actionName.

## Getting Started
```bash
$ npm install --save redux-peach
```
Add in Your project if you are using reactjs you can use it with `react-redux` and use `provider`.
```javascript
const store = require('redux-peach') // store is Store Instance.
const INCREMENT = 'INCREMENT ACTION NAME' // define constant
const DEFAULT_STATE_SET = 'DEFAULT STATE SET' // define constant
```
Now you should configure your store like this:
```javascript 
// set middlewares and enhancers here
store.configure({
  rootState: {}, 
  middlewares: [], 
  enhancers: []
})
```
If you need to set state every where you want, you can but be careful that this feature create to set default state in lazy loading for components.

```javascript
store.state = { users: { list: ['Jim', 'Jack', 'Paul'] }, Counter: 0 }
```
Now make your first Action:

[payloadCreator and metaCreator definition](https://redux-actions.js.org/api/createaction#createactiontype-payloadcreator-metacreator)
```javascript
store.actions.create(INCREMENT, {
  payloadCreator: undefined,
  metaCreator: undefined,
  // You can add payloadCreator and metaCreator as described in redux-actions library.
})
```
Now define your ActionHandler:
```javascript
store.actions.create(INCREMENT, {
  onSucceed: (action, state) => ({ 
    Counter: state.Counter + action.payload,
  }),
})

store.actions.create(INCREMENT, {
  onSucceed: (action, state) => ({ //This is just for example 
    Counter: state.Counter + action.payload + 30, 
  }),
})

store.actions.create(INCREMENT, {
  onSucceed: (action, state) => ({ //This is just for example 
    Counter: state.Counter + action.payload + 10,
  }),
})

```
Lets dispatch `INCREMENT` action
```javascript
//ActionSelector will return created action Function for execute.
store.dispatch(store.actions.get(INCREMENT)(4)) //Increment state.Counter by 4
```

If we want to look on states we see this:
```javascript 
console.log(store.state) // State { _: Map  { "users": Map { "list": List [ "Jim", "Jack", "Paul" ] }, "Counter": 48 } }
```

## Async Actions
Define AsyncAction

With set `async: true` action will be async. On Async actions we can set `onDispatch` function. This function is a redux middleware.
```javascript
store.actions.create(INCREMENT, {
  async: true, // Make action async
  onDispatch: (value, dispatch, getState) => { // This is middleware args from dispatch action and dispatch and getState will come in as a function arguments.
    // In this example (4 + 2) will pass to INCREMENT ActionHandler after 1 Second.
    return new Promise(resolve => setTimeout(() => resolve(value + 2), 1000))
  },
})
```
```javascript
store.dispatch(store.actions.get(INCREMENT)(4))
```
```javascript
console.log(store.state) // State { _: Map  { "users": Map { "list": List [ "Jim", "Jack", "Paul" ] }, "Counter": 52 } }
```
## Work with ActionCreator and ActionHandler combination
If you look at `set state` method in `Store.js` you can see how we use it:
```javascript
  this.actions.new(DEFAULT_STATE_SET, {
    selfDispatch: true, // This will Dispatch action immediately after defining.
    onDispatchArgs: props, // Args for Dispatch Action 
    onSucceed: action => action.payload, // After dispatch action was succeed, this function will run.
  })
```

## Use With reactJS
To use this library with [react](https://reactjs.org/) you can create store object and pass through your components with [Context](https://reactjs.org/docs/context.html) or create global object or every ways you will prefer.

Create Store.js file in your project root:
```javascript
import storeInstance from 'redux-peach'

storeInstance.configure({
  rootState: {},
  middlewares: [],
  enhancers: [],
})

export const store = storeInstance
export const Actions = storeInstance.actions
export const setState = state => (storeInstance.state = state)
export const States = store.state
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
One more thing about `react-redux`, when you are using `connect` you should use like this:
```javascript
connect(
  mapStatesToProps, 
  mapDispatchToProps, 
  undefined,
  {
    pure: true,
    areStatesEqual: ()=>false
  }
)
```
## Test
Run tests with `npm test`.
Test framework is jest.

Current tests is not unit test exactly and just check base functionality.

*34 Tests* will be passed.

Need More TESTS!!!!

## License
*MIT*