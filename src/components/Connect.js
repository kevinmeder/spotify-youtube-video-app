import React, { Component } from 'react';
import * as firebase from 'firebase';

const provider = new firebase.auth.FacebookAuthProvider();

const SPOTIFY_KEYS = {
	client_id: '3701baeb580b4d11a09e4201254085b4',
	redirect_url: (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000/callback' : 'https://spotitubes.com/callback'
};

class Connect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
			authorized: false,
			authUrl: ''		
		};

		if(this.props.loggedIn){
			this.setState({ loggedIn: true });
		}

		this.buildSpotifyUrl = this.buildSpotifyUrl.bind(this);
		this.facebookLogin = this.facebookLogin.bind(this);
	}

	componentWillMount() {

		this.buildSpotifyUrl();
	}

	// Build link for "Spotify Connect" button
	buildSpotifyUrl() {
		let base_url = 'https://accounts.spotify.com/authorize';
		let response_type = 'code';
		let scope = 'user-top-read user-library-read';

		let url = base_url + '?response_type=' + response_type + '&client_id=' + SPOTIFY_KEYS.client_id + '&scope=' + encodeURIComponent(scope) + '&redirect_uri=' + encodeURIComponent(SPOTIFY_KEYS.redirect_url)
	
		this.setState({ authUrl: url });
	}

	// Facebook login popup
	facebookLogin() {
		firebase.auth().signInWithPopup(provider).then((result) => {
		  this.setState({
		  	loggedIn: true
		  });
		}).catch(function(error) {
		  console.log(error);
		});
	}

	render() {
		return (
			<div className="row" style={{ marginTop: '20px' }}>
				<div className="col-md-6" style={{ textAlign: 'center' }}>
					<h2>1. Log in with facebook</h2>
					<p className="home-icon facebook"><i className="fa fa-facebook-square" aria-hidden="true"></i></p>
					{!this.props.loggedIn && <button onClick={this.facebookLogin} className="btn btn-primary">Log In with Facebook</button>}
					{this.props.loggedIn && <p style={{ color: '#4CAF50', fontSize: '24px' }}><i className="ion-android-checkmark-circle" style={{ marginRight: '5px' }}></i> Connected</p>}
				</div>
				<div className="col-md-6" style={{ textAlign: 'center' }}>
					<h2>2. Log In with Spotify</h2>
					<p className="home-icon spotify"><i className="fa fa-spotify" aria-hidden="true"></i></p>
					{!this.props.authorized && <a href={this.state.authUrl} className="btn btn-primary">Connect to Spotify</a>}
				</div>
			</div>
		);
	}
}

export default Connect;