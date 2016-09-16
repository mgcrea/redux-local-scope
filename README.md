# [Redux Local Scope](http://mgcrea.github.io/redux-local-scope)

[![npm version](https://img.shields.io/npm/v/redux-local-scope.svg)](https://github.com/mgcrea/redux-local-scope/releases) [![license](https://img.shields.io/github/license/mgcrea/redux-local-scope.svg?style=flat)](https://tldrlegal.com/license/mit-license) [![build status](http://img.shields.io/travis/mgcrea/redux-local-scope/master.svg?style=flat)](http://travis-ci.org/mgcrea/redux-local-scope) [![dependencies status](https://img.shields.io/david/mgcrea/redux-local-scope.svg?style=flat)](https://david-dm.org/mgcrea/redux-local-scope) [![devDependencies status](https://img.shields.io/david/dev/mgcrea/redux-local-scope.svg?style=flat)](https://david-dm.org/mgcrea/redux-local-scope#info=devDependencies) [![coverage status](http://img.shields.io/codeclimate/coverage/github/mgcrea/redux-local-scope.svg?style=flat)](https://codeclimate.com/github/mgcrea/redux-local-scope) [![climate status](https://img.shields.io/codeclimate/github/mgcrea/redux-local-scope.svg?style=flat)](https://codeclimate.com/github/mgcrea/redux-local-scope)

Locally scope your redux store modules (eg. types, actions, reducers) to easily reuse them.

## Usage

### Quickstart

```bash
npm i redux-local-scope --save
```

Export scoped types, actions and reducers (eg. in `containers/Users/store/index.js`)

```js
import {scopeModule} from 'redux-local-scope';
import types from './types';
import actions from './actions';
import reducers from './reducers';

const scope = '@@list/DEVICE';
export const {types: scopedTypes, actions: scopedActions, reducers: scopedReducers} = scopeModule(scope, {types, actions, reducers});
```

### Examples

#### Scoped types

```js
import {scopeTypes} from 'redux-local-scope';

const TOGGLE_ASIDE = 'TOGGLE_ASIDE';
const types = {
  TOGGLE_ASIDE
};

const scope = '@@list/DEVICE';
const scopedTypes = scopeTypes(scope, types)

/*  
scopedTypes == {
  "TOGGLE_ASIDE": "@@list/DEVICE/TOGGLE_ASIDE",
  "FETCH_USERS": "@@resource/USER/FETCH"
}
*/
```

#### Scoped actions

```js
import {scopeActions} from 'redux-local-scope';

export const actions = {
  toggleAside: payload => ({type: TOGGLE_ASIDE, payload})
};

const scope = '@@list/DEVICE';
const scopedActions = scopeActions(scope, actions)

/*  
scopedActions.toggleAside(1) == {
  type: "@@list/DEVICE/TOGGLE_ASIDE",
  payload: 1
}
*/
```

#### Scoped reducers

```js
import {scopeReducers} from 'redux-local-scope';

// Action Handlers
export const initialState = {
  asideExpanded: false
};
const ACTION_HANDLERS = {
  [TOGGLE_ASIDE]: (state, action) => ({
    ...state,
    asideExpanded: !state.asideExpanded
  })
};

// Root Reducer
export function reducers(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

const scope = '@@list/DEVICE';
const scopedReducers = scopeReducers(scope, reducers)

/*  
const initialState = {};
scopedReducers(initialState, {type: 'TOGGLE_ASIDE'}) === initialState == {asideExpanded: false}
scopedReducers(initialState, {type: '@@list/DEVICE/TOGGLE_ASIDE'}) == {asideExpanded: true}
*/
```


### Available scripts

| **Script** | **Description** |
|----------|-------|
| test | Run mocha unit tests |
| lint | Run eslint static tests |
| test:watch | Run and watch mocha unit tests |
| compile | Compile the library |


## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea

Inspired by the [AngularJS resource](https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js).

## License

```
The MIT License

Copyright (c) 2016 Olivier Louvignes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
