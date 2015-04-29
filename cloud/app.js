var express = require('express');
var moment = require('moment');

var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');

var app = express();



// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(parseExpressHttpsRedirect());    // Automatically redirect non-secure urls to secure ones
//app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.bodyParser()); 
app.use(express.cookieParser('123456789'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'obj.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

// Homepage endpoint
app.get('/', function(req, res) {
  // Get the latest images to show
  		res.render('views/login');
 
});

// User endpoints
app.use('/', require('cloud/user'));

// twitto endpoints
app.use('/t', require('cloud/twitto'));

// twitto profile page endpoints
app.use('/p', require('cloud/profileExpress'));

// Attach the Express app to Cloud Code.
app.listen();
