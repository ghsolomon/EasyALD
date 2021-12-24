const app = require('./app');
const { db } = require('./db');
const seed = require('../script/seed');

const port = process.env.PORT || 3000;

const init = async () => {
  try {
    if (process.env.SEED) {
      await seed();
    } else {
      await db.sync();
    }
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

init();
