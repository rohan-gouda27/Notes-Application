const db = require('./db');

exports.getNotesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
            [userId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

exports.getAllNotes = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT n.*, u.username as author 
             FROM notes n 
             JOIN users u ON n.user_id = u.id 
             ORDER BY n.updated_at DESC`,
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC',
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE id = ?',
            [userId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            }
        );
    });
};

exports.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            }
        );
    });
};


exports.updateUserPassword = (userId, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
};


exports.updateUserUsername = (userId, newUsername) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE users SET username = ? WHERE id = ?',
            [newUsername, userId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
};

exports.createNote = (userId, title, content) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
            [userId, title, content],
            (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, user_id: userId, title, content });
            }
        );
    });
};

exports.updateNote = (noteId, userId, title, content) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, noteId, userId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
};


exports.updateNoteById = (noteId, title, content) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE notes SET title = ?, content = ? WHERE id = ?',
            [title, content, noteId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
};

exports.deleteNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [noteId, userId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
};


exports.deleteNoteById = (noteId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM notes WHERE id = ?',
            [noteId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            }
        );
    });
}; 