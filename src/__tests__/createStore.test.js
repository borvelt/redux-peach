const createStore = require('../CreateStore')
const IsReduxStore = require('../IsReduxStore')

describe('test createStore', () => {
  let store
  it('should return function', () => {
    expect(typeof createStore).toBe(typeof (() => {}))
  })
  beforeAll(() => {
    store = createStore({ test: 10 })
  })
  it('should check root state', () => {
    expect(store.getState().toJS()).toEqual({ test: 10 })
  })
  it('should be redux store object', () => {
    expect(IsReduxStore(store)).toBe(true)
  })
})
