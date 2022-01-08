import axios from 'axios';

// action types:
const SET_NOTES = 'SET_NOTES';
const UPDATE_NOTE = 'UPDATE_NOTE';
const REMOVE_TYPE = 'REMOVE_TYPE_FROM_NOTE';

// action creators:
const _setNotes = (notes) => ({ type: SET_NOTES, notes });
const _updateNote = (note) => ({
  type: UPDATE_NOTE,
  note,
});
const _removeType = (noteId, typeId) => ({ type: REMOVE_TYPE, noteId, typeId });

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
      const { data: note } = await axios.post(
        `/api/projects/${projectId}/notes/${noteId}/types`,
        { typeId }
      );
      dispatch(_updateNote(note));
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
      const { data: note } = await axios.put(
        `/api/projects/${projectId}/notes/${noteId}/types/${typeId}`,
        { isComplete }
      );
      dispatch(_updateNote(note));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

export const setNoteLightTypeComplete =
  (projectId, noteId, lightId, typeId, isComplete) => async (dispatch) => {
    try {
      const { data: note } = await axios.put(
        `/api/projects/${projectId}/notes/${noteId}/lights/${lightId}/types/${typeId}`,
        { isComplete }
      );
      dispatch(_updateNote(note));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

export const updateNote = (note) => async (dispatch) => {
  try {
    const { data: updatedNote } = await axios.put(
      `/api/projects/${note.projectId}/notes/${note.id}`,
      note
    );
    dispatch(_updateNote(updatedNote));
  } catch (error) {
    console.log(error.response.status, error.response.data);
  }
};

export const addLightsToNote =
  (projectId, noteId, lightIds) => async (dispatch) => {
    try {
      const { data: updatedNote } = await axios.post(
        `/api/projects/${projectId}/notes/${noteId}/lights`,
        lightIds
      );
      dispatch(_updateNote(updatedNote));
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };

export const removeLightsFromNote =
  (projectId, noteId, lightIds) => async (dispatch) => {
    try {
      const { data: updatedNote } = await axios.post(
        `/api/projects/${projectId}/notes/${noteId}/lights/remove`,
        lightIds
      );
      dispatch(_updateNote(updatedNote));
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
    case UPDATE_NOTE:
      return state.map((note) =>
        note.id !== action.note.id ? note : action.note
      );
    case REMOVE_TYPE:
      return state.map((note) =>
        note.id !== action.noteId
          ? note
          : {
              ...note,
              noteTypes: note.noteTypes.filter(
                (noteType) => noteType.typeId !== action.typeId
              ),
            }
      );
    default:
      return state;
  }
};

export default notes;
