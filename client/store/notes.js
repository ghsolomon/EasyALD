import axios from 'axios';

// action types:
const SET_NOTES = 'SET_NOTES';
const ADD_TYPE = 'ADD_TYPE_TO_NOTE';
const REMOVE_TYPE = 'REMOVE_TYPE_FROM_NOTE';
const SET_TYPE_STATUS = 'SET_TYPE_STATUS';

// action creators:
const _setNotes = (notes) => ({ type: SET_NOTES, notes });
const _addType = (notesTypes) => ({
  type: ADD_TYPE,
  notesTypes,
});
const _removeType = (noteId, typeId) => ({ type: REMOVE_TYPE, noteId, typeId });
const _setTypeStatus = (noteId, typeId, isComplete) => ({
  type: SET_TYPE_STATUS,
  noteId,
  typeId,
  isComplete,
});

// thunk creators:
export const fetchNotes = (projectId) => async (dispatch) => {
  try {
    const { data: notes } = await axios.get(`/api/projects/${projectId}/notes`);
    dispatch(_setNotes(notes));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

export const addTypeToNote =
  (projectId, noteId, typeId) => async (dispatch) => {
    try {
      const { data: notesTypes } = await axios.post(
        `/api/projects/${projectId}/notes/${noteId}/types`,
        { typeId }
      );
      dispatch(_addType(notesTypes));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

export const removeTypeFromNote =
  (projectId, noteId, typeId) => async (dispatch) => {
    try {
      await axios.delete(
        `/api/projects/${projectId}/notes/${noteId}/types/${typeId}`
      );
      dispatch(_removeType(noteId, typeId));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

export const setTypeStatus =
  (projectId, noteId, typeId, isComplete) => async (dispatch) => {
    try {
      await axios.put(
        `/api/projects/${projectId}/notes/${noteId}/types/${typeId}`,
        { isComplete }
      );
      dispatch(_setTypeStatus(noteId, typeId, isComplete));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

// reducer:
const initialState = [];
const notes = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return action.notes;
    case SET_TYPE_STATUS:
      return state.map((note) =>
        note.id !== action.noteId
          ? note
          : {
              ...note,
              notesTypes: note.notesTypes.map((notesType) =>
                notesType.typeId !== action.typeId
                  ? notesType
                  : { ...notesType, isComplete: action.isComplete }
              ),
            }
      );
    case ADD_TYPE:
      return state.map((note) =>
        note.id !== action.notesTypes[0].noteId
          ? note
          : { ...note, notesTypes: action.notesTypes }
      );
    case REMOVE_TYPE:
      return state.map((note) =>
        note.id !== action.noteId
          ? note
          : {
              ...note,
              notesTypes: note.notesTypes.filter(
                (notesType) => notesType.typeId !== action.typeId
              ),
            }
      );
    default:
      return state;
  }
};

export default notes;
