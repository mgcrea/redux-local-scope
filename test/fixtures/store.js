
// Types
const CHANGE_ASIDE_TAB = 'CHANGE_ASIDE_TAB';
const TOGGLE_ASIDE = 'TOGGLE_ASIDE';
export const types = {
  CHANGE_ASIDE_TAB,
  TOGGLE_ASIDE
};

// Actions
export const actions = {
  changeAsideTab: payload => ({type: CHANGE_ASIDE_TAB, payload}),
  toggleAside: payload => ({type: TOGGLE_ASIDE, payload})
};

// Action Handlers
export const initialState = {
  asideExpanded: true,
  asideTabIndex: 0
};
const ACTION_HANDLERS = {
  [CHANGE_ASIDE_TAB]: (state, action) => ({
    ...state,
    asideTabIndex: action.payload
  }),
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

export default reducers;
