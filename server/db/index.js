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
NoteLight.belongsTo(Note);
NoteLight.belongsTo(Light);
Note.hasMany(NoteLight);
Light.hasMany(NoteLight);

Note.belongsToMany(Type, { through: NoteType });
Type.belongsToMany(Note, { through: NoteType });
NoteType.belongsTo(Note);
NoteType.belongsTo(Type);
Note.hasMany(NoteType);
Type.hasMany(NoteType);

NoteLight.belongsToMany(NoteType, { through: NoteLightType });
NoteType.belongsToMany(NoteLight, { through: NoteLightType });
NoteLightType.belongsTo(NoteLight);
NoteLightType.belongsTo(NoteType);
NoteLight.hasMany(NoteLightType);
NoteType.hasMany(NoteLightType);

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
