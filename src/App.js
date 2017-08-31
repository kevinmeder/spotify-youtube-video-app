import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import Home from './pages/Home';
import Saved from './pages/Saved';
import Callback from './pages/Callback';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';

import Header from './components/Header';

import * as firebase from "firebase";

import './App.css';

var config = {
  apiKey: "AIzaSyAsUl6Z9O2DBODbu1uNnnnfeocGSHMUQ6Y",
  authDomain: "youtube-search-4cf4d.firebaseapp.com",
  databaseURL: "https://youtube-search-4cf4d.firebaseio.com",
  projectId: "youtube-search-4cf4d",
  storageBucket: "youtube-search-4cf4d.appspot.com",
  messagingSenderId: "221179145588"
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
          username: user.displayName
        });
      }else{
        this.setState({
          loggedIn: false,
          user: []
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header loggedIn={this.state.loggedIn} />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/saved' component={Saved}/>
          <Route exact path='/callback' component={Callback}/>
          <Route exact path='/logout' component={Logout}/>
          <Route path="*" component={NotFound}  status={404} />
        </Switch>
      </div>
    );
  }
}

export default App;
