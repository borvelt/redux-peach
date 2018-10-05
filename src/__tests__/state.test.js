const State = require('../State')
const Store = require('../Store')

describe('Work with states', () => {
  const entryState = { ids: [1, 2, 3, 4, 5] }
  let state
  beforeAll(() => {
    state = new State(entryState)
  })
  it('should recieve object', () => {
    expect(() => new State()).toThrow()
  })
  it('should be equal to rawState', () => {
    expect(state.rawState).toEqual(entryState)
  })

  describe('work with store and state', () => {
    //it's not a unit test.
    let store = new Store()
    store.configure()

    it('should throw error beacuse store object needed', () => {
      expect(() => State.set(entryState)).toThrow()
    })
    it('should set State statically be the same', () => {
      State.set(entryState, store)
    })
  })

  describe('work with state merge', () => {
    state = new State(entryState)
    let newState = state.merge({ name: 'borvelt' })
    it('should show that merge is immutable', () => {
      expect(state).toEqual(entryState)
    })
    it('should show new State', () => {
      expect(newState).toEqual({ ids: [1, 2, 3, 4, 5], name: 'borvelt' })
    })
    it('should check deep state merging', () => {
      newState = state.merge({ ids: [] })
      expect(newState).toEqual({ ids: [] })
    })
  })

  describe('work with Proxy', () => {
    it('should be the equal state.ids == entryState.ids', () => {
      expect(state.ids).toEqual(entryState.ids)
    })
    it('should return state keys(email,name)', () => {
      let ns = new State({ email: 'borvelt@gmail.com', name: 'borvelt' })
      expect(Object.keys(ns)).toContain('name')
      expect(Object.keys(ns)).toContain('email')
    })
  })
})
