const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const {
  db,
  models: { User, Light, Project },
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

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);
  console.log(`seeded ${users.length} users`);

  // Sync SEED_DATA
  const SEED_DATA = await csv({
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
  // console.log(SEED_DATA[0]);
  await Project.create({ name: 'Oklahoma' });
  await Promise.all(
    SEED_DATA.map((light) => Light.create({ ...light, projectId: 1 }))
  );
  // await Light.bulkCreate(SEED_DATA);
  // console.log(SEED_DATA[2]);
  console.log(`seeded ${SEED_DATA.length} data entries`);

  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
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
