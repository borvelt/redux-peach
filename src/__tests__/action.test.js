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
      .setAsyncFlag(true)
      .setOnDispatchListener(x)
      .setOnDispatchArgs([10])
      .setSelfDispatchFlag(true)
      .setOnHappenedListener(x)
      .setOnSucceedListener(x)
      .setOnEndedListener(x)
      .setOnStartedListener(x)
      .setOnFailedListener(x)
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

describe('check hookStore and set InitialState', () => {
  const store = new Store()
  store.configure()
  it('should throw error', () => {
    expect(() => new Action().hookToStore(store)).toThrow()
  })
  it('should hook to store', () => {
    const ac = new Action().setName('ac').hookToStore(store)
    const [, action] = store.findAction('ac')
    expect(action).toBe(ac)
  })
  it('should set Prefix for states', () => {
    const action = new Action()
      .setName('TEST_FETCH')
      .hookToStore(store)
      .setPrefix('...science..computer..')
    expect(action.getPrefix()).toEqual('science.computer')
  })
  it('should set initial State', () => {
    const action = new Action()
      .setName('TEST_INITIAL_STATE')
      .hookToStore(store)
      .setInitialState({ test: 10 })
    expect(action.getInitialState()).toEqual({ test: 10 })
  })
})

describe('Check static methods', () => {
  let store = new Store()
  store.configure()
  it('should find action', () => {
    const ac = new Action().setName('ac').hookToStore(store)
    const [, action] = Action.find('ac', store)
    expect(action).toBe(ac)
  })
  it('should return reduxStore', () => {
    expect(Action._getReduxStore(store)).toBe(store.reduxStoreObject)
    expect(Action._getReduxStore(store.reduxStoreObject)).toBe(
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
        .setOnHappenedListener(x)
        .setOnSucceedListener(x)
        .setOnEndedListener(x)
        .setOnStartedListener(x)
        .setOnFailedListener(x)
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
    it('should work without prepareForFetch', () => {
      const ac = new Action()
        .setName('noPrepareForFetch')
        .setOnSucceedListener()
        .hookToStore(store)
      const action = ac.make()
      store.dispatch(action({ test: 10 }))
      expect(store.getState().test).toEqual(10)
      store.dispatch(ac.prepareForDispatch({ test: 20 }))
      expect(store.getState().test).toEqual(20)
    })
  })
})
