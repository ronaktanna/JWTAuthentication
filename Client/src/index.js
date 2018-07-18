import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import App from './components/app';
import RequireAuth from './components/require_auth';
import SignIn from './components/auth/signin';
import SignOut from './components/auth/signout';
import Header from './components/header';
import Feature from './components/feature';

import SignUp from './components/auth/signup';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(logger, reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

if (token) {
  store.dispatch({type: AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path="/feature" component={RequireAuth(Feature)} />
          <Route path="/signout" component={SignOut} />
          <Route path="/signup" component={SignUp} />
          <Route path="/signin" component={SignIn} />
          <Route path="/" component={App} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('#root'));
