import React, { Component } from 'react';

class SavedVideos extends Component {

	render() {
		return (
			<div className="saved-videos">
		      { this.props.videos &&
		      		Object.keys(this.props.videos).map((key, i) => {
		      			return (
		      				{ (i % 3) == 0 && <div className="row"> }
		      				<div className="col-md-4" key={key}>
		      					<img src={this.props.videos[key].image} alt={this.props.videos[key].title} />
		      					<p>{this.props.videos[key].title}</p> 
		      				</div>
		      				{ (i % 3) == 0 && </div> }
		      			);
		      		})
		      }
			</div>
		);
	}
}

export default SavedVideos;