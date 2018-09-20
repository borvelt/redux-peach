const Store = require('../Store')
const DefaultState = require('../DefaultStates')

test('counter in defaultState should be 10', () => {
  DefaultState({ counter: 10 })
  expect(Store.getState().toJS().counter).toEqual(10)
})
