const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const NotesType = db.define('notesType', {
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = NotesType;
