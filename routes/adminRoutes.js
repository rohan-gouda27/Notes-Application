const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);
router.get('/notes', adminController.getAllNotes);
router.get('/users/:userId/notes', adminController.getNotesByUser);
router.put('/notes/:id', adminController.updateAnyNote);
router.delete('/notes/:id', adminController.deleteAnyNote);
router.get('/users', adminController.getAllUsers);
router.get('/profile', adminController.getAdminProfile);
router.put('/change-password', adminController.changeAdminPassword);
router.put('/change-username', adminController.changeAdminUsername);

module.exports = router; 