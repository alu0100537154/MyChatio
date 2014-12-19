
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

//var users = require('./routes/users');

var app = express();

var passport = require('passport');

var flash = require('connect-flash');

//var auth = require('passport.socket.io')(cookieParser, mongooseSessionStore);

// Cofigurando la Base de datos
var mongoose = require('mongoose');
var configDB = require('./config/database.js');

/*SessionMongoose = require("mongoose-session"),
    mongooseSessionStore = new SessionMongoose({
        url: "mongodb://victor:123456@proximus.modulusmongo.net:27017/ywonA5qa",
        interval: 120000 
});*/

mongoose.connect(configDB.url);

//app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/users', users);

app.use(session({
  key: 'session',
  secret: 'my_secret',
  store :new (require("connect-mongo")(session))({
        url: 'mongodb://victor:123456@proximus.modulusmongo.net:27017/ywonA5qa'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./config/passport_oauth');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
