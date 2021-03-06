var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var path = require('path');

// The needed require statements for passport
// express-session for keeping track of session data.
var session = require('express-session');
// storing use information.
var cookieParser = require('cookie-parser');
// For user auth
var passport = require('passport');
// Flash messages
var flash = require('connect-flash');
// Request looging
var morgan = require('morgan');

var Animal = require('./models/animal');

var options = {
server:  { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/animals";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);

var animalRoutes = require('./routes/animals');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
// app.use(express.static('public')) // gives our app access to our static code in public folder

// Express only serves static assets in production
const isProd = process.env.NODE_ENV === 'production';
const clientPath = isProd ? 'client/build' : 'client/public';

if (isProd) {
  app.use(express.static(clientPath));
}

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// Set our app to use middleware needed for authentication
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session({
  cookie: {
   maxAge: 60000
 }
}));
app.use(flash());

require('./config/passport')(passport); // pass passport for configuration
require('./routes/userAuth')(app, passport); // load our routes and pass in our app and fully configured passport

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3001));

// var daysOfTheWeek = ["Sunday", "Monday",
            // "Tuesday", "Wednesday",
            // "Thursday", "Friday",
            // "Saturday"
          // ];

// app.get('/', function (req, res) {
  // res.render('index', {today: daysOfTheWeek[ new Date().getDay() ]});
// });

app.use('/api/animals', animalRoutes);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, clientPath, 'index.html'));
});

app.listen(app.get('port'), function(){
  console.log(`🔥🔥🔥🔥🔥🔥 at: http://localhost:${app.get('port')}/`);
});
