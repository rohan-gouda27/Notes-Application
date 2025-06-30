const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, notesController.getNotes);
router.post('/', verifyToken, notesController.createNote);
router.put('/:id', verifyToken, notesController.updateNote);
router.delete('/:id', verifyToken, notesController.deleteNote);

module.exports = router;
