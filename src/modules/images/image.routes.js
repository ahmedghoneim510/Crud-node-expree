const { Router } = require('express');
const imageController = require('./image.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');

const router = Router();

router.post(
  '/product/:productId',
  authenticate,
  authorize('admin'),
  uploadMiddleware.array('images', 10),
  imageController.upload
);

router.get('/product/:productId', imageController.getByProduct);
router.delete('/:id', authenticate, authorize('admin'), imageController.remove);

module.exports = router;
