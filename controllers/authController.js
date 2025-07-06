const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required' });

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashed, 'user'],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username already exists' });
          }
          return res.status(500).json({ message: 'Database error', error: err });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ 
        id: user.id, 
        username: user.username,
        role: user.role 
      }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(200).json({ 
        message: 'Login successful', 
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
};
