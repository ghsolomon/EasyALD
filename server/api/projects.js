const router = require('express').Router();
const {
  models: { Light, Type },
} = require('../db');

// Verify permissions middleware
const verifyPermissions = async (req, res, next) => {
  try {
    if (
      req.user.projects.some(
        (project) => project.dataValues.id === +req.params.projectId
      )
    ) {
      next();
    } else {
      const error = new Error(
        'User does not have permission to view this project'
      );
      error.status = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:projectId/lights
router.get('/:projectId/lights', verifyPermissions, async (req, res, next) => {
  try {
    const lights = await Light.findAll({
      where: { projectId: +req.params.projectId },
    });
    res.json(lights);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/types
router.get('/:projectId/types', verifyPermissions, async (req, res, next) => {
  try {
    const types = await Type.findAll({
      where: { projectId: +req.params.projectId },
    });
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
router.post('/', (req, res, next) => {});

// PUT /api/projects
router.put('/', (req, res, next) => {});

// DELETE /api/projects
router.delete('/', (req, res, next) => {});

module.exports = router;
