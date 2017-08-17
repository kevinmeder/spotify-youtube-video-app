import React, { Component } from 'react';

class NotFound extends Component {

	render() {
		return (
			<div className="container">
				<p style={{ textAlign: 'center', fontSize: '80px', fontWeight: '900'}}>404</p>
				<p style={{ textAlign: 'center', fontSize: '24px'}}>Page Does Not Exist</p>
			</div>
		);
	}

}

export default NotFound;