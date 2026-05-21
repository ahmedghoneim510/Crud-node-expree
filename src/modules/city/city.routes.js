const { Router } = require('express');
const cityController = require('./city.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { validate, validateQuery } = require('../../middlewares/validate.middleware');
const { createCitySchema, updateCitySchema } = require('./city.validation');

const router = Router();

router.get('/', validateQuery(createCitySchema), cityController.getPaginated);
router.get('/:id', cityController.getById);
router.post('/', authenticate, authorize('admin'), validate(createCitySchema), cityController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateCitySchema), cityController.update);
router.delete('/:id', authenticate, authorize('admin'), cityController.remove);
router.get('/paginated', cityController.getPaginated);

module.exports = router;