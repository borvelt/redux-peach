# Redux Peach
#### Eat redux state container like 🍑

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
This contain middlewares and enhancers for your store, if you want to add 
some action logger or redux dev tools or etc, you should add as argument to `store.configure` method.`

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
  * __Regular actions__
  
    Regular actions contains two sub actions, [actionName_SUCCEED, 
    actionName_FAILED]

  * __Async actions__

      Async actions contains four sub actions, [actionName_STARTED, 
      actionName_Succeed, actionName_Ended, actionName_Failed]

#### Handle Actions
According to your action type (async flag) some sub actions will dispatch 
that you can handle by some function like this:
  sub action[actionName_SUCCEED] -> dispatch -> will handle with 
  setOnSucceedListener function

  sub action[actionName_FAILED] -> dispatch -> will handle with 
  setOnFailedListener function

#### Handle actions that will be dispatch by other modules
Some libraries has their own actions, you can handle them by create new action with same name and catch them with `.setOnHappenedListener(x => x)` method.

#### [payloadCreator and metaCreator definition](https://redux-actions.js.org/api/createaction#createactiontype-payloadcreator-metacreator)


## Getting Started
#### Installation
```bash
$ npm install --save redux-peach

# redux is a peer-dependency of redux-peach so let's install it.
$ npm install --save redux
```
#### Import
Import `redux-peach` in Your project if you are using react js you can use it 
with `react-redux` package and use its `provider` component.
```javascript
const {Store, State, Action} = require('redux-peach')
```
#### Make Store instance
```javascript
const store = new Store()
```
You can pass redux store to Store constructor or let redux-peach to make new
 redux store.
##### note: If you want to add your own redux store Please pay attention that redux-peach needs redux-thunk middleware, so you should add it to your store middlewares.  
#### Configuration
##### if your are using your own store you don't need this section.
Now you should configure your store like this:
```javascript 
// set middlewares and enhancers here
store.configure({
  rootState: { users: { list: ['Jim', 'Jack', 'Paul'] }, Counter: 0 },
  middlewares: [],
  enhancerts: [],
})
```
#### Make Action
Create Async action with name INCREMENT:

First Appearance of action means to define an action with some functionality,
 don't worry actions are mutable and throughout application you can change 
 their behavior.
```javascript
new Action()
  .setName('INCREMENT')
  .hookToStore(store)
  .setScope('Math.Numbers') // o.O Scope? What is it? I will explain it!
  .setInitialState({ Counter: 0 })
  .setAsyncFlag(true)
  .setOnDispatchListener(
    value =>
      new Promise(resolve => setTimeout(() => resolve(value * value), 1000)),
  )
  .make()
  // You can add payloadCreator and metaCreator as described in redux-actions library.
})
```
After 1000 millisecond will return square of value that you will dispatch. 
Always you should call `make`, `hookToStore` to make and hook current action 
to store.

It's important to call `make` method after all operations of action.
And It's also better to call `hookToStore` after `setName` because in 
`hookToStore` if action defined before, this will return that and if you call 
it as last method and action name has been defined before, all of your 
configurations will discard.

Now See INCREMENT action in other parts of project:

Second or more appearance of action means you want to change action behavior,
 maybe you want to add some listener or make action async or etc...
```javascript
Action('INCREMENT')
// you can call Action like function and pass actionName as first argument and 
// store as second argument. Or you can use `new` keyword like first expression
  .hookToStore(store)
  .setOnSucceedListener((action, state) => ({
    Counter: state.Counter + action.payload,
  }))
  .make()
})
```
Look at this action, what is it mean? yes mutate INCREMENT action but it's so
 weird!?
 
 It seams we have to setOnSucceedListener and it means that we over write it,
  but NO! if we set listeners for times, redux-peach will run all of them in 
  FIFO queue.
```javascript
Action('INCREMENT', store)
  .setOnSucceedListener((action, state) => ({
    Counter: state.Counter + action.payload + action.payload,
  }))
  .make()
```
### Find Action
```javascript
// Action find return function like preparation for dispatch as first 
// argument and action object as second. 
const [increment, action] = Action.find('INCREMENT', store)

// Set default status based on what you defined in action definition.
State.set(action.getInitialState(), store)
```
### Dispatch Action
```javascript
store.dispatch(increment(4)) //dispatch INCREMENT Action with.increment by 4
```
Create `DECREMENT` action that will dispatch immediately after created.
```javascript
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
```
If you need to set state every where you want, you can but be careful that 
this feature create to set default state in lazy loading for components.
```javascript
State.set({ test: 'redux-peach' }, store)
// OR
store.setState({ test: 'redux-peach' }) 
```

If we want to look on states we see this:
```javascript 
setTimeout(() => console.log(store.state), 200)
//After 200miliseconds:
{ users: { list: [ 'Jim', 'Jack', 'Paul' ] },
  Math: { Numbers: { Counter: -132 } },
  test: 'redux-peach' }
setTimeout(() => console.log(store.state), 1001)
//After 801miliseconds: 
{ users: { list: [ 'Jim', 'Jack', 'Paul' ] },
  Math: { Numbers: { Counter: -84 } },
  test: 'redux-peach' }

```

## Scopes
If you think deeper about actions and more deeper about store states you can 
see that we can make horrible side effects, how?

If you do not define scope for your action, on your succeedListener you can 
change states for example about User information while your action is about 
Math and countering, but you do this unwelcome mess.

While you are using scope concept your state object in Listeners functions 
will point to that specific scope for better development experience.

So `setScope` help you that your action work around this scope in store state.
 and
 prevent making unwanted side effects.
## Set your own store
As I mentioned above, if you have store with very special configurations like 
persistence or some development tools like redux-devtools or etc, you can make 
your store then import to `redux-peach`.Just pass your store to constructor.

**You should just do these two steps:**
- _while store creating pass `rootReducer` as reducer parameter to 
`createStore`._
```javascript
import {rootReducer} from 'redux-peach'
const store = createStore(rootReducer({}), ...)
```
- _add redux-thunk middleware to your store while store 
creation._

**And then run this:**
```javascript
const store = new Store(reduxStore)
```
## Use With reactJS
To use this library with [react](https://reactjs.org/) you can create store 
object and pass through your components with [Context](https://reactjs.org/docs/context.html) or create global object or every ways you will prefer.

Create Store.js file in your project root:
```javascript
import { Store, State, Action } from 'redux-peach'
//Create your own reduxStore...
export const store = new Store(reduxStore)
export const setState = newState => State.set(newState, store)
export const findAction = actionName => Action.find(actionName, store)
export const newAction = actionName => Action(actionName, store)
```
Now import every where you want in your react project
#### react Context
You can create [context](https://reactjs.org/docs/context.html) in react and 
provide your store in root of your project and consume it every where.Or 
until react 16.x you can use [legacy context](https://reactjs
.org/docs/legacy-context.html) see sample code below.

If you are using [react-redux](https://github.com/reduxjs/react-redux) store 
object will provide with `provider` component.Just consume it
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
#### State type and performance issue
`State` types provide shallow equals in work with `redux-react` package. and
 it does not cause a side effects and performance issue.
## Test
Run tests with `npm test`.
Test framework is jest.

*50 Tests passed.*


## Contribution
Please feel free to send me feed backs, I needs them. and so I will be 
so happy if you contribute in project.

## License
*MIT*
