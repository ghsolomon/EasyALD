const db = require('./db');

// require models:
const User = require('./models/User');
const Project = require('./models/Project');
const Light = require('./models/Light');
const Type = require('./models/Type');

// associate models:
User.belongsToMany(Project, { through: 'UserProjects' });
Project.belongsToMany(User, { through: 'UserProjects' });

Light.belongsTo(Project);
Project.hasMany(Light);

Type.belongsTo(Project);
Project.hasMany(Type);

// export db and models:
module.exports = { db, models: { Project, Light, User, Type } };
