
// Types
const CHANGE_ASIDE_TAB = 'CHANGE_ASIDE_TAB';
const TOGGLE_ASIDE = 'TOGGLE_ASIDE';
const FETCH_USER = 'FETCH_USER';
export const types = {
  CHANGE_ASIDE_TAB,
  TOGGLE_ASIDE,
  FETCH_USER
};

// Actions
export const actions = {
  changeAsideTab: payload => ({type: CHANGE_ASIDE_TAB, payload}),
  toggleAside: payload => ({type: TOGGLE_ASIDE, payload}),
  fetchUser: payload => (dispatch, getState) =>
    setTimeout(() => {
      const {asideExpanded} = getState();
      dispatch({type: FETCH_USER, payload: {...payload, asideExpanded}});
    }, 5)
};

// Action Handlers
export const initialState = {
  asideExpanded: true,
  asideTabIndex: 0,
  user: null
};
const ACTION_HANDLERS = {
  [CHANGE_ASIDE_TAB]: (state, action) => ({
    ...state,
    asideTabIndex: action.payload
  }),
  [TOGGLE_ASIDE]: (state, action) => ({
    ...state,
    asideExpanded: !state.asideExpanded
  }),
  [FETCH_USER]: (state, action) => ({
    ...state,
    user: action.payload
  })
};


// Root Reducer
export function reducers(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

export default reducers;
