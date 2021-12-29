import axios from 'axios';

// action types:
const SET_TYPES = 'SET_TYPES';
const ADD_TYPE = 'ADD_TYPE';

// action creators:
const _setTypes = (types) => ({ type: SET_TYPES, types });
const _addType = (typeObj) => ({ type: ADD_TYPE, typeObj });

// thunk creators:
export const fetchTypes = (projectId) => async (dispatch) => {
  const { data: types } = await axios.get(`/api/projects/${projectId}/types`);
  dispatch(_setTypes(types));
};

export const addType = (projectId, type) => async (dispatch) => {
  try {
    const { data: newType } = await axios.post(
      `/api/projects/${projectId}/types`,
      type
    );
    dispatch(_addType(newType));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

export const updateTypes = (projectId, types) => async (dispatch) => {
  try {
    const { data: updatedTypes } = await axios.put(
      `/api/projects/${projectId}/types`,
      types
    );
    dispatch(_setTypes(updatedTypes));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

// reducer:
const initialState = [];
const types = (state = initialState, action) => {
  switch (action.type) {
    case SET_TYPES:
      return action.types;
    case ADD_TYPE:
      return [...state, action.typeObj];
    default:
      return state;
  }
};

export default types;
