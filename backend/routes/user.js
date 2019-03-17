const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/registration', userController.createUser);

router.post('/login', userController.userLogin);

router.get('', userController.getUsers);

router.get('/:id', userController.getUser);

module.exports = router;
