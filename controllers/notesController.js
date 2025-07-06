const noteModel = require('../models/noteModel');
exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.getNotesByUserId(req.user.id);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
    
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await noteModel.createNote(req.user.id, title, content);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updated = await noteModel.updateNote(req.params.id, req.user.id, title, content);
        if (updated) {
            res.json({ message: 'Note updated successfully' });
        } else {
            res.status(404).json({ message: 'Note not found or unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const deleted = await noteModel.deleteNote(req.params.id, req.user.id);
        if (deleted) {
            res.json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ message: 'Note not found or unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

