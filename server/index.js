const express = require('express');
const axios = require('axios');
const btoa = require('btoa');
const app = express();
const port = 3200;

var bodyParser = require('body-parser');

var SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_CLIENT_ID = '3701baeb580b4d11a09e4201254085b4'; // Your Spotify Client Token
const SPOTIFY_CLIENT_SECRET = '67c36eb1dae64b72b2f4f7dec800be49'; // Your Spotify Client Secret Token


var spotifyApi = new SpotifyWebApi({
  clientId : SPOTIFY_CLIENT_ID,
  clientSecret : SPOTIFY_CLIENT_SECRET,
  redirectUri : 'http://localhost:3000/callback'
});

app.use( bodyParser.json() );  

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
app.use(function(req, res, next) {
	spotifyApi.clientCredentialsGrant()
	.then(function(data) {
	    spotifyApi.setAccessToken(data.body['access_token']);
	    next();
	}, function(err) {
	    next();
	});
});
*/

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/artist/:search', function (req, res) {

	spotifyApi.searchArtists(req.params.search)
	.then(function(data) {
		var json = JSON.stringify(data.body.artists.items);
		res.send(json);
	}, function(err) {
		console.error(err);
	});
});

app.post('/authorize', function (req, res) {

	let code = req.body.code;

	axios({
	  method: 'post',
	  url: 'https://accounts.spotify.com/api/token',
	  headers: {
	  	'Authorization': "Basic " + btoa( SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET  ),
	  	'Content-Type': 'application/x-www-form-urlencoded'
	  },
	  params: {
	    grant_type: 'authorization_code',
	    code: code,
	    redirect_uri: 'http://localhost:3000/callback',
	  }
	})
	.then(function (response) {
		var json = JSON.stringify(response.data);
		res.send(json);
	})
	.catch(function (error) {
		console.log(error);
		res.end();
	});
});

app.post('/refresh', function (req, res) {

	let refresh_token = req.body.refresh_token;

	axios({
	  method: 'post',
	  url: 'https://accounts.spotify.com/api/token',
	  headers: {
	  	'Authorization': "Basic " + btoa( SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET  ),
	  	'Content-Type': 'application/x-www-form-urlencoded'
	  },
	  params: {
	    grant_type: 'refresh_token',
	    refresh_token: refresh_token
	  }
	})
	.then(function (response) {
		var json = JSON.stringify(response.data);
		res.send(json);
	})
	.catch(function (error) {
		console.log(error);
		res.end();
	});
});

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
