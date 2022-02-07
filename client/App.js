import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Routes from './Routes';
import { fetchProject } from './store';
import { ACTIVE_PROJECT_ID } from './utils/constants';

const App = ({ activeProject, fetchProject }) => {
  useEffect(() => {
    const projectId = window.localStorage.getItem(ACTIVE_PROJECT_ID);
    fetchProject(projectId);
  }, []);
  useEffect(() => {
    if (activeProject.name) {
      document.title = `${activeProject.name} - EasyALD`;
    } else {
      document.title = `EasyALD`;
    }
  }, [activeProject]);
  return (
    <div id="app">
      <Navbar />
      <Routes />
    </div>
  );
};

const mapState = (state) => ({ activeProject: state.activeProject });

const mapDispatch = (dispatch) => ({
  fetchProject: (projectId) => dispatch(fetchProject(projectId)),
});

export default connect(mapState, mapDispatch)(App);
