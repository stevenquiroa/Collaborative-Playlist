const express = require('express');
const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(new SpotifyStrategy({
    clientID: 'ab21b36c822d48ac94788edf2dd7c865',
    clientSecret: '52e95d3925e84e34aa1a1f68fb62463c',
    callbackURL: "http://localhost:3000/auth/callback"
  }, (accessToken, refreshToken, expiresIn, profile, done) => {
    done(null, {...profile, accessToken, refreshToken, expiresIn });
  }
));

router.get('/spotify', passport.authenticate('spotify', {
    scope: [
      "streaming", "user-read-birthdate", "user-read-email",
      "user-read-private", "playlist-modify-private", "playlist-modify-public"
    ],
    session: false,
    showDialog: true
}));

router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login', session: false }),

  function(req, res) {
    const { accessToken, refreshToken, expiresIn } = req.user;
    res.cookie('accessToken', accessToken, { maxAge: 3600, httpOnly: true });
    res.cookie('refreshToken', refreshToken, { maxAge: 3600 * 24, httpOnly: true });
    res.cookie('expiresIn', expiresIn, { maxAge: 3600, httpOnly: true });
    res.redirect('/');
  });


module.exports = router;