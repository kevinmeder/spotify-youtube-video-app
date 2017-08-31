import React, { Component } from 'react';
import axios from 'axios';
import * as firebase from 'firebase';

import Connect from '../components/Connect';
import Track from '../components/Track';
import ViewVideo from '../components/ViewVideo';

class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedIn: null,
			user_id: null,
			authorized: null,
			access_token: '',
			time_options: ['short_term', 'medium_term', 'long_term'],
			time_range: 'short_term',
			results: [],
			saved: [],
			limit: 24,
			offset: 0,
			view_video: false,
			view_more: true
		};

		this.getUserTracks = this.getUserTracks.bind(this);
		this.viewMoreSongs = this.viewMoreSongs.bind(this);
		this.viewVideo = this.viewVideo.bind(this);
		this.exitVideo = this.exitVideo.bind(this);
		this.saveVideo = this.saveVideo.bind(this);
		this.removeVideo = this.removeVideo.bind(this);
		this.changeTime = this.changeTime.bind(this);
	}

	// Check for whether user is logged in
	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
	      if (user) {

	      	// Retrieve and check stored access token
	      	let access_token = this.getCookie('access_token');
	      	let authorized = (access_token && access_token.length > 0) ? true : false;

	        this.setState({
	          loggedIn: true,
	          authorized: authorized,
	          access_token: access_token,
	          user_id: user.uid
	        });

	        // Retrieve saved videos if user is connected to Spotify
	        if(this.state.authorized){
	        	var ref = firebase.database().ref('videos/' + this.state.user_id);
				ref.on('value', (snapshot) => {
		    		this.setState({
		    			saved: snapshot.val()
		    		});

		    		// Retrieve top spotify tracks to cross reference with saved videos
		    		this.getUserTracks();
				});
	        }

	      } else {
	        this.setState({
	          loggedIn: false
	        });
	      }
	    });
	}

	// Retrieve cookies for Spotify tokens 
	getCookie(name) {
		let value = "; " + document.cookie;
		let parts = value.split("; " + name + "=");
		if (parts.length === 2) return parts.pop().split(";").shift();
	} 

	// View selected video
	viewVideo(id, title, image, spotify_id) {
		this.setState({
			view_video: true,
			youtube: {
				id: id,
				title: title,
				image: image,
				spotify_id: spotify_id
			}
		});
	}

	// Close video player
	exitVideo() {
		this.setState({
			view_video: false,
			youtube: false
		});
	}

	// Save video to saved list
	saveVideo(youtube) {
		console.log(youtube);
		if(youtube.id && youtube.spotify_id){
			firebase.database().ref('videos/' + this.state.user_id).push({
				video_id: youtube.id,
				title: youtube.title,
				image: youtube.image,
				spotify_id: youtube.spotify_id
			});
		}else{
			console.log("error" + youtube.length);
		}
	}

	// Remove video from saved list
	removeVideo(youtube) {
		var ref = firebase.database().ref('videos/' + this.state.user_id + '/' + youtube.key);
		ref.remove().then(() => {
			this.setState({
				view_video: false,
				youtube: false
			});
		})
		.catch(function(error) {
			console.log("Remove failed: " + error.message)
		});
	}


	// Retrieve top user tracks from Spotify API
	getUserTracks() {

		let nextPage = false;

		if(this.state.results.length > 0){
			nextPage = true;
		}

		axios({
		  method: 'GET',
		  url: 'https://api.spotify.com/v1/me/top/tracks',
		  headers: {
		  	'Authorization': 'Bearer ' + this.state.access_token
		  },
		  params: {
		  	'limit': this.state.limit,
		  	'offset': this.state.offset,
		  	'time_range': this.state.time_range
		  }
		})
		.then((response) => {

			// Check for whether these are new items or items added to current list
			let items = (nextPage) ? this.state.results.concat(response.data.items) : response.data.items;
			let offset = this.state.offset + this.state.limit;

			// If results are less than the current limit, hide "View More" button
			let view_more = (response.data.items.length < this.state.limit) ? false : true;

			this.setState({
				results: items,
				offset: offset,
				view_more: view_more
			});
		})
		.catch((error) => {

			let refresh_token = this.getCookie('refresh_token');


			// If access token is invalid but refresh token exists
	      	if (refresh_token && refresh_token.length > 0) { 
	      		this.getAccessToken(refresh_token);
	      	} else {
	      		// No refresh token exists
	      		this.setState({
					authorized: false,
					access_token: '',
				});
	      	}
		});
	}

	// Scrolling view more button
	viewMoreSongs() {
		this.getUserTracks();
	}

	// Change the Spotify top tracks time range
	changeTime(time_range) {
		if(time_range !== this.state.time_range){
			this.setState({
				results: [],
				time_range: time_range,
				offset: 0,
				view_more: true
			}, () => {
				this.getUserTracks();
			});
		}
	}


	// Retrieve access token from backend server
	getAccessToken(refresh_token) {
		let url = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3200/refresh' : 'https://spotitubes.com/server/refresh';
		axios({
		  method: 'POST',
		  url: url,
		  data: {
		  	'refresh_token': refresh_token
		  }
		})
		.then((response) => {
			console.log(response.data);
			if(response.data.access_token){
				document.cookie = 'access_token=' + response.data.access_token;

				this.setState({
					authorized: true,
					access_token: response.data.access_token
				});

				var ref = firebase.database().ref('videos/' + this.state.user_id);
				ref.on('value', (snapshot) => {
		    		this.setState({
		    			saved: snapshot.val()
		    		});
		    		this.getUserTracks();
				});
			}
		})
		.catch((error) => {
			console.log(error);
			this.setState({
				authorized: false,
				access_token: '',
			});
			console.log(error);
		});
	}
	
	render() {
	    return (
	      <div className="container-fluid albums">

	      	{ // Show the video player when video is selected
	      	this.state.view_video && 
	      		<ViewVideo exitVideo={this.exitVideo} saveVideo={this.saveVideo} removeVideo={this.removeVideo} youtube={this.state.youtube} />
	      	}

	        { // If user is not logged
	        (this.state.loggedIn === false || this.state.authorized === false) && 
	        	<Connect loggedIn={this.state.loggedIn} authorized={this.state.authorized} />
	        }

	        { // Show time range tabs if user is logged in and connected to Spotify
	        this.state.loggedIn && this.state.authorized && 
	        	<div style={{ margin: '15px'}}>
					<h4 style={{ textAlign: 'center' }}>Your Top Songs</h4>
		        	<ul className="nav nav-pills nav-fill">
				        { this.state.time_options.map((data, i) => {
				        	let className = 'btn btn-link nav-item nav-link';
				        	className += (data === this.state.time_range) ? ' active' : '';
				        	let displayName = (i === 0) ? 'Past 2 Weeks' : (i === 1) ? 'Past Month' : 'Past 6 Months' ;
				        	return <button key={i} className={className} onClick={() => this.changeTime(data)}>{displayName}</button>
				           })
				    	}
			    	</ul>
		    	</div>
	        }

	        <div className="media-list">

	      	{ // Show results of youtube search
	      	this.state.results && 
	      		this.state.results.map((data, i) => {
	      			let saved = false;
	      			Object.keys(this.state.saved).map((key, i) => {
	      				if(this.state.saved[key].spotify_id === data.id){
	      					saved = true;
	      					return;
	      				}

	      			});
	      			return <Track track={data} saved={saved} viewVideo={this.viewVideo} key={i} />
	      		})
	      	}

	      	</div>

	      	{ // Show view more button 
	      	this.state.results.length > 0 && this.state.view_more &&
	      		<div style={{ margin: '15px' }}><button className="btn btn-primary btn-lg btn-block" onClick={this.viewMoreSongs}>View More Songs</button></div>
	      	}
	      </div>
	    );
	}
}

export default Home;
