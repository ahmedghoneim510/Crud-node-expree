const { Router } = require('express');
const productController = require('./product.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { validate, validateQuery } = require('../../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema, queryProductSchema } = require('./product.validation');

const router = Router();

router.get('/', validateQuery(queryProductSchema), productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize('admin'), validate(createProductSchema), productController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateProductSchema), productController.update);
router.delete('/:id', authenticate, authorize('admin'), productController.remove);

module.exports = router;
