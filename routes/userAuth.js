var User = require('../models/user');
var Location = require('../models/location');

module.exports = function (app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    // res.json({'message': 'This is the index page'});
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
    // res.json({'message': 'This is the loggin page'});
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
    // res.json({'message': 'This is the signup page.'});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/profile', isLogedIn, function (req, res) {
    // Find the user object
    User.findById(req.user._id)
      // Fill in the values from the location object that the user object references.
      // user.location is an ._id
      // Like: Location.findById(user.location)
      .populate('location')
      .exec(function (err, data) {
        console.log(data);
        if (err) {
          console.log(err);
          // res.render('profile', {user: req.user, message: req.flash('updateMessage') });
        } else {
          res.render('profile', {user: data, message: req.flash('updateMessage') });
        }
      });
  });

  app.post('/update', isLogedIn, function (req, res) {
    // Find a user object.
    User.findById(req.user._id, function (err, user) {
      if (err) {
        req.flash('updateMessage', 'Update Failed: Failed to Lookup User.');
        res.redirect('/profile');
        console.log(err);
      } else {
        // Create a location object
        var location = new Location();
        location.city = req.body.city;
        location.state = req.body.state;
        location.zip = req.body.zip;
        // Save the location object.
        location.save(function (err, location) {
          if (err) {
            console.log(err);
            req.flash('updateMessage', 'Update Failed: Failed to Save Location.');
            res.redirect('/profile');
          }
          // Relate the user object to the location object
          user.location = location._id;
          // Resave the user object with the new location.
          user.save(function (err, data) {
            if (err) {
              console.log(err);
              req.flash('updateMessage', 'Update Failed: Failed to Save the User.');
              res.redirect('/profile');
            }
            req.flash('updateMessage', 'Updated User.')
            res.redirect('/profile');
          });
        });
      }
    });
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  function isLogedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
}
