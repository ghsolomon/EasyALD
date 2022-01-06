import axios from 'axios';
import { setPositions } from './positions';

// action types:
const SET_LIGHTS = 'SET_LIGHTS';

// action creators:
const _setLights = (lights) => ({ type: SET_LIGHTS, lights });

// thunk creators:
export const fetchLights = (projectId) => async (dispatch) => {
  try {
    const { data: lights } = await axios.get(
      `/api/projects/${projectId}/lights`
    );
    dispatch(_setLights(lights));
    const positionsObj = {};
    lights.forEach((light) => {
      positionsObj[light.PosOrd] = light.Pos;
    });
    const positions = Object.keys(positionsObj)
      .map((posOrder) => ({ name: positionsObj[posOrder], posOrder }))
      .sort((a, b) => a.posOrder - b.posOrder)
      .filter((pos) => pos.name !== null);
    dispatch(setPositions(positions));
  } catch (error) {
    console.log(error);
  }
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
