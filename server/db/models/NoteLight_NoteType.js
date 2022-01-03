const Sequelize = require('sequelize');
const db = require('../db');
const NoteLightType = require('./NoteLightType');

// model definition:
const NoteLight = db.define('noteLight', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

// model definition:
const NoteType = db.define('noteType', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
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
NoteLight.afterCreate('createNoteLight', async (noteLight) => {
  try {
    const { noteId, id: noteLightId } = noteLight;
    const noteTypes = await NoteType.findAll({
      where: { noteId },
    });
    const noteLightTypes = noteTypes.map((noteType) => ({
      noteTypeId: noteType.id,
      noteLightId,
    }));
    await NoteLightType.bulkCreate(noteLightTypes);
  } catch (error) {
    console.error(error);
  }
});

NoteLight.afterBulkCreate('bulkCreateNoteLight', async (noteLights) => {
  for (let noteLight of noteLights) {
    try {
      const { noteId, id: noteLightId } = noteLight;
      const noteTypes = await NoteType.findAll({
        where: { noteId },
      });
      const noteLightTypes = noteTypes.map((noteType) => ({
        noteTypeId: noteType.id,
        noteLightId,
      }));
      await NoteLightType.bulkCreate(noteLightTypes);
    } catch (error) {
      console.error(error);
    }
  }
});

NoteLight.afterDestroy('destroyNoteLight', async (noteLight) => {
  try {
    const { noteId, id: noteLightId } = noteLight;
    const noteTypes = await NoteType.findAll({
      where: { noteId },
    });
    const noteLightTypes = noteTypes.map((noteType) => ({
      noteTypeId: noteType.id,
      noteLightId,
    }));
    await NoteLightType.destroy({ where: noteLightTypes });
  } catch (error) {
    console.error(error);
  }
});

NoteLight.afterDestroy('bulkDestroyNoteLight', async (noteLights) => {
  for (let noteLight of noteLights) {
    try {
      const { noteId, id: noteLightId } = noteLight;
      const noteTypes = await NoteType.findAll({
        where: { noteId },
      });
      const noteLightTypes = noteTypes.map((noteType) => ({
        noteTypeId: noteType.id,
        noteLightId,
      }));
      await NoteLightType.destroy({ where: noteLightTypes });
    } catch (error) {
      console.error(error);
    }
  }
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:
NoteType.afterCreate('createNoteType', async (noteType) => {
  try {
    const { noteId, id: noteTypeId } = noteType;
    const noteLights = await NoteLight.findAll({
      where: { noteId },
    });
    const noteLightTypes = noteLights.map((noteLight) => ({
      noteLightId: noteLight.id,
      noteTypeId,
    }));
    await NoteLightType.bulkCreate(noteLightTypes);
  } catch (error) {
    console.error(error);
  }
});

NoteType.afterBulkCreate('bulkCreateNoteType', async (noteTypes) => {
  for (let noteType of noteTypes) {
    try {
      const { noteId, id: noteTypeId } = noteType;
      const noteLights = await NoteLight.findAll({
        where: { noteId },
      });
      const noteLightTypes = noteLights.map((noteLight) => ({
        noteLightId: noteLight.id,
        noteTypeId,
      }));
      await NoteLightType.bulkCreate(noteLightTypes);
    } catch (error) {
      console.error(error);
    }
  }
});

NoteType.afterDestroy('destroyNoteType', async (noteType) => {
  try {
    const { noteId, id: noteTypeId } = noteType;
    const noteLights = await NoteLight.findAll({
      where: { noteId },
    });
    const noteLightTypes = noteLights.map((noteLight) => ({
      noteLightId: noteLight.id,
      noteTypeId,
    }));
    await NoteLightType.destroy({ where: noteLightTypes });
  } catch (error) {
    console.error(error);
  }
});

NoteType.afterDestroy('bulkDestroyNoteType', async (noteTypes) => {
  for (let noteType of noteTypes) {
    try {
      const { noteId, id: noteTypeId } = noteType;
      const noteLights = await NoteLight.findAll({
        where: { noteId },
      });
      const noteLightTypes = noteLights.map((noteLight) => ({
        noteLightId: noteLight.id,
        noteTypeId,
      }));
      await NoteLightType.destroy({ where: noteLightTypes });
    } catch (error) {
      console.error(error);
    }
  }
});

// export:
module.exports = { NoteType, NoteLight };
