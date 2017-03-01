// Setup to use the local stratigy of passport.
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
// Include the data model for our users
var User = require('../models/user.js');

var configAuth = require('./auth');

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

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, username, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function () {
      User.findOne({'local.username' : username}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That user name is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function (err, user) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
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

  passport.use('twitter', new TwitterStrategy({
    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.find({'twitter.id': profile.id}, function (err, user) {
        // If an error occurs
        if (err) {
          return done(err)
        }
        // If user is found, log them in.
        if(user) {
          return done(null, user);
        } else {
          // If user was not found, add to database.
          var newUser = new User();
          newUser.token = token;
          newUser.id = profile.id;
          newUser.displayName = profile.displayName;
          newUser.username = profile.username;
          newUser.save(function (err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

};
