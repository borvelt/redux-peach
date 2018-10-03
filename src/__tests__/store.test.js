const Store = require('../Store')
const State = require('../State')

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

  it('should show state currectly', () => {
    store.configure(rootState)
    expect(store.getState()).toBe(store.reduxStoreObject.getState())
    console.log(store.getState())
    expect(store.getState()).toEqual(new State(rootState))
  })
})
