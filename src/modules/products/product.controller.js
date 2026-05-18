const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const productService = require('./product.service');

const create = catchAsync(async (req, res) => {
  const product = await productService.create(req.body, req.user._id);
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
  ApiResponse.success(res, { product }, 'Product updated successfully');
});

const remove = catchAsync(async (req, res) => {
  await productService.delete(req.params.id);
  ApiResponse.success(res, null, 'Product deleted successfully');
});

module.exports = { create, getAll, getById, update, remove };
