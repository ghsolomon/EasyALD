const db = require('./db');

// require models:
const User = require('./models/User');
const Project = require('./models/Project');
const Light = require('./models/Light');
const Type = require('./models/Type');
const Note = require('./models/Note');
const { NoteLight, NoteType } = require('./models/NoteLight_NoteType');
const NoteLightType = require('./models/NoteLightType');

// associate models:
User.belongsToMany(Project, { through: 'projectsUsers' });
Project.belongsToMany(User, { through: 'projectsUsers' });

Light.belongsTo(Project);
Project.hasMany(Light);

Type.belongsTo(Project);
Project.hasMany(Type);

Note.belongsTo(Project);
Project.hasMany(Note);
Note.belongsToMany(Light, { through: NoteLight });
Light.belongsToMany(Note, { through: NoteLight });
Note.belongsToMany(Type, { through: NoteType });
Type.belongsToMany(Note, { through: NoteType });
NoteType.belongsTo(Note);
Note.hasMany(NoteType);
Type.hasMany(NoteType);
NoteType.belongsTo(Type);
NoteLight.belongsToMany(NoteType, { through: NoteLightType });
NoteType.belongsToMany(NoteLight, { through: NoteLightType });

// export db and models:
module.exports = {
  db,
  models: {
    Project,
    Light,
    User,
    Type,
    Note,
    NoteType,
    NoteLight,
    NoteLightType,
  },
};
