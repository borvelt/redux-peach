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
    expect(store.state.toImmutableObject().toJS()).toEqual(newState)
  })
})

describe('Create Store with pre defined rootState', () => {
  let store

  beforeAll(() => {
    store = new Store()
    store.configure({
      rootState: { friends: ['Bob', 'Ernest', 'Josh', 'Benjamin'] },
    })
  })

  it('should have same state', () => {
    expect(store.state).toBe(store._.getState())
  })
})
