const Store = require('../Store')

test('Store object should has redux store attributes', () => {
  const storeKeys = Object.keys(Store)
  expect(storeKeys).toContain('dispatch')
  expect(storeKeys).toContain('subscribe')
  expect(storeKeys).toContain('getState')
  expect(storeKeys).toContain('replaceReducer')
  expect(storeKeys).toContain('Handlers')
  expect(storeKeys).toContain('Actions')
})
