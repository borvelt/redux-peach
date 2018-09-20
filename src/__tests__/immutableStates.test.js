const Store = require('../Store')
const { Map } = require('immutable')

test('Store states should be immutable', () => {
  const currentState = Store.getState()
  expect(currentState).toBe(Map({}))
})
