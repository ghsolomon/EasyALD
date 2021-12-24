const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const Project = db.define('project', {
  name: Sequelize.STRING,
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = Project;
