const db = require('./db');

// require models:
const User = require('./models/User');
const Project = require('./models/Project');
const Light = require('./models/Light');
const Type = require('./models/Type');
const Note = require('./models/Note');
const NotesType = require('./models/NotesType');

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
Note.belongsToMany(Type, { through: NotesType });
Type.belongsToMany(Note, { through: NotesType });
NotesType.belongsTo(Note);
Note.hasMany(NotesType);
Type.hasMany(NotesType);
NotesType.belongsTo(Type);

// export db and models:
module.exports = {
  db,
  models: { Project, Light, User, Type, Note, NotesType },
};
