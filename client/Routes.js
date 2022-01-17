import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import { Lights } from './components/Lights';
import { Notes } from './components/Notes';
import { TypesForm } from './components/Types';
import { getUser } from './store';
import { Projects } from './components/Projects';

class Routes extends React.Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div id="content">
        {isLoggedIn ? (
          <>
            <Route path="/projects/:projectId">PROJECT BAR HERE</Route>
            <Switch>
              <Route exact path="/projects" component={Projects} />
              <Route path="/home" component={Home} />
              <Route path="/projects/:projectId/lights" component={Lights} />
              <Route path="/projects/:projectId/types" component={TypesForm} />
              <Route path="/projects/:projectId/notes" component={Notes} />
              <Redirect to="/home" />
            </Switch>
          </>
        ) : (
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(getUser());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
