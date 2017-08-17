import React, { Component } from 'react';
import * as youtubeSearch from 'youtube-search';

const YOUTUBE_API_KEY = 'AIzaSyAsUl6Z9O2DBODbu1uNnnnfeocGSHMUQ6Y';

class Track extends Component {

	constructor(props) {
		super(props);

		this.state = {
			videos: []
		};

		this.searchYoutube = this.searchYoutube.bind(this);
	}

	// YouTube API search
	searchYoutube(term) {

		let opts: youtubeSearch.YouTubeSearchOptions = {
		  maxResults: 4,
		  key: YOUTUBE_API_KEY
		};

		youtubeSearch(term, opts, (err, results) => {
			if(err) return console.log(err);

			this.setState({
				videos: results
			});
		});
	}

	render() {
		var albumImage = "";
		
		// Display album cover if image exists
		if(this.props.track.album.images[1].url.length > 0) {
			albumImage = <a><img className="d-flex mr-3" src={this.props.track.album.images[1].url} alt={this.props.track.album.name} style={{ width: '100px' }} /></a>
		}

		return (
			<div className="media">
			  { albumImage }
			  <div className="media-body">
			  	<div className="row">
			  		<div className="col-md-8">
			  			<h4 className="media-heading">{this.props.track.name}</h4>
			  			<p>
					    {this.props.track.artists.map((data, i) => {
					    		// Display commas between artist names
					    		let comma = (i !== 0) ? ', ' : '';
					    		return <span key={i} className="artist-name">{ `${comma} ${data.name}` }</span>
					   	 	}
					    )}
					    </p>
			  		</div>
			  		<div className="col-md-4">

			  		{ // Display "Search Youtube" button if video for song is not already saved
			  		!this.props.saved && this.state.videos.length === 0 &&
					  	<button className="btn btn-primary" style={{ float: 'right' }} onClick={() => this.searchYoutube(this.props.track.name + ' ' + this.props.track.artists[0].name)}>Search Youtube</button>
					}

					{ // If video for song is saved
					this.props.saved &&
						<button className="btn btn-success disabled" style={{ float: 'right' }}>Saved</button>
					}
			  		</div>
			  	</div>
			  	<div className="row media-videos">

				  	{ // Displays 4 video results
				  	this.state.videos.length > 0 && 
				  		this.state.videos.map((data, i) =>
				  			<div key={i} className="col-md-3 col-sm-6">
				  				<a onClick={() => this.props.viewVideo(data.id, data.title, data.thumbnails.medium.url, this.props.track.id)}>
					  				<img src={data.thumbnails.medium.url} alt={data.title} />
					  				<p>{data.title}</p>
					  			</a>
				  			</div>
				  		)
				  	}

				</div>
			  </div>
			</div>
		);
	}
}

export default Track;