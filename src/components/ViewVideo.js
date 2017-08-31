import React, { Component } from 'react';

class ViewVideo extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			source: 'https://www.youtube.com/embed/' + this.props.youtube.id + '?ecver=2',
			saved: false
		};

		this.saved = this.saved.bind(this);
		this.removed = this.removed.bind(this);
	}

	componentWillMount() {
		if(this.props.youtube.saved) {
			this.setState({
				saved: true
			});
		}
	}

	saved() {
		this.setState({
			saved: true
		});
	}

	removed() {
		this.setState({
			saved: false
		});
	}

	render() {
	    return (
			<div className="view-video">
				<div className="exit-bkgd" onClick={this.props.exitVideo}></div>
				<div className="video">
					<div className="options">
						<button onClick={this.props.exitVideo}><i className="ion-android-close"></i></button>
						{!this.state.saved && <button onClick={() => { this.props.saveVideo(this.props.youtube); this.saved(); }}><i className="ion-android-star-outline"></i></button>}
						{this.state.saved && <button onClick={() => { this.props.removeVideo(this.props.youtube); this.removed(); }}><i className="ion-android-star"></i></button>}
					</div>
					<iframe src={this.state.source} title="Current Video" width="640" height="360" frameBorder="0" className="youtube-iframe" allowFullScreen></iframe>
				</div>
			</div>
		);
	}
}

export default ViewVideo;