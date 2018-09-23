const createStore = require('../CreateStore')
const IsReduxStore = require('../IsReduxStore')

describe('test createStore', () => {
  let store

  it('should return function', () => {
    expect(typeof createStore).toBe(typeof (() => {}))
  })

  beforeAll(() => {
    store = createStore({ test: 10 }) //return redux object store
  })

  it('should check root state to be equal', () => {
    expect(
      store
        .getState()
        .toImmutableObject()
        .toJS(),
    ).toEqual({ test: 10 })
  })

  it('should be redux store object', () => {
    expect(IsReduxStore(store)).toBe(true)
  })
})
