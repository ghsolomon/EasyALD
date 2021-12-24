const router = require('express').Router();
const {
  models: { User },
} = require('../db/index');

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username'] });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
