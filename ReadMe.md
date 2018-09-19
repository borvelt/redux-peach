# Redux Peach
Eat redux state manager like 🍑 : )

[ImmutableJS](https://github.com/facebook/immutable-js), 
[redux](https://github.com/reduxjs/redux),
[redux-actions](https://github.com/redux-utilities/redux-actions) and
[redux-thunk](https://github.com/reduxjs/redux-thunk)
are this repository dependencies. I thinks it should be good if you know something about this libraries. 

## First Of All 
First of all I want to tell you that this librarie will fix your below concerns about your project: 

> your confiusing to find action string and constants in your reducers and your action creators.

> your worries about your application scaffold, we always think that our application doesn't have rubost scaffold.

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

`redux-peach` have both of this we can handle actions with two or more functions to run, with same action name and clean scaffold in addition you can use redux middlewares every where you want and very simple.
## Concepts
### Enhancers
This containe middlewares and enhancers for your store, if you want to add some action logger or redux dev tools or etc, you should add in this file.`Enhancers.js`
### Store
It makes your Store application with base reducer and enhancers that introduced in last section.
### DefaultStates
With DefaultStates you can set default states for your application part every where you want and any time.
### ActionCreator
This will create an Action for your application we have two type of actions, ActionCreator return action function and types of actions.
  * Regular actions
  
    Regular actions contains two type of action, [onSucceed, onFailed]

  * Async actions

      Async actions contains four type of action, [onStarted, onSucceed, onEnded, onFailed]

### ActionHandler
In ActionHandler options we input the action name same as we defined in ActionCreator and we send some functions like [onStarted, onSucceed, onEnded, onFailed] all of this function will dispatch on time

### Action
Action is combination of ActionHandler and ActionCreator it can create action and handle it in place.
in action we have option that can dispatch action ondemand.

### ActionSelector
ActionSelector use to get the action with actionName and call like a function.

***
## Getting Started

```bash
$ npm install --save redux-peach
```
Add in Your project if you are using reactjs you can use it with `react-redux` and use `provider`.
```javascript
const {
  Store,
  Action,
  DefaultStates,
  ActionCreator,
  ActionSelector,
  ActionHandler,
} = require('redux-peach')
```
It is not your concern that how your Store will create if you want to change in Enhancers and starting middlewares you should change in `Enhancers.js`

```javascript
// Enhancers.js
const { compose, applyMiddleware } = require('redux')
const thunkMiddleware = require('redux-thunk').default
let middlewares = [thunkMiddleware]
let enhancers = []
module.exports = compose(
  applyMiddleware(...middlewares),
  ...enhancers,
)
```
You just need to define your default states every where you want:
```javascript
DefaultStates({ users: { list: ['Jim', 'Jack', 'Paul'] }, Counter: 0 })
```
Now make your Action:
```javascript
ActionCreator({
  name: 'INCREMENT', // You can define a constants
})
```
Now define your ActionHandler:
```javascript
ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({ 
    Counter: state.get('Counter') + action.payload,
  }),
})

ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({ //This is just for example 
    Counter: state.get('Counter') + action.payload + 30, 
  }),
})

ActionHandler({
  name: 'INCREMENT',
  onSucceed: (action, state) => ({ //This is just for example 
    Counter: state.get('Counter') + action.payload + 10,
  }),
})
```
Lets dispatch `INCREMENT` action
```javascript
//ActionSelector will return created action Function for execute.
Store.dispatch(ActionSelector('INCREMENT')(4)) //Increment state.Counter by 4
```

If we want to look on states we see this:
```javascript 
console.log(Store.getState()) // Map { "users": Map { "list": List [ 1, 2 ] }, "Counter": 52 }
```

## Async Actions

Define AsyncAction

With set `async: true` action will be async. On Async actions we can set `onDispatch` function. This function is a redux middleware.
```javascript
ActionCreator({
  name: 'INCREMENT',
  async: true, // Make action async
  onDispatch: (value, dispatch, getState) => { // This is middleware args from dispatch action and dispatch and getState will come in as a function arguments.

    // In this example (4 + 2) will pass to actionHandlers after 1 Second.
    return new Promise(resolve => setTimeout(() => resolve(value + 2), 1000))
  },
})
```

## Work with Action
If you loot at `DefaultStates.js` you can see how we use this function.
```javascript
  Action({
    selfDispatch: true, // This will Dispatch action immediately after defining.
    name: 'DEFAULT_STATE_SET',
    onDispatchArgs: props, // Args for Dispatch Action 
    onSucceed: action => action.payload, // After dispatch action was succeed, this function will run.
  })
```
```javascript 
console.log(Store.getState()) // Map { "users": Map { "list": List [ 1, 2 ] }, "Counter": 58 }
```
