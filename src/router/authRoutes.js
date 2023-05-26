const express = require("express");
const tryCatchHandler = require("../utils/tryCatchHandler");
const userController = require("../controllers/authController")

const router = new express.Router();

//authentication routes
// const { signUp, login, logout } = require('../controllers/authController');


router.post('/signUp', tryCatchHandler(userController.signUp));
router.post('/login', tryCatchHandler(userController.login));
router.get('/logout', tryCatchHandler(userController.logout));

module.exports = router;
