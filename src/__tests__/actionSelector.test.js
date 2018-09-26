const Store = require('../Store')
const ActionSelector = require('../ActionSelector')
const Actions = require('../Actions')
const TEST = 'TEST'

let store
describe('test action selector', () => {
  beforeAll(() => {
    store = new Store()
    store.configure()
  })
  it('should pass store object', () => {
    expect(() => ActionSelector({})).toThrow()
  })
  it('should return action', () => {
    const actions = new Actions(store)
    actions.create(TEST)
    const actionSelector = new ActionSelector(store)
    const action = actionSelector.get(TEST)
    expect(action.TYPE).toEqual(TEST)
  })
})
