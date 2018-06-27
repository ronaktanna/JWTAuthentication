import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit({ email, password }) {
    // Do the authentication
    this.props.signInUser({ email, password }, () => {
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

  renderField(field) {
    // Get the meta property off the field object.
    // Also, get the touched and error properties from the meta object that we just pulled off the field object.
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
      <label>{field.label}</label>
        <input
          {...field.input}
          className="form-control"
          type={field.type}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <Field
          component={this.renderField}
          label="Email"
          name="email"
          type="email"
        />
        <Field
          component={this.renderField}
          label="Password"
          name="password"
          type="password"
        />
        {this.renderAlert()}
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

export default reduxForm({
  form: 'signin',
  validate,
})(
  connect(mapStateToProps, actions)(SignIn)
);