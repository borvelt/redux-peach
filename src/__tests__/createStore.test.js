const createStore = require('../CreateStore')
const IsReduxStore = require('../IsReduxStore')
const State = require('../State')

describe('test createStore', () => {
  let store

  beforeAll(() => {
    store = createStore({ test: 10 }) //return redux object store
  })

  it('should check root state to be equal', () => {
    console.log(store.getState())
    expect(store.getState()).toEqual({ test: 10 })
  })

  it('should states be State type', () => {
    expect(store.getState()).toBeInstanceOf(State)
  })

  it('should be redux store object', () => {
    expect(IsReduxStore(store)).toBeTruthy()
  })
})
