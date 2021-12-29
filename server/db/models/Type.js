const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const Type = db.define('type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex',
    validate: { notEmpty: true },
  },
  color: {
    type: Sequelize.STRING,
    defaultValue: '#FFFFFF',
  },
  sortOrder: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  projectId: {
    type: Sequelize.INTEGER,
    unique: 'compositeIndex',
  },
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = Type;
