import api from '../api';
import { showAlert } from 'gabsocial/actions/alerts';
import { fetchMe } from 'gabsocial/actions/me';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAIL    = 'AUTH_REGISTER_FAIL';

export function createAuthApp() {
  return (dispatch, getState) => {
    const appToken = getState().getIn(['auth', 'app', 'access_token']);
    if (appToken) return new Promise(_ => _()); // Skip for now, FIXME: call verify_credentials
    return api(getState).post('/api/v1/apps', {
      // TODO: Add commit hash to client_name
      client_name: `SoapboxFE_${(new Date()).toISOString()}`,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow push admin',
    }).then(response => {
      dispatch(authAppCreated(response.data));
    }).then(() => {
      const app = getState().getIn(['auth', 'app']);
      return api(getState).post('/oauth/token', {
        client_id: app.get('client_id'),
        client_secret: app.get('client_secret'),
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        grant_type: 'client_credentials',
      });
    }).then(response => {
      dispatch(authAppAuthorized(response.data));
    });
  };
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    return api(getState).post('/oauth/token', {
      client_id: app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'password',
      username: username,
      password: password,
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    }).catch((error) => {
      dispatch(showAlert('Login failed.', 'Invalid username or password.'));
      throw error;
    });
  };
}

export function logOut() {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_LOGGED_OUT });
    dispatch(showAlert('Successfully logged out.', ''));
  };
}

export function register(params) {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_REGISTER_REQUEST });
    return api(getState).post('/api/v1/accounts', params).then(response => {
      dispatch({ type: AUTH_REGISTER_SUCCESS, token: response.data });
      dispatch(authLoggedIn(response.data));
      dispatch(fetchMe());
    }).catch(error => {
      dispatch({ type: AUTH_REGISTER_FAIL, error });
    });
  };
}

export function authAppCreated(app) {
  return {
    type: AUTH_APP_CREATED,
    app,
  };
}

export function authAppAuthorized(app) {
  return {
    type: AUTH_APP_AUTHORIZED,
    app,
  };
}

export function authLoggedIn(user) {
  return {
    type: AUTH_LOGGED_IN,
    user,
  };
}
