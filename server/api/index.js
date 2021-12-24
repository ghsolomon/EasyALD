const router = require('express').Router();

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
