const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const NoteType = db.define('noteType', {
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
module.exports = NoteType;
