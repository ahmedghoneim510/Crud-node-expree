const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const imageService = require('./image.service');

const upload = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'Please upload at least one image');
  }

  const { productId } = req.params;
  const images = await imageService.upload(req.files, productId);
  ApiResponse.created(res, { images }, 'Images uploaded successfully');
});

const getByProduct = catchAsync(async (req, res) => {
  const images = await imageService.getByProduct(req.params.productId);
  ApiResponse.success(res, { images });
});

const remove = catchAsync(async (req, res) => {
  await imageService.delete(req.params.id);
  ApiResponse.success(res, null, 'Image deleted successfully');
});

module.exports = { upload, getByProduct, remove };
