const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const userService = require('./user.service');

const register = catchAsync(async (req, res) => {
  const { user, token } = await userService.register(req.body);
  ApiResponse.created(res, { user, token }, 'User registered successfully');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await userService.login(email, password);
  ApiResponse.success(res, { user, token }, 'Login successful');
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  ApiResponse.success(res, { user });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  ApiResponse.success(res, { users });
});

module.exports = { register, login, getProfile, getAllUsers };
