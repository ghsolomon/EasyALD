import axios from 'axios';

// action types:
const SET_LIGHTS = 'SET_LIGHTS';

// action creators:
const _setLights = (lights) => ({ type: SET_LIGHTS, lights });

// thunk creators:
export const fetchLights = (projectId) => async (dispatch) => {
  const { data: lights } = await axios.get(`/api/projects/${projectId}/lights`);
  dispatch(_setLights(lights));
};

// reducer:
const initialState = [];
const lights = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIGHTS:
      return action.lights;
    default:
      return state;
  }
};

export default lights;
