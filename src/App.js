import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

import * as firebase from "firebase";

import './App.css';

var config = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  storageBucket: "<BUCKET>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: []
    };

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          user: user.email
        });
      } else {
        console.log("Logged Out");
      }
    });

    this.logOut = this.logOut.bind(this);
  }

  logOut(event) {
    event.preventDefault();
    firebase.auth().signOut().then(() => {
      this.setState({
          loggedIn: false,
          user: []
      });
    }, function(error) {
      // An error happened.
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand">Logo</Link>
            </div>
            <div className="collapse navbar-collapse">
              { this.state.loggedIn && 
                <ul className="nav navbar-nav navbar-right">
                  <li><Link to="/dashboard">{this.state.user}</Link></li> 
                  <li><a onClick={this.logOut}>Log Out</a></li>
                </ul>
              }
              { !this.state.loggedIn && 
                <ul className="nav navbar-nav navbar-right">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li> 
                </ul>
              }
            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/login' component={Login}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/dashboard' component={Dashboard}/>
        </Switch>
      </div>
    );
  }
}

export default App;
