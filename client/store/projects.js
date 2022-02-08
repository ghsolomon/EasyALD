import axios from 'axios';
import { setActiveProject } from '.';

// action types:
const SET_PROJECTS = 'SET_PROJECTS';
const ADD_PROJECT = 'ADD_PROJECT';

// action creators:
const _setProjects = (projects) => ({ type: SET_PROJECTS, projects });
const _addProject = (project) => ({ type: ADD_PROJECT, project });

// thunk creators:
export const fetchProjects = () => async (dispatch) => {
  try {
    const { data: projects } = await axios.get(`/api/projects`);
    dispatch(_setProjects(projects));
  } catch (error) {
    console.log(error);
  }
};

export const addProject = (project) => async (dispatch) => {
  try {
    const { data: newProject } = await axios.post('/api/projects', project);
    dispatch(_addProject(newProject));
    dispatch(setActiveProject(newProject));
  } catch (error) {
    console.log(error);
  }
};

// reducer:
const initialState = [];
const projects = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.projects;
    case ADD_PROJECT:
      return [...state, action.project];
    default:
      return state;
  }
};

export default projects;
