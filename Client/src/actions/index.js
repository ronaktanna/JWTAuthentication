import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE } from './types';

const ROOT_URL = `http://localhost:6090`;

export function signInUser({ email, password }, callback) {

  // Since redux-thunk is installed as a middleware, instead of
  // returning an object(action) from an action creator, we return a function that gets the dispatch
  // function as an argument. dispatch is the method inside of redux
  // that accepts an actions and forwards it off to all the different reducers in our application
  
  /* Redux thunk allows us to have multiple actions. We can have as many as we want. */
  return function(dispatch) {
  // Submit email/password to server
  axios.post(`${ROOT_URL}/signin`, { email, password })
    .then(response => {
      // The request is good...

      // - Update state to indicate user is authenticated
      dispatch({ type: AUTH_USER })
      // - Save the JWT
      localStorage.setItem('token', response.data.token);
      // - redirect to the route '/feature'
      callback();
    })
    .catch((e) => {
      // The request is bad...
      // - Show an error to the user
      dispatch(authError('Bag login info'));
    });

  }

}

export function authError(error) {
  return {
    type: AUTH_ERROR, 
    payload: error
  }
}

export function signOutUser() {
    localStorage.removeItem('token');
    return { type: UNAUTH_USER };
}

export function signUpUser({ email, password }, callback) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
    .then(response => {
      dispatch({ type: AUTH_USER });
      localStorage.setItem('token', response.data.token );
      callback();
    })
    .catch(response => {
      dispatch(authError('Email in use'))});
  }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}`, {
      headers: { authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
  }
}