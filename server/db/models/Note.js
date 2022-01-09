const Sequelize = require('sequelize');
const db = require('../db');
const { NoteLight, NoteType } = require('./NoteLight_NoteType');
const Light = require('./Light');
const Type = require('./Type');
const NoteLightType = require('./NoteLightType');
const compareChannels = require('../../../utils/helpers').compareChannels;

// model definition:
const Note = db.define('note', {
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.ENUM('Active', 'Discuss', 'On Hold'),
    defaultValue: 'Active',
    allowNull: false,
  },
  channel: {
    type: Sequelize.STRING,
    get() {
      // If has lights attached, get lowest value channel
      if (this.noteLights && this.noteLights.length) {
        return this.noteLights.reduce(
          (minChan, { light }) =>
            compareChannels(minChan, light.Ch) === 1 ? light.Ch : minChan,
          null
        );
      } else {
        return this.dataValues.channel;
      }
    },
  },
  position: { type: Sequelize.STRING },
  posOrder: {
    type: Sequelize.INTEGER,
    get() {
      if (this.noteLights && this.noteLights.length) {
        return this.noteLights.reduce(
          (minPos, { light }) => Math.min(minPos, light.PosOrd),
          Infinity
        );
      } else {
        return this.dataValues.posOrder;
      }
    },
    LtOrder: {
      type: Sequelize.INTEGER,
      get() {
        if (this.noteLights && this.noteLights.length) {
          return this.noteLights.reduce(
            (minLt, { light }) => Math.min(minLt, light.LtOrd),
            Infinity
          );
        } else {
          return 0;
        }
      },
    },
  },
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

const DEFAULT_NOTE_OPTIONS = {
  include: [
    {
      model: NoteType,
      separate: true,
      include: [Type, { model: NoteLightType, separate: true }],
      order: [[Type, 'sortOrder', 'ASC']],
    },
    {
      model: NoteLight,
      separate: true,
      include: [Light, { model: NoteLightType, separate: true }],
      order: [[Light, 'PosOrd', 'ASC']],
    },
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
