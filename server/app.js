const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', require('./api'));
app.use('/auth', require('./auth'));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
