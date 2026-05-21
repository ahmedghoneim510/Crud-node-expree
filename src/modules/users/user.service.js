const jwt = require('jsonwebtoken');
const config = require('../../config');
const ApiError = require('../../utils/ApiError');
const User = require('./user.model');
const { RefreshToken, BlacklistedToken } = require('./token.model');

class UserService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    const user = await User.create(userData);
    const tokens = await this.generateTokens(user._id);

    return { user, ...tokens };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = await this.generateTokens(user._id);
    return { user, ...tokens };
  }

  async refreshToken(refreshToken) {
    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Check if refresh token exists in DB (not revoked)
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      throw new ApiError(401, 'Refresh token has been revoked');
    }

    // Delete the old refresh token (rotation)
    await RefreshToken.deleteOne({ _id: storedToken._id });

    // Generate new token pair
    const tokens = await this.generateTokens(decoded.id);
    return tokens;
  }

  async logout(accessToken, refreshToken) {
    // Blacklist the access token
    const decoded = jwt.decode(accessToken);
    if (decoded && decoded.exp) {
      await BlacklistedToken.create({
        token: accessToken,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }

    // Remove refresh token from DB (revoke it)
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
  }

  async logoutAll(userId) {
    // Remove all refresh tokens for this user
    await RefreshToken.deleteMany({ userId });
  }

  async isTokenBlacklisted(token) {
    const found = await BlacklistedToken.findOne({ token });
    return !!found;
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async getAllUsers() {
    return User.find().select('-password');
  }

  async generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Store refresh token in DB
    const decoded = jwt.decode(refreshToken);
    await RefreshToken.create({
      token: refreshToken,
      userId,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return { accessToken, refreshToken };
  }
}

module.exports = new UserService();
