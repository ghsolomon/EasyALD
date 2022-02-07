import axios from 'axios';
import { ACTIVE_PROJECT_ID } from '../utils/constants';

// action types:
const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT';

// action creators:
const _setActiveProject = (project) => ({
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

export const setActiveProject = (project) => async (dispatch) => {
  window.localStorage.setItem(ACTIVE_PROJECT_ID, project.id);
  dispatch(_setActiveProject(project));
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
