import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from "firebase";

class Logout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedIn: true,
			error: false,
			errorMessage: ''
		};
	}

	componentWillMount() {
		// Log current user out and delete all associated cookies
		firebase.auth().signOut().then(() => {
	      this.setState({
	          loggedIn: false
	      });
	      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	    }, function(error) {
	      	console.log(error);
	    });
	}
	
	render() {

		if(!this.state.loggedIn) {
	      return (
	        <Redirect to="/" />
	      )
	    }

	    return (
	      <div className="container">
	        {this.state.error && 
	        	<p>{this.state.errorMessage}</p>
	        }
	      </div>
	    );
	}
}

export default Logout;