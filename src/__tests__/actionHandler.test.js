const ActionHandler = require('../ActionHandler')
const ActionCreator = require('../ActionCreator')
const Store = require('../Store')
const {
  ONSTARTED,
  ONSUCCEED,
  ONFAILED,
  ONENDED,
  _SUCCEED,
} = require('../Constants')
const TEST = 'T E S T'
let store
let actionHandler, actionCreator
describe('Test actionHandler', () => {
  it('should get store object', () => {
    expect(() => new ActionHandler({})).toThrow()
  })
  beforeAll(() => {
    store = new Store()
    store.configure()
    actionHandler = new ActionHandler(store)
  })

  it('should listeners to be defined', () => {
    const toBe = [ONSTARTED, ONSUCCEED, ONFAILED, ONENDED]
    const result = toBe.map(key =>
      actionHandler._listeners.find(el => el === key),
    )
    expect(result).toContain(ONSTARTED)
    expect(result).toContain(ONSUCCEED)
    expect(result).toContain(ONFAILED)
    expect(result).toContain(ONENDED)
  })

  beforeAll(() => {
    actionCreator = new ActionCreator(store)
    actionCreator.create({ name: TEST })
  })

  it('Should be define in store handlers', () => {
    actionHandler.create({ name: TEST })
    expect(
      typeof store.toReduxStoreObject().Handlers.get(TEST + _SUCCEED),
    ).toBe(typeof (() => {}))
  })
})
