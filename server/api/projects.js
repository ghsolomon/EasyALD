const router = require('express').Router();
const {
  models: { Light },
} = require('../db');

// GET /api/projects
router.get('/:projectId/lights', async (req, res, next) => {
  const lights = await Light.findAll({
    where: { projectId: +req.params.projectId },
  });
  res.json(lights);
});

// POST /api/projects
router.post('/', (req, res, next) => {});

// PUT /api/projects
router.put('/', (req, res, next) => {});

// DELETE /api/projects
router.delete('/', (req, res, next) => {});

module.exports = router;
