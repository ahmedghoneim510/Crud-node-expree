const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const cityService = require('./city.service');

const create = catchAsync(async(req,res) =>{
    const city = await cityService.create(req.body);
    ApiResponse.created(res, {city}, 'City created successfully');
});

const getAll = catchAsync(async(req,res) =>{
    const cities = await cityService.getAll();
    ApiResponse.success(res, {cities});
});

const getById = catchAsync(async(req,res) =>{
    const city = await cityService.getById(req.params.id);
    ApiResponse.success(res, {city});
});

const update = catchAsync(async(req,res) =>{
    const city = await cityService.update(req.params.id, req.body);
    ApiResponse.success(res, {city}, 'City updated successfully');
});

const remove = catchAsync(async(req,res) =>{
    await cityService.delete(req.params.id);
    ApiResponse.success(res, null, 'City deleted successfully');
});

const getPaginated = catchAsync(async(req,res) =>{
    const filter = {};
    if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: 'i' };
    }
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        order: req.query.order || 'desc',
    };
    const result = await cityService.getPaginated(filter, options);
    ApiResponse.success(res, result);
});

module.exports = {create, getAll, getById, update, remove, getPaginated};