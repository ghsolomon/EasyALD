import axios from 'axios';
import history from '../history';

const TOKEN = 'token';

// action types:

const SET_AUTH = 'SET_AUTH';

// action creators:

const setAuth = (auth) => ({ type: SET_AUTH, auth });

// thunk creators:

export const getUser = () => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN);
  if (token) {
    const { data: user } = await axios.get('/auth/user', {
      headers: { authorization: token },
    });
    return dispatch(setAuth(user));
  }
};

export const authenticate =
  (username, password, method) => async (dispatch) => {
    try {
      const res = await axios.post(`/auth/${method}`, { username, password });
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(getUser());
    } catch (authError) {
      return dispatch(setAuth({ error: authError }));
    }
  };

export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push('/login');
  return {
    type: SET_AUTH,
    auth: {},
  };
};

// reducer:

export default (state = {}, action) => {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
};
