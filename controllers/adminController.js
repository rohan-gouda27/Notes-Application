const noteModel = require('../models/noteModel');
const bcrypt = require('bcryptjs');
const db = require('../models/db');

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await noteModel.getAllNotes();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNotesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notes = await noteModel.getNotesByUserId(userId);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAnyNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const noteId = req.params.id;
        const updated = await noteModel.updateNoteById(noteId, title, content);
        if (updated) {
            res.json({ message: 'Note updated successfully' });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAnyNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const deleted = await noteModel.deleteNoteById(noteId);
        if (deleted) {
            res.json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await noteModel.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminId = req.user.id;
        const user = await noteModel.getUserById(adminId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updated = await noteModel.updateUserPassword(adminId, hashedNewPassword);
        if (updated) {
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.changeAdminUsername = async (req, res) => {
    try {
        const { newUsername, password } = req.body;
        const adminId = req.user.id;

        const user = await noteModel.getUserById(adminId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const existingUser = await noteModel.getUserByUsername(newUsername);
        if (existingUser && existingUser.id !== adminId) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const updated = await noteModel.updateUserUsername(adminId, newUsername);
        if (updated) {
            res.json({ message: 'Username updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update username' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        const user = await noteModel.getUserById(adminId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const { password, ...userProfile } = user;
        res.json(userProfile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 