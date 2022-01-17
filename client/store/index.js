import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import lights from './lights';
import types from './types';
import notes from './notes';
import positions from './positions';
import projects from './projects';
import activeProject from './activeProject';

const reducer = combineReducers({
  auth,
  lights,
  types,
  notes,
  positions,
  projects,
  activeProject,
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);

const store = createStore(reducer, middleware);

export default store;
export * from './auth';
export * from './lights';
export * from './types';
export * from './notes';
export * from './projects';
export * from './activeProject';
