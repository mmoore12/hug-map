const config = require('../config');
const express = require('express');
const morgan = require('morgan');
const parser = require('body-parser');

// Create application
const app = express();

// Parse POST requests
// For future, as this WMS does not currently support POST requests
app.use(parser.urlencoded({extended: false}));

// Logging
app.use(morgan(config.logLevel));

// Routes
app.use('/', require('./routes'));

// for test files & their resources
app.use(express.static('./web'));

// For everything else
app.use(function (req, res, next) {
  res.status(404).send('Page not found');
});

// Export app
module.exports = app;
