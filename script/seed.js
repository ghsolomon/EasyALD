const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const {
  db,
  models: { User, Light, Project, Type, Note },
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
  const seededLights = await Promise.all(
    LIGHTS.map((light) => Light.create({ ...light, projectId: 1 }))
  );
  console.log(`seeded ${seededLights.length} lights`);

  // Seed types

  const TYPES = [
    {
      name: 'work',
      color: '#FF0000',
      sortOrder: 0,
    },
    {
      name: 'focus',
      color: '#FF0000',
      sortOrder: 1,
    },
    {
      name: 'LW',
      color: '#00FF00',
      sortOrder: 2,
    },
    {
      name: 'plot',
      color: '#00FF00',
      sortOrder: 3,
    },
    {
      name: 'magic',
      color: '#0000FF',
      sortOrder: 4,
    },
    {
      name: 'chart',
      color: '#0000FF',
      sortOrder: 5,
    },
  ];

  const seededTypes = await Promise.all(
    TYPES.map((type) => Type.create({ ...type, projectId: 1 }))
  );

  console.log(`seeded ${seededTypes.length} types`);

  // Seed notes
  const NOTES = [
    { description: 'This is an example note' },
    { description: 'This is another example note' },
    { description: 'This is another example note with no lights attached' },
  ];

  const seededNotes = await Promise.all(
    NOTES.map((note) => Note.create({ ...note, projectId: 1 }))
  );

  console.log(`seeded ${seededNotes.length} notes`);

  // Associate notes:
  for (let note of seededNotes) {
    if (note.id === 3) break;
    const randomTimes = Math.ceil(Math.random() * 5);
    for (let i = 0; i < randomTimes; i++) {
      const randomType =
        seededTypes[Math.floor(Math.random() * seededTypes.length)];
      const randomLight =
        seededLights[Math.floor(Math.random() * seededLights.length)];
      await note.addType(randomType);
      await note.addLight(randomLight);
    }
  }

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
