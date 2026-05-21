const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const productService = require('./product.service');
const { emitProductCreated, emitProductUpdated, emitProductDeleted, emitToAdmins } = require('../../socket/emitters');

const create = catchAsync(async (req, res) => {
  const product = await productService.create(req.body, req.user._id);

  // 🔌 Emit real-time notification to all connected clients
  emitProductCreated(product);

  // Notify admins specifically
  emitToAdmins('admin:notification', {
    type: 'NEW_PRODUCT',
    message: `New product "${product.title}" was created`,
    data: product,
  });

  ApiResponse.created(res, { product }, 'Product created successfully');
});

const getAll = catchAsync(async (req, res) => {
  const result = await productService.getAll(req.query);
  ApiResponse.success(res, result);
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getById(req.params.id);
  ApiResponse.success(res, { product });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);

  // 🔌 Emit real-time update notification
  emitProductUpdated(product);

  ApiResponse.success(res, { product }, 'Product updated successfully');
});

const remove = catchAsync(async (req, res) => {
  await productService.delete(req.params.id);

  // 🔌 Emit real-time deletion notification
  emitProductDeleted(req.params.id);

  ApiResponse.success(res, null, 'Product deleted successfully');
});

module.exports = { create, getAll, getById, update, remove };
