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
  // isComplete: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false,
  //   allowNull: false,
  // },
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    get() {
      if (this.noteLightTypes) {
        return !this.noteLightTypes.some(
          (noteLightType) => !noteLightType.isComplete
        );
      }
    },
    // set() {
    //   // console.log(this);
    // },
  },
  isPartiallyComplete: {
    type: Sequelize.VIRTUAL(Sequelize.BOOLEAN),
    get() {
      if (this.noteLightTypes) {
        return this.noteLightTypes.some(
          (noteLightType) => noteLightType.isComplete
        );
      }
    },
  },
});

// instance methods:
// ModelTemplate.prototype.methodName = function () {};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:
NoteLight.afterCreate(async (noteLight) => {
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

NoteLight.afterBulkCreate(async (noteLights) => {
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

NoteLight.afterDestroy(async (noteLight) => {
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

NoteLight.afterDestroy(async (noteLights) => {
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
NoteType.prototype.setCompletionStatus = async function (isComplete) {
  this.isComplete = isComplete;
  await Promise.all([
    NoteLightType.update({ isComplete }, { where: { noteTypeId: this.id } }),
    this.save(),
  ]);
};

// class methods:
// ModelTemplate.methodName = () => {};

// hooks:
NoteType.afterCreate(async (noteType) => {
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

NoteType.afterBulkCreate(async (noteTypes) => {
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

NoteType.afterDestroy(async (noteType) => {
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

NoteType.afterDestroy(async (noteTypes) => {
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
