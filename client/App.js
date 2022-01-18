import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Routes from './Routes';

const App = ({ activeProject }) => {
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

export default connect(mapState)(App);
