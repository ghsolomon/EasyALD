import React from 'react';
import { connect } from 'react-redux';

export const Home = (props) => {
  const { username } = props;

  return (
    <div className="home-container">
      <h3>Welcome to EasyALD, {username}!</h3>
      <p>Use the nav-bar above to get started!</p>
    </div>
  );
};

const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
