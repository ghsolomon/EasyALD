const db = require('./db');

// require models:
const User = require('./models/User');
const Project = require('./models/Project');
const Light = require('./models/Light');
const Type = require('./models/Type');
const Note = require('./models/Note');
const NoteType = require('./models/NoteType');

// associate models:
User.belongsToMany(Project, { through: 'projectsUsers' });
Project.belongsToMany(User, { through: 'projectsUsers' });

Light.belongsTo(Project);
Project.hasMany(Light);

Type.belongsTo(Project);
Project.hasMany(Type);

Note.belongsTo(Project);
Project.hasMany(Note);
Note.belongsToMany(Light, { through: 'notesLights' });
Light.belongsToMany(Note, { through: 'notesLights' });
Note.belongsToMany(Type, { through: NoteType });
Type.belongsToMany(Note, { through: NoteType });
NoteType.belongsTo(Note);
Note.hasMany(NoteType);
Type.hasMany(NoteType);
NoteType.belongsTo(Type);

// export db and models:
module.exports = {
  db,
  models: { Project, Light, User, Type, Note, NoteType },
};
