const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { 
  createRecord, 
  getRecords, 
  getRecordById, 
  updateRecord, 
  deleteRecord 
} = require('../controllers/recordController');

// All routes require authentication
router.use(auth);

// Viewer, Analyst, Admin can view records
router.get('/', roleGuard(['Viewer', 'Analyst', 'Admin']), getRecords);
router.get('/:id', roleGuard(['Viewer', 'Analyst', 'Admin']), getRecordById);

// Only Admin can create, modify, or delete records
router.post('/', roleGuard(['Admin']), createRecord);
router.put('/:id', roleGuard(['Admin']), updateRecord);
router.delete('/:id', roleGuard(['Admin']), deleteRecord);

module.exports = router;
