import axios from 'axios';

// action types:
const SET_TYPES = 'SET_TYPES';

// action creators:
const _setTypes = (types) => ({ type: SET_TYPES, types });

// thunk creators:
export const fetchTypes = (projectId) => async (dispatch) => {
  const { data: types } = await axios.get(`/api/projects/${projectId}/types`);
  dispatch(_setTypes(types));
};

// reducer:
const initialState = [];
const types = (state = initialState, action) => {
  switch (action.type) {
    case SET_TYPES:
      return action.types;
    default:
      return state;
  }
};

export default types;
