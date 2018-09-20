const Store = require('../Store')
const ActionSelector = require('../ActionSelector')
const ActionCreator = require('../ActionCreator')

test('Select action with action name', () => {
  ActionCreator({ name: 'TEST' })
  const action = ActionSelector('TEST')
  const action2 = Store.Actions.get('TEST')
  expect(action).toBe(action2)
  expect(action.TYPE).toEqual('TEST')
})
test('undefined action should throw error', () => {
  expect(() => ActionSelector('TEST2')).toThrow()
})
