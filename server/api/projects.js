const router = require('express').Router();
const {
  db,
  models: { Light, Type, Note, NoteType, Project, NoteLightType, NoteLight },
} = require('../db');

// Verify permissions middleware
const verifyPermissions = async (req, res, next) => {
  try {
    if (
      req.user &&
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

/**
 * ALL NOTES ROUTES
 */

// GET /api/projects/:projectId/notes
router.get('/:projectId/notes', verifyPermissions, async (req, res, next) => {
  try {
    res.json(await Note.findByProjectId(+req.params.projectId));
  } catch (error) {
    next(error);
  }
});

/**
 * LIGHTS ROUTES
 */

// GET /api/projects/:projectId/lights
router.get('/:projectId/lights', verifyPermissions, async (req, res, next) => {
  try {
    res.json(await Light.findByProjectId(+req.params.projectId));
  } catch (error) {
    next(error);
  }
});

/**
 * TYPES ROUTES
 */

// GET /api/projects/:projectId/types
router.get('/:projectId/types', verifyPermissions, async (req, res, next) => {
  try {
    res.json(await Type.findByProjectId(+req.params.projectId));
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

/**
 * SINGLE NOTES ROUTES
 */

// POST /api/projects/:projectId/notes/:noteId/types
router.post(
  '/:projectId/notes/:noteId/types',
  verifyPermissions,
  async (req, res, next) => {
    const { projectId, noteId } = req.params;
    try {
      const [note, type] = await Promise.all([
        Note.findOne({
          where: { id: noteId, projectId: projectId },
        }),
        Type.findOne({
          where: { id: req.body.typeId, projectId },
        }),
      ]);
      if (!note || !type) {
        const error = new Error('Not found');
        error.status = 404;
        next(error);
      } else {
        await note.addType(type);
        res.json(await Note.findById(note.id));
      }
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/projects/:projectId/notes/:noteId/types/:typeId
router.put(
  '/:projectId/notes/:noteId/types/:typeId',
  verifyPermissions,
  async (req, res, next) => {
    const { projectId, noteId, typeId } = req.params;
    try {
      const noteType = await NoteType.findOne({
        where: { noteId, typeId },
        include: [{ model: Type, where: { projectId } }],
      });
      if (!noteType) {
        const error = new Error('Not found');
        error.status = 404;
        next(error);
      } else {
        noteType.isComplete = req.body.isComplete;
        await noteType.save();
        res.json(noteType);
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/projects/:projectId/notes/:noteId/types/:typeId
router.delete(
  '/:projectId/notes/:noteId/types/:typeId',
  verifyPermissions,
  async (req, res, next) => {
    const { projectId, noteId, typeId } = req.params;
    try {
      const note = await Note.findOne({
        where: { id: noteId, projectId: projectId },
        include: [{ model: Type, where: { id: typeId } }],
      });
      if (!note) {
        const error = new Error('Not found');
        error.status = 404;
        next(error);
      } else {
        await note.removeType(typeId);
        res.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * NOTE LIGHT ROUTES
 */

// PUT /api/projects/:projectId/notes/:noteId/lights/:lightId/types/:typeId
router.put(
  '/:projectId/notes/:noteId/lights/:lightId/types/:typeId',
  verifyPermissions,
  async (req, res, next) => {
    const { projectId, noteId, lightId, typeId } = req.params;
    try {
      const note = await Note.findOne({
        where: {
          projectId,
          id: noteId,
        },
        include: [
          {
            model: NoteLight,
            where: { lightId },
            include: [
              {
                model: NoteLightType,
                include: [{ model: NoteType, where: { typeId } }],
              },
            ],
          },
        ],
      });

      const noteLightType = note.noteLights[0].noteLightTypes[0];
      noteLightType.isComplete = req.body.isComplete;

      await noteLightType.save();
      res.json(await Note.findById(noteId));
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
