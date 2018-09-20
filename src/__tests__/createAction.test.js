const Store = require('../Store')
const ActionCreator = require('../ActionCreator')

test('CreateAction', () => {
  ActionCreator({ name: 'TEST' })
  expect(Object.keys(Store.Actions.toJS())).toContain('TEST')
})

test('created action should contain some attributes', () => {
  const action = Store.Actions.get('TEST')
  const keys = Object.keys(action)
  expect(typeof action).toBe(typeof (() => {}))
  expect(keys).toContain('TYPE')
  expect(keys).toContain('SUCCEED')
  expect(keys).toContain('FAILED')
})
