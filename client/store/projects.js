import axios from 'axios';

// action types:
const SET_PROJECTS = 'SET_PROJECTS';

// action creators:
const _setProjects = (projects) => ({ type: SET_PROJECTS, projects });

// thunk creators:
export const fetchProjects = () => async (dispatch) => {
  try {
    const { data: projects } = await axios.get(`/api/projects`);
    dispatch(_setProjects(projects));
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
    default:
      return state;
  }
};

export default projects;
