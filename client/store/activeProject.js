import axios from 'axios';

// action types:
const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT';

// action creators:
export const setActiveProject = (project) => ({
  type: SET_ACTIVE_PROJECT,
  project,
});

// thunk creators:
export const fetchProject = (projectId) => async (dispatch) => {
  try {
    const { data: project } = await axios.get(`/api/projects/${projectId}`);
    dispatch(setActiveProject(project));
  } catch (error) {
    console.log(error);
  }
};
// reducer:
const activeProject = (state = {}, action) => {
  switch (action.type) {
    case SET_ACTIVE_PROJECT:
      return action.project;
    default:
      return state;
  }
};

export default activeProject;
