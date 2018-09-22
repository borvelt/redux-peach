const invariant = require('invariant')
const isUndefined = require('lodash.isundefined')
const { createAction } = require('redux-actions')
const ActionSelector = require('./ActionSelector')
const { _STARTED, _FAILED, _SUCCEED, _ENDED } = require('./Constants')
const isReduxStore = require('./IsReduxStore')

class ActionCreator {
  constructor(store) {
    invariant(
      isReduxStore(store._),
      'ActionCreator should recieve Store instance.',
    )
    this._actionSelector = new ActionSelector(store)
    this._store = store._
    this._create = this._create.bind(this)
    this._createAsync = this._createAsync.bind(this)
  }

  create(props) {
    invariant(!isUndefined(props), 'Props is Undefined')
    invariant('name' in props, 'You have to define at least `name` property.')
    let action
    try {
      action = this._actionSelector.get(props.name)
    } catch (e) {
      this.TYPE = props.name
      if ('onDispatch' in props) {
        this._onDispatch = props.onDispatch
      }
      this._makeTypes()
      action = this._make({
        async: props.async,
        payloadCreator: props.payloadCreator,
        metaCreator: props.metaCreator,
      })
    }
    return action
  }

  _makeTypes() {
    this.TYPE_STARTED = `${this.TYPE + _STARTED}`
    this.TYPE_FAILED = `${this.TYPE + _FAILED}`
    this.TYPE_SUCCEED = `${this.TYPE + _SUCCEED}`
    this.TYPE_ENDED = `${this.TYPE + _ENDED}`
  }

  _make(
    options = {
      async: false,
      payloadCreator: undefined,
      metaCreator: undefined,
    },
  ) {
    this.actionCreators = {
      [this.TYPE_SUCCEED]: createAction(
        this.TYPE_SUCCEED,
        options.payloadCreator,
        options.metaCreator,
      ),
      [this.TYPE_FAILED]: createAction(
        this.TYPE_FAILED,
        options.payloadCreator,
        options.metaCreator,
      ),
      [this.TYPE_STARTED]: createAction(
        this.TYPE_STARTED,
        options.payloadCreator,
        options.metaCreator,
      ),
      [this.TYPE_ENDED]: createAction(
        this.TYPE_ENDED,
        options.payloadCreator,
        options.metaCreator,
      ),
    }

    const payload = {
      TYPE: this.TYPE,
      FAILED: this.TYPE_FAILED,
      SUCCEED: this.TYPE_SUCCEED,
    }

    const asyncPayload = {
      ...payload,
      ENDED: this.TYPE_ENDED,
      STARTED: this.TYPE_STARTED,
    }

    if (options.async) {
      Object.assign(this._createAsync, asyncPayload)
      this._store.Actions = this._store.Actions.set(
        this.TYPE,
        this._createAsync,
      )
      return this._createAsync
    }
    Object.assign(this._create, payload)
    this._store.Actions = this._store.Actions.set(this.TYPE, this._create)
    return this._create
  }

  _createAsync(...args) {
    return async (dispatch, getState) => {
      let result
      const startedAt = new Date().getTime()
      dispatch(
        this.actionCreators[this.TYPE_STARTED]({
          startedAt,
          ...args,
        }),
      )
      try {
        result = await this._onDispatch(...args, dispatch, getState)
        dispatch(this.actionCreators[this.TYPE_SUCCEED](result))
      } catch (error) {
        dispatch(
          this.actionCreators[this.TYPE_FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      let endedAt = new Date().getTime()
      dispatch(
        this.actionCreators[this.TYPE_ENDED]({
          endedAt: endedAt,
          elapsed: endedAt - startedAt,
        }),
      )
      return result
    }
  }

  _create(...args) {
    return (dispatch, getState) => {
      let result
      try {
        result = this._onDispatch(...args, dispatch, getState)
        dispatch(this.actionCreators[this.TYPE_SUCCEED](result))
      } catch (error) {
        dispatch(
          this.actionCreators[this.TYPE_FAILED]({
            errorMessage: error.message,
          }),
        )
        throw error
      }
      return result
    }
  }

  _onDispatch(...args) {
    args.pop()
    args.pop()
    return args[0]
  }
}

module.exports = ActionCreator
