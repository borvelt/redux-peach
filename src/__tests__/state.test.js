const State = require('../State')
const Store = require('../Store')

describe('Work with states', () => {
  let store
  const rootState = { ids: [1, 2, 3, 4, 5] }
  beforeAll(() => {
    store = new Store()
    store.configure({ rootState })
  })
  it('should recieve object', () => {
    expect(() => new State()).toThrow()
  })
  it('appliction state should be instance of State', () => {
    expect(store.state instanceof State).toBeTruthy()
  })

  it('should return the same', () => {
    expect(store.state.ids).toEqual(store._.getState().ids)
  })

  it('should return undefined', () => {
    expect(store.state.unknown).toBeUndefined()
  })

  it('should return merge function and undefined toJS', () => {
    expect(typeof store.state.merge).toBe(typeof (() => {}))
    expect(store.state.toJS).toBeUndefined()
  })

  it('should return immutableObject', () => {
    expect(store.state.toImmutableObject().toJS()).toEqual(rootState)
  })
})
