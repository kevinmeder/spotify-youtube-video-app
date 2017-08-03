import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from "firebase";

class Login extends Component {

  constructor(props) {
  	super(props);

  	this.state = {
  		loggedIn: false,
  		email: '',
  		password: '',
  		error: false,
        errorMessage: ''
  	};

  	this.handleInputChange = this.handleInputChange.bind(this);
  	this.handleSubmit = this.handleSubmit.bind(this);

  	firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
        	loggedIn: true
        });
      }
    });

  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
  	event.preventDefault();
  	if(this.state.email && this.state.password){
  		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
		  this.setState({
		  	error: true,
		  	errorMessage: error.message
		  });
		});
  	}
  }

  render() {

  	if(this.state.loggedIn) {
      return (
        <Redirect to="/dashboard"/>
      )
    }

    return (
      <div className="container">
        <h1>Login</h1>
        {this.state.error && <p className="bg-danger" style={{ padding: 15 }}>{this.state.errorMessage}</p>}
        <div className="well">
        	<form onSubmit={this.handleSubmit}>
			  <div className="form-group">
			    <label>Email address</label>
			   	<input type="email" name="email" className="form-control" value={this.state.email} onChange={this.handleInputChange} placeholder="Email" />
			  </div>
			  <div className="form-group">
			    <label>Password</label>
			    <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleInputChange} placeholder="Password" />
			  </div>
			  <button type="submit" className="btn btn-default">Submit</button>
			</form>
		</div>
      </div>
    );
  }
}

export default Login;