const { createAction, handleActions } = require('redux-actions')
const invariant = require('invariant')
const isReduxStore = require('./IsReduxStore')
const { isUndefined, isBoolean, isFunction } = require('./Utils')
const {
  _STARTED,
  _FAILED,
  _SUCCEED,
  _ENDED,
  SUCCEED,
  FAILED,
  STARTED,
  ENDED,
  HAPPENED,
} = require('./Constants')

class Action {
  constructor() {
    this._async = false
    this._selfDispatch = false
    this._onDispatchArgs = []
    this._handlers = {
      [HAPPENED]: [],
      [SUCCEED]: [],
      [ENDED]: [],
      [FAILED]: [],
      [STARTED]: [],
    }
    this._types = {}
    this._subActions = {}
  }

  setOnDispatchListener(func) {
    invariant(isFunction(func), 'onDispatchListener should be callable.')
    this._onDispatch = func
    return this
  }

  setOnDispatchArgs(...args) {
    invariant(Array.isArray(args), 'onDispatchArgs should be array.')
    this._onDispatchArgs = args
    return this
  }

  setName(name) {
    invariant(!isUndefined(name), 'action name should be defined.')
    this._name = name
    return this
  }

  setAsync(async) {
    invariant(isBoolean(async), 'async flag should be Boolean.')
    this._async = async
    return this
  }

  setPayloadCreator(payloadCreator) {
    invariant(isFunction(payloadCreator), 'payloadCreator should be callable.')
    this._payloadCreator = payloadCreator
    return this
  }

  setMetaCreator(metaCreator) {
    invariant(isFunction(metaCreator), 'metaCreator should be callable.')
    this._metaCreator = metaCreator
    return this
  }

  setSelfDispatch(value) {
    invariant(isBoolean(value), 'selfDispatch flag should be Boolean.')
    this._selfDispatch = value
    return this
  }

  onHappened(listener = action => action.payload) {
    this._handlers[HAPPENED].push(listener)
    return this
  }

  onStarted(listener = action => action.payload) {
    this._handlers[STARTED].push(listener)
    return this
  }

  onSucceed(listener = action => action.payload) {
    this._handlers[SUCCEED].push(listener)
    return this
  }

  onFailed(listener = action => action.payload) {
    this._handlers[FAILED].push(listener)
    return this
  }

  onEnded(listener = action => action.payload) {
    this._handlers[ENDED].push(listener)
    return this
  }

  hookToStore(store) {
    try {
      this._store = Action._getStore(store)
      return Action.find(this._name, this._store)
    } catch (e) {
      if (!('__actions' in this._store)) {
        this._store.__actions = {}
      }
      invariant(
        !isUndefined(this._name),
        'first of all you should make action name',
      )
      Object.assign(this._store.__actions, {
        [this._name]: this,
      })
      return this
    }
  }

  static _getStore(store) {
    let reduxStore
    try {
      invariant('__' in store, 'it`s not a Store instance')
      reduxStore = store.toReduxStoreObject()
    } catch (e) {
      reduxStore = store
    }
    invariant(isReduxStore(reduxStore), 'it should be redux store')
    return reduxStore
  }

  _makeHandlers() {
    const handlers = {}
    for (let type of Object.keys(this._handlers)) {
      handlers[this._types[type]] = (state, action) => {
        invariant('merge' in state, 'State object should have merge method.')
        for (let handler of this._handlers[type]) {
          state = state.merge(handler(action, state))
        }
        return state
      }
    }
    return handlers
  }

  _updateReducers() {
    let handlers = {}
    for (let action of Object.values(this._store.__actions)) {
      Object.assign(handlers, action._makeHandlers())
    }
    this._store.replaceReducer(handleActions(handlers, {}))
  }

  make() {
    invariant(
      !isUndefined(this._store) && !isUndefined(this._store.__actions),
      'Action isn`t hook any where.',
    )
    this._makeTypes()
    this._makeSubActions()
    this._updateReducers()
    if (this._selfDispatch) {
      this._store.dispatch(this.prepareForDispatch(...this._onDispatchArgs))
    }
    return this
  }

  prepareForDispatch(args) {
    if (this._async) {
      return this._prepareForDispatchAsync(args)
    }
    return this._prepareForDispatch(args)
  }

  clearHandlers() {
    const handlers = this._handlers
    this._handlers = {}
    return handlers
  }

  _makeTypes() {
    this._types = {
      HAPPENED: `${this._name}`,
      STARTED: `${this._name + _STARTED}`,
      FAILED: `${this._name + _FAILED}`,
      SUCCEED: `${this._name + _SUCCEED}`,
      ENDED: `${this._name + _ENDED}`,
    }
    return this
  }

  _makeSubActions() {
    this._subActions = {
      [this._types.SUCCEED]: createAction(
        this._types.SUCCEED,
        this._payloadCreator,
        this._metaCreator,
      ),
      [this._types.FAILED]: createAction(
        this._types.FAILED,
        this._payloadCreator,
        this._metaCreator,
      ),
      [this._types.STARTED]: createAction(
        this._types.STARTED,
        this._payloadCreator,
        this._metaCreator,
      ),
      [this._types.ENDED]: createAction(
        this._types.ENDED,
        this._payloadCreator,
        this._metaCreator,
      ),
    }
    return this
  }

  _prepareForDispatch(...args) {
    return (dispatch, getState) => {
      let result
      try {
        result = this._onDispatch(...args, dispatch, getState)
        dispatch(this._subActions[this._types.SUCCEED](result))
      } catch (error) {
        dispatch(
          this._subActions[this._types.FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      return result
    }
  }

  _prepareForDispatchAsync(...args) {
    return async (dispatch, getState) => {
      let result
      const startedAt = new Date().getTime()
      dispatch(
        this._subActions[this._types.STARTED]({
          startedAt,
        }),
      )
      try {
        result = await this._onDispatch(...args, dispatch, getState)
        dispatch(this._subActions[this._types.SUCCEED](result))
      } catch (error) {
        dispatch(
          this._subActions[this._types.FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      let endedAt = new Date().getTime()
      dispatch(
        this._subActions[this._types.ENDED]({
          endedAt: endedAt,
          elapsed: endedAt - startedAt,
        }),
      )
      return result
    }
  }

  _onDispatch(...args) {
    args.pop()
    args.pop()
    return args[0]
  }

  static find(actionName, store) {
    const result = this._getStore(store).__actions[actionName]
    invariant(!isUndefined(result), 'Action NOT found.')
    return result
  }
}

module.exports = Action
