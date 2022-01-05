const Sequelize = require('sequelize');
const db = require('../db');
const { NoteLight, NoteType } = require('./NoteLight_NoteType');
const Light = require('./Light');
const Type = require('./Type');
const NoteLightType = require('./NoteLightType');

// model definition:
const Note = db.define('note', {
  description: Sequelize.TEXT,
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
Note.findByProjectId = async function (projectId) {
  const notes = await this.findAll({
    where: { projectId },
    include: [
      { model: NoteType, include: [Type, NoteLightType] },
      {
        model: NoteLight,
        include: [Light, NoteLightType],
      },
    ],
    order: [
      ['noteLights', 'light', 'PosOrd'],
      ['noteTypes', 'type', 'sortOrder'],
    ],
  });
  return notes;
};

Note.findById = async function (noteId) {
  const note = await Note.findByPk(noteId, {
    include: [
      { model: NoteType, include: [Type, NoteLightType] },
      {
        model: NoteLight,
        include: [Light, NoteLightType],
      },
    ],
    order: [
      ['noteLights', 'light', 'PosOrd'],
      ['noteTypes', 'type', 'sortOrder'],
    ],
  });
  return note;
};

// hooks:

// export:
module.exports = Note;
