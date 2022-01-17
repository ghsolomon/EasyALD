import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchProjects } from '../../store';

const Projects = ({ projects, fetchProjects }) => {
  useEffect(() => fetchProjects(), []);
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
};

const mapState = (state) => ({
  projects: state.projects,
});
const mapDispatch = (dispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
});
export default connect(mapState, mapDispatch)(Projects);
