import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {scopeModule, scopeTypes, scopeActions, scopeReducers} from '../../src';
import * as storeModule from '../fixtures/store';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

try { require('debug-utils'); } catch (err) {}; // eslint-disable-line

// Configuration
const scope = '@@list/USER';
const altScope = '@@list/DEVICE';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

describe('scopeModule', () => {
  it('should throw if scope is undefined', () => {
    expect(() => {
      const scopedModule = scopeModule();
      expect(typeof scopedModule).toBe('object');
    }).toThrow();
  });
  it('should properly return an object with properly named keys', () => {
    const {types, actions, reducers} = scopeModule(scope, storeModule);
    expect(typeof types).toBe('object');
    expect(typeof actions).toBe('object');
    expect(typeof reducers).toBe('function');
  });
});

describe('scopeTypes', () => {
  it('should properly scope types', () => {
    const scopedTypes = scopeTypes(scope, storeModule.types);
    expect(typeof scopedTypes).toBe('object');
    expect(scopedTypes.CHANGE_ASIDE_TAB).toEqual(`${scope}/CHANGE_ASIDE_TAB`);
  });
  it('should properly not scope types when given a falsy scope', () => {
    const scopedTypes = scopeTypes(null, storeModule.types);
    expect(typeof scopedTypes).toBe('object');
    expect(scopedTypes.CHANGE_ASIDE_TAB).toEqual('CHANGE_ASIDE_TAB');
  });
});

describe('scopeActions', () => {
  it('should properly scope dispatched actions types', () => {
    const scopedActions = scopeActions(scope, storeModule.actions);
    expect(typeof scopedActions).toBe('object');
    store.dispatch(scopedActions.changeAsideTab(1));
    const storeActions = store.getActions();
    expect(Array.isArray(storeActions)).toBe(true);
    expect(storeActions[0].type).toEqual(`${scope}/CHANGE_ASIDE_TAB`);
    store.clearActions();
  });
  it('should properly scope dispatched actions types with redux-thunk', () => {
    const scopedActions = scopeActions(scope, storeModule.actions);
    expect(typeof scopedActions).toBe('object');
    store.dispatch(scopedActions.fetchUser({email: 'foo@bar.com'}));
    return delay(10)
      .then(() => {
        const storeActions = store.getActions();
        expect(Array.isArray(storeActions)).toBe(true);
        expect(storeActions[0].type).toEqual(`${scope}/FETCH_USER`);
        store.clearActions();
      });
  });
});

describe('scopeReducers', () => {
  it('should return the initial state', () => {
    const scopedReducers = scopeReducers(scope, storeModule.reducers);
    expect(typeof scopedReducers).toBe('function');
    expect(scopedReducers(undefined, {}))
      .toEqual(storeModule.initialState);
  });
  it('should properly process scoped reducers', () => {
    const scopedReducers = scopeReducers(scope, storeModule.reducers);
    const scopedActions = scopeActions(scope, storeModule.actions);
    expect(scopedReducers(undefined, scopedActions.changeAsideTab(1)))
      .toEqual({...storeModule.initialState, asideTabIndex: 1});
  });
  it('should properly locally scope reducers', () => {
    const scopedReducers = scopeReducers(scope, storeModule.reducers);
    const altScopedActions = scopeActions(altScope, storeModule.actions);
    expect(scopedReducers(undefined, altScopedActions.changeAsideTab(1)))
      .toEqual(storeModule.initialState);
  });
  it('should support initialState option', () => {
    const scopedReducers = scopeReducers(scope, storeModule.reducers, {initialState: {foo: 'bar'}});
    const altScopedActions = scopeActions(scope, storeModule.actions);
    expect(scopedReducers(undefined, altScopedActions.changeAsideTab(1)))
      .toEqual({...storeModule.initialState, asideTabIndex: 1, foo: 'bar'});
  });
  it('should support onStateChange option', () => {
    const mockFn = jest.fn();
    const scopedReducers = scopeReducers(scope, storeModule.reducers, {onStateChange: mockFn});
    const altScopedActions = scopeActions(scope, storeModule.actions);
    scopedReducers(undefined, altScopedActions.changeAsideTab(1));
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn.mock.calls[0][0]).toEqual({...storeModule.initialState, asideTabIndex: 1});
  });
});
