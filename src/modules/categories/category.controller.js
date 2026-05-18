const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const categoryService = require('./category.service');

const create = catchAsync(async (req, res) => {
  const category = await categoryService.create(req.body);
  ApiResponse.created(res, { category }, 'Category created successfully');
});

const getAll = catchAsync(async (req, res) => {
  const categories = await categoryService.getAll();
  ApiResponse.success(res, { categories });
});

const getById = catchAsync(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  ApiResponse.success(res, { category });
});

const update = catchAsync(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  ApiResponse.success(res, { category }, 'Category updated successfully');
});

const remove = catchAsync(async (req, res) => {
  await categoryService.delete(req.params.id);
  ApiResponse.success(res, null, 'Category deleted successfully');
});

module.exports = { create, getAll, getById, update, remove };
