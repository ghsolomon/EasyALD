import axios from 'axios';

// action types:
const SET_POSITIONS = 'SET_POSITIONS';

// action creators:
export const setPositions = (positions) => ({ type: SET_POSITIONS, positions });

// reducer:
const initialState = [];
const positions = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSITIONS:
      return action.positions;
    default:
      return state;
  }
};

export default positions;
