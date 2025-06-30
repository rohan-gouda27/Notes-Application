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