// action types:
const ACTION_TYPE = 'ACTION_TYPE';

// action creators:
export const actionType = (payload) => ({ type: ACTION_TYPE, payload });

// thunk creators:
export const thunk = () => async (dispatch) => {
  dispatch(actionType());
};

// reducer:
const initialState = {};
const reducerTemplate = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducerTemplate;
