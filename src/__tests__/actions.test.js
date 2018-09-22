const store = require('../../index')
const Actions = require('../Actions')
const ActionHandler = require('../ActionHandler')
const ActionCreator = require('../ActionCreator')
const ActionSelector = require('../ActionSelector')
const { _SUCCEED } = require('../Constants')
const TEST = 'T E S T'
const TEST2 = 'T E S T 2'

describe('Actions class', () => {
  let actions

  beforeAll(() => {
    store.configure()
  })

  it('should accept store object', () => {
    expect(() => new Actions({})).toThrow()
  })

  beforeAll(() => {
    actions = new Actions(store)
  })

  it('check attribute instances', () => {
    expect(actions._actionHandler instanceof ActionHandler).toBe(true)
    expect(actions._actionCreator instanceof ActionCreator).toBe(true)
    expect(actions._actionSelector instanceof ActionSelector).toBe(true)
  })

  it('should create action', () => {
    const action = actions.create(TEST)
    expect(action.TYPE).toBe(TEST)
  })

  it('should create handler', () => {
    actions.handle(TEST)
    expect(typeof store._.Handlers.get(TEST + _SUCCEED)).toBe(typeof (() => {}))
  })

  it('should retrieve action', () => {
    expect(actions.get(TEST).TYPE).toEqual(TEST)
  })

  it('should do both work, create action and handle it', () => {
    actions.new(TEST2)
    expect(actions.get(TEST2).TYPE).toBe(TEST2)
    expect(typeof store._.Handlers.get(TEST2 + _SUCCEED)).toBe(
      typeof (() => {}),
    )
  })
})
