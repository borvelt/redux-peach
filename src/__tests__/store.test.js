import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const Store = require('../Store')
const State = require('../State')
const Action = require('../Action')
const { rootReducer } = require('../index')
const { DEFAULT_STATE_SET } = require('../Constants')
describe('Create Store Object', () => {
  let store
  let rootState = { isMailRecieved: true }
  beforeAll(() => {
    store = new Store()
  })

  it('reduxStoreObject should be undefined', () => {
    expect(store.reduxStoreObject).toBeUndefined()
  })

  it('should have configure method', () => {
    expect(typeof store.configure).toBe(typeof (x => x))
  })

  it('should show state correctly', () => {
    store.configure({ rootState })
    expect(store.getState()).toEqual(new State(rootState))
  })

  describe('Store with State', () => {
    it('should show store with state', () => {
      store.configure({ rootState })
      store.setState({ test: 20 })
      expect(store.getState()).toEqual({ ...rootState, test: 20 })
    })
    it('should show store actions', () => {
      expect(store.actions[DEFAULT_STATE_SET]).toBeInstanceOf(Action)
    })
  })

  describe('Store find Action', () => {
    it('should return true action source', () => {
      const [, action] = store.findAction(DEFAULT_STATE_SET)
      expect(store.actions[DEFAULT_STATE_SET]).toBe(action)
    })
  })
})

describe('Work with Redux store object', () => {
  const reduxStore = createStore(
    () => ({}),
    compose(applyMiddleware(thunkMiddleware)),
  )
  const reduxStore2 = createStore(
    rootReducer({ foo: 'bar' }),
    compose(applyMiddleware(thunkMiddleware)),
  )
  it('rootReducer method work as rootState initializer', () => {
    expect(rootReducer({}).call()).toEqual(new State({}))
  })
  it('should check state reference', () => {
    const reduxPeachStore = new Store(reduxStore)
    expect(reduxPeachStore.__).toBe(reduxStore)
  })
  it('should check state value', () => {
    const reduxPeachStore = new Store(reduxStore)
    expect(reduxPeachStore.getState()).toEqual({})
  })
  describe('should test rootReducer', () => {
    const reduxPeachStore = new Store(reduxStore2)
    it('should check State type', () => {
      expect(reduxPeachStore.getState()).toBeInstanceOf(State)
    })
    it('should test state value', () => {
      expect(reduxPeachStore.getState().foo).toEqual('bar')
    })
  })
})
