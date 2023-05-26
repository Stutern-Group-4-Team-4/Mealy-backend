const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
  } = require('../controllers/userController');
  
  module.exports = router;