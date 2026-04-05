const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');

// All user management routes require 'Admin' role
router.use(auth, roleGuard(['Admin']));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
