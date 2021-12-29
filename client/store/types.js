import axios from 'axios';

// action types:
const SET_TYPES = 'SET_TYPES';
const ADD_TYPE = 'ADD_TYPE';
const DELETE_TYPE = 'DELETE_TYPE';

// action creators:
const _setTypes = (types) => ({ type: SET_TYPES, types });
const _addType = (typeObj) => ({ type: ADD_TYPE, typeObj });
const _deleteType = (typeObj) => ({ type: DELETE_TYPE, typeObj });

// thunk creators:
export const fetchTypes = (projectId) => async (dispatch) => {
  const { data: types } = await axios.get(`/api/projects/${projectId}/types`);
  dispatch(_setTypes(types));
};

export const addType = (type) => async (dispatch) => {
  try {
    const { data: newType } = await axios.post(
      `/api/projects/${type.projectId}/types`,
      type
    );
    dispatch(_addType(newType));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

export const updateTypes = (types) => async (dispatch) => {
  try {
    const { data: updatedTypes } = await axios.put(
      `/api/projects/${types[0].projectId}/types`,
      types
    );
    dispatch(_setTypes(updatedTypes));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

export const deleteType = (type) => async (dispatch) => {
  try {
    await axios.delete(`/api/projects/${type.projectId}/types/${type.id}`);
    dispatch(_deleteType(type));
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
    case DELETE_TYPE:
      return state.filter((type) => type.id !== action.typeObj.id);
    default:
      return state;
  }
};

export default types;
