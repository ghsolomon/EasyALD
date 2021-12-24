const Sequelize = require('sequelize');
const db = require('../db');

// model definition:
const Light = db.define('light', {
  Pur: Sequelize.STRING,
  Ch: Sequelize.STRING,
  Dm: Sequelize.STRING,
  Adr: Sequelize.STRING,
  Pos: Sequelize.STRING,
  'U#': Sequelize.STRING,
  Type: Sequelize.STRING,
  Load: Sequelize.INTEGER,
  Acc: Sequelize.STRING,
  Clr: Sequelize.STRING,
  Gbo: Sequelize.STRING,
  Gsiz: Sequelize.STRING,
  Ckt: Sequelize.STRING,
  'C#': Sequelize.INTEGER,
  Sys: Sequelize.CHAR,
  Layer: Sequelize.STRING,
  Class: Sequelize.STRING,
  XCord: Sequelize.STRING,
  YCord: Sequelize.STRING,
  ZCord: Sequelize.STRING,
  Rot: Sequelize.STRING,
  LtOrd: Sequelize.INTEGER,
  LW: Sequelize.STRING,
  Ext: Sequelize.STRING,
  Sym: Sequelize.STRING,
  Plt: Sequelize.ENUM('Yes', 'No'),
  Univ: Sequelize.INTEGER,
  DMX: Sequelize.INTEGER,
  PosOrd: Sequelize.INTEGER,
  DTyp: Sequelize.ENUM('Device', 'Light', 'Moving Light', 'Practical', 'SFX'),
  'Clr Fm': Sequelize.STRING,
  'Pos & U#': Sequelize.STRING,
  'Type & Acc': Sequelize.STRING,
  'Type & Load': Sequelize.STRING,
  'Type & Acc & Load': Sequelize.STRING,
  'Ckt & C#': Sequelize.STRING,
  'Clr & Gbo': Sequelize.STRING,
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:

// export:
module.exports = Light;
