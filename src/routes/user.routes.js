const express = require('express');
const userController = require('../controllers/user.controller');

const userRoutes = express.Router();

// [POST] Đăng nhập
userRoutes.post('/login', userController.login);

module.exports = userRoutes;
