import axios from 'axios';

// action types:
const SET_NOTES = 'SET_NOTES';

// action creators:
const _setNotes = (notes) => ({ type: SET_NOTES, notes });

// thunk creators:
export const fetchNotes = (projectId) => async (dispatch) => {
  const { data: notes } = await axios.get(`/api/projects/${projectId}/notes`);
  dispatch(_setNotes(notes));
};

// reducer:
const initialState = [];
const notes = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return action.notes;
    default:
      return state;
  }
};

export default notes;
