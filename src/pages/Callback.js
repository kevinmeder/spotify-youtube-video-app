import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Callback extends Component {

	constructor(props) {
		super(props);

		this.state = {
			authorized: false,
			error: false,
			errorMessage: ''
		};

		this.getAuth = this.getAuth.bind(this);
	}

	componentWillMount() {
		// Parse callback code from URL
		var code = this.props.location.search.replace('?code=', '');
		this.getAuth(code);
	}

	// Retrieve tokens from backend server
	getAuth(code) {
		axios({
		  method: 'post',
		  url: (process.env.NODE_ENV !== 'production') ? 'http://localhost:3200/authorize' : 'https://spotitubes.com/server/authorize',
		  data: {
		    code: code,
		  }
		})
		.then((response) => {
			document.cookie = 'access_token=' + response.data.access_token;
			document.cookie = 'refresh_token=' + response.data.refresh_token;

			this.setState({
				authorized: true
			});
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	
	render() {

		if(this.state.authorized) {
	      return (
	        <Redirect to="/" />
	      )
	    }

	    return (
	      <div className="container">
	        {this.state.error && <p>There was an error.</p>}
	      </div>
	    );
	}
}

export default Callback;