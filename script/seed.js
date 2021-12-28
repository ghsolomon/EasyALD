const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const {
  db,
  models: { User, Light, Project, Type },
} = require('../server/db');

// const SEED_DATA = JSON.parse(
//   fs.readFileSync(path.join(__dirname, '../', 'bin', 'seed.json'), 'utf8')
// );

const CSV = fs.readFileSync(
  path.join(__dirname, '../', 'bin', 'seed.csv'),
  'utf8'
);

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Seed PROJECT
  const project = await Project.create({ name: 'Oklahoma' });
  console.log(`seeded demo project`);

  // Seed USER and associate PROJECT
  const greg = await User.create({ username: 'greg', password: 'greg' });
  await greg.addProject(project);
  console.log(`seeded demo user`);

  // Seed LIGHTS
  const LIGHTS = await csv({
    colParser: {
      Load: 'number',
      'C#': 'number',
      LtOrd: 'number',
      Univ: 'number',
      DMX: 'number',
      PosOrd: 'Number',
    },
    ignoreEmpty: true,
  }).fromString(CSV);
  await Promise.all(
    LIGHTS.map((light) => Light.create({ ...light, projectId: 1 }))
  );
  console.log(`seeded ${LIGHTS.length} lights`);

  const TYPES = [
    {
      name: 'work',
      color: '#FF0000',
    },
    {
      name: 'focus',
      color: '#FF0000',
    },
    {
      name: 'LW',
      color: '#00FF00',
    },
    {
      name: 'plot',
      color: '#00FF00',
    },
    {
      name: 'magic',
      color: '#0000FF',
    },
    {
      name: 'chart',
      color: '#0000FF',
    },
  ];

  await Promise.all(
    TYPES.map((type) => Type.create({ ...type, projectId: 1 }))
  );

  console.log(`seeded ${TYPES.length} types`);

  console.log(`seeded successfully`);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
