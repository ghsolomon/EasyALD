const Sequelize = require('sequelize');
const db = require('../db');
const { NoteLight, NoteType } = require('./NoteLight_NoteType');
const Light = require('./Light');
const Type = require('./Type');
const NoteLightType = require('./NoteLightType');

// model definition:
const Note = db.define('note', {
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.ENUM('Active', 'Discuss', 'On Hold'),
    defaultValue: 'Active',
    allowNull: false,
  },
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

const DEFAULT_NOTE_OPTIONS = {
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
};

// class methods:
Note.findByProjectId = async function (projectId) {
  const notes = await this.findAll({
    where: { projectId },
    ...DEFAULT_NOTE_OPTIONS,
  });
  return notes;
};

Note.findById = async function (noteId) {
  const note = await Note.findByPk(noteId, DEFAULT_NOTE_OPTIONS);
  return note;
};

// hooks:

// export:
module.exports = Note;
