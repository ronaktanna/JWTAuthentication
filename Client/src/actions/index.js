import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types';

const ROOT_URL = `http://localhost:6090`;

export const signin = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(`${ROOT_URL}/signin`, formProps);

    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('token', response.data.token);
    callback();
  } catch(e) {
    dispatch(authError('Invalid Login Credentials'));
  }
};

export const signout = () => {
  localStorage.removeItem('token');
  return {
    type: AUTH_USER,
    payload: ''
  }
}

export const signup = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(`${ROOT_URL}/signup`, formProps);

    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('token', response.data.token);
    callback();
  } catch (e) {
    dispatch(authError('Email already in use'));
  }
}

export const fetchmessage = () => async dispatch => {
  try {
    const response = await axios.get(`${ROOT_URL}`, { headers: { authorization: localStorage.getItem('token') }});

    dispatch({ type: FETCH_MESSAGE, payload: response.data.message })
  } catch (e) {
    dispatch(authError('You are unauthorized to access this resource.'));
  }
}

/**
 * @private
 * @param {String} error 
 */
function authError(error) {
  return {
    type: AUTH_ERROR, 
    payload: error
  }
}