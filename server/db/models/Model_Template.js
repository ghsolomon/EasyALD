const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const ModelTemplate = db.define('modelTemplate', {});

// instance methods:
ModelTemplate.prototype.methodName = function () {};

// class methods:
ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = ModelTemplate;
