const { Router } = require('express');
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('./user.validation');

const router = Router();

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', authenticate, userController.logout);
router.post('/logout-all', authenticate, userController.logoutAll);
router.get('/profile', authenticate, userController.getProfile);
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);

module.exports = router;
