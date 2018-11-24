const Store = require('../Store')
const State = require('../State')
const Action = require('../Action')
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
