const Action = require('../Action')
const Store = require('../Store')
const {
  HAPPENED,
  SUCCEED,
  FAILED,
  STARTED,
  ENDED,
  _STARTED,
  _SUCCEED,
  _ENDED,
  _FAILED,
} = require('../Constants')

let x = x => x

describe('Create Action', () => {
  let action
  beforeAll(() => {
    action = new Action()
      .setName('TEST')
      .setAsync(true)
      .setOnDispatchListener(x)
      .setOnDispatchArgs([10])
      .setSelfDispatch(true)
      .onHappened(x)
      .onSucceed(x)
      .onEnded(x)
      .onStarted(x)
      .onFailed(x)
      .setMetaCreator(x)
      .setPayloadCreator(x)
  })
  it('Check action attributes', () => {
    expect(action._name).toEqual('TEST')
    expect(action._async).toBeTruthy()
    expect(action._onDispatch).toBe(x)
    expect(action._onDispatchArgs).toEqual([[10]])
    expect(action._selfDispatch).toBeTruthy()
    expect(action._handlers[HAPPENED].shift()).toBe(x)
    expect(action._handlers[SUCCEED].shift()).toBe(x)
    expect(action._handlers[FAILED].shift()).toBe(x)
    expect(action._handlers[STARTED].shift()).toBe(x)
    expect(action._handlers[ENDED].shift()).toBe(x)
    expect(action._payloadCreator).toBe(x)
    expect(action._metaCreator).toBe(x)
  })
})

describe('check hookStore', () => {
  let store = new Store()
  store.configure()
  it('should throw error', () => {
    expect(() => new Action().hookToStore(store)).toThrow()
  })
  it('should hook to store', () => {
    let ac = new Action().setName('ac').hookToStore(store)
    expect(store.findAction('ac')).toBe(ac)
  })
})

describe('Check static methods', () => {
  let store = new Store()
  store.configure()
  it('should find action', () => {
    let ac = new Action().setName('ac').hookToStore(store)
    expect(Action.find('ac', store)).toBe(ac)
  })
  it('should return reduxStore', () => {
    expect(Action._getStore(store)).toBe(store.reduxStoreObject)
    expect(Action._getStore(store.reduxStoreObject)).toBe(
      store.reduxStoreObject,
    )
  })

  describe('Make and preparation action', () => {
    let action
    let store = new Store()
    store.configure()
    it('should generate types', () => {
      action = new Action()
        .setName('ac')
        .hookToStore(store)
        ._makeTypes()
      expect(action._types).toEqual({
        HAPPENED: 'ac',
        SUCCEED: `ac${_SUCCEED}`,
        STARTED: `ac${_STARTED}`,
        ENDED: `ac${_ENDED}`,
        FAILED: `ac${_FAILED}`,
      })
    })
    it('check handlers', () => {
      let x = x => x
      let actionCheckHandlers = new Action()
        .setName('aaa')
        .hookToStore(store)
        .onHappened(x)
        .onSucceed(x)
        .onEnded(x)
        .onStarted(x)
        .onFailed(x)
      let handlers = actionCheckHandlers
        ._makeTypes()
        ._makeSubActions()
        ._makeHandlers()
      expect(Object.keys(handlers)).toContain('aaa')
      expect(Object.keys(handlers)).toContain('aaa_SUCCEED')
      expect(Object.keys(handlers)).toContain('aaa_FAILED')
      expect(Object.keys(handlers)).toContain('aaa_STARTED')
      expect(Object.keys(handlers)).toContain('aaa_ENDED')
    })
  })
})
