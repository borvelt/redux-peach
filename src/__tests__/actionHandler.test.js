const Store = require('../Store')
const ActionCreator = require('../ActionCreator')
const ActionHandler = require('../ActionHandler')
test('ActionHandler', () => {
  ActionCreator({ name: 'TEST' })
  ActionHandler({ name: 'TEST' })
  expect(Object.keys(Store.Actions.toJS())).toContain('TEST')
})

test('undefined action should throw error', () => {
  expect(() => ActionHandler({ name: 'TEST2' })).toThrow(/actionName/)
})
