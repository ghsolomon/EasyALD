const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const Note = db.define('note', {
  description: Sequelize.TEXT,
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = Note;
