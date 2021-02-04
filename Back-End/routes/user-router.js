const express = require('express');
const router = express.Router();
const userController = require("../controllers/user-controller");

/*Realizar o Login*/
router.post('/login', userController.login);

/*Realizar o registo*/
router.post('/register', userController.createUser);

module.exports = router;