import React, { Component } from 'react';
import * as firebase from 'firebase';

import ViewVideo from '../components/ViewVideo';

class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
			user_id: null,
			savedVideos: [],
			view_video: false,
			youtube: false
		};

		this.getSavedVideos = this.getSavedVideos.bind(this);
		this.viewVideo = this.viewVideo.bind(this);
		this.exitVideo = this.exitVideo.bind(this);
		this.removeVideo = this.removeVideo.bind(this);
	}

	componentWillMount() {
		// Check for whether user is logged in
		firebase.auth().onAuthStateChanged((user) => {
	      if (user) {

	        this.setState({
	          loggedIn: true,
	          user_id: user.uid
	        });

	        this.getSavedVideos();

	      } else {
	        this.setState({
	          loggedIn: false
	        });
	      }
	    });
	}

	// Retrieve saved videos
	getSavedVideos() {
		var ref = firebase.database().ref('videos/' + this.state.user_id);
		ref.on('value', (snapshot) => {
    		this.setState({
    			savedVideos: snapshot.val()
    		});
		});
	}

	// View saved video
	viewVideo(id, key) {
		this.setState({
			view_video: true,
			youtube: {
				id: id,
				key: key,
				saved: true
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
	
	render() {
	    return (
	      <div className="container">

	      	{ // Show the video player when video is selected
	      	this.state.view_video &&
	      		<ViewVideo exitVideo={this.exitVideo} removeVideo={this.removeVideo} youtube={this.state.youtube} />
	      	}

	      	<div className="media-videos">
	      		<div className="row">

			    	{ // Display saved list of videos
			      	this.state.savedVideos &&
			      		Object.keys(this.state.savedVideos).map((key, i) => {
			      			return <div className="col-md-4" key={key} onClick={() => this.viewVideo(this.state.savedVideos[key].video_id, key)}>
			      					<a >
				      					<img src={this.state.savedVideos[key].image} alt={this.state.savedVideos[key].title} />
				      					<p>{this.state.savedVideos[key].title}</p>
			      					</a>
			      				   </div>
			      		})
			    	}

		      	</div>
	      	</div>
	      </div>
	    );
	}
}

export default Home;
