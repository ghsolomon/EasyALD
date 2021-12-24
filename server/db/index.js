const db = require('./db');

// require models:
const User = require('./models/User');
const Project = require('./models/Project');
const Light = require('./models/Light');

// associate models:
Light.belongsTo(Project);
Project.hasMany(Light);

// export db and models:
module.exports = { db, models: { Project, Light, User } };
