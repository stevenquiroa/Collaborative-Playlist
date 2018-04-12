const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const next = require('next');
const fetch = require('node-fetch');

const SpotifyStrategy = require('passport-spotify').Strategy;

const { parse } = require('url');

const DEV = process.env.ENVIRONMENT !== 'production';
const PORT = process.env.PORT || 3000;

const app = next({dev: DEV});
const handle = app.getRequestHandler();

const routes = require('./routes');

const spotifyConfig = {
  clientID: process.env.REACT_APP_SPOTIFY_ID,
  clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
  callbackURL: process.env.REACT_APP_SPOTIFY_CALLBACK,
  showDialog: true,
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(passport.initialize());
  server.use(passport.session());

  passport.use(new SpotifyStrategy(spotifyConfig, (accessToken, refreshToken, expiresIn, profile, done) => {
      done(null, {...profile, accessToken, refreshToken, expiresIn });
    }
  ));

  server.get('/auth/spotify',
    passport.authenticate('spotify', {
      scope: [
        "streaming", "user-read-birthdate", "user-read-email",
        "user-read-private", "playlist-modify-private", "playlist-modify-public",
        "user-read-playback-state", 'playlist-read-collaborative',
      ],
      showDialog: true
    })
  );

  server.get('/auth/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    (req, res) => {
      const user = req.user;
      const { accessToken, refreshToken, expiresIn } = user;
      const maxAge = expiresIn * 1000;
      res.cookie('accessToken', accessToken, { maxAge, httpOnly: false });
      res.cookie('refreshToken', refreshToken, { maxAge: maxAge * 24, httpOnly: false });
      res.cookie('expiresIn', (Date.now() + maxAge), { maxAge, httpOnly: false });
      delete user.accessToken;
      delete user.refreshToken;
      delete user.expiresIn;
      app.render(req, res, '/auth', { user });

    }
  );

  server.get('/auth/refresh', (req, res) => {
    const access_token = Buffer.from(`${spotifyConfig.clientID}:${spotifyConfig.clientSecret}`).toString('base64');
    const refresh_token = req.cookies.refreshToken;

    fetch('https://accounts.spotify.com/api/token', {
      headers: {
        'Accept': 'application/json',
        'Authorization' : `Basic ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    })
    .catch(error => {
      res.header('Content-Type', 'application/json');
      res.status(400).send(error);
    })
    .then(response => response.json())
    .then(({ access_token, expires_in }) => {
      const maxAge = expires_in * 1000;

      res.cookie('accessToken', access_token, { maxAge, httpOnly: false });
      res.cookie('expiresIn', (Date.now() + maxAge), { maxAge, httpOnly: false });
      res.header('Content-Type', 'application/json');
      res.status(200).send({});
    })
  });

  server.get('*', (req, res) => {

    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const route = routes[pathname];

    if (route) {
      return app.render(req, res, route.page, query);
    }
    return handle(req, res)
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready for liftoff: http://localhost:${PORT}`)
  })
})