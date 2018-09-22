const Store = require('../Store')
const Actions = require('../Actions')

describe('Create Store Object', () => {
  let store

  beforeAll(() => {
    store = new Store()
  })

  it('should have configure method', () => {
    expect(typeof store.configure).toBe(typeof (() => {}))
  })

  beforeAll(() => {
    store.configure()
  })

  it('should be Actions type (actions)', () => {
    expect(store.actions instanceof Actions).toBe(true)
  })

  it('should show state currectly', () => {
    expect(store.state).toBe(store._.getState())
  })

  it('would set new state', () => {
    const newState = { newSetState: true }
    store.state = newState
    expect(store.state.toJS()).toEqual(newState)
  })
})
