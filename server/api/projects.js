const router = require('express').Router();
const {
  db,
  models: { Light, Type, Note, NotesType },
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
        'User does not have permission to view / modify this project'
      );
      error.status = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:projectId/notes
router.get('/:projectId/notes', verifyPermissions, async (req, res, next) => {
  try {
    console.log(Note.associations);
    const notes = await Note.findAll({
      where: { projectId: +req.params.projectId },
      include: [{ model: NotesType, include: [Type] }, Light],
      order: [[Note.associations.lights, 'PosOrd']],
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

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
      order: [['sortOrder', 'ASC']],
    });
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:projectId/types
router.post('/:projectId/types', verifyPermissions, async (req, res, next) => {
  try {
    const newType = await Type.create({
      ...req.body,
      projectId: req.params.projectId,
    });
    res.json(newType);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const error = new Error('Type already exists');
      error.status = 400;
      next(error);
    } else {
      if (error.name === 'SequelizeValidationError') {
        error.status = 400;
      }
      next(error);
    }
  }
});

// PUT /api/projects/:projectId/types/:typeId
router.put(
  '/:projectId/types/:id',
  verifyPermissions,
  async (req, res, next) => {
    try {
      const { projectId, id } = req.params;
      const typeToUpdate = await Type.findOne({ where: { projectId, id } });
      if (!typeToUpdate) {
        const error = new Error('Type does not exist');
        error.status = 404;
        next(error);
      } else {
        const { name, color, sortOrder } = req.body;
        typeToUpdate.update({ name, color, sortOrder });
      }
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const error = new Error('Type already exists');
        error.status = 400;
        next(error);
      } else {
        if (error.name === 'SequelizeValidationError') {
          error.status = 400;
        }
        next(error);
      }
    }
  }
);

// PUT /api/projects/:projectId/types
router.put('/:projectId/types', verifyPermissions, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const updatedTypes = await db.transaction(async (t) => {
      return await Promise.all(
        req.body.map(async (type) => {
          const { id, name, color, sortOrder } = type;
          const typeToUpdate = await Type.findOne({
            where: { projectId, id },
          });
          if (!typeToUpdate) {
            const error = new Error('Type does not exist');
            error.status = 404;
            throw error;
          } else {
            typeToUpdate.set({ name, color, sortOrder });
            return typeToUpdate.save({ transaction: t });
          }
        })
      );
    });
    updatedTypes.sort((a, b) => a.sortOrder - b.sortOrder);
    res.json(updatedTypes);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const error = new Error('Type already exists');
      error.status = 400;
      next(error);
    } else {
      if (error.name === 'SequelizeValidationError') {
        error.status = 400;
      }
      next(error);
    }
  }
});

// DELETE /api/projects/:projectId/types/:typeId
router.delete(
  '/:projectId/types/:id',
  verifyPermissions,
  async (req, res, next) => {
    try {
      const { projectId, id } = req.params;
      const typeToDelete = await Type.findOne({ where: { projectId, id } });
      if (!typeToDelete) {
        const error = new Error('Type does not exist');
        error.status = 404;
        next(error);
      } else {
        await typeToDelete.destroy();
        res.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/projects
router.post('/', (req, res, next) => {});

// PUT /api/projects
router.put('/', (req, res, next) => {});

// DELETE /api/projects
router.delete('/', (req, res, next) => {});

module.exports = router;
