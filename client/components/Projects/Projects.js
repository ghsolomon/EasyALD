import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProject, fetchProjects } from '../../store';

const Projects = ({ projects, fetchProjects, fetchProject }) => {
  useEffect(() => fetchProjects(), []);
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <button onClick={() => fetchProject(project.id)}>
            {project.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

const mapState = (state) => ({
  projects: state.projects,
});
const mapDispatch = (dispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchProject: (projectId) => dispatch(fetchProject(projectId)),
});
export default connect(mapState, mapDispatch)(Projects);
