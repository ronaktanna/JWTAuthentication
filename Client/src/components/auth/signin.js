import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as actions from '../../actions';

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit = formProps => {
    this.props.signin(formProps, () => {
      this.props.history.push('/feature');
    });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong> Oops! </strong> {this.props.errorMessage}
        </div>
      )
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <Field
          component="input"
          label="Email"
          name="email"
          type="email"
        />
        <Field
          component="input"
          label="Password"
          name="password"
          type="password"
        />
        <div> { this.props.errorMessage } </div>
        <button className="btn btn-primary" type="submit"> Sign In </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Enter an email!";
  }
  if (!values.password) {
    errors.password = "Enter a password";
  }
  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signin', validate })
)(SignIn);