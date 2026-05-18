const { Router } = require('express');
const categoryController = require('./category.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('./category.validation');

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', authenticate, authorize('admin'), validate(createCategorySchema), categoryController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authenticate, authorize('admin'), categoryController.remove);

module.exports = router;
