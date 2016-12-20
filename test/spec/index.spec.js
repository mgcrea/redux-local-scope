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
      expect(scopedModule).toBeA('object');
    }).toThrow();
  });
  it('should properly return an object with properly named keys', () => {
    const {types, actions, reducers} = scopeModule(scope, storeModule);
    expect(types).toBeA('object');
    expect(actions).toBeA('object');
    expect(reducers).toBeA('function');
  });
});

describe('scopeTypes', () => {
  it('should properly scope types', () => {
    const scopedTypes = scopeTypes(scope, storeModule.types);
    expect(scopedTypes).toBeA('object');
    expect(scopedTypes.CHANGE_ASIDE_TAB).toEqual(`${scope}/CHANGE_ASIDE_TAB`);
  });
});

describe('scopeActions', () => {
  it('should properly scope dispatched actions types', () => {
    const scopedActions = scopeActions(scope, storeModule.actions);
    expect(scopedActions).toBeA('object');
    store.dispatch(scopedActions.changeAsideTab(1));
    const storeActions = store.getActions();
    expect(storeActions).toBeA('array');
    expect(storeActions[0].type).toEqual(`${scope}/CHANGE_ASIDE_TAB`);
    store.clearActions();
  });
  it('should properly scope dispatched actions types with redux-thunk', () => {
    const scopedActions = scopeActions(scope, storeModule.actions);
    expect(scopedActions).toBeA('object');
    store.dispatch(scopedActions.fetchUser({email: 'foo@bar.com'}));
    return delay(10)
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions).toBeA('array');
        expect(storeActions[0].type).toEqual(`${scope}/FETCH_USER`);
        store.clearActions();
      });
  });
});

describe('scopeReducers', () => {
  it('should return the initial state', () => {
    const scopedReducers = scopeReducers(scope, storeModule.reducers);
    expect(scopedReducers).toBeA('function');
    expect(scopedReducers(undefined, {}))
      .toBe(storeModule.initialState);
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
      .toBe(storeModule.initialState);
  });
});
