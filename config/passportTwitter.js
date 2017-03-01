// Setup to use the local stratigy of passport.
var TwitterStrategy = require('passport-twitter').Strategy;
// Include the data model for our users
var User = require('../models/user.js');

module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // passport.use('local-signup', new LocalStrategy({
    // usernameField : 'username',
    // passwordField : 'password',
    // passReqToCallback : true // allows us to pass back the entire request to the callback
  // },

  passport.use('twitter-login', new TwitterStrategy({
    consumerKey: process.env.CUS_KEY,
    consumerSecret: process.env.CUS_SEC,
    callbackURL: "http://www.example.com/auth/twitter/callback"
    passReqToCallback: true
  },
  function (req, username, password, done) {
    User.findOne({'local.username': username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, req.flash('loginMessage', 'That user name does not exist.'));
      }
      if(!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'The password entered does not match the database.'));
      }

      return done(null, user);
    });
  }));
};
