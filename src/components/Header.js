import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <Link to="/" className="navbar-brand">Spotitubes</Link>
        { this.props.loggedIn && 
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><Link to="/saved" className="nav-link">Saved Videos</Link></li>
            </ul>
            <ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex">
              <Link to="/logout" className="nav-item nav-link">Log Out</Link>
            </ul>
          </div>
        }
      </nav>
    );
  }
}

export default Header;