const isReduxStore = require('../IsReduxStore')
const Store = require('../Store')

describe('Check is object redux store', () => {
  it('should throw undefined error', () => {
    expect(() => isReduxStore()).toThrow()
  })

  it('should have all these keys[dispatch, subscribe, getState, replaceReducer] to return true otherwise it return false like this', () => {
    expect(isReduxStore({})).toBeFalsy()
  })

  it('should return true', () => {
    const store = new Store()
    store.configure()
    expect(isReduxStore(store.reduxStoreObject)).toBeTruthy()
  })
})
