const router = require('express').Router();
const {
  models: { User },
} = require('../db');

// Get user middleware:
router.use(async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.log('User is not authenticated');
  }
  next();
});

// Routes:
router.use('/route-template', require('./route_template'));
router.use('/projects', require('./projects'));
router.use('/users', require('./users'));
router.use('/projects', require('./projects'));

// 404:
router.use((req, res, next) => {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;
