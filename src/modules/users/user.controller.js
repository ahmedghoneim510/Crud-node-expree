const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const userService = require('./user.service');

const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await userService.register(req.body);
  ApiResponse.created(res, { user, accessToken, refreshToken }, 'User registered successfully');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await userService.login(email, password);
  ApiResponse.success(res, { user, accessToken, refreshToken }, 'Login successful');
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;
  const tokens = await userService.refreshToken(token);
  ApiResponse.success(res, tokens, 'Token refreshed successfully');
});

const logout = catchAsync(async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const { refreshToken } = req.body;
  await userService.logout(accessToken, refreshToken);
  ApiResponse.success(res, null, 'Logged out successfully');
});

const logoutAll = catchAsync(async (req, res) => {
  await userService.logoutAll(req.user._id);
  ApiResponse.success(res, null, 'Logged out from all devices');
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  ApiResponse.success(res, { user });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  ApiResponse.success(res, { users });
});

module.exports = { register, login, refreshToken, logout, logoutAll, getProfile, getAllUsers };
