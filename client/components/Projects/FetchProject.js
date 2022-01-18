import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchProject } from '../../store';

const FetchProject = ({ activeProject, fetchProject, match }) => {
  useEffect(
    () => fetchProject(match.params.projectId),
    [match.params.projectId]
  );
  return <></>;
};

const mapDispatch = (dispatch) => ({
  fetchProject: (projectId) => dispatch(fetchProject(projectId)),
});

export default connect(null, mapDispatch)(FetchProject);
